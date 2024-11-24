import { defineStore } from 'pinia';
import { SigninState } from '@/store/modules/signin/types';
import { SigninDeviceDto, signinDeviceList } from '@/api/signin';

const useSigninStore = defineStore('signin', {
  state: (): SigninState => ({
    devices: [],
  }),
  actions: {
    async initDevices() {
      const { data } = await signinDeviceList();
      this.devices = data;
    },
    getDeviceById(deviceId: string): SigninDeviceDto {
      if (!this.devices || this.devices.length === 0) {
        return null;
      }
      if (!this.devices || this.devices.length === 0) {
        return null;
      }
      for (let i = this.devices.length - 1; i >= 0; i -= 1) {
        if (this.devices[i].deviceId === deviceId) {
          return this.devices[i];
        }
      }
      return null;
    },
  },
});

export default useSigninStore;
