import { defineStore } from 'pinia';
import type { RouteRecordNormalized } from 'vue-router';
import defaultSettings from '@/config/settings.json';
import { getConfig } from '@/store/modules/app/persistence';
// eslint-disable-next-line import/namespace
import useRouterPlus from '@/hooks/router';
import { AppStateVO, getUserFrontConfig, setUserFrontConfig } from '@/api/user';
import { isLogin } from '@/utils/auth';
import eventBus from '@/utils/eventBus';
import { AppState, RecentlyRouter } from './types';

const useAppStore = defineStore('app', {
  state: (): AppState => {
    // const data = this.getUserFrontConfigS();
    // return { ...data };
    // const configs = getConfig();
    // if (configs) {
    //   if (configs.indexOf('globalSettings') !== -1) {
    //
    //   }
    // }

    return { ...defaultSettings };
  },

  getters: {
    appCurrentSetting(state: AppState): AppState {
      return { ...state };
    },
    appDevice(state: AppState) {
      return state.device;
    },
    appRecentlyRouter(state: AppState): RecentlyRouter[] {
      return state.recentlyRouter as unknown as RecentlyRouter[];
    },
    appquickRouter(state: AppState): RouteRecordNormalized[] {
      return state.quickRouter as unknown as RouteRecordNormalized[];
    },
  },

  actions: {
    // Update app settings
    async updateSettings(partial: Partial<AppState>, ignoreUpdate?: boolean) {
      this.$patch(partial);
      if (!ignoreUpdate) {
        await this.updateConfigServer();
      }
    },
    async initSettings() {
      // 每次登录成功首次就同步一次配置
      const { data } = await getUserFrontConfig();
      this.$patch(data);
    },
    // Change theme color
    async toggleTheme(dark: boolean) {
      eventBus.emit('addLoading', { tip: '写入用户配置中~' });
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this
      try {
        if (dark) {
          await that.updateSettings({ theme: 'dark' });
          document.body.setAttribute('arco-theme', 'dark');
        } else {
          await that.updateSettings({ theme: 'light' });
          document.body.removeAttribute('arco-theme');
        }
      } catch (e) {
        console.log(e);
      } finally {
        eventBus.emit('removeLoading');
      }
    },
    getRecentlyRouter(): RecentlyRouter[] {
      const routerPlus = useRouterPlus();
      const recentlyList = this.appRecentlyRouter;
      recentlyList.sort((a, b) => b.visits - a.visits);
      const canGoRecentlyList = [];
      for (let i = 0; i < recentlyList.length; i += 1) {
        if (routerPlus.isCanGo(recentlyList[i])) {
          canGoRecentlyList.push(recentlyList[i]);
        }
        if (canGoRecentlyList.length >= 9) {
          break;
        }
      }
      return canGoRecentlyList;
    },
    getQuickRouter(): RouteRecordNormalized[] {
      const routerPlus = useRouterPlus();
      const quickList = this.appquickRouter;
      const canGoRecentlyList = [];
      for (let i = 0; i < quickList.length; i += 1) {
        if (routerPlus.isCanGo(quickList[i])) {
          canGoRecentlyList.push(quickList[i]);
        }
        if (canGoRecentlyList.length >= 9) {
          break;
        }
      }
      return canGoRecentlyList;
    },
    clearLocalRecentlyVisited() {
      // 清除本地记录
      this.$state.recentlyRouter = [];
    },
    toggleDevice(device: string) {
      this.updateSettings({ device }, true);
    },
    toggleMenu(value: boolean) {
      this.updateSettings({ hideMenu: value }, true);
    },
    logAccess(route: RouteRecordNormalized) {
      let isNew = false;
      if ('ignore' in route.meta) {
        if (route.meta.ignore) {
          return;
        }
      }
      this.recentlyRouter.forEach((routeItem) => {
        if (routeItem.path === route.path) {
          isNew = true;
          routeItem.visits += 1;
        }
      });
      if (!isNew) {
        this.recentlyRouter.push({ ...route, visits: 1 });
      }
      this.updateConfigServer();
    },
    updateQuickRoute(routes: RouteRecordNormalized[]) {
      this.quickRouter = routes || [];

      this.updateConfigServer();
    },
    async changePrintDevice(id: string) {
      await this.updateSettings({lastPrintDevice: id});
    },
    async updateConfigServer() {
      if (!isLogin) {
        console.log('未登录，不更新用户配置');
        return;
      }
      try {
        const duixiang: AppStateVO = {
          colorWeak: this.colorWeak,
          footer: this.footer,
          lastPrintDevice: this.lastPrintDevice,
          menuWidth: 180,
          modelFullscreen: this.modelFullscreen,
          tabBar: this.tabBar,
          theme: this.theme,
          topMenu: this.topMenu,
          versionRead: this.versionRead,
        };
        await setUserFrontConfig({ appState: duixiang });
      } catch (e) {
        console.log(e);
        console.log('记录失败');
      }
    },
  },
});

export default useAppStore;
