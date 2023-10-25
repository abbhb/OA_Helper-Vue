import { fileItemType } from '@/types/printFille';
import { fileConfigurationPolling } from '@/api/printer';
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

  constructor(fileName) {
    this.file_name = fileName;
    this.state = 1;
    this.configTimer = null;
    this.imageTimer = null;
    this.isConfigPolling = false;
    this.isImagePolling = false;
  }

  // 离开前需要调用每个对象的停止轮询
  stopFileConfigPolling() {
    if (this.configTimer != null && this.isConfigPolling === true) {
      clearInterval(this.configTimer);
    }
  }

  startFileConfigPolling() {
    if (this.configTimer == null && this.isConfigPolling === false) {
      // 开始轮询
      this.configTimer = setInterval(async () => {
        const { data } = await fileConfigurationPolling({ id: this.uuid });
        if (data.type === 2) {
          // 失败了
          Message.error(data.message || '该任务转换失败了');
          this.stopFileConfigPolling();
        } else if (data.type === 1) {
          // 成功获取到了
          this.page_start = data.data.firstPage;
          this.page_end = data.data.lastPage;
          this.max_num = data.data.lastPage;
          // 停止轮询
          this.stopFileConfigPolling();
        } else {
          // 继续轮询
        }
      }, 3000);
    }
  }

  uploadSuccess(uuid: string) {
    if (this.state <= 2) {
      this.state = 2;
    }
    this.uuid = uuid;
    // 开始轮询状态与缩略图
  }
}
export default { PrintFileImpl };
