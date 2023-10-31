import {PrintDevice, PrintJob} from '@/store/modules/print/types';
import axios from 'axios';

export class PrintDeviceImpl implements PrintDevice {
  description: string;

  id: string;

  ip: string;

  listNums: number;

  name: string;

  port: number;

  status: number;

  statusTypeMessage: string;

  pollingTimer: any;

  timerStatus: boolean; // false 关闭轮询，无定时器 true，。有定时器

  pollingInterval: number; // 轮询间隔，单位：毫秒

  printJobs: PrintJob[];

  constructor(
    id,
    name,
    description,
    ip,
    port,
    status,
    statusTypeMessage,
    listNums
  ) {
    this.ip = ip;
    this.id = id;
    this.name = name;
    this.port = port;
    this.status = status;
    this.description = description;
    this.listNums = listNums;
    this.statusTypeMessage = statusTypeMessage;
    this.pollingInterval = 5000; // 5s一次
    this.pollingTimer = null;
    this.printJobs = [];
  }

  async updateDeviceData() {
    const resB = await axios.get(
      `http://${this.ip}:${this.port}/api/printDevice/status`
    );
    if (resB.data.printJobs !== undefined) {
      this.printJobs = resB.data.printJobs;
    }
    if (String(resB.data.statusType) !== '0') {
      this.status = resB.data.statusType;
      this.statusTypeMessage = resB.data.statusTypeMessage;
      this.listNums = resB.data.listNums;
      // 此处不为0就正常
    } else {
      this.status = resB.data.statusType;
      this.statusTypeMessage = resB.data.statusTypeMessage;
    }
  }

  startPolling() {

    if (this.timerStatus && this.pollingTimer) {
      return; // 已经有了
    }
    this.timerStatus = true;
    this.pollingTimer = setInterval(() => {
      // 调用更新数据的方法
      this.updateDeviceData();
    }, this.pollingInterval);
  }

  stopPolling() {
    if (!this.timerStatus && this.pollingTimer == null) {
      return; // 已经停了
    }
    clearInterval(this.pollingTimer);
    this.timerStatus = false;
  }
}

export default { PrintDeviceImpl };
