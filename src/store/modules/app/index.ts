import { defineStore } from 'pinia';
import { Notification } from '@arco-design/web-vue';
import type { NotificationReturn } from '@arco-design/web-vue/es/notification/interface';
import type { RouteRecordNormalized } from 'vue-router';
import defaultSettings from '@/config/settings.json';
import { getMenuList } from '@/api/menu';
import { getConfig } from '@/store/modules/app/persistence';
// eslint-disable-next-line import/namespace
import useRouterPlus from '@/hooks/router';
import { AppState, RecentlyRouter } from './types';

const useAppStore = defineStore('app', {
  state: (): AppState => {
    if (getConfig()) {
      console.log(getConfig());
      if (getConfig().indexOf('globalSettings') !== -1) {
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
    appAsyncMenus(state: AppState): RouteRecordNormalized[] {
      // console.log('同步菜单');
      // console.log(state.serverMenu);
      return state.serverMenu as unknown as RouteRecordNormalized[];
    },
    appRecentlyRouter(state: AppState): RecentlyRouter[] {
      return state.recentlyRouter as unknown as RecentlyRouter[];
    },
  },

  actions: {
    // Update app settings
    updateSettings(partial: Partial<AppState>) {
      // @ts-ignore-next-line
      this.$patch(partial);
    },

    // Change theme color
    toggleTheme(dark: boolean) {
      if (dark) {
        this.theme = 'dark';
        document.body.setAttribute('arco-theme', 'dark');
      } else {
        this.theme = 'light';
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
      this.device = device;
    },
    toggleMenu(value: boolean) {
      this.hideMenu = value;
    },
    logAccess(route: RouteRecordNormalized) {
      let isNew = false;
      this.recentlyRouter.forEach((routeItem) => {
        if (routeItem.path === route.path) {
          isNew = true;
          routeItem.visits += 1;
        }
      });
      if (!isNew) {
        this.recentlyRouter.push({ ...route, visits: 1 });
      }
    },
    async fetchServerMenuConfig() {
      let notifyInstance: NotificationReturn | null = null;
      try {
        notifyInstance = Notification.info({
          id: 'menuNotice', // Keep the instance id the same
          content: 'loading',
          closable: true,
        });
        const { data } = await getMenuList();
        this.serverMenu = data;
        notifyInstance = Notification.success({
          id: 'menuNotice',
          content: 'success',
          closable: true,
        });
      } catch (error) {
        notifyInstance = Notification.error({
          id: 'menuNotice',
          content: 'error',
          closable: true,
        });
      }
    },
    clearServerMenu() {
      this.serverMenu = [];
    },
  },
  persist: true,
});

export default useAppStore;
