<script setup lang="ts">
import {computed, watch} from 'vue';
  import useDownloadQuenuStore from '@/store/modules/chat/downloadQuenu';
  import { FileBody, MessageType, MsgType } from '@/types/chat';
  import { formatBytes, getFileSuffix } from '@/utils/chat';
  import { UploadTask } from '@/hooks/chat/useUploadN';
  import { useChatStore } from '@/store/modules/chat/chat';
  import { Message } from '@arco-design/web-vue';

  const { downloadObjMap, download, quenu, cancelDownload } =
    useDownloadQuenuStore();

  const props = defineProps<{
    body: FileBody;
    origin: MessageType | UploadTask;
  }>();

  //
  // watch(props.origin, () => {
  //   console.log('----子组件： watch -- props.origin：', props.origin)
  // })


  // 下载文件
  const downloadFile = () => {
    // 队列下载
    download(props.body.url);
  };

  const cancelDownloadFile = () => {
    cancelDownload(props.body.url);
  };

  // 目前使用url作为map的key 但是url可能会重复 后面可以考虑使用id 或者 url + id 的形式
  const isDownloading = computed(() => {
    return (
      (props.body?.url && downloadObjMap.get(props.body.url)?.isDownloading) ||
      false
    );
  });

watch(
  () => props.body,
  (newBody, oldBody) => {
    console.log("props.body 发生变化：", oldBody, "=>", newBody);
    // 根据 props.body 的变化做一些事情
  },
  { deep: true } // 如果 props.body 是嵌套对象且需要监听其中的值
);

const messageBody = computed(()=>{
  return props.body;
})

const messageOrigin = computed(()=>{
  return props.origin;
})
  const process = computed(() => {
    // eslint-disable-next-line no-unsafe-optional-chaining
    return ((messageBody.value?.url && downloadObjMap.get(messageBody.value.url)?.process / 100.0) || 0);
  });
  const isUploading = computed(() => {
    //@ts-ignore
    if (messageOrigin.value?.Mock) {
      console.log('上传中');
      return true;
    }
    return false;
  });
  const uploadErr = computed(() => {
    //@ts-ignore
    if (messageOrigin.value?.Mock) {
      //@ts-ignore
      if (messageOrigin.value?.state === 2) {
        return true;
      }
      return false;
    }
    return false;
  });
  const uploadProgress = computed(() => {
    //@ts-ignore
    return messageOrigin.value?.progress || 0;
  });

  // 是否排队中
  const isQuenu = computed(() => {
    if (!messageBody.value?.url) {
      return false;
    }
    return quenu.includes(messageBody.value.url);
  });

  const fileName = computed(()=>{
    return messageBody.value?.fileName || '未知文件';
  })
const fileSize = computed(()=>{
    return messageBody.value?.size || 0;
  })

  // 重试上传
  const retryUpload = () => {
    const chatStore = useChatStore();
    const message = chatStore.getMessage(messageOrigin.value.message.id);
    if (!message?.Mock) {
      Message.error('请删除该消息，已失效');
      return;
    }
    console.log(message)
    console.log(typeof message)
    message?.start();
  };
</script>

<template>
  <div class="file">
    <icon-file :icon="getFileSuffix(messageBody?.fileName)" :size="32" colorful />
    <div class="file-desc">
      <span class="file-name">{{ fileName }}</span>
      <span class="file-size">{{ formatBytes(fileSize) }}</span>
    </div>
    <div
      v-if="isQuenu"
      class="mx-1"
      size="small"
      type="warning"
      @click="cancelDownloadFile"
      >等待下载
      <icon-close-circle></icon-close-circle>
    </div>
    <icon-download
      v-else-if="!isDownloading && !isUploading"
      :size="22"
      @click="downloadFile"
    />
    <a-progress
      v-else-if="isDownloading"
      type="circle"
      :percent="process"
      :width="22"
      :stroke-width="1"
      :animation="true"
    />
    <a-popover v-else-if="uploadErr" title="错误原因">
      <IconExclamationCircle :size="22" @click="retryUpload" />
      <template #content>
        <p>{{ messageOrigin?.err }}</p>
      </template>
    </a-popover>

    <a-progress
      v-else-if="isUploading"
      type="circle"
      :percent="uploadProgress"
      :width="22"
      :stroke-width="1"
      :animation="true"
    />
  </div>
</template>
