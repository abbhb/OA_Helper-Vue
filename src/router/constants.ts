// 白名单，不放会导致某些问题，比如死循环跳登录
export const WHITE_LIST = [
  { name: 'notFound', children: [] },
  { name: 'login', children: [] },
  { name: 'callback', children: [] },
];

export const NOT_FOUND = {
  name: 'notFound',
};

export const REDIRECT_ROUTE_NAME = 'Redirect';

export const DEFAULT_ROUTE_NAME = 'Workplace';

export const DEFAULT_ROUTE = {
  title: 'menu.dashboard.workplace',
  name: DEFAULT_ROUTE_NAME,
  fullPath: '/dashboard/workplace',
};
