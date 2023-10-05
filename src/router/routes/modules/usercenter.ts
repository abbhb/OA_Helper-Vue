import {DEFAULT_LAYOUT} from '../base';
import {AppRouteRecordRaw} from '../types';

const USERCENTER: AppRouteRecordRaw = {
    path: '/usercenter',
    name: 'usercenter',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.usercenter',
        requiresAuth: true,
        roles: ['*'],
        icon: 'icon-user',
        order: 0,
        canGo:false

    },
    children: [
        {
            path: 'profile',
            name: 'profile',
            component: () => import('@/views/usercenter/usercenter/index.vue'),
            meta: {
                locale: 'menu.usercenter.usercenter',
                requiresAuth: true,
                roles: ['*'],
                canGo:true

            },
        },
    ],
};

export default USERCENTER;
