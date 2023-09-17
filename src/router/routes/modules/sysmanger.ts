import {DEFAULT_LAYOUT} from '../base';
import {AppRouteRecordRaw} from '../types';

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
            },
        },
    ],
};

export default SysManger;
