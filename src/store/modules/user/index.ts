import {defineStore} from 'pinia';
import {
  getUserInfo,
  login as userLogin,
  loginbycode,
  loginbytoken,
  LoginData,
  LoginDataByCode,
  logout as userLogout,
} from '@/api/user';
import {clearToken, setToken} from '@/utils/auth';
import {removeRouteListener} from '@/utils/route-listener';
import {checkPermissionByServer} from '@/api/permission';
import useMenuStore from '@/store/modules/menu';
import {useAppStore} from "@/store";
import {UserState} from './types';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    name: '',
    avatar: '',
    username: '',
    id: undefined,
    email: '',
    sex: '男',
    status: 1,
    phone: '',
    createTime: '',
    updateTime: '',
    studentId: '',
    deptId: '',
    deptName: '',
    roles: [
      {
        id: '3',
        roleName: '内部用户',
        roleKey: 'roomuser',
      },
    ],
    permissionCache: [], // 用作缓存，后端有权限校验，所以没必要每次刷新组件都去请求服务器，先经过缓存
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    switchPermission() {
      return new Promise((resolve) => {
        resolve(this.permission);
      });
    },
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },
    isSign() {
      return this.id !== '';
    },

    // Get user's information
    async info() {
      try {
        const res = await getUserInfo();
        this.setInfo(res.data);
        // eslint-disable-next-line no-console
      } catch (e) {
        console.log(e);
      }
    },

    async loginSuccess(token: string) {
      setToken(token);
      await useAppStore().initSettings();
    },
    // Login
    async login(loginForm: LoginData) {
      try {
        // 移除ras加密
        // loginForm.password = <string>(
        //   rsautils.encryptByPublicKey(loginForm.password)
        // );
        const res = await userLogin(loginForm);
        await this.loginSuccess(res.data.token);
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    // eslint-disable-next-line consistent-return
    async checkPermission(permission: string) {
      let isCache = false;
      let isHavePermission = false;
      if (this.permissionCache.length > 0) {
        // eslint-disable-next-line array-callback-return,consistent-return,no-plusplus
        for (let i = 0; i < this.permissionCache.length; i++) {
          if (this.permissionCache[i].permission === permission) {
            isCache = true;
            if (this.permissionCache[i].type === 1) {
              isHavePermission = true;
              return true;
            }
          }
        }
      }
      if (isHavePermission) {
        return true;
      }
      if (isCache && !isHavePermission) {
        return false;
      }
      if (!isCache) {
        try {
          const { data } = await checkPermissionByServer({ permission });
          this.permissionCache.push({ permission, type: data });
          if (data === 1) {
            return true;
          }
          return false;
        } catch (e) {
          return false;
        }
      }
    },
    async loginByCode(loginForm: LoginDataByCode) {
      try {
        const res = await loginbycode(loginForm);
        await this.loginSuccess(res.data.token);
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    async loginByToken() {
      try {
        await loginbytoken();
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    logoutCallBack() {
      const menuStore = useMenuStore();

      this.resetInfo();
      clearToken();
      removeRouteListener();
      menuStore.clearServerMenu();
    },
    // Logout
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
});

export default useUserStore;
