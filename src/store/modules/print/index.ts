import { defineStore } from 'pinia';
import { printDevicePolling } from '@/api/printer';
import { PrintDeviceImpl } from '@/utils/print/PrintDeviceImpl';
import { modelType, PrintState } from './types';

const usePrintStore = defineStore('print', {
  state: (): PrintState => ({
    model: 1, // 默认单文件打印
    printDevice: null, // 无对象引用就是没选择
    printDeviceList: [], // 如果用户在选择，就不删除里面的数据，只更新状态为异常，如果选择窗关着就直接删掉不行的打印机
    isSelecting: false,
    needDelectId: [], // 不为空或者数量不为0时，需要监听是否选择的状态，false就删除一次
    timer: null,
  }),

  getters: {
    getModel(): modelType {
      return this.model;
    },
    // 打印机状态是否正常，不正常的在轮询后就给自动取消选择
    isCanPrint(): boolean {
      if (this.printDevice.id === '') {
        return false;
      }
      return true;
    },
    getPrintDevice(): PrintDeviceImpl {
      return this.printDevice;
    },
    getPrintDeviceList(): PrintDeviceImpl[] {
      return this.printDeviceList;
    },
  },

  actions: {
    set(model: modelType) {
      this.model = model;
    },
    startSelect() {
      this.isSelecting = true;
    },
    stopSelect() {
      this.isSelecting = false;
    },
    stopPolling() {
      // 停止每个小的遍历
      // eslint-disable-next-line no-plusplus
      for (let i = this.printDeviceList.length - 1; i >= 0; i--) {
        this.printDeviceList[i].stopPolling();
      }
      // 停止大的遍历
      if (this.timer != null) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    isHavePrintDevice(id: string):(boolean|PrintDeviceImpl) {
      if (id === '' || id == null) {
        return false;
      }
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < this.printDeviceList.length; i++) {
        if (this.printDeviceList[i].id === id) {
          return this.printDeviceList[i];
        }
      }
      return false;
    },
    async getDevicePollCode() {
      const {data} = await printDevicePolling();
      // 遍历 现有 列表
      if (
          this.printDeviceList == null ||
          this.printDeviceList.length <= 0
      ) {
        this.printDeviceList = [];
        // 首次为空,此时禁止进入select状态，点击选择框提示加载中
        // 直接添加B
        // eslint-disable-next-line no-plusplus
        for (let i = data.length - 1; i >= 0; i--) {
          if (this.needDelectId.length > 0) {
            const index = this.needDelectId.findIndex(
                (need) => need === data[i].id
            );
            if (index !== -1) {
              // 把移除列表这项移除，不用删了
              this.needDelectId.splice(index, 1); // 删除 `find` 到的元素
            }
          }
          this.printDeviceList.push(
              new PrintDeviceImpl(
                  data[i].id,
                  data[i].name,
                  data[i].description,
                  data[i].ip,
                  data[i].port,
                  data[i].status,
                  '未知',
                  0
              )
          );
        }
      } else {
        // 否则还需要判断，如果此时在select状态，只能修改状态，需要删除的放入删除列表
        // eslint-disable-next-line no-plusplus
        for (let i = this.printDeviceList.length - 1; i >= 0; i--) {
          const itemA = this.printDeviceList[i];
          const matchInB = data.findIndex(
              (itemB) => String(itemB.id) === String(itemA.id)
          );

          if (matchInB !== -1) {
            // 相关属性匹配，但要检查属性是否为 1，如果不是则删除
            if (itemA.status === '0') {
              if (this.isSelecting) {
                this.printDeviceList[i].status = '0'; // 置异常
                this.printDeviceList[i].statusTypeMessage = '异常';
                this.needDelectId.push(itemA.id);
              } else {
                // 直接删除
                this.printDeviceList.splice(matchInB, 1);
              }
            }
          }
        }

        // 遍历新数据列表，发现新数据放在最后面
        // eslint-disable-next-line no-restricted-syntax
        for (const itemB of data) {
          const matchInA = this.printDeviceList.findIndex(
              (itemA) => itemA.id === String(itemB.id)
          );

          if (matchInA === -1) {
            // 未找到匹配的项，添加到 A 列表的末尾
            this.printDeviceList.push(
                new PrintDeviceImpl(
                    itemB.id,
                    itemB.name,
                    itemB.description,
                    itemB.ip,
                    itemB.port,
                    itemB.status,
                    '未知',
                    0
                )
            );
          }
        }
      }
      // 启动每个小的遍历
      // eslint-disable-next-line no-plusplus
      for (let i = this.printDeviceList.length - 1; i >= 0; i--) {
        this.printDeviceList[i].startPolling();
      }
    },
    // 离开页面一定要销毁，不然内存泄露
    startPolling() {
      if (this.timer != null) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(
        async () => {
          await this.getDevicePollCode();
        },
        this.isSelecting ? 12 * 10000 : 5000
      );
    },
    cleanNeedDelete() {
      if (!this.isSelecting && this.needDelectId.length > 0) {
        // eslint-disable-next-line no-restricted-syntax
        for (const needId of this.needDelectId) {
          const matchInA = this.printDeviceList.findIndex(
            (itemA) => itemA.id === String(needId)
          );
          if (matchInA !== -1) {
            // 未找到匹配的项，添加到 A 列表的末尾
            this.printDeviceList.splice(matchInA, 1);
          }
        }
      }
    },
    setPrintDevice(id: string) {
      const matchInB = this.printDeviceList.findIndex(
        (itemB) => String(itemB.id) === String(id)
      );
      this.printDevice = this.printDeviceList[matchInB];
    },
    reset() {
      this.model = 1;
    },
  },
});

export default usePrintStore;
