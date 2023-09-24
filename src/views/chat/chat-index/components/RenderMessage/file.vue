<script setup lang="ts">
import {computed} from 'vue';
import useDownloadQuenuStore from '@/store/modules/chat/downloadQuenu';
import {FileBody} from '@/types/chat';
import {formatBytes, getFileSuffix} from '@/utils/chat';

const { downloadObjMap, download, quenu, cancelDownload } =
    useDownloadQuenuStore();

  const props = defineProps<{ body: FileBody }>();

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
    return downloadObjMap.get(props.body.url)?.isDownloading || false;
  });

  const process = computed(() => {
    return downloadObjMap.get(props.body.url)?.process || 0;
  });

  // 是否排队中
  const isQuenu = computed(() => {
    return quenu.includes(props.body.url);
  });
</script>

<template>
  <div class="file">
    <icon-download :icon="getFileSuffix(body?.fileName)" :size="32" colorful />
    <div class="file-desc">
      <span class="file-name">{{ body?.fileName || '未知文件' }}</span>
      <span class="file-size">{{ formatBytes(body?.size) }}</span>
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
      v-else-if="!isDownloading"
      :size="22"
      @click="downloadFile"
    />
    <a-progress
      v-else
      type="circle"
      :percent="process"
      :width="22"
      :stroke-width="1"
      :animation="true"
    />
  </div>
</template>
