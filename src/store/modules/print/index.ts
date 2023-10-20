import { defineStore } from 'pinia';
import { modelType, PrintDevice, PrintState } from './types';

const usePrintStore = defineStore('print', {
  state: (): PrintState => ({
    model: 1, // 默认单文件打印
    printDevice: {
      id: '',// 没有选择打印机开始打印直接提示当前没有打印机
      name: '',
      description: '',
      ip: '',
      port: 0,
      status: 0,
      listNums:0,
      statusTypeMessage:"异常"
    },
  }),

  getters: {
    getModel(): modelType {
      return this.model;
    },
    getPrintDevice(): PrintDevice {
      return this.printDevice;
    },
  },

  actions: {
    set(model: modelType) {
      this.model = model;
    },
    setPrintDevice(printDevice: PrintDevice) {
      this.printDevice = printDevice;
    },
    reset() {
      this.model = 1;
    },
  },
});

export default usePrintStore;
