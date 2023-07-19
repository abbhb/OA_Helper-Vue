import {DEFAULT_LAYOUT} from '../base';
import {AppRouteRecordRaw} from '../types';

const USERCENTER: AppRouteRecordRaw = {
    path: '/usercenter',
    name: 'usercenter',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.user-center',
        requiresAuth: true,
        roles: ['*'],
        icon: 'icon-user-center',
        order: 0,
    },
    children: [
        {
            path: 'profile',
            name: 'profile',
            component: () => import('@/views/usercenter/usercenter/index.vue'),
            meta: {
                locale: 'menu.usercenter.profile',
                requiresAuth: true,
                roles: ['10', '1', '2', '3', '4'],
            },
        },
    ],
};

export default USERCENTER;
