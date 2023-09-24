import {reactive} from 'vue';
import {defineStore} from 'pinia';
import {isDiffNow10Min} from '@/utils/chat/computedTime';
import {CacheUserItem, CacheUserReq} from '@/types/chat';
import * as Api from '@/api/chat';

export const useCachedStore = defineStore(
  'cached',
  () => {
    const userCachedList = reactive<Record<string, Partial<CacheUserItem>>>({});

    /** 批量获取用户详细信息 */
    const getBatchUserInfo = async (users: CacheUserReq[]) => {
      // 没有 lastModifyTime 的要更新，lastModifyTime 距离现在 10 分钟已上的也要更新
      const result = users.filter(
        (item) => !item.lastModifyTime || isDiffNow10Min(item.lastModifyTime)
      );
      if (!result.length) return;
      const itemIdSet: Set<string> = new Set();
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

    /** 全量初始化用户基础信息 */
    const initAllUserBaseInfo = async () => {
      if (localStorage.getItem('IS_INIT_USER_BASE') === null) {
        await getAllUserBaseInfo();
        localStorage.setItem('IS_INIT_USER_BASE', 'true');
      }
    };

    // 根据用户名关键字过滤用户，
    // FIXME 是否需要过滤自己
    const filterUsers = (searchKey: string) => {
      return Object.values(userCachedList).filter((item) =>
        item.name?.startsWith(searchKey)
      );
    };

    return {
      userCachedList,
      getBatchUserInfo,
      initAllUserBaseInfo,
      filterUsers,
    };
  },
  { persist: true }
);

export default { useCachedStore };
