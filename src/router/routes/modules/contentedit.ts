import {FULL_LAYOUT} from '../base';
import {AppRouteRecordRaw} from '../types';

const ContentEdit: AppRouteRecordRaw = {
    path: '/content-edit',
    name: 'ContentEdit',
    component: FULL_LAYOUT,
    meta: {
        locale: 'menu.edit',
        requiresAuth: true,
        roles: ['*'],
        icon: 'icon-user',
        order: 1,
        canGo: false,
    },
    children: [
        {
            path: 'notice-edit',
            name: 'NoticeEdit',
            component: () =>
                import('@/views/content-promotion/notice-edit/index.vue'),
            meta: {
                locale: 'menu.notice-edit.NoticeEdit',
                requiresAuth: true,
                roles: ['*'],
                canGo: true, // 不展示在菜单区
            },
        },
    ],
};

export default ContentEdit;
