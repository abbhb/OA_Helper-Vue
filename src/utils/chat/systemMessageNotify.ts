import { notifyMe } from '@/utils/notify';
import { MessageType } from '@/types/chat';
import useServerConfigStore from '@/store/modules/server-config';
import { Notification } from '@arco-design/web-vue';
import { useCachedStore } from '@/store/modules/chat/cached';
import AvatarImage from '@/components/image/AvatarImage.vue';
import RenderMessage from '@/views/chat/chat-index/components/RenderMessage/index.vue';
import { h } from 'vue';

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
    // 暂时无特殊
  }

  // 当前用户在浏览器窗口
  Notification.info({
    title: cacheUser.name,
    content: () =>
      h(RenderMessage, {
        message: msg,
        extType: ""
      }),
    icon: () =>
      h(AvatarImage, {
        avatar: cacheUser.avatar,
        name: cacheUser.name,
        key: cacheUser.avatar + 'customiconsys' + cacheUser.name,
      }),
  });
};

export const pushNotifyByMessage = (msg: MessageType) => {
  // tab 在后台就发系统消息
  if (document.hidden) {
    console.log('后台');
    pushNotify(msg);
  } else {
    console.log('站内');

    pushNitice(msg);
  }
};

export const pushWebNotifyByMessage = (msg: MessageType) => {
  pushNitice(msg);
};
