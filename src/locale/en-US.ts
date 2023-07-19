import localeMessageBox from '@/components/message-box/locale/en-US';
import localeLogin from '@/views/login/locale/en-US';

import localeWorkplace from '@/views/dashboard/workplace/locale/en-US';

import localeCallback from "@/views/callback/locale/zh-CN";
import localeSafeCenter from "@/views/usercenter/usercenter/locale/zh-CN";
import localePrinter from "@/views/dashboard/printer/locale/zh-CN";
import localeKeep from "@/views/dashboard/keep/locale/zh-CN";
import localeSettings from './en-US/settings';

export default {
  'menu.dashboard': 'Dashboard',
  'menu.server.dashboard': 'Dashboard-Server',
  'menu.server.workplace': 'Workplace-Server',
  'menu.server.monitor': 'Monitor-Server',
  'menu.list': 'List',
  'menu.result': 'Result',
  'menu.exception': 'Exception',
  'menu.form': 'Form',
  'menu.profile': 'Profile',
  'menu.visualization': 'Data Visualization',
  'menu.user': 'User Center',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': 'FAQ',
  'menu.fileBrowser': 'FileBrowser',
  'navbar.docs': 'Docs',
  'navbar.action.locale': 'Switch to English',
  'card.more': 'More',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,
  ...localeCallback,
  ...localeSafeCenter,
  ...localePrinter,
  ...localeKeep,
};
