import type {Router, RouteRecordNormalized} from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import usePermission from '@/hooks/permission';
import {useAppStore, useUserStore} from '@/store';
import useMenuStore from "@/store/modules/menu";
import {appRoutes} from '../routes';
import {NOT_FOUND, WHITE_LIST} from '../constants';

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const appStore = useAppStore();
    const menuStore = useMenuStore();

    // 统计用户跳转路由的次数来选出8个作为快捷操作，先使用浏览器本地存储，之后数据存数据库
    appStore.logAccess(to as unknown as RouteRecordNormalized);
    if (to.meta.requiresAuth === false) {
      next();
    }
    const Permission = usePermission();
    const permissionsAllow = Permission.accessRouter(to);
    if (menuStore.menuFromServer) {
      // 针对来自服务端的菜单配置进行处理
      // Handle routing configuration from the server

      // 根据需要自行完善来源于服务端的菜单配置的permission逻辑
      // Refine the roles logic from the server's menu configuration as needed
      if (
        !menuStore.appAsyncMenus ||
        (menuStore.appAsyncMenus.length === 0 &&
          !WHITE_LIST.find((el) => el.name === to.name))
      ) {
        await menuStore.fetchServerMenuConfig();
      }
      const serverMenuConfig = [...menuStore.appAsyncMenus, ...WHITE_LIST];

      let exist = false;
      while (serverMenuConfig.length && !exist) {
        const element = serverMenuConfig.shift();
        if (element?.name === to.name) exist = true;
        // 目前就2级路由！第三级为按钮权限
        if (element?.children) {
          serverMenuConfig.push(
            ...(element.children as unknown as RouteRecordNormalized[])
          );
        }
      }
      if (exist && permissionsAllow) {
        next();
      } else next(NOT_FOUND);
    } else {
      // eslint-disable-next-line no-lonely-if
      if (permissionsAllow) {
        next();
      } else {
        const destination =
          Permission.findFirstPermissionRoute(appRoutes, String('10')) ||
          NOT_FOUND;
        next(destination);
      }
    }
    NProgress.done();
  });
}
