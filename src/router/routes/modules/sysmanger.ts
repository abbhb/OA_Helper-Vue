import {DEFAULT_LAYOUT} from '../base';
import {AppRouteRecordRaw} from '../types';

const USERCENTER: AppRouteRecordRaw = {
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
            path: 'manger',
            name: 'manger',
            component: () => import('@/views/sysmanger/user-manger/index.vue'),
            meta: {
                locale: 'menu.sysmanger.manger',
                requiresAuth: true,
                roles: ['superadmin', 'lsadmin'],
            },
        },
        {
            path: 'group',
            name: 'group',
            component: () => import('@/views/sysmanger/group/index.vue'),
            meta: {
                locale: 'menu.sysmanger.group',
                requiresAuth: true,
                roles: ['superadmin', 'lsadmin'],
            },
        },
    ],
};

export default USERCENTER;
