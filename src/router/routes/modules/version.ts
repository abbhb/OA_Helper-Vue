import { DEFAULT_LAYOUT, FULL_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

// @ts-ignore
const VERSION: AppRouteRecordRaw = {
  path: '/version',
  name: 'Version',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.version',
    requiresAuth: true,
    roles: ['*'],
    icon: 'icon-dashboard',
    order: 94,
    canGo: false,
  },
  children: [
    {
      path: 'index',
      name: 'VersionIndex',
      component: () => import('@/views/version/index.vue'),
      meta: {
        locale: 'menu.version.index',
        requiresAuth: true,
        roles: ['*'],
        canGo: true,
        ignore:true,

      },
    },
  ],
};

export default VERSION;
