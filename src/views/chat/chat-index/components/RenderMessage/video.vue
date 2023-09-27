<script setup lang="ts">
import {VideoBody} from '@/types/chat';
import {useVideoPreviewStore} from '@/store/modules/chat/preview';
import {formatImage} from '@/utils/chat';

const props = defineProps<{ body: VideoBody }>();

  const videoStore = useVideoPreviewStore();

  const getImageHeight = () => {
    const width = props.body.thumbWidth || 0;
    const height = props.body.thumbHeight || 0;
    return formatImage(width, height);
  };
</script>

<template>
  <div
    class="video"
    :style="`height:${getImageHeight()}px`"
    @click="videoStore.open(body?.url)"
  >
    <icon-file-video icon="bofang" :size="30" />
    <img :src="body.thumbUrl" />
  </div>
</template>
