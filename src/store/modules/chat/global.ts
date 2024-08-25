import { defineStore } from 'pinia';
import { reactive, ref, watch } from 'vue';
import { RoomTypeEnum } from '@/types/enums/chat';
import {ContactItem, ContactItemW, RequestFriendItem} from '@/types/chat';
import { clearQueue, readCountQueue } from '@/utils/chat/readCountQueue';
import { markMsgRead } from '@/api/chat';
import { useChatStore } from '@/store/modules/chat/chat';

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
    msgId: string | null;
  }>({
    show: false,
    msgId: null,
  });
  // todo:fix允许当前为空会话，此处会导致bug,某些情况导致roomId为undefined应该兼容，显示为空
  const currentSession = reactive<{ roomId: string; type: RoomTypeEnum }>({
    roomId: '',
    type: RoomTypeEnum.Group,
  });
  /** 点击联系人选中的联系人项 */
  const currentSelectedContact = ref<ContactItemW | RequestFriendItem>();
  const addFriendModalInfo = reactive<{ show: boolean; uid?: string }>({
    show: false,
    uid: undefined,
  });
  // 创建群聊
  const createGroupModalInfo = reactive<{
    show: boolean;
    isInvite: boolean;
    selectedUid: string[];
  }>({
    show: false,
    isInvite: false,
    selectedUid: [],
  });

  // 切换会话的时候重置消息已读数查询
  watch(currentSession, (val) => {
    // 清理已读数查询
    clearQueue();
    setTimeout(readCountQueue, 1000);
    // 标记房间最新消息已读
    markMsgRead({ roomId: val.roomId });
    const unreadCount = chatStore.markSessionRead(val.roomId);
    // console.log(unReadMark.newMsgUnreadCount, unreadCount)
    // setTimeout(() => {
    //   if (unReadMark.newMsgUnreadCount !== unReadMark.newMsgUnreadCount - unreadCount) {
    //     // unReadMark.newMsgUnreadCount = unReadMark.newMsgUnreadCount - unreadCount
    //   }
    // })
    const resultCount = unReadMark.newMsgUnreadCount - unreadCount;
    unReadMark.newMsgUnreadCount = resultCount > 0 ? resultCount : 0;
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

export default { useGlobalStore };
