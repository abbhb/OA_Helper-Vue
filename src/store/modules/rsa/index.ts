import { defineStore } from 'pinia';
import { getPublicKey } from '@/api/common';
import { RSAState } from './types';

const useRSAStore = defineStore('rsa', {
  state: (): RSAState => ({
    publicKey: '',
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
    async updateRSA() {
      const res = await getPublicKey();
      this.publicKey = res.data;
      return res.data;
    },
    resetRSA() {
      this.publicKey = '';
    },
  },
});

export default useRSAStore;
