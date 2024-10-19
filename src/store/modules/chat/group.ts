import { computed, reactive, ref } from 'vue';
import { CacheUserReq, GroupDetailReq, UserItem } from '@/types/chat';
import * as apis from '@/api/chat';
import { ChatOnlineEnum, RoleEnum } from '@/types/enums/chat';
import { defineStore } from 'pinia';
import { useCachedStore } from '@/store/modules/chat/cached';
import { pageSize, useChatStore } from '@/store/modules/chat/chat';
import { cloneDeep } from 'lodash';
import { uniqueUserList } from '@/utils/chat/unique';
import { useGlobalStore } from '@/store/modules/chat/global';
import { useUserStore } from '@/store';
import { Message } from '@arco-design/web-vue';

const sorAction = (pre: UserItem, next: UserItem) => {
  if (
    pre.activeStatus === ChatOnlineEnum.ONLINE &&
    next.activeStatus === ChatOnlineEnum.ONLINE
  ) {
    return next.lastOptTime < pre.lastOptTime ? -1 : 1;
  }
  if (
    pre.activeStatus !== ChatOnlineEnum.ONLINE &&
    next.activeStatus !== ChatOnlineEnum.ONLINE
  ) {
    return next.lastOptTime < pre.lastOptTime ? -1 : 1;
  }
  if (
    pre.activeStatus === ChatOnlineEnum.ONLINE &&
    next.activeStatus !== ChatOnlineEnum.ONLINE
  ) {
    return -1;
  }
  if (
    pre.activeStatus !== ChatOnlineEnum.ONLINE &&
    next.activeStatus === ChatOnlineEnum.ONLINE
  ) {
    return 1;
  }
  return next.lastOptTime < pre.lastOptTime ? -1 : 1;
};

export const useGroupStore = defineStore('group', () => {
  const cachedStore = useCachedStore();
  const globalStore = useGlobalStore();
  const userStore = useUserStore();
  const chatStore = useChatStore();
  // 消息列表
  const userList = ref([]);
  const userListOptions = reactive({
    isLast: false,
    loading: true,
    cursor: '',
    currentSearch: '',
  });

  const currentRoomId = computed(() => globalStore?.currentSession?.roomId);
  /**
   * 获取当前群主ID
   */
  const currentLordId = computed(() => {
    const list = userList.value.filter(
      (member) => member.roleId === RoleEnum.LORD
    );
    if (list.length) {
      return list[0]?.uid;
    }
    return -99;
  });
  /**
   * 获取当前管理员ID列表
   * //todo:要实现得改获取用户信息的接口，继承原来的类添加个chatRole角色返回得了
   */
  const adminUidList = computed(() => {
    return userList.value
      .filter((member) => member.roleId === RoleEnum.ADMIN)
      .map((member) => member.uid);
  });
  /**
   * 获取管理员基本信息列表
   */
  const adminList = computed(() => {
    return cachedStore.filterUsersByUidList(adminUidList.value);
  });
  /**
   * 获取管理员基本信息列表
   */
  const memberList = computed(() => {
    const memberInfoList = cachedStore.filterUsersByUidList(
      userList.value.map((item) => item.uid)
    );
    return memberInfoList.map((member) => {
      if (adminUidList.value.includes(member.uid)) {
        return {
          ...member,
          roleId: RoleEnum.ADMIN,
        };
      } else if (member.uid === currentLordId.value) {
        return {
          ...member,
          roleId: RoleEnum.LORD,
        };
      }
      return member;
    });
  });
  const countInfo = ref<GroupDetailReq>({
    avatar: '',
    groupName: '',
    onlineNum: 0,
    role: 0,
    roomId: currentRoomId.value,
  });

  // 移动端控制显隐
  const showGroupList = ref(false);

  // 搜索群成员
  const searchGroupUserList = async (search: string) => {
    // 每次搜索都是全新的匹配条件  ,若search为''即可重置条件
    userListOptions.currentSearch = search;
    await getGroupUserList(true);
  };
  // 获取群成员
  const getGroupUserList = async (refresh = false) => {
    let datasda = null;
    try {
      const { data } = await apis.getGroupList({
        params: {
          pageSize,
          cursor: refresh ? undefined : userListOptions.cursor,
          roomId: currentRoomId.value,
          search:
            userListOptions.currentSearch === ''
              ? undefined
              : userListOptions.currentSearch,
        },
      });
      const tempNew = cloneDeep(
        uniqueUserList(refresh ? data.list : [...data.list, ...userList.value])
      );
      tempNew.sort(sorAction);

      userList.value = tempNew;
      userListOptions.cursor = data.cursor;
      userListOptions.isLast = data.isLast;
      userListOptions.loading = false;
      datasda = data;
    } catch (e) {
      const tempNew = cloneDeep(
        uniqueUserList(refresh ? [] : [...[], ...userList.value])
      );
      tempNew.sort(sorAction);

      userList.value = tempNew;
      userListOptions.cursor = '';
      userListOptions.isLast = true;
      userListOptions.loading = false;
      Message.info('返回结果为空');
      return;
    }
    /** 收集需要请求用户详情的 uid */
    if (datasda !== null) {
      const uidCollectYet: Set<string> = new Set(); // 去重用
      datasda.list?.forEach((user) => uidCollectYet.add(user.uid));
      // 获取用户信息缓存
      await cachedStore.getBatchUserInfo([...uidCollectYet]);
    }
  };

  // 获取群成员数量统计
  const getCountStatistic = async () => {
    const { data } = await apis.groupDetail({ id: currentRoomId.value });
    countInfo.value = data;
  };

  // 默认执行一次
  getGroupUserList();
  getCountStatistic();

  // 加载更多群成员
  const loadMore = async () => {
    if (userListOptions.isLast) return;
    await getGroupUserList();
  };

  // 更新用户在线状态
  const batchUpdateUserStatus = (items: UserItem[]) => {
    const tempNew = cloneDeep(userList.value);
    for (let index = 0, len = items.length; index < len; index += 1) {
      const curUser = items[index];
      const findIndex = tempNew.findIndex((item) => item.uid === curUser.uid);
      // findIndex > -1 &&
      //   (tempNew[findIndex].activeStatus = curUser.activeStatus)
    }
    tempNew.sort(sorAction);
    userList.value = tempNew;
  };

  // 过滤掉小黑子
  const filterUser = (uid: number) => {
    if (typeof uid !== 'number') return;
    userList.value = userList.value.filter((item) => item.uid !== uid);
  };

  /**
   * 添加管理员
   * @param uidList
   */
  const addAdmin = async (uidList: string[]) => {
    await apis.addAdmin({ roomId: currentRoomId.value, uidList });

    // 更新群成员列表
    userList.value.forEach((user) => {
      if (uidList.includes(user.uid)) {
        user.roleId = RoleEnum.ADMIN;
      }
    });
  };

  /**
   * 撤销管理员
   * @param uidList
   */
  const revokeAdmin = async (uidList: string[]) => {
    await apis.revokeAdmin({ roomId: currentRoomId.value, uidList });

    // 更新群成员列表
    userList.value.forEach((user) => {
      if (uidList.includes(user.uid)) {
        user.roleId = RoleEnum.NORMAL;
      }
    });
  };

  const exitGroup = async () => {
    // 退出群聊
    await apis.exitGroup({ roomId: currentRoomId.value });
    try {
      // 更新群成员列表
      const index = userList.value.findIndex(
        (user) => user.uid === userStore.userInfo.id
      );
      userList.value.splice(index, 1);

      // 更新会话列表
      chatStore.removeContact(currentRoomId.value);
    } catch (e) {
      console.log(e);
    }

    // 切换为第一个会话
    globalStore.currentSession.roomId = chatStore.sessionList[0].roomId;
  };

  return {
    userList,
    userListOptions,
    loadMore,
    getGroupUserList,
    searchGroupUserList,
    getCountStatistic,
    currentLordId,
    countInfo,
    batchUpdateUserStatus,
    showGroupList,
    filterUser,
    adminUidList,
    adminList,
    memberList,
    addAdmin,
    revokeAdmin,
    exitGroup,
  };
});

export default { useGroupStore };
