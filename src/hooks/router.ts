import {
  RouteRecord,
  RouteRecordNormalized,
  RouteRecordRaw,
  useRouter,
} from 'vue-router';
import { useUserStore } from '@/store';
import { BreadcrumbRoute, Message } from '@arco-design/web-vue';

export default function useRouterPlus() {
  const router = useRouter();
  // 也没用动态路由，获取一次就行
  const routerList: RouteRecordNormalized[] = router.getRoutes();

  function findObjectById(
    obj: RouteRecord | RouteRecordRaw,
    path: string
  ): RouteRecord | RouteRecordRaw | undefined {
    if (obj.path === path) {
      return obj;
    }

    if (obj.children && obj.children.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const child of obj.children) {
        const found = findObjectById(child, path);
        if (found !== undefined) {
          return found;
        }
      }
    }

    return undefined;
  }

  const isCanGo = (currentRouter: RouteRecord): boolean => {
    for (let i = 0; i < routerList.length; i += 1) {
      const itoj = findObjectById(routerList[i], currentRouter.path);
      if (itoj !== undefined) {
        if (itoj.meta.canGo === false) {
          return false;
        }
        if (
          !itoj.meta.canGo ||
          itoj.meta.canGo === true ||
          itoj.path.includes('http')
        ) {
          return true;
        }
      }
    }
    return false;
  };
  return {
    isCanGo,
  };
}
