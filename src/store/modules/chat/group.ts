import {reactive, ref} from 'vue';
import {CacheUserReq, UserItem} from '@/types/chat';
import * as apis from '@/api/chat';
import {ChatOnlineEnum} from '@/types/enums/chat';
import {defineStore} from 'pinia';
import {useCachedStore} from '@/store/modules/chat/cached';
import {pageSize} from '@/store/modules/chat/chat';
import {cloneDeep} from 'lodash';
import {uniqueUserList} from '@/utils/chat/unique';

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
  // 消息列表
  const userList = ref([]);
  const isLast = ref(false);
  const loading = ref(true);
  const cursor = ref();
  const countInfo = reactive({ onlineNum: 0, totalNum: 0 });

  // 移动端控制显隐
  const showGroupList = ref(false);

  // 获取群成员
  const getGroupUserList = async () => {
    const { data } = await apis.getGroupList({
      params: { pageSize, cursor: cursor.value },
    });
    if (!data) return;
    const tempNew = cloneDeep(
      uniqueUserList([...data.list, ...userList.value])
    );
    tempNew.sort(sorAction);
    userList.value = tempNew;
    cursor.value = data.cursor;
    isLast.value = data.isLast;
    loading.value = false;

    /** 收集需要请求用户详情的 uid */
    const uidCollectYet: Set<string> = new Set(); // 去重用
    const uidCollects: CacheUserReq[] = [];
    const collectUidItem = (uid: string) => {
      if (uidCollectYet.has(uid)) return;
      const cacheUser = cachedStore.userCachedList[uid];
      uidCollects.push({ uid, lastModifyTime: cacheUser?.lastModifyTime });
      // 添加收集过的 uid
      uidCollectYet.add(uid);
    };
    data.list?.forEach((user) => collectUidItem(user.uid));
    // 获取用户信息缓存
    cachedStore.getBatchUserInfo(uidCollects);
  };

  // 获取群成员数量统计
  const getCountStatistic = async () => {
    const { data } = await apis.getMemberStatistic();
    countInfo.onlineNum = data.onlineNum;
    countInfo.totalNum = data.totalNum;
  };

  // 默认执行一次
  getGroupUserList();
  getCountStatistic();

  // 加载更多群成员
  const loadMore = async () => {
    if (isLast.value) return;
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

  return {
    userList,
    loading,
    loadMore,
    getGroupUserList,
    countInfo,
    batchUpdateUserStatus,
    showGroupList,
    filterUser,
  };
});

export default {useGroupStore}