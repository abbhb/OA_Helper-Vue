import { computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import { isDiffNow10Min } from '@/utils/chat/computedTime';
import { CacheUserItem, CacheUserReq } from '@/types/chat';
import * as Api from '@/api/chat';
import { useGlobalStore } from '@/store/modules/chat/global';

export type BaseUserItem = Pick<CacheUserItem, 'uid' | 'avatar' | 'name'>;

export const useCachedStore = defineStore(
  'cached',
  () => {
    const globalStore = useGlobalStore();
    const userCachedList = reactive<Record<string, Partial<CacheUserItem>>>({});

    const currentRoomId = computed(() => globalStore.currentSession.roomId);

    const atUsersMap = reactive<Record<number, BaseUserItem[]>>({
      [currentRoomId.value]: [],
    }); // 消息Map

    const currentAtUsersList = computed({
      get: () => {
        const current = atUsersMap[currentRoomId.value];
        if (current === undefined) {
          atUsersMap[currentRoomId.value] = [];
        }
        if (currentRoomId.value === '1') {
          return Object.values(userCachedList as unknown as BaseUserItem[]);
        }
        return atUsersMap[currentRoomId.value];
      },
      set: (val) => {
        atUsersMap[currentRoomId.value] = val;
      },
    });

    /** 批量获取用户详细信息 */
    const getBatchUserInfo = async (uids: string[]) => {
      // 没有 lastModifyTime 的要更新，lastModifyTime 距离现在 10 分钟已上的也要更新
      const result = uids
        .map((uid) => {
          const cacheUser = userCachedList[uid];
          return { uid, lastModifyTime: cacheUser?.lastModifyTime };
        })
        .filter(
          (item) => !item.lastModifyTime || isDiffNow10Min(item.lastModifyTime)
        );
      if (!result.length) return;

      const { data } = await Api.getUserInfoBatch(result);
      data?.forEach((item) => {
        // 更新最后更新时间。
        const curItemResult = {
          ...(item?.needRefresh ? item : userCachedList[item.uid]),
          needRefresh: undefined,
          lastModifyTime: Date.now(),
        };
        userCachedList[item.uid] = curItemResult;
      });
    };
    const getAllUserBaseInfo = async () => {
      const { data } = await Api.getAllUserBaseInfo({ params: { roomId: 1 } });
      data?.forEach((item) => {
        userCachedList[item.uid] = item;
      });
    };

    /** 房间内的所有群成员列表-@专用 */
    const initAllUserBaseInfo = async () => {
      if (localStorage.getItem('IS_INIT_USER_BASE') === null) {
        // await getAllUserBaseInfo()
        const { data } = await Api.getAllUserBaseInfo({
          params: { roomId: currentRoomId.value },
        });
        // eslint-disable-next-line no-return-assign
        data?.forEach((item) => (userCachedList[item.uid] = item));
        localStorage.setItem('IS_INIT_USER_BASE', 'true');
      }
    };

    const getGroupAtUserBaseInfo = async () => {
      if (currentRoomId.value === '1') return;
      const { data } = await Api.getAllUserBaseInfo({
        params: { roomId: currentRoomId.value },
      });
      currentAtUsersList.value = data;
    };

    // 根据用户名关键字过滤用户，
    // FIXME 是否需要过滤自己
    const filterUsers = (searchKey: string) => {
      return currentAtUsersList.value?.filter((item) =>
        item.name?.startsWith(searchKey)
      );
    };

    /**
     * 通过用户ID列表获取用户基本信息
     * @param uidList
     */
    const filterUsersByUidList = (uidList: number[]) => {
      return currentAtUsersList.value.filter((user) =>
        uidList.includes(user.uid)
      );
    };

    return {
      userCachedList,
      getBatchUserInfo,
      initAllUserBaseInfo,
      filterUsers,
      getGroupAtUserBaseInfo,
      currentAtUsersList,
      filterUsersByUidList,
    };
  },
  { persist: true }
);

export default { useCachedStore };
