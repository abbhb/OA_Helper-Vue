import {ref} from 'vue';
import {defineStore} from 'pinia';
import wsIns from '@/utils/chat/websocket'
import { WsRequestMsgType } from '@/utils/chat/wsType'


export enum LoginStatus {
  Init,
  Waiting,
  Success,
}

export const useWsLoginStore = defineStore('wsLogin', () => {
  const loginQrCode = ref<string>();
  const showLogin = ref(false);
  const loginStatus = ref(LoginStatus.Init);

  function loginSuccess(token:string) {
    wsIns.send({ type: WsRequestMsgType.Authorization, data: { token } });
  }

  return {
    loginQrCode,
    loginStatus,
    showLogin,
    loginSuccess

  };
});
