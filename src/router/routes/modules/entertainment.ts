import { FULL_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

// @ts-ignore
const ENTERTAINMENT: AppRouteRecordRaw = {
  path: '/entertainment',
  name: 'Entertainment',
  component: FULL_LAYOUT,
  meta: {
    locale: 'menu.entertainment',
    requiresAuth: false,
    roles: ['*'],
    icon: 'icon-dashboard',
    order: 0,
  },
  children: [
    {
      path: 'center',
      name: 'Center',
      component: () => import('@/views/entertainment/center/index.vue'),
      meta: {
        locale: 'menu.entertainment.center',
        requiresAuth: false,
        roles: ['*'],
      },
    },

  ],
};

export default ENTERTAINMENT;
