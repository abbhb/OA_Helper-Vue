import {DEFAULT_LAYOUT} from '../base';
import { AppRouteRecordRaw } from '../types';

// @ts-ignore
const MYVACATION: AppRouteRecordRaw = {
  path: '/my-vacation',
  name: 'MyVacation',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.my-vacation',
    requiresAuth: true,
    roles: ['*'],
    icon: 'icon-dashboard',
    order: 3,
    canGo: false,
  },
  children: [
    {
      path: 'attendance',
      name: 'Attendance',
      component: () => import('@/views/my-vacation/attendance/index.vue'),
      meta: {
        locale: 'menu.my-vacation.attendance',
        requiresAuth: true,
        roles: ['*'],
        canGo: true,
      },
    },
  ],
};

export default MYVACATION;
