import {DEFAULT_LAYOUT} from '../base';
import {AppRouteRecordRaw} from '../types';

// @ts-ignore
const Signin: AppRouteRecordRaw = {
    path: '/signin',
    name: 'Signin',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.signin',
        requiresAuth: true,
        roles: ['*'],
        icon: 'icon-dashboard',
        order: 0,
        canGo: false,
    },
    children: [
        {
            path: 'bcgl',
            name: 'BCGL',
            component: () => import('@/views/signin/bc/index.vue'),
            meta: {
                locale: 'menu.signin.bcgl',
                requiresAuth: true,
                roles: ['*'],
                canGo: true,
            },
        },
        {
            path: 'group',
            name: 'SigninGroup',
            component: () => import('@/views/signin/group/index.vue'),
            meta: {
                locale: 'menu.signin.group',
                requiresAuth: true,
                roles: ['*'],
                canGo: true,
            },
        },
        {
            path: 'signin-device',
            name: 'SigninDeviceManger',
            component: () => import('@/views/signin/device/index.vue'),
            meta: {
                locale: 'menu.signin.device',
                requiresAuth: true,
                roles: ['*'],
                canGo: true,
            },
        },
    ],
};

export default Signin;
