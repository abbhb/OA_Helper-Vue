import {createRouter, createWebHashHistory} from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';

import {appRoutes} from './routes';
import {NOT_FOUND_ROUTE, REDIRECT_MAIN} from './routes/base';
import createRouteGuard from './guard';

NProgress.configure({ showSpinner: true }); // NProgress Configuration

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
        redirect: (to) => {
            return {path: '/login'};
        },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/callback',
      name: 'callback',
      component: () => import('@/views/callback/index.vue'),
      meta: {
        requiresAuth: false,
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
