import type { ComputedRef } from 'vue';
import { computed, toValue } from 'vue';
import { useCachedStore } from '@/store/modules/chat/cached';

/**
 * 统一获取用户信息 hook
 * @param uid 用户 ID
 * @description 引入该Hook后，可响应式获取用户信息
 */
export const useUserInfo = (uid?: string | ComputedRef<string | undefined>) => {
  const cachedStore = useCachedStore();
  const userInfo = computed(() => {
    if (uid === '0') {
      return {
        uid: '0',
        name: '全体成员',
        lastModifyTime: 0,
        itemIds: [],
        wearingItemId: '',
        locPlace: '',
        avatar: '',
        lastOptTime: '',
      };
    }
    if (!(uid && cachedStore.userCachedList[toValue(uid as string)])){
      cachedStore.getBatchUserInfo([uid as string])
      return {}
    }
    return (uid && cachedStore.userCachedList[toValue(uid as string)]) || {};
  });
  return userInfo;
};

export default { useUserInfo };
