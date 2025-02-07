import { WorkerType } from '@/hooks/chat/useUploadN';

let progress = 0;
// eslint-disable-next-line no-restricted-globals
addEventListener('message', (e: MessageEvent<WorkerType>) => {
  const { data } = e;
  console.log(data);
  if (!data.msgId || data.msgId === '') {
    console.error('异常的worker');
    postMessage({
      type: 'Error', // 直接返回该异常直接关掉Worker，上传失败状态
      msg: '请携带msgId',
    });
    postMessage({
      type: 'UploadState',
      state: 2, // 上传失败
      msgId: data.msgId, // 必须带上msgId
    });
  }

  switch (data.taskType) {
    case 'FILE':
      // eslint-disable-next-line no-case-declarations
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', data.taskBody.uploadUrl, true);
      xhr.setRequestHeader('Content-Type', data.taskBody.file.type);
      xhr.upload.onprogress = (e) => {
        progress = Math.round((e.loaded / e.total) * 100);
        postMessage({
          type: 'UploadProgress', // 更新状态
          progress: progress,
          msgId: data.msgId,
        });
      };
      xhr.onload = () => {
        if (xhr.status === 200) {
          postMessage({
            type: 'Success', // 多个上传时取并，当出现一个失败，都算失败.
            msgId: data.msgId,
          });
        } else {
          postMessage({
            type: 'Error', // 直接返回该异常直接关掉Worker，上传失败状态
            msg: `Upload failed with status: ${xhr.status}`,
          });
        }
      };
      xhr.onerror = () => {
        postMessage({
          type: 'Error', // 直接返回该异常直接关掉Worker，上传失败状态
          msg: `Upload encountered an error`,
        });
      };
      xhr.send(data.taskBody.file);
      break;
    case 'VEDIO':
      // eslint-disable-next-line no-case-declarations
      const xhr3 = new XMLHttpRequest();
      // @ts-ignore
      xhr3.open('PUT', data.taskBody?.thumbUploadUrl, true);
      // @ts-ignore
      xhr3.setRequestHeader('Content-Type', data.taskBody?.thumbFile.type);
      xhr3.onload = () => {
        if (xhr3.status === 200) {
          postMessage({
            type: 'Success', // 多个上传时取并，当出现一个失败，都算失败.
            msgId: data.msgId,
          });
        } else {
          postMessage({
            type: 'Error', // 直接返回该异常直接关掉Worker，上传失败状态
            msg: `Upload failed with status: ${xhr3.status}`,
          });
        }
      };
      xhr3.onerror = () => {
        postMessage({
          type: 'Error', // 直接返回该异常直接关掉Worker，上传失败状态
          msg: `Upload encountered an error`,
        });
      };
      // @ts-ignore
      xhr3.send(data.taskBody?.thumbFile);
      console.log('VEDIO thumbFile Send，file start sending。');
      // eslint-disable-next-line no-case-declarations
      const xhr2 = new XMLHttpRequest();
      xhr2.open('PUT', data.taskBody.uploadUrl, true);
      xhr2.setRequestHeader('Content-Type', data.taskBody.file.type);
      xhr2.upload.onprogress = (e) => {
        progress = Math.round((e.loaded / e.total) * 100);
        postMessage({
          type: 'UploadProgress', // 更新状态
          progress: progress,
          msgId: data.msgId,
        });
      };
      xhr2.onload = () => {
        if (xhr2.status === 200) {
          postMessage({
            type: 'Success', // 多个上传时取并，当出现一个失败，都算失败.
            msgId: data.msgId,
          });
        } else {
          postMessage({
            type: 'Error', // 直接返回该异常直接关掉Worker，上传失败状态
            msg: `Upload failed with status: ${xhr2.status}`,
          });
        }
      };
      xhr2.onerror = () => {
        postMessage({
          type: 'Error', // 直接返回该异常直接关掉Worker，上传失败状态
          msg: `Upload encountered an error`,
        });
      };
      xhr2.send(data.taskBody.file);
      break;
    default:
      postMessage({
        type: 'Error', // 直接返回该异常直接关掉Worker，上传失败状态
        msg: '请携带任务类型',
      });
      break;
  }
});
