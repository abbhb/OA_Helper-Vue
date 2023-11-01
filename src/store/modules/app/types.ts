import type { RouteRecordNormalized } from 'vue-router';

export interface RecentlyRouter extends RouteRecordNormalized {
  visits: number;
}
export interface AppState {
  theme: string;
  colorWeak: boolean;
  navbar: boolean;
  menu: boolean;
  topMenu: boolean;
  hideMenu: boolean;
  menuCollapse: boolean;
  footer: boolean;
  themeColor: string;
  menuWidth: number;
  globalSettings: boolean;
  device: string;
  tabBar: boolean;
  modelFullscreen: boolean;
  menuFromServer: boolean;
  serverMenu: RouteRecordNormalized[];
  recentlyRouter: RecentlyRouter[];
  [key: string]: unknown;
  lastPrintDevice: string; // id
  versionRead: string; // 版本号不对或者为空即没阅读最新版本说明
}
