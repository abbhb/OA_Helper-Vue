import {DEFAULT_LAYOUT} from '../base';
import {AppRouteRecordRaw} from '../types';

// @ts-ignore
const BMP: AppRouteRecordRaw = {
    path: '/bmp',
    name: 'Bmp',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.bmp',
        requiresAuth: true,
        roles: ['*'],
        icon: 'icon-dashboard',
        order: 0,
        canGo: false,
    },
    children: [
        {
            path: 'form-i',
            name: 'FormI',
            component: () => import('@/views/bmp/form/index.vue'),
            meta: {
                locale: 'menu.bmp.form',
                requiresAuth: true,
                roles: ['*'],
                canGo: true,
            },
        },
        {
            path: 'bpmn',
            name: 'BPMN',
            component: () => import('@/views/bmp/bpmn/index.vue'),
            meta: {
                locale: 'menu.bmp.bpmn',
                requiresAuth: true,
                roles: ['*'],
                canGo: true,
            },
        },
        {
            path: 'bpmn-group',
            name: 'BPMNGroup',
            component: () => import('@/views/bmp/bpm-group/index.vue'),
            meta: {
                locale: 'menu.bmp.bpmn-group',
                requiresAuth: true,
                roles: ['*'],
                canGo: true,
            },
        },
        {
            path: 'bpmn-group-act',
            name: 'BPMNGroupAct',
            component: () => import('@/views/bmp/bpm-group-act/index.vue'),
            meta: {
                locale: 'menu.bmp.bpmn-group-act',
                requiresAuth: true,
                roles: ['*'],
                canGo: true,
            },
        },
    ],
};

export default BMP;
