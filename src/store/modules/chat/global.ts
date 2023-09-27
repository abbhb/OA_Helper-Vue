import {defineStore} from 'pinia';
import {reactive, ref, watch} from 'vue';
import {useChatStore} from '@/store/modules/chat/chat';
import {RoomTypeEnum} from '@/types/enums/chat';
import {ContactItem, RequestFriendItem} from '@/types/chat';

export const useGlobalStore = defineStore('global', () => {
  const chatStore = useChatStore();
  const unReadMark = reactive<{
    newFriendUnreadCount: number;
    newMsgUnreadCount: number;
  }>({
    newFriendUnreadCount: 0,
    newMsgUnreadCount: 0,
  });
  const currentReadUnreadList = reactive<{
    show: boolean;
    msgId: number | null;
  }>({
    show: false,
    msgId: null,
  });
  const currentSession = reactive<{ roomId: number; type: RoomTypeEnum }>({
    roomId: 1,
    type: RoomTypeEnum.Group,
  });
  /** 点击联系人选中的联系人项 */
  const currentSelectedContact = ref<ContactItem | RequestFriendItem>();
  const addFriendModalInfo = reactive<{ show: boolean; uid?: number }>({
    show: false,
    uid: undefined,
  });
  // 创建群聊
  const createGroupModalInfo = reactive<{
    show: boolean;
    isInvite: boolean;
    selectedUid: number[];
  }>({
    show: false,
    isInvite: false,
    selectedUid: [],
  });

  // 切换会话的时候重置消息已读数查询
  watch(currentSession, (val) => {
    // 清理已读数查询
    // clearQueue();
    // setTimeout(readCountQueue, 1000);
    // // 标记房间最新消息已读
    // markMsgRead({ roomId: val.roomId }).send();
    // const unreadCount = chatStore.markSessionRead(val.roomId);
    // const resultCount = unReadMark.newMsgUnreadCount - unreadCount;
    // unReadMark.newMsgUnreadCount = resultCount > 0 ? resultCount : 0;
  });

  return {
    unReadMark,
    currentSession,
    addFriendModalInfo,
    currentSelectedContact,
    currentReadUnreadList,
    createGroupModalInfo,
  };
});

export default {useGlobalStore}