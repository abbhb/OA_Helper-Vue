import type {ComputedRef} from 'vue'
import {computed, toValue} from 'vue'
import {useCachedStore} from "@/store/modules/chat/cached";

/**
 * 统一获取用户信息 hook
 * @param uid 用户 ID
 * @description 引入该Hook后，可响应式获取用户信息
 */
export const useUserInfo = (uid?: string | ComputedRef<string | undefined>) => {
  const cachedStore = useCachedStore()
  const userInfo = computed(() => (uid && cachedStore.userCachedList[toValue(uid as string)]) || {})
  return userInfo
}

export default {useUserInfo}