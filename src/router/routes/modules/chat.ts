import {DEFAULT_LAYOUT} from '../base';
import {AppRouteRecordRaw} from '../types';

// @ts-ignore
const Chat: AppRouteRecordRaw = {
  path: '/chat',
  name: 'Chat',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.chat',
    requiresAuth: true,
    roles: ['*'],
    icon: 'icon-dashboard',
    order: 0,
    canGo:false

  },
  children:[
    {
      path: 'chat',
      name: 'Chat-Index',
      component: () => import('@/views/chat/chat-index/index.vue'),
      meta: {
        locale: 'menu.chat',
        requiresAuth: true,
        roles: ['*'],
        canGo:true
      },
    },
      {
          path: 'notice-list',
          name: 'Notice-List',
          component: () => import('@/views/content-promotion/notice-list/index.vue'),
          meta: {
              locale: 'menu.notice-list',
              requiresAuth: true,
              roles: ['*'],
              canGo: true
      },
    },
  ]
};

export default Chat;
