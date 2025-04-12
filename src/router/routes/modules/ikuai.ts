import {DEFAULT_LAYOUT} from '../base';
import {AppRouteRecordRaw} from '../types';

// @ts-ignore
const BMP: AppRouteRecordRaw = {
    path: '/ikuai',
    name: 'Ikuai',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.ikuai',
        requiresAuth: true,
        roles: ['*'],
        icon: 'icon-dashboard',
        order: 0,
        canGo: false,
    },
    children: [
        {
            path: 'allow-manager',
            name: 'IkuaiAllowManager',
            component: () => import('@/views/ikuai/allow-manager/index.vue'),
            meta: {
                locale: 'menu.ikuai.allow',
                requiresAuth: true,
                roles: ['*'],
                canGo: true,
            },
        },
    ],
};

export default BMP;
