import {DEFAULT_LAYOUT} from '../base';
import {AppRouteRecordRaw} from '../types';

const NavAdmin: AppRouteRecordRaw = {
    path: '/nav-admin',
    name: 'NavAdmin',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.navadmin',
        requiresAuth: true,
        roles: ['*'],
        icon: 'icon-user',
        order: 3,
        canGo: false,
    },
    children: [
        {
            path: 'nav-fenlei-admin',
            name: 'NavFenLeiAdmin',
            component: () => import('@/views/nav-dh/fenlei/index.vue'),
            meta: {
                locale: 'menu.sysmanger.NavFenLeiAdmin',
                requiresAuth: true,
                roles: ['*'],
                canGo: true,
            },
        }, {
            path: 'nav-item-admin',
            name: 'NavItemAdmin',
            component: () => import('@/views/nav-dh/item/index.vue'),
            meta: {
                locale: 'menu.sysmanger.NavItemAdmin',
                requiresAuth: true,
                roles: ['*'],
                canGo: true,
            },
        },
    ],
};

export default NavAdmin;
