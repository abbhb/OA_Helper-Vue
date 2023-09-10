import {RouteLocationNormalized, RouteRecordRaw} from 'vue-router';
import {useUserStore} from '@/store';

export default function usePermission() {
  const userStore = useUserStore();
  return {
    accessRouter(route: RouteLocationNormalized | RouteRecordRaw) {
      const roleKeyList = [];
      userStore.roles.forEach((item) => {
        roleKeyList.push(item.roleKey);
      });
      return (
        !route.meta?.requiresAuth ||
        !route.meta?.roles ||
        route.meta?.roles?.includes('*') ||
        // route.meta?.roles?.includes(String(userStore.roles))
        route.meta.roles.length + roleKeyList.length !==
        Array.from(new Set([...route.meta.roles, ...roleKeyList])).length
      );
    },
    findFirstPermissionRoute(_routers: any, role = 'admin') {
      const cloneRouters = [..._routers];
      while (cloneRouters.length) {
        const firstElement = cloneRouters.shift();
        if (
          firstElement?.meta?.roles?.find((el: string[]) => {
            return el.includes('*') || el.includes(role);
          })
        )
          return { name: firstElement.name };
        if (firstElement?.children) {
          cloneRouters.push(...firstElement.children);
        }
      }
      return null;
    },
    // You can add any rules you want
  };
}
