import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const SysManger: AppRouteRecordRaw = {
  path: '/sysmanger',
  name: 'sysmanger',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.sysmanger',
    requiresAuth: true,
    roles: ['*'],
    icon: 'icon-user',
    order: 3,
    canGo: false,
  },
  children: [
    {
      path: 'user-manger',
      name: 'UserManger',
      component: () => import('@/views/sysmanger/user-manger/index.vue'),
      meta: {
        locale: 'menu.sysmanger.UserManger',
        requiresAuth: true,
        roles: ['*'],
        canGo: true,
      },
    },
    {
      path: 'menu-manger',
      name: 'MenuManger',
      component: () => import('@/views/sysmanger/menu-manger/index.vue'),
      meta: {
        locale: 'menu.sysmanger.MenuManger',
        requiresAuth: true,
        roles: ['*'],
        canGo: true,
      },
    },
    {
      path: 'group',
      name: 'group',
      component: () => import('@/views/sysmanger/group/index.vue'),
      meta: {
        locale: 'menu.sysmanger.group',
        requiresAuth: true,
        roles: ['*'],
        canGo: true,
      },
    },
    {
      path: 'role-manger',
      name: 'RoleManger',
      component: () => import('@/views/sysmanger/role-manger/index.vue'),
      meta: {
        locale: 'menu.sysmanger.RoleManger',
        requiresAuth: true,
        roles: ['*'],
        canGo: true,
      },
    },
    {
      path: 'dept-manger',
      name: 'DeptManger',
      component: () => import('@/views/sysmanger/dept-manger/index.vue'),
      meta: {
        locale: 'menu.sysmanger.DeptManger',
        requiresAuth: true,
        roles: ['*'],
        canGo: true,
      },
    },
    {
      path: 'oauth-manger',
      name: 'OauthManger',
      component: () => import('@/views/sysmanger/oauth-manger/index.vue'),
      meta: {
        locale: 'menu.sysmanger.OauthManger',
        requiresAuth: true,
        roles: ['*'],
        canGo: true,
      },
    },
  ],
};

export default SysManger;
