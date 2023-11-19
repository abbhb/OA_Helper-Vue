import { defineStore } from 'pinia';
import type { RouteRecordNormalized } from 'vue-router';
import defaultSettings from '@/config/settings.json';
import { getConfig } from '@/store/modules/app/persistence';
// eslint-disable-next-line import/namespace
import useRouterPlus from '@/hooks/router';
import {getUserFrontConfig, setUserFrontConfig} from "@/api/user";
import { AppState, RecentlyRouter } from './types';

const useAppStore = defineStore('app', {
  state: (): AppState => {
    const configs = getConfig();
    if (configs) {
      if (configs.indexOf('globalSettings') !== -1) {
        return { ...JSON.parse(getConfig()) };
      }
    }
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
  },

  actions: {
    // Update app settings
    updateSettings(partial: Partial<AppState>,ignoreUpdate?:boolean) {
      this.$patch(partial);
      if (!ignoreUpdate){
        this.updateConfigServer();
      }
    },
    async initSettings() {
      // 每次登录成功首次就同步一次配置
      const {data} = await getUserFrontConfig();
      this.$patch(JSON.parse(data));
    },
    // Change theme color
    toggleTheme(dark: boolean) {
      if (dark) {
        this.updateSettings({ theme: 'dark' });
        document.body.setAttribute('arco-theme', 'dark');
      } else {
        this.updateSettings({ theme: 'light' });
        document.body.removeAttribute('arco-theme');
      }
    },
    getRecentlyRouter(): RecentlyRouter[] {
      const routerPlus = useRouterPlus();
      const recentlyList = this.appRecentlyRouter;
      recentlyList.sort((a, b) => a.visits - b.visits);
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
    toggleDevice(device: string) {
      this.updateSettings({ device },true);
    },
    toggleMenu(value: boolean) {
      this.updateSettings({ hideMenu: value },true);
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
    changePrintDevice(id: string) {
      this.updateSettings({ lastPrintDevice: id });
    },
    async updateConfigServer() {
      const text = JSON.stringify(this.$state, null, 2);
      await setUserFrontConfig({req:text});
    }
  },
});

export default useAppStore;
