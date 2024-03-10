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
        canGo: false,
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
                canGo: true,
            },
        },
        {
            path: 'startProcess',
            name: 'StartProcess',
            component: () => import('@/views/usercenter/process-my/index.vue'),
            meta: {
                locale: 'menu.usercenter.process-my',
                requiresAuth: true,
                roles: ['*'],
                canGo: true,
            },
        },
        {
            path: 'todo',
            name: 'Todo',
            component: () => import('@/views/usercenter/todo-my/index.vue'),
            meta: {
                locale: 'menu.usercenter.todo-my',
                requiresAuth: true,
                roles: ['*'],
                canGo: true,
            },
        },
    ],
};

export default USERCENTER;
