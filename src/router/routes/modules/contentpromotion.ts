import {DEFAULT_LAYOUT} from '../base';
import {AppRouteRecordRaw} from '../types';

const ContentPromotion: AppRouteRecordRaw = {
  path: '/content-promotion',
  name: 'ContentPromotion',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.contentpromotion',
    requiresAuth: true,
    roles: ['*'],
    icon: 'icon-user',
    order: 1,
      canGo: false,
  },
  children: [
    {
      path: 'docnotification',
      name: 'DocNotification',
      component: () =>
          import('@/views/content-promotion/doc-notification/index.vue'),
      meta: {
        locale: 'menu.docnotification.DocNotification',
        requiresAuth: true,
        roles: ['*'],
          canGo: true,
      },
    },
    {
      path: 'indeximage',
      name: 'IndexImage',
      component: () =>
          import('@/views/content-promotion/index-image/index.vue'),
      meta: {
        locale: 'menu.docnotification.IndexImage',
        requiresAuth: true,
        roles: ['*'],
          canGo: true,
      },
    },
  ],
};

export default ContentPromotion;
