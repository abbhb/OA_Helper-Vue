import { computed, reactive, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { useCachedStore } from '@/store/modules/chat/cached';
import { useUserStore } from '@/store';
import {
  MarkItemType,
  MessageType,
  RevokedMsgType,
  SessionItem,
} from '@/types/chat';
import * as Api from '@/api/chat';
import { markMsgRead, removeMsg, sessionDetail } from '@/api/chat';
import { computedTimeBlock } from '@/utils/chat/computedTime';
import shakeTitle from '@/utils/chat/shakeTitle';
import { ChatMarkEnum, ChatMsgEnum, RoomTypeEnum } from '@/types/enums/chat';
import { notifyMe } from '@/utils/notify';
import { useGlobalStore } from '@/store/modules/chat/global';
import { useGroupStore } from '@/store/modules/chat/group';
import { useContactStore } from '@/store/modules/chat/contacts';
import { cloneDeep } from 'lodash';
import router from '@/router';
import { pushNotifyByMessage } from '@/utils/chat/systemMessageNotify';

export const pageSize = 20;
// 标识是否第一次请求
let isFirstInit = false;

export const useChatStore = defineStore('chat', () => {
  const cachedStore = useCachedStore();
  const userStore = useUserStore();
  const globalStore = useGlobalStore();
  const groupStore = useGroupStore();
  const contactStore = useContactStore();
  const sessionList = reactive<SessionItem[]>([]); // 会话列表
  const sessionOptions = reactive({
    isLast: false,
    isLoading: false,
    cursor: '',
  });
  const currentRoomType = computed(() => globalStore.currentSession?.type);
  const currentRoomId = computed(() => globalStore.currentSession?.roomId);

  const messageMap = reactive<Map<string, Map<string, MessageType>>>(
    new Map([[currentRoomId.value, new Map()]])
  ); // 消息Map
  const messageOptions = reactive<
    Map<string, { isLast: boolean; isLoading: boolean; cursor: string }>
  >(
    new Map([
      [currentRoomId.value, { isLast: false, isLoading: false, cursor: '' }],
    ])
  );
  const replyMapping = reactive<Map<string, Map<string, string[]>>>(
    new Map([[currentRoomId.value, new Map()]])
  ); // 回复消息映射
  const { userInfo } = userStore;

  const currentMessageMap = computed({
    get: () => {
      if (!currentRoomId.value){
        return new Map();
      }
      const current = messageMap.get(currentRoomId.value as string);
      if (current === undefined) {
        messageMap.set(currentRoomId.value, new Map());
      }
      return messageMap.get(currentRoomId.value as string);
    },
    set: (val) => {

      messageMap.set(currentRoomId.value, val as Map<string, MessageType>);
    },
  });

  const currentMessageOptions = computed({
    get: () => {
      const current = messageOptions.get(currentRoomId.value as string);
      if (current === undefined) {
        messageOptions.set(currentRoomId.value, {
          isLast: false,
          isLoading: true,
          cursor: '',
        });
      }
      return messageOptions.get(currentRoomId.value as string);
    },
    set: (val) => {
      messageOptions.set(
        currentRoomId.value,
        val as { isLast: boolean; isLoading: boolean; cursor: string }
      );
    },
  });
  const currentReplyMap = computed({
    get: () => {
      const current = replyMapping.get(currentRoomId.value);
      if (current === undefined) {
        // @ts-ignore
        replyMapping.set(currentRoomId.value, new Map());
      }
      return replyMapping.get(currentRoomId.value);
    },
    set: (val) => {
      replyMapping.set(currentRoomId.value, val);
    },
  });
  const isGroup = computed(() => currentRoomType.value === RoomTypeEnum.Group);

  /**
   * 获取当前会话信息
   */
  const currentSessionInfo = computed(() =>
    sessionList.find(
      (session) => session.roomId === globalStore.currentSession.roomId
    )
  );

  const chatListToBottomAction = ref<() => void>(); // 外部提供消息列表滚动到底部事件

  const newMsgCount = reactive<
    Map<string, { count: number; isStart: boolean }>
  >(
    new Map([
      [
        currentRoomId.value,
        {
          // 新消息计数
          count: 0,
          // 是否开始计数
          isStart: false,
        },
      ],
    ])
  );

  const currentNewMsgCount = computed({
    get: () => {
      const current = newMsgCount.get(currentRoomId.value as string);
      if (current === undefined) {
        newMsgCount.set(currentRoomId.value, { count: 0, isStart: false });
      }
      return newMsgCount.get(currentRoomId.value as string);
    },
    set: (val) => {
      newMsgCount.set(
        currentRoomId.value,
        val as { count: number; isStart: boolean }
      );
    },
  });

  watch(currentRoomId, (val, oldVal) => {
    if (oldVal !== undefined && val !== oldVal) {
      // 切换会话，滚动到底部
      chatListToBottomAction.value?.();
      // 切换的 rooms是空数据的话就请求消息列表
      // @ts-ignore
      if (!currentMessageMap.value || currentMessageMap.value.size === 0) {
        if (!currentMessageMap.value) {
          // @ts-ignore
          messageMap.set(currentRoomId.value as string, new Map());
        }
        // eslint-disable-next-line no-use-before-define
        getMsgList();
      }

      // 群组的时候去请求
      if (currentRoomType.value === RoomTypeEnum.Group) {
        groupStore.getGroupUserList(true);
        groupStore.getCountStatistic();
        cachedStore.getGroupAtUserBaseInfo();
      }
    }

    // 重置当前回复的消息
    // eslint-disable-next-line no-use-before-define
    currentMsgReply.value = {};
  });

  // 当前消息回复
  const currentMsgReply = ref<Partial<MessageType>>({});

  // 将消息列表转换为数组
  const chatMessageList = computed(() => [
    ...(currentMessageMap.value?.values() || []),
  ]);

  const getMsgList = async (size = pageSize) => {
    // eslint-disable-next-line no-unused-expressions
    currentMessageOptions.value &&
      (currentMessageOptions.value.isLoading = true);
    const { data } = await Api.getMsgList({
      params: {
        pageSize: size,
        cursor: currentMessageOptions.value?.cursor,
        roomId: currentRoomId.value,
      },
    });
    // eslint-disable-next-line no-unused-expressions
    currentMessageOptions.value &&
      (currentMessageOptions.value.isLoading = false);

    if (!data) return;
    const computedList = computedTimeBlock(data.list);

    /** 收集需要请求用户详情的 uid */
    const uidCollectYet: Set<string> = new Set(); // 去重用
    computedList.forEach((msg) => {
      const replyItem = msg.message.body?.reply;
      if (replyItem?.id) {
        const messageIds =
          currentReplyMap.value?.get(String(replyItem.id)) || [];
        messageIds.push(msg.message.id);
        currentReplyMap.value?.set(replyItem.id, messageIds);

        // 查询被回复用户的信息，被回复的用户信息里暂时无 uid
        // collectUidItem(replyItem.uid)
      }
      // 查询消息发送者的信息
      uidCollectYet.add(msg.fromUser.uid);
    });
    // 获取用户信息缓存
    cachedStore.getBatchUserInfo([...uidCollectYet]);
    // 为保证获取的历史消息在前面
    const newList = [...computedList, ...chatMessageList.value];
    currentMessageMap.value?.clear(); // 清空Map
    newList.forEach((msg) => {
      currentMessageMap.value?.set(msg.message.id, msg);
    });

    if (currentMessageOptions.value) {
      currentMessageOptions.value.cursor = data.cursor;
      currentMessageOptions.value.isLast = data.isLast;
      currentMessageOptions.value.isLoading = false;
    }
  };

  const getSessionList = async (isFresh = false) => {
    if (!isFresh && (sessionOptions.isLast || sessionOptions.isLoading)) return;
    sessionOptions.isLoading = true;
    // eslint-disable-next-line import/namespace
    const { data } = await Api.getSessionList({
      pageSize: sessionList.length > pageSize ? sessionList.length : pageSize,
      cursor:
        isFresh || !sessionOptions.cursor ? undefined : sessionOptions.cursor,
    });
    if (!data) return;
    // eslint-disable-next-line no-unused-expressions
    isFresh
      ? sessionList.splice(0, sessionList.length, ...data.list)
      : sessionList.push(...data.list);
    sessionOptions.cursor = data.cursor;
    sessionOptions.isLast = data.isLast;
    sessionOptions.isLoading = false;

    // eslint-disable-next-line no-use-before-define
    sortAndUniqueSessionList();

    sessionList[0].unreadCount = 0;
    if ((!isFirstInit || isFresh )&& data?.list[0]?.roomId) {
      isFirstInit = true;
      globalStore.currentSession.roomId = data.list[0].roomId;
      globalStore.currentSession.type = data.list[0].type;
      // 用会话列表第一个去请求消息列表
      getMsgList();
      // 请求第一个群成员列表
      // eslint-disable-next-line no-unused-expressions
      currentRoomType.value === RoomTypeEnum.Group &&
        groupStore.getGroupUserList(true);
      // 初始化所有用户基本信息
      // eslint-disable-next-line no-unused-expressions
      userStore.isSign && cachedStore.initAllUserBaseInfo();
      // 联系人列表
      contactStore.getContactList(true);
    }
  };
  /** 会话列表去重并排序 */
  const sortAndUniqueSessionList = () => {
    const temp: Record<string, SessionItem> = {};
    // eslint-disable-next-line no-return-assign
    sessionList.forEach((item) => (temp[item.roomId] = item));
    sessionList.splice(0, sessionList.length, ...Object.values(temp));
    sessionList.sort((pre, cur) => cur.activeTime - pre.activeTime);
  };

  const updateSession = (roomId: string, roomProps: Partial<SessionItem>) => {
    const session = sessionList.find((item) => item.roomId === roomId);
    // eslint-disable-next-line no-unused-expressions
    session && roomProps && Object.assign(session, roomProps);
    sortAndUniqueSessionList();
  };

  const updateSessionLastActiveTime = (roomId: string, room?: SessionItem) => {
    const session = sessionList.find((item) => item.roomId === roomId);
    if (session) {
      Object.assign(session, { activeTime: Date.now() });
    } else if (room) {
      const newItem = cloneDeep(room);
      newItem.activeTime = Date.now();
      sessionList.unshift(newItem);
    }
    sortAndUniqueSessionList();
  };

  // 通过房间ID获取会话信息
  const getSession = (roomId: string): SessionItem => {
    return sessionList.find((item) => item.roomId === roomId) as SessionItem;
  };

  const pushMsg = async (msg: MessageType) => {
    const current = messageMap.get(msg.message.roomId);
    current?.set(msg.message.id, msg);
    // 获取用户信息缓存
    // 尝试取缓存user, 如果有 lastModifyTime 说明缓存过了，没有就一定是要缓存的用户了
    if (!msg.fromUser.uid) {
      return;
    }
    const cacheUser = cachedStore.userCachedList[msg.fromUser.uid];
    cachedStore.getBatchUserInfo([msg.fromUser.uid]);
    // 发完消息就要刷新会话列表，
    // 如果sessionList当前不包含会话需要刷新
    const session = sessionList.find(
      (item) => item.roomId === msg.message.roomId
    );
    session || (await getSessionList(true));
    // 如果当前会话已经置顶了，可以不用刷新
    if (
      globalStore.currentSession &&
      globalStore.currentSession.roomId !== msg.message.roomId
    ) {
      let result;
      // 如果当前路由不是聊天，就开始拿会话详情，并手动新增一条会话记录
      // if (route?.path && route?.path !== '/') {
      //   globalStore.currentSession.roomId = msg.message.roomId
      //   globalStore.currentSession.type = RoomTypeEnum.Single
      if (!current) {
        sessionDetail({ id: msg.message.roomId }).then((res) => {
          result = res.data;
        });
      }
      //   Router.push('/')
      // }
      updateSessionLastActiveTime(msg.message.roomId, result);
    }
    // 如果收到的消息里面是艾特自己的就发送系统通知
    if (
      msg.message.body.atUidList?.includes(userStore.userInfo.id) &&
      cacheUser
    ) {
      notifyMe(
        cacheUser.name as string,
        msg.message.body.content,
        cacheUser.avatar as string
      );
    }
    pushNotifyByMessage(msg);
    // tab 在后台获得新消息，就开始闪烁！
    if (document.hidden && !shakeTitle.isShaking) {
      shakeTitle.start();
    }

    if (
      currentNewMsgCount.value &&
      currentNewMsgCount.value?.isStart &&
      typeof currentNewMsgCount.value.count === 'number'
    ) {
      // eslint-disable-next-line no-plusplus
      currentNewMsgCount.value.count++;
      return;
    }

    // 聊天记录计数
    if (currentRoomId.value !== msg.message.roomId) {
      console.log('计数');
      const item = sessionList.find(
        (item) => item.roomId === msg.message.roomId
      );
      if (item) {
        console.log('计数成功');
        item.unreadCount += 1;
      }
      // 如果新消息的 roomId 和 当前显示的 room 的 Id 一致，就更新已读
    } else {
      // 且当前路由在 聊天 内
      if (
        router.currentRoute.value?.path &&
        router.currentRoute.value?.path === '/chat/chat'
      ) {
        markMsgRead({ roomId: currentRoomId.value });
      }
    }

    // 如果当前路由不是聊天，就开始计数
    if (
      router.currentRoute.value?.path &&
      router.currentRoute.value?.path !== '/chat/chat'
    ) {
      // eslint-disable-next-line no-plusplus
      globalStore.unReadMark.newMsgUnreadCount++;
    }

    // 聊天列表滚动到底部
    setTimeout(() => {
      // 如果超过一屏了，不自动滚动到最新消息。
      chatListToBottomAction.value?.();
    }, 0);
  };

  // 过滤掉小黑子的发言
  const filterUser = (uid: number) => {
    if (typeof uid !== 'string') return;
    // eslint-disable-next-line no-restricted-syntax
    for (const messages of messageMap.values()) {
      messages?.forEach((msg) => {
        if (msg.fromUser.uid === uid) {
          messages.delete(msg.message.id);
        }
      });
    }
  };

  const loadMore = async (size?: number) => {
    if (
      currentMessageOptions.value?.isLast ||
      currentMessageOptions.value?.isLoading
    )
      return;
    await getMsgList(size);
  };

  const clearNewMsgCount = () => {
    // eslint-disable-next-line no-unused-expressions
    currentNewMsgCount.value && (currentNewMsgCount.value.count = 0);
  };

  // 查找消息在列表里面的索引
  const getMsgIndex = (msgId: string) => {
    if (!msgId) return -1;
    const keys = Array.from(messageMap.keys());
    return keys.findIndex((key) => key === msgId);
  };

  // 更新点赞、举报数
  const updateMarkCount = (markList: MarkItemType[]) => {
    markList.forEach((mark: MarkItemType) => {
      const { msgId, markType, markCount } = mark;

      const msgItem = currentMessageMap.value?.get(String(msgId));
      console.log(currentMessageMap.value);
      console.log(msgId);
      if (msgItem) {
        if (markType === ChatMarkEnum.LIKE) {
          msgItem.message.messageMark.likeCount = markCount;
        } else if (markType === ChatMarkEnum.DISLIKE) {
          msgItem.message.messageMark.dislikeCount = markCount;
        }
      }
    });
  };
  // 更新消息撤回状态
  const updateRecallStatus = (data: RevokedMsgType) => {
    const { msgId } = data;
    const message = currentMessageMap.value?.get(String(msgId));
    if (message) {
      message.message.type = ChatMsgEnum.RECALL;
      if (typeof data.recallUid === 'string') {
        const cacheUser = cachedStore.userCachedList[data.recallUid];
        // 如果撤回者的 id 不等于消息发送人的 id, 或者你本人就是管理员，那么显示管理员撤回的。
        if (data.recallUid !== message.fromUser.uid) {
          message.message.body = `管理员"${cacheUser.name}"撤回了一条成员消息`; // 后期根据本地用户数据修改
        } else {
          // 如果被撤回的消息是消息发送者撤回，正常显示
          message.message.body = `"${cacheUser.name}"撤回了一条消息`; // 后期根据本地用户数据修改
        }
      }
    }
    // 更新与这条撤回消息有关的消息
    const messageList = currentReplyMap.value?.get(String(msgId));
    messageList?.forEach((id) => {
      const msg = currentMessageMap.value?.get(String(id));
      if (msg) {
        msg.message.body.reply.body = `原消息已被撤回`;
      }
    });
  };
  // 删除消息
  const deleteMsg = async (msgId: string) => {
    try {
      await removeMsg({
        msgId,
        state: 1,
      });
      currentMessageMap.value?.delete(msgId);
    } catch (e) {
      console.error(e);
    }
  };
  // 更新消息
  const updateMsg = (msgId: string, newMessage: MessageType) => {
    deleteMsg(msgId);
    pushMsg(newMessage);
  };

  // 标记已读数为 0
  const markSessionRead = (roomId: string) => {
    const session = sessionList.find((item) => item.roomId === roomId);
    const unreadCount = session?.unreadCount || 0;
    if (session) {
      session.unreadCount = 0;
    }
    return unreadCount;
  };

  // 根据消息id获取消息体
  const getMessage = (messageId: string) => {
    return currentMessageMap.value?.get(String(messageId));
  };

  // 删除会话
  const removeContact = (roomId: string) => {
    const index = sessionList.findIndex((session) => session.roomId === roomId);
    sessionList.splice(index, 1);
  };

  return {
    getMsgIndex,
    chatMessageList,
    pushMsg,
    deleteMsg,
    clearNewMsgCount,
    updateMarkCount,
    updateRecallStatus,
    updateMsg,
    chatListToBottomAction,
    newMsgCount,
    messageMap,
    currentMessageMap,
    currentMessageOptions,
    currentReplyMap,
    currentNewMsgCount,
    loadMore,
    currentMsgReply,
    filterUser,
    sessionList,
    sessionOptions,
    getSessionList,
    updateSession,
    updateSessionLastActiveTime,
    markSessionRead,
    getSession,
    isGroup,
    currentSessionInfo,
    getMessage,
    removeContact,
  };
});
