import { reactive } from 'vue';
import { defineStore } from 'pinia';
import { useGlobalStore } from '@/store/modules/chat/global';
import { ContactItem, RequestFriendItem } from '@/types/chat';
import * as ChatApi from '@/api/chat';

export const pageSize = 20;

export const useContactStore = defineStore('contact', () => {
  const globalStore = useGlobalStore();
  const contactsList = reactive<ContactItem[]>([]);
  const requestFriendsList = reactive<RequestFriendItem[]>([]);

  const contactsOptions = reactive({
    isLoading: false,
  });
  const requestFriendsOptions = reactive({
    isLast: false,
    isLoading: false,
    cursor: '',
  });

  const getContactList = async (isFresh = false) => {
    if (!isFresh) {
      if (contactsOptions.isLoading) return;
    }
    contactsOptions.isLoading = true;
    // eslint-disable-next-line import/namespace
    const { data } = await ChatApi.getContactList();
    contactsOptions.isLoading = false;
    if (!data) return

    // eslint-disable-next-line no-unused-expressions
    isFresh
      ? contactsList.splice(0, contactsList.length, ...data)
      : contactsList.push(...data);
    contactsOptions.isLoading = false;
  };

  const getRequestFriendsList = async (isFresh = false) => {
    if (!isFresh) {
      if (requestFriendsOptions.isLast || requestFriendsOptions.isLoading)
        return;
    }
    requestFriendsOptions.isLoading = true;
    // eslint-disable-next-line import/namespace
    const { data } = await ChatApi.requestFriendList({
      pageSize,
      cursor:
        isFresh || !requestFriendsOptions.cursor
          ? undefined
          : requestFriendsOptions.cursor,
    });
    requestFriendsOptions.isLoading = false;
    if (!data) return;
    // eslint-disable-next-line no-unused-expressions
    isFresh
      ? requestFriendsList.splice(0, requestFriendsList.length, ...data.list)
      : requestFriendsList.push(...data.list);
    requestFriendsOptions.cursor = data.cursor;
    requestFriendsOptions.isLast = data.isLast;
    requestFriendsOptions.isLoading = false;
  };

  // 默认执行一次
  // getContactList()
  // getRequestFriendsList()

  /** 接受好友请求 */
  const onAcceptFriend = async (applyId: string) => {
    // 同意好友申请
    // eslint-disable-next-line import/namespace
    await ChatApi.applyFriendRequest({ applyId });
    // 刷新好友申请列表
    getRequestFriendsList(true);
    // 刷新好友列表
    getContactList(true);

    // 标识为可以发消息的人
    if (globalStore.currentSelectedContact) {
      // @ts-ignore
      globalStore.currentSelectedContact.status = RequestFriendAgreeStatus.Agree;
    }
  };

  /** 删除好友 */
  const onDeleteContact = async (uid: string) => {
    if (!uid) return;
    // 同意好友申请
    // eslint-disable-next-line import/namespace
    await ChatApi.deleteFriend({ targetUid: uid });
    // 刷新好友申请列表
    // getRequestFriendsList(true)
    // 刷新好友列表
    getContactList(true);
  };

  return {
    getContactList,
    getRequestFriendsList,
    contactsList,
    requestFriendsList,
    contactsOptions,
    requestFriendsOptions,
    onAcceptFriend,
    onDeleteContact,
  };
});
