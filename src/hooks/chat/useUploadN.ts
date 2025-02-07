// hooks/useUpload.ts

import { computed, Reactive, reactive, ref } from 'vue';
import { getUploadUrl, sendMsg } from '@/api/chat';
import { Message } from '@arco-design/web-vue';
import { ChatMsgEnum } from '@/types/enums/chat';
import { generateBody } from '@/utils/chat';
import { useChatStore } from '@/store/modules/chat/chat';
import { useGlobalStore } from '@/store/modules/chat/global';
import { MockMessageInterface, MsgType, MsgUserType } from '@/types/chat';
import { useUserStore } from '@/store';
import { timesTamp } from '@/utils/utils';

/**
 * 优化计划
 * 视频获取第一帧和音频获取秒这个都作为ext信息传入，mock下的用class记录，不兼容正式json
 * 然后传给worker的包含全部的信息，worker完成上传，此时拿到了各种downloadurl，但此时还未正式发送消息
 *
 * 发送消息这步是统一的，麻烦在这里，mock的消息什么时机触发发送，怎么触发，异步worker任务通过任务回调，文本消息直接调用
 * 还需要个class-mock消息对象（直接放入map。当发送成功替换成send接口的消息），还需要解决前端页面不自动更新的问题（小问题）
 */

/** 文件信息类型 */
export type FileInfoType = {
  name: string;
  type: string;
  size: number;
  suffix: string;
  width?: number;
  height?: number;
  downloadUrl?: string;
  second?: number;
  thumbWidth?: number;
  thumbFile?: File;
  thumbHeight?: number;
  thumbUrl?: string;
  tempUrl?: string; // 临时
};

export type FileWorkerBody = {
  file: File;
  uploadUrl: string;
};

export type VedioWorkerBody = {
  file: File;
  uploadUrl: string;
  thumbFile: File; // 缩略图
  thumbUploadUrl: string;
};

export type WorkerType = {
  taskType: 'FILE' | 'VIOCE' | 'VEDIO' | 'IMAGE';
  msgId: string;
  taskBody: FileWorkerBody | VedioWorkerBody;
};

const Max = 5000; // 单位M
const MAX_FILE_SIZE = Max * 1024 * 1024; // 最大上传限制
// 获取本地存储的用户信息
const globalStore = useGlobalStore();
const userStore = useUserStore();
const chatStore = useChatStore();
const whiteMessageType = [ChatMsgEnum.TEXT, ChatMsgEnum.EMOJI];
// 获取本地存储的用户信息
const currentRoomId = computed(() => globalStore.currentSession.roomId);

/** 上传任务类 */
export class UploadTask implements MockMessageInterface {
  Mock = true; // 此状态用来做兼容处理，只对mock下的接入新特性

  FileI?: File;

  worker = null;

  extInfo = reactive<{
    state: number;
    progress: number;
    err: string;
  }>({
    state: 0,
    progress: 0,
    err: '',
  });

  fromUser?: MsgUserType;

  message?: Reactive<MsgType>; // 不是响应式，怎么动态更新

  sendTime = String(Date.now());

  timeBlock = '';

  loading = false;

  fileInfo = reactive<FileInfoType | null>(null);

  // eslint-disable-next-line no-useless-constructor
  constructor(
    public type: ChatMsgEnum,
    public body: any,
    // public msgId: string,
    public file: File // public url: string
  ) {
    const currentTimeStamp: number = Date.now();
    const random: number = Math.floor(Math.random() * 15);
    // 唯一id 后五位时间戳+随机数
    const uniqueId = String(currentTimeStamp).slice(-7) + random;
    const { id, name, avatar } = userStore;
    this.fromUser = {
      avatar: avatar,
      locPlace: '',
      uid: id,
      username: name,
    };
    this.message = reactive({
      body: body,
      id: uniqueId,
      messageMark: {
        likeCount: 0,
        userLike: 0,
        dislikeCount: 0,
        userDislike: 0,
      },
      roomId: currentRoomId.value,
      sendTime: timesTamp(currentTimeStamp),
      type: type,
    });
    if (whiteMessageType.includes(type)) {
      // 无需上传文件
      this.extInfo.state = 3;
      return;
    }
    this.extInfo.state = 1; // 默认认为走这个需要上传文件
    this.worker = new Worker(
      new URL('../../worker/chatUploadWorker.ts', import.meta.url)
    );
    // 消息发送处理,只有文件上传类型才走这个
    this.worker.onmessage = async (e) => {
      console.log(e.data);
      switch (e.data.type) {
        case 'UploadProgress':
          this.extInfo.state = 1;
          this.extInfo.progress = e.data.progress;
          break;
        case 'Success':
          // 发送消息，等待回收掉该mock
          // eslint-disable-next-line no-case-declarations

          try {
            await this.putMsg();
          } catch (e) {
            console.log(e);
            this.extInfo.state = 4;
          }
          break;
        case 'Error':
          this.extInfo.state = 2;
          this.extInfo.err = e.data.msg;
          break;
        default:
          console.log('异常的任务');
          this.extInfo.state = 2;
          this.extInfo.err = e.data.msg;
          break;
      }
    };
    this.FileI = file;
  }

  private async putMsg() {
    try {
      this.extInfo.state = 3;
      this.extInfo.err = '';
      const req = await sendMsg({
        roomId: globalStore.currentSession.roomId,
        msgType: this.message.type,
        body: this.message.body,
      });
      // @ts-ignore
      if (req.code !== 1) {
        this.extInfo.state = 4;
        // @ts-ignore
        this.extInfo.err = req.msg;
        return;
      }
      await chatStore.updateMsg(this.message.id, req.data);
    } catch (e) {
      console.log(e);
      this.extInfo.state = 4;
      this.extInfo.err = e;
    }
  }

  async start() {
    // 当放入map后手动触发 Text or EMOJI
    if (
      this.extInfo.state > 2 ||
      whiteMessageType.includes(this.message.type)
    ) {
      try {
        await this.putMsg();
      } catch (e) {
        console.error(`消息发送失败${e}`);
        this.extInfo.state = 4; // 可重试
      }
      return;
    }
    const info = await this.parseFile(this.FileI);
    // eslint-disable-next-line no-case-declarations
    if (info.size > MAX_FILE_SIZE) {
      Message.warning(`文件不得大于 ${Max} MB`);
      this.extInfo.state = 2;
      this.extInfo.err = `文件不得大于 ${Max} MB`;
      return;
    }
    this.extInfo.state = 1;
    // 默认当存在上传的类型
    switch (this.message.type) {
      case ChatMsgEnum.FILE:
      case ChatMsgEnum.IMAGE:
      case ChatMsgEnum.VOICE:
        // eslint-disable-next-line no-case-declarations
        let UploadUrl = '';
        try {
          // eslint-disable-next-line no-case-declarations
          const { data } = await getUploadUrl({
            fileName: info.name,
            scene: '1',
          });
          if (!data.uploadUrl || !data.downloadUrl) {
            this.extInfo.state = 2;
            this.extInfo.err = `无法获取上传url`;
            return;
          }
          UploadUrl = data.uploadUrl;
          this.fileInfo = { ...info, downloadUrl: data.downloadUrl };
        } catch (e) {
          this.extInfo.state = 2;
          this.extInfo.err = `无法获取上传url`;
        }

        this.worker.postMessage({
          taskType: 'FILE',
          msgId: String(this.message.id),
          taskBody: {
            uploadUrl: UploadUrl,
            file: this.FileI,
          },
        });

        break;
      case ChatMsgEnum.VIDEO:
        // eslint-disable-next-line no-case-declarations
        let UploadUrl1 = '';
        // eslint-disable-next-line no-case-declarations
        let UploadThumbFileUrl1 = '';
        try {
          // eslint-disable-next-line no-case-declarations
          const { data } = await getUploadUrl({
            fileName: info.name,
            scene: '1',
          });
          if (!data.uploadUrl || !data.downloadUrl) {
            this.extInfo.state = 2;
            this.extInfo.err = `无法获取上传url`;
            return;
          }
          UploadUrl1 = data.uploadUrl;
          this.fileInfo = { ...info, downloadUrl: data.downloadUrl };
        } catch (e) {
          this.extInfo.state = 2;
          this.extInfo.err = `无法获取上传url`;
        }

        try {
          // eslint-disable-next-line no-case-declarations
          const { data } = await getUploadUrl({
            // @ts-ignore
            fileName: info?.thumbFile,
            scene: '1',
          });
          if (!data.uploadUrl || !data.downloadUrl) {
            this.extInfo.state = 2;
            this.extInfo.err = `无法获取上传url`;
            return;
          }
          UploadThumbFileUrl1 = data.uploadUrl;
          this.fileInfo = { ...info, thumbUrl: data.downloadUrl };
        } catch (e) {
          this.extInfo.state = 2;
          this.extInfo.err = `无法获取上传url`;
        }
        this.worker.postMessage({
          taskType: 'VEDIO',
          msgId: String(this.message.id),
          taskBody: {
            uploadUrl: UploadUrl1,
            file: this.FileI,
            thumbFile: this.fileInfo.thumbFile,
            thumbUploadUrl: UploadThumbFileUrl1,
          },
        });
        break;
      default:
        console.log('不支持的类型');
        return;
    }
    const { type, body } = generateBody(this.fileInfo, this.type, true);

    this.message.body = body;
  }

  // eslint-disable-next-line class-methods-use-this
  getImgWH(file: File) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const tempUrl = URL.createObjectURL(file);
      img.src = tempUrl;
      img.onload = function () {
        resolve({ width: img.width, height: img.height, tempUrl });
      };
      img.onerror = function () {
        URL.revokeObjectURL(tempUrl);
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({ width: 0, height: 0, url: null });
      };
    });
  }

  // eslint-disable-next-line class-methods-use-this
  getAudioDuration(file: File) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const tempUrl = URL.createObjectURL(file);
      audio.src = tempUrl;
      const countAudioTime = async () => {
        while (isNaN(audio.duration) || audio.duration === Infinity) {
          // eslint-disable-next-line no-await-in-loop,no-promise-executor-return
          await new Promise((resolve) => setTimeout(resolve, 100));
          audio.currentTime = 100000 * Math.random();
        }
        const second = Math.round(audio.duration || 0);
        resolve({ second, tempUrl });
      };
      countAudioTime();
      audio.onerror = function () {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({ second: 0, tempUrl });
      };
    });
  }

  // eslint-disable-next-line class-methods-use-this
  getVideoCover(file: File) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const tempUrl = URL.createObjectURL(file);
      video.src = tempUrl;
      video.crossOrigin = 'anonymous';
      video.currentTime = 2;
      video.oncanplay = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas
          .getContext('2d')
          ?.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const name = `${Date.now()}thumb.jpg`;
          const thumbFile = new File([blob], name, { type: 'image/jpeg' });
          resolve({
            thumbWidth: canvas.width,
            thumbHeight: canvas.height,
            thumbUrl: '',
            thumbFile: thumbFile,
            thumbSize: thumbFile.size,
            tempUrl,
          });
        });
      };
      video.onerror = function () {
        URL.revokeObjectURL(tempUrl);
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({ width: 0, height: 0, url: null });
      };
    });
  }

  async parseFile(file: File) {
    const { name, size, type } = file;
    const suffix = name.split('.').pop()?.trim().toLowerCase() || '';
    const baseInfo = { name, size, type, suffix };

    if (type.includes('image')) {
      const { width, height, tempUrl } = (await this.getImgWH(file)) as any;
      return { ...baseInfo, width, height, tempUrl };
    }

    if (type.includes('audio')) {
      const { second, tempUrl } = (await this.getAudioDuration(file)) as any;
      return { second, tempUrl, ...baseInfo };
    }

    if (type.includes('video')) {
      this.message.type = ChatMsgEnum.VIDEO;
      const {
        thumbWidth,
        thumbHeight,
        tempUrl,
        thumbFile,
        thumbUrl,
        thumbSize,
      } = (await this.getVideoCover(file)) as any;
      return {
        ...baseInfo,
        thumbWidth,
        thumbHeight,
        tempUrl,
        thumbUrl,
        thumbFile,
        thumbSize,
      };
    }

    return baseInfo;
  }
}
