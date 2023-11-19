import { RouteRecordNormalized } from 'vue-router';

export interface MenuState {
  menuFromServer: boolean;
  serverMenu: RouteRecordNormalized[];
}
