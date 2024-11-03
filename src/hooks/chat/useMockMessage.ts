import { computed } from 'vue';
import { MessageType } from '@/types/chat';
import { useGlobalStore } from '@/store/modules/chat/global';
import { useUserStore } from '@/store';

/**
 * Mock 消息 Hook
 */
// eslint-disable-next-line import/prefer-default-export
export const useMockMessage = () => {
  // 获取本地存储的用户信息
  const globalStore = useGlobalStore();
  const userStore = useUserStore();
  // 获取本地存储的用户信息
  const currentRoomId = computed(() => globalStore.currentSession.roomId);

  /**
   * 模拟消息生成
   * @param type 消息类型
   * @param body 消息体
   * @param messageMark 互动信息
   * @returns 服务器格式消息
   */
  /**
   * 模拟消息生成
   * @param type 消息类型
   * @param body 消息体
   * @param messageMark 互动信息
   * @returns 服务器格式消息
   */
  const mockMessage = (
    type: number,
    body: any,
    messageMark?: any
  ): MessageType => {
    const currentTimeStamp: number = Date.now();
    const random: number = Math.floor(Math.random() * 15);
    // 唯一id 后五位时间戳+随机数
    const uniqueId = String(currentTimeStamp).slice(-7) + random;
    const content = type === 1 ? body.content : null;
    const { id, name, avatar } = userStore;
    const data = {
      fromUser: {
        username: name,
        uid: id,
        avatar,
        locPlace: 'XX',
      },
      message: {
        id: uniqueId,
        roomId: currentRoomId.value,
        sendTime: '2024-01-01 12:41:12',
        content,
        urlContentMap: {},
        type,
        body,
        messageMark: {
          likeCount: 0,
          userLike: 0,
          dislikeCount: 0,
          userDislike: 0,
          ...messageMark,
        },
      },
      sendTime: String(currentTimeStamp),
      loading: true,
    };
    return data;
  };

  return {
    mockMessage,
  };
};
