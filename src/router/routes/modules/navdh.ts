import {AppRouteRecordRaw} from '../types';

// @ts-ignore
const NAVDH: AppRouteRecordRaw = {
    path: '/nav',
    name: 'Nav',
    meta: {
        locale: 'menu.nav',
        requiresAuth: true,
        roles: ['*'],
        icon: 'icon-dashboard',
        order: 20,
        canGo: false,
    },
    children: [
        {
            path: 'index',
            name: 'NavIndex',
            component: () => import('@/views/nav-dh/index-v1/index.vue'),
            meta: {
                locale: 'menu.nav.index',
                requiresAuth: true,
                roles: ['*'],
                canGo: true,
                ignore: true,
            },
        }
    ],
};

export default NAVDH;
