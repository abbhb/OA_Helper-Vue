import { fileItemType } from '@/types/printFille';
import {
  fileConfigurationPolling,
  printFile,
  thumbnailPolling,
} from '@/api/printer';
import { Message } from '@arco-design/web-vue';

export class PrintFileImpl implements fileItemType {
  copies_num: number;

  /**
   * 0为单面
   * 1为双面
   */
  duplex: number;

  file_name: string;

  imageUrl: string;

  max_num: number;

  page_end: number;

  page_start: number;

  percent: number;

  position: number; // 方向0 为垂直 1为水平

  state: number;

  uuid: string;

  configTimer: any;

  imageTimer: any;

  isConfigPolling: boolean;

  isImagePolling: boolean;

  canGetImage: boolean;

  constructor() {
    this.state = 0;
    this.configTimer = null;
    this.imageTimer = null;
    this.isConfigPolling = false;
    this.isImagePolling = false;
    this.canGetImage = false;
    this.duplex = 1;
    this.percent = 0;
  }

  addFile(fileName) {
    this.file_name = fileName;
    this.state = 1;
  }

  // 离开前需要调用每个对象的停止轮询
  stopFileConfigPolling() {
    if (this.configTimer != null && this.isConfigPolling === true) {
      clearInterval(this.configTimer);
      this.configTimer = null;
      this.isConfigPolling = false;
    }
  }

  stopImagePolling() {
    if (this.imageTimer != null && this.isImagePolling === true) {
      clearInterval(this.imageTimer);
      this.imageTimer = null;
      this.isImagePolling = false;
    }
  }

  endThisClass() {
    this.stopImagePolling();
    this.stopFileConfigPolling();
    this.state = 0;
    this.duplex = 1;
    this.page_start = 1;
    this.page_end = 1;
    this.imageUrl = '';
    this.configTimer = null;
    this.imageTimer = null;
    this.canGetImage = false;
    this.uuid = '';
    this.file_name = '';
  }

  private startFileConfigPolling() {
    if (this.configTimer == null && this.isConfigPolling === false) {
      this.isConfigPolling = true;

      // 开始轮询
      this.configTimer = setInterval(async () => {
        const { data } = await fileConfigurationPolling({ id: this.uuid });
        if (data.type === 2) {
          // 失败了
          Message.error(data.message || '该任务转换失败了');
          this.state = -1;
          this.stopFileConfigPolling();
        } else if (data.type === 1) {
          // 成功获取到了
          this.page_start = data.data.firstPage;
          this.page_end = data.data.lastPage;
          this.max_num = data.data.lastPage;
          this.copies_num = 1;
          this.position = 0;
          this.duplex = 1;
          this.state = 3;
          // 停止轮询
          this.stopFileConfigPolling();
          // 只有状态成功了才可能有图
          this.startImagePolling();
        } else {
          // 继续轮询
        }
      }, 3000);
    }
  }

  private startImagePolling() {
    if (this.imageTimer == null && this.isImagePolling === false) {
      this.isImagePolling = true;
      this.imageTimer = setInterval(async () => {
        const { data } = await thumbnailPolling({ id: this.uuid });
        if (data.type === 2) {
          // 失败了
          Message.error(data.message || '该任务转换失败了');
          this.stopImagePolling();
        } else if (data.type === 1) {
          // 成功获取到了
          this.imageUrl = data.data.imgUrl;
          this.canGetImage = true;
          // 停止轮询
          this.stopImagePolling();
        } else {
          // 继续轮询
        }
      }, 3000);
    }
  }

  // 只有上传成功了才有上面的事
  public uploadSuccess(uuid: string) {
    if (this.state <= 2) {
      this.state = 2;
    }
    this.uuid = uuid;
    // 开始轮询状态
    this.startFileConfigPolling();
  }

  public async submitPrint(
    deviceId: string,
    callback?: (file_name: string) => void,
    messageTip = true
  ) {
    // 提交当前对象的打印任务
    if (this.state < 3) {
      Message.error('还不能打印呢');
      return; // 不够资格
    }
    try {
      const { data } = await printFile({
        endNum: this.page_end,
        startNum: this.page_start,
        id: this.uuid,
        copies: this.copies_num,
        isDuplex: this.duplex,
        landscape: this.position,
        deviceId,
      });
      if (messageTip) {
        Message.success(data);
      }
    } catch (e) {
      if (typeof callback === 'function') {
        callback(this.file_name);
      } else {
        Message.error(e);
      }
    } finally {
      // 停止轮询，此时对象也该销毁了
      this.endThisClass();
    }
  }
  // 开始打印和打印成功干脆也用对象管理？多文件就直接循环提交就行,提交成功了也不用管了，直接清除得了，成功后依赖打印机的任务列表
}
export default { PrintFileImpl };
