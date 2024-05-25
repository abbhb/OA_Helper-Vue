import { FULL_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

// @ts-ignore
const Signin: AppRouteRecordRaw = {
  path: '/signin-ext',
  name: 'SigninExt',
  component: FULL_LAYOUT,
  meta: {
    locale: 'menu.signin-ext',
    requiresAuth: true,
    roles: ['*'],
    icon: 'icon-dashboard',
    order: 0,
    canGo: false,
  },
  children: [
    {
      path: 'signin-data-read',
      name: 'SigninDataRead',
      component: () => import('@/views/signin/signin-data-read/index.vue'),
      meta: {
        locale: 'menu.signin-ext.data-read',
        requiresAuth: true,
        roles: ['*'],
        canGo: true,
      },
    },
  ],
};

export default Signin;
