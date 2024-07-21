import { defineStore } from 'pinia';
import { getPublicKey, getSystemMessageConfig } from '@/api/common';
import { ServerConfigState } from '@/store/modules/server-config/types';

const useServerConfigStore = defineStore('server-config', {
  state: (): ServerConfigState => ({
    publicKey: '',
    systemMessage: {
      userId: '10011',
      roomId: '2',
    },
  }),

  getters: {
    getPublicKey(): string {
      if (!this.publicKey) {
        this.updateRSA();
      }
      return this.publicKey;
    },
  },

  actions: {
    initDate() {
      this.updateRSA();
      this.updateSystemMessageConfig();
    },

    async updateRSA() {
      const res = await getPublicKey();
      this.publicKey = res.data;
      return res.data;
    },
    async updateSystemMessageConfig() {
      const { data } = await getSystemMessageConfig();
      this.systemMessage.roomId = data.roomId;
      this.systemMessage.userId = data.userId;
    },

    resetRSA() {
      this.publicKey = '';
    },
  },
});

export default useServerConfigStore;
