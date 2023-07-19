import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';
import localeCallback from '@/views/callback/locale/zh-CN';

import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';
import localeSafeCenter from '@/views/usercenter/usercenter/locale/zh-CN';
import localePrinter from '@/views/dashboard/printer/locale/zh-CN';
import localeKeep from '@/views/dashboard/keep/locale/zh-CN';

import localeSettings from './zh-CN/settings';

export default {
  'menu.dashboard': '仪表盘',
  'menu.usercenter': '用户中心',
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.workplace': '工作台-服务端',
  'menu.usercenter.usercenter': '用户中心',
  'menu.dashboard.printer': 'AI_EN打印',
  'menu.dashboard.keep': '学习打卡',
  'menu.server.monitor': '实时监控-服务端',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '个人中心',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': '常见问题',
  'menu.fileBrowser': '文件服务器',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  'footer.company': 'AI_EN Helper',
  'card.more': '更多',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,
  ...localeCallback,
  ...localeSafeCenter,
  ...localePrinter,
  ...localeKeep,

};
