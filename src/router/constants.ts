// 白名单，不放会导致某些问题，比如死循环跳登录
export const WHITE_LIST = [
  { name: 'notFound', children: [] },
  { name: 'login', children: [] },
  { name: 'ClientOauth', children: [] },
  { name: 'register', children: [] },
  { name: 'callback', children: [] },
  { name: 'oauthShow', children: [] },
  { name: 'forgotPassword', children: [] },
    {name: 'NoticeEdit', children: []}, // 通知编辑组件
    {name: 'SigninDataRead', children: []}, // 考勤统计阅读组件
    {name: 'MangerHolidays', children: []}, // 节假日管理组件
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
