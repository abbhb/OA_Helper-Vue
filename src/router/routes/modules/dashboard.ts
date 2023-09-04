import {DEFAULT_LAYOUT} from '../base';
import {AppRouteRecordRaw} from '../types';

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
          },
      },
  ],
};

export default DASHBOARD;
