import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

// @ts-ignore
const DASHBOARD: AppRouteRecordRaw = {
  path: '/dashboard',
  name: 'dashboard',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.dashboard',
    requiresAuth: true,
    roles: ['*'],
    icon: 'icon-dashboard',
    order: 0,
    canGo: false,
  },
  children: [
    {
      path: 'workplace',
      name: 'Workplace',
      component: () => import('@/views/dashboard/workplace/index.vue'),
      meta: {
        locale: 'menu.dashboard.workplace',
        requiresAuth: true,
        roles: ['*'],
        canGo: true,
      },
    },
    {
      path: 'printer',
      name: 'printer',
      component: () => import('@/views/dashboard/printer/printerL.vue'),
      meta: {
        locale: 'menu.dashboard.printer',
        requiresAuth: true,
        roles: ['*'],
        canGo: true,
      },
    },
    {
      path: 'printer-manager',
      name: 'printerManager',
      component: () => import('@/views/printer/manager/index.vue'),
      meta: {
        locale: 'menu.dashboard.printerManager',
        requiresAuth: true,
        roles: ['*'],
        canGo: true,
      },
    },
    {
      path: 'printer-manager-user',
      name: 'printerManagerUser',
      component: () => import('@/views/printer/manager-user/index.vue'),
      meta: {
        locale: 'menu.dashboard.printerManagerUser',
        requiresAuth: true,
        roles: ['*'],
        canGo: true,
      },
    },
    {
      path: 'keep',
      name: 'keep',
      component: () => import('@/views/dashboard/keep/index.vue'),
      meta: {
        locale: 'menu.dashboard.keep',
        requiresAuth: true,
        roles: ['*'],
        canGo: true,
      },
    },
  ],
};

export default DASHBOARD;
