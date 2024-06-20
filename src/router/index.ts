import { createRouter, createWebHashHistory } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';

import { appRoutes } from './routes';
import { NOT_FOUND_ROUTE, REDIRECT_MAIN } from './routes/base';
import createRouteGuard from './guard';

NProgress.configure({ showSpinner: true }); // NProgress Configuration

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: (to) => {
        return { path: '/login' };
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: {
        requiresAuth: false,
        canGo: true,
        ignore: true,
      },
    },
    {
      path: '/client_oauth',
      name: 'ClientOauth',
      component: () => import('@/views/client_oauth/index.vue'),
      meta: {
        requiresAuth: true,
        canGo: true,
        ignore: true,
      },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/register/index.vue'),
      meta: {
        requiresAuth: false,
        canGo: true,
        ignore: true,
      },
    },
    {
      path: '/forgot-password',
      name: 'forgotPassword',
      component: () => import('@/views/forget-password/index.vue'),
      meta: {
        requiresAuth: false,
        canGo: true,
        ignore: true,
      },
    },
    {
      path: '/callback',
      name: 'callback',
      component: () => import('@/views/callback/index.vue'),
      meta: {
        requiresAuth: false,
        canGo: true,
        ignore: true,
      },
    },
    {
      path: '/show',
      name: 'oauthShow',
      component: () => import('@/views/oauth/index.vue'),
      meta: {
        requiresAuth: false,
        canGo: true,
        ignore: true,
      },
    },
    ...appRoutes,
    REDIRECT_MAIN,
    NOT_FOUND_ROUTE,
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

createRouteGuard(router);

export default router;
