// hooks/useUpload.ts

import { ref } from 'vue';
import { createEventHook } from '@vueuse/core';
import { getUploadUrl, sendMsg } from '@/api/chat';
import { Message,Notification } from '@arco-design/web-vue';
import { ChatMsgEnum } from '@/types/enums/chat';
import { generateBody } from '@/utils/chat';
import { useMockMessage } from '@/hooks/chat/useMockMessage';
import { useChatStore } from '@/store/modules/chat/chat';
import { useGlobalStore } from '@/store/modules/chat/global';


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
  thumbHeight?: number;
  thumbUrl?: string;
};

const Max = 5000; // 单位M
const MAX_FILE_SIZE = Max * 1024 * 1024; // 最大上传限制

/** 上传任务类 */
class UploadTask {
  // eslint-disable-next-line no-useless-constructor
  constructor(public msgId: string, public file: File, public url: string) {}

  status = ref('Initialized');

  progress = ref(0);

  async upload(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.status.value = 'Uploading';
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', this.url, true);
      xhr.setRequestHeader('Content-Type', this.file.type);
      xhr.upload.onprogress = (e) => {
        this.progress.value = Math.round((e.loaded / e.total) * 100);
      };
      xhr.onload = () => {
        if (xhr.status === 200) {
          this.status.value = 'Completed';
          resolve();
        } else {
          this.status.value = 'Failed';
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      };
      xhr.onerror = () => {
        this.status.value = 'Error';
        reject(new Error('Upload encountered an error'));
      };
      xhr.send(this.file);
    });
  }
}

/** 上传管理器类 */
class UploadManager {
  private tasks: Record<string, UploadTask> = {};

  addTask(msgId: string, file: File, url: string) {
    const task = new UploadTask(msgId, file, url);
    this.tasks[msgId] = task;
    return task.upload();
  }

  getStatus(msgId: string) {
    const task = this.tasks[msgId];
    if (task) {
      return { status: task.status.value, progress: task.progress.value };
    } else {
      return { status: 'No such task', progress: 0 };
    }
  }

  getTask(msgId: string) {
    const task = this.tasks[msgId];
    if (task) {
      return task;
    } else {
      return null;
    }
  }
}

/** 文件上传Hooks */
export const useUpload = () => {
  const isUploading = ref(false);
  const progress = ref(0);
  const fileInfo = ref<FileInfoType | null>(null);
  const { on: onChange, trigger } = createEventHook();
  const onStart = createEventHook();
  const manager = new UploadManager();
  const nowMsgType = ref<ChatMsgEnum>(ChatMsgEnum.FILE);
  const globalStore = useGlobalStore();

  const upload = async (url: string, file: File) => {
    isUploading.value = true;
    const task = new UploadTask(Date.now().toString(), file, url);
    await task.upload();
    progress.value = task.progress.value;
    isUploading.value = false;
    if (task.status.value === 'Completed') {
      trigger('success');
    } else {
      trigger('fail');
    }
  };

  const getVideoCover = (file: File) => {
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
          const { data } = await getUploadUrl({ fileName: name, scene: '1' });
          if (data.uploadUrl && data.downloadUrl) {
            manager
              .addTask(Date.now().toString(), thumbFile, data.uploadUrl)
              .then(() => {
                resolve({
                  thumbWidth: canvas.width,
                  thumbHeight: canvas.height,
                  thumbUrl: data.downloadUrl,
                  thumbSize: thumbFile.size,
                  tempUrl,
                });
              })
              .catch(reject);
          }
        });
      };
      video.onerror = function () {
        URL.revokeObjectURL(tempUrl);
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({ width: 0, height: 0, url: null });
      };
    });
  };

  const getImgWH = (file: File) => {
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
  };

  const getAudioDuration = (file: File) => {
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
  };

  const parseFile = async (file: File, addParams: Record<string, any> = {}) => {
    const { name, size, type } = file;
    const suffix = name.split('.').pop()?.trim().toLowerCase() || '';
    const baseInfo = { name, size, type, suffix, ...addParams };

    if (type.includes('image')) {
      const { width, height, tempUrl } = (await getImgWH(file)) as any;
      return { ...baseInfo, width, height, tempUrl };
    }

    if (type.includes('audio')) {
      const { second, tempUrl } = (await getAudioDuration(file)) as any;
      return { second, tempUrl, ...baseInfo };
    }

    if (type.includes('video')) {
      const { thumbWidth, thumbHeight, tempUrl, thumbUrl, thumbSize } =
        (await getVideoCover(file)) as any;
      return {
        ...baseInfo,
        thumbWidth,
        thumbHeight,
        tempUrl,
        thumbUrl,
        thumbSize,
      };
    }

    return baseInfo;
  };

  const uploadFile = async (file: File, addParams?: Record<string, any>) => {
    if (isUploading.value || !file) return;
    const info = await parseFile(file, addParams);
    const { mockMessage } = useMockMessage();
    const chatStore = useChatStore();

    if (info.size > MAX_FILE_SIZE) {
      Message.warning(`文件不得大于 ${Max} MB`);
      return;
    }

    const { data } = await getUploadUrl({
      fileName: info.name,
      scene: '1',
    });

    if (data.uploadUrl && data.downloadUrl) {
      fileInfo.value = { ...info, downloadUrl: data.downloadUrl };
      onStart.trigger(fileInfo);
      isUploading.value = true;
      let tempMessageId = '';
      const { type, body } = generateBody(
        fileInfo.value,
        nowMsgType.value,
        true
      );
      const res = mockMessage(type, body);
      tempMessageId = res.message.id; // 记录下上传状态下的消息id
      if (!fileInfo.value) return;
      // 如果文件是视频就把消息类型改为视频
      if (fileInfo.value.type.includes('video')) {
        nowMsgType.value = ChatMsgEnum.VIDEO;
      }
      chatStore.pushMsg(res); // 消息列表新增一条消息
      chatStore.chatListToBottomAction?.(); // 滚动到消息列表底部
      manager
        .addTask(tempMessageId, file, data.uploadUrl)
        .then(() => {

          if (!fileInfo.value) return;
          const { body, type } = generateBody(fileInfo.value, nowMsgType.value);
          sendMsg({
            roomId: globalStore.currentSession.roomId,
            msgType: nowMsgType.value,
            body,
          })
            .then((req) => {
              if (req.data.message.type === ChatMsgEnum.TEXT) {
                // chatStore.pushMsg(data); // 消息列表新增一条消息,发送消息没必要再push了，收到ws的消息就能push
                // 暂时文本消息不发送mock消息，失败了就是没有!无需重试
              } else if (
                req.data.message.type === ChatMsgEnum.VOICE ||
                req.data.message.type === ChatMsgEnum.FILE
              ) {
                // 更新上传状态下的消息
                chatStore.updateMsgMock(tempMessageId, req.data, false);
              }
            })
            .catch((e) => {
              Notification.error(e)

              console.log(e);
            });

          trigger('success');
        })
        .catch(() => trigger('fail'))
        // eslint-disable-next-line no-return-assign
        .finally(() => (isUploading.value = false));
    } else {
      trigger('fail');
      Message.error('获取上传链接失败');
    }
  };

  return {
    uploadFile,
    isUploading,
    getTask: manager.getTask.bind(manager),
    getStatus: manager.getStatus.bind(manager),
  };
};
