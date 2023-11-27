import { notifyMe } from '@/utils/notify';
import { MessageType } from '@/types/chat';
import useServerConfigStore from '@/store/modules/server-config';
import { Notification } from '@arco-design/web-vue';
import { useCachedStore } from '@/store/modules/chat/cached';

// Notify系统通知
export const pushNotify = (msg: MessageType) => {
  const systemConfigStore = useServerConfigStore();
  const cachedStore = useCachedStore();
  const cacheUser = cachedStore.userCachedList[msg.fromUser.uid];

  if (
    msg.fromUser.uid === systemConfigStore.systemMessage.userId &&
    msg.message.roomId === systemConfigStore.systemMessage.roomId
  ) {
    notifyMe(
      cacheUser.name as string,
      msg.message.body.content,
      cacheUser.avatar as string
    );
  }
};

// 站内通知
export const pushNitice = (msg: MessageType) => {
  const systemConfigStore = useServerConfigStore();
  const cachedStore = useCachedStore();
  const cacheUser = cachedStore.userCachedList[msg.fromUser.uid];

  if (
    msg.fromUser.uid === systemConfigStore.systemMessage.userId &&
    msg.message.roomId === systemConfigStore.systemMessage.roomId
  ) {
    // 当前用户在浏览器窗口
    Notification.info({
      title: cacheUser.name,
      content: msg.message.body.content,
    });
  }
};

export const pushNotifyByMessage = (msg: MessageType) => {
  // tab 在后台就发系统消息
  if (document.hidden) {
    pushNotify(msg);
  } else {
    pushNitice(msg);
  }
};
