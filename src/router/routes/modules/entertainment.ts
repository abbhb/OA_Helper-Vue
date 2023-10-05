import { FULL_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

// @ts-ignore
const ENTERTAINMENT: AppRouteRecordRaw = {
  path: '/entertainment',
  name: 'Entertainment',
  component: FULL_LAYOUT,
  meta: {
    locale: 'menu.entertainment',
    requiresAuth: true,
    roles: ['*'],
    icon: 'icon-dashboard',
    order: 0,
    canGo:false
  },
  children: [
    {
      path: 'center',
      name: 'Center',
      component: () => import('@/views/entertainment/center/index.vue'),
      meta: {
        locale: 'menu.entertainment.center',
        requiresAuth: true,
        roles: ['*'],
        canGo:true
      },
    },
    {
      path: 'game2048',
      name: 'Game2048',
      component: () => import('@/views/entertainment/game-2048/index.vue'),
      meta: {
        locale: 'menu.entertainment.game2048',
        requiresAuth: true,
        roles: ['*'],
        canGo:true
      },
    },
  ],
};

export default ENTERTAINMENT;
