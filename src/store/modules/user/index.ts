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
import rsautils from '@/utils/rsautils';
import {UserState} from './types';
import useAppStore from '../app';

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

    // Get user's information
    async info() {
      const res = await getUserInfo();
      this.setInfo(res.data);
    },

    // Login
    async login(loginForm: LoginData) {
      try {
        loginForm.password = <string>(
            rsautils.encryptByPublicKey(loginForm.password)
        );
        const res = await userLogin(loginForm);
        setToken(res.data.token);
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    async loginByCode(loginForm: LoginDataByCode) {
      try {
        const res = await loginbycode(loginForm);
        setToken(res.data.token);
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
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
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
