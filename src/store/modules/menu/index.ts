import { defineStore } from 'pinia';
import { RecentlyRouter } from '@/store/modules/app/types';
import { RouteRecordNormalized } from 'vue-router';
import { NotificationReturn } from '@arco-design/web-vue/es/notification/interface';
import { Notification } from '@arco-design/web-vue';
import { getMenuList } from '@/api/menu';
import {MenuState} from "@/store/modules/menu/types";

const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    menuFromServer: true,
    serverMenu: [],
  }),

  getters: {
    appCurrentSetting(state: MenuState): MenuState {
      return { ...state };
    },
    appAsyncMenus(state: MenuState): RouteRecordNormalized[] {
      console.log('同步菜单');
      console.log(state.serverMenu);
      return state.serverMenu as unknown as RouteRecordNormalized[];
    },
  },

  actions: {
    // Update app settings
    updateSettings(partial: Partial<MenuState>) {
      // @ts-ignore-next-line
      this.$patch(partial);
    },

    // todo:如果在回调登录页或者登录页会导致报错
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
});

export default useMenuStore;
