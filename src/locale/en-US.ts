import localeMessageBox from '@/components/message-box/locale/en-US';
import localeLogin from '@/views/login/locale/en-US';

import localeWorkplace from '@/views/dashboard/workplace/locale/en-US';

import localeCallback from '@/views/callback/locale/en-US';
import localeSafeCenter from '@/views/usercenter/usercenter/locale/en-US';
import localeUserGroup from '@/views/sysmanger/group/locale/en-US';

import localePrinter from '@/views/dashboard/printer/locale/en-US';
import localeKeep from '@/views/dashboard/keep/locale/en-US';
import localeSysUserManger from '@/views/sysmanger/user-manger/locale/en-US';
import localeSysMenuManger from '@/views/sysmanger/menu-manger/locale/en-US';
import localeSysRoleManger from '@/views/sysmanger/role-manger/locale/en-US';
import localeSysDeptManger from '@/views/sysmanger/dept-manger/locale/en-US';
import localeSettings from './en-US/settings';

export default {
    'menu.dashboard': 'Dashboard',
    'menu.usercenter.usercenter': 'User-Center',
    'menu.server.dashboard': 'Dashboard-Server',
    'menu.server.workplace': 'Workplace-Server',
    'menu.sysmanger.group': 'Group-User',
    'menu.sysmanger': 'System-Center',
    'menu.sysmanger.usercenter': 'User-Center',
    'menu.sysmanger.MenuManger': 'Menu-Manger',
    'menu.sysmanger.UserManger': 'User-Manger',
    'menu.sysmanger.DeptManger': 'Dpet-Manger',
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
    ...localeUserGroup,
    ...localeSysUserManger,
    ...localeSysMenuManger,
    ...localeSysRoleManger,
    ...localeSysDeptManger,
};
