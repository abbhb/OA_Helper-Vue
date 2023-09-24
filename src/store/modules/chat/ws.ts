import {ref} from 'vue';
import {defineStore} from 'pinia';

export enum LoginStatus {
  Init,
  Waiting,
  Success,
}

export const useWsLoginStore = defineStore('wsLogin', () => {
  const loginQrCode = ref<string>();
  const showLogin = ref(false);
  const loginStatus = ref(LoginStatus.Init);
  return {
    loginQrCode,
    loginStatus,
    showLogin,

  };
});
