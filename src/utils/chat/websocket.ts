import shakeTitle from '@/utils/chat/shakeTitle';
import { useUserStore } from '@/store';
import { Message } from '@arco-design/web-vue';
import { useCachedStore } from '@/store/modules/chat/cached';
import { useGroupStore } from '@/store/modules/chat/group';
import { useChatStore } from '@/store/modules/chat/chat';
import { ChatOnlineEnum } from '@/types/enums/chat';
import { MarkItemType, MessageType, RevokedMsgType } from '@/types/chat';
import {
  OnStatusChangeType,
  WsReqMsgContentType,
  WsResponseMessageType,
} from '@/utils/chat/wsType';
import { worker } from '@/utils/chat/initWorker';
import { log } from 'echarts/types/src/util/log';

class WS {
  #tasks: WsReqMsgContentType[] = [];

  // 重连🔐
  #connectReady = false;

  constructor() {
    const token = localStorage.getItem('token');
    worker.postMessage(
      `{"type":"initWS","value":${token ? `"${token}"` : null}}`
    );
    // 收到消息
    worker.addEventListener('message', this.onWorkerMsg);

    // 后台重试次数达到上限之后，tab 获取焦点再重试
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && !this.#connectReady) {
        const token = localStorage.getItem('token');
        worker.postMessage(
          `{"type":"initWS","value":${token ? `"${token}"` : null}}`
        );
      }
      // 获得焦点停止消息闪烁
      if (!document.hidden) {
        shakeTitle.clear();
      }
    });
  }

  // 收到消息回调
  // eslint-disable-next-line class-methods-use-this
  onMessage = (value: string) => {
    // FIXME 可能需要 try catch,
    try {
      const params: { type: WsResponseMessageType; data: unknown } =
        JSON.parse(value);
      const userStore = useUserStore();
      const chatStore = useChatStore();
      const groupStore = useGroupStore();
      const cachedStore = useCachedStore();
      switch (params.type) {
        // 获取登录二维码
        // case WsResponseMessageType.LoginQrCode: {
        //   const data = params.data as LoginInitResType;
        //   loginStore.loginQrCode = data.loginUrl;
        //   break;
        // }
        // // 等待授权
        // case WsResponseMessageType.WaitingAuthorize: {
        //   loginStore.loginStatus = LoginStatus.Waiting;
        //   break;
        // }
        // 登录成功
        case WsResponseMessageType.LoginSuccess: {
          // 自己更新自己上线
          groupStore.batchUpdateUserStatus([
            {
              activeStatus: ChatOnlineEnum.ONLINE,
              avatar: userStore.avatar,
              lastOptTime: String(Date.now()),
              name: userStore.name,
              uid: userStore.id,
            },
          ]);
          // 初始化所有用户基本信息
          cachedStore.initAllUserBaseInfo();
          break;
        }
        // 用户 token 过期
        case WsResponseMessageType.TokenExpired: {
          // 调用统一的下线接口

          break;
        }
        // 收到消息
        case WsResponseMessageType.ReceiveMessage: {
          chatStore.pushMsg(params.data as MessageType);
          break;
        }
        // 用户下线
        case WsResponseMessageType.OnOffLine: {
          const data = params.data as OnStatusChangeType;
          groupStore.countInfo.onlineNum = data.onlineNum;
          groupStore.countInfo.totalNum = data.totalNum;
          groupStore.batchUpdateUserStatus(data.changeList);
          break;
        }
        // 小黑子的发言在禁用后，要删除他的发言
        case WsResponseMessageType.InValidUser: {
          const data = params.data as { uid: number };
          // 消息列表删掉小黑子发言
          chatStore.filterUser(data.uid);
          // 群成员列表删掉小黑子
          groupStore.filterUser(data.uid);
          break;
        }
        // 点赞、倒赞消息通知
        case WsResponseMessageType.WSMsgMarkItem: {
          const data = params.data as { markList: MarkItemType[] }
          chatStore.updateMarkCount(data.markList)
          break;
        }
        // 消息撤回通知
        case WsResponseMessageType.WSMsgRecall: {
          const { data } = params as { data: RevokedMsgType };
          chatStore.updateRecallStatus(data);
          break;
        }
        default: {
          console.log('接收到未处理类型的消息:', params);
          break;
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  onWorkerMsg = (e: MessageEvent<any>) => {
    const params: { type: string; value: unknown } = JSON.parse(e.data);
    // eslint-disable-next-line default-case
    switch (params.type) {
      case 'message': {
        this.onMessage(params.value as string);
        break;
      }
      case 'open': {
        this.#dealTasks();
        break;
      }
      case 'close':
      case 'error': {
        this.#onClose();
        break;
      }
    }
  };

  // 重置一些属性
  #onClose = () => {
    this.#connectReady = false;
  };

  #dealTasks = () => {
    this.#connectReady = true;
    // 先探测登录态
    // this.#detectionLoginStatus()

    setTimeout(() => {
      const userStore = useUserStore();
      if (userStore.id) {
        // 处理堆积的任务
        this.#tasks.forEach((task) => {
          this.send(task);
        });
        // 清空缓存的消息
        this.#tasks = [];
      } else {
        // 如果没登录，而且已经请求了登录二维码，就要更新登录二维码。
        // loginStore.loginQrCode && loginStore.getLoginQrCode();
        Message.error('请先登录，若已登录请刷新重试');
      }
    }, 500);
  };

  // eslint-disable-next-line class-methods-use-this
  #send(msg: WsReqMsgContentType) {
    worker.postMessage(
      `{"type":"message","value":${
        typeof msg === 'string' ? msg : JSON.stringify(msg)
      }}`
    );
  }

  send = (params: WsReqMsgContentType) => {
    if (this.#connectReady) {
      this.#send(params);
    } else {
      // 放到队列
      this.#tasks.push(params);
    }
  };
}

export default new WS();
