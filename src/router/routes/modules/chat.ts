import { CUSTOM_MENU_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

// @ts-ignore
const Chat: AppRouteRecordRaw = {
  path: '/chat',
  name: 'Chat',
  component: CUSTOM_MENU_LAYOUT,
  meta: {
    locale: 'menu.chat',
    requiresAuth: true,
    roles: ['*'],
    icon: 'icon-dashboard',
    order: 0,
    canGo: false,
  },
  children: [
    {
      path: 'chat',
      name: 'Chat-Index',
      component: () => import('@/views/chat/chat-index/index.vue'),
      meta: {
        locale: 'menu.Message',
        requiresAuth: true,
        roles: ['*'],
        canGo: true,
      },
    },
    {
      path: 'contacts',
      name: 'Chat-Contacts',
      component: () => import('@/views/chat/contacts/index.vue'),
      meta: {
        locale: 'menu.Contacts',
        requiresAuth: true,
        roles: ['*'],
        canGo: true,
      },
    },

  ],
};

export default Chat;
