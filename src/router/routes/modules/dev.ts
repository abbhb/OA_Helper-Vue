import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

// @ts-ignore
const DEV: AppRouteRecordRaw = {
  path: '/dev',
  name: 'DEV',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.dev',
    requiresAuth: true,
    roles: ['*'],
    icon: 'icon-dashboard',
    order: 0,
    canGo: false,
  },
  children: [
    {
      path: 'test',
      name: 'Test',
      component: () => import('@/views/dev/test/index.vue'),
      meta: {
        locale: 'menu.dev.test',
        requiresAuth: true,
        roles: ['*'],
        canGo: true,
      },
    },
  ],
};

export default DEV;
