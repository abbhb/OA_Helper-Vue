<script setup lang="ts">
import {computed, ref} from 'vue';
import {ImageBody} from '@/types/chat';
import {useImgPreviewStore} from '@/store/modules/chat/preview';
import {formatImage} from '@/utils/chat';

const props = defineProps<{ body: ImageBody }>();

  const imageStore = useImgPreviewStore();
  const hasLoadError = ref(false);
  const isLoading = ref(true);

  /**
   * 核心就是的到高度，产生明确占位防止图片加载时页面抖动
   * @param width 宽度
   * @param height 高度
   */
  const getImageHeight = computed(() => {
    const { width, height } = props.body;
    return formatImage(width, height);
  });

  // 没有图片的情况下计算出按比例的宽度
  const getWidthStyle = () => {
    const { width, height } = props.body;
    return `width: ${(getImageHeight.value / height) * width}px`;
  };

  const handleError = () => {
    isLoading.value = false;
    hasLoadError.value = true;
  };
</script>

<template>
  <div
    class="image"
    :style="{ height: getImageHeight + 'px' }"
    @click="imageStore.show(body?.url)"
  >
    <div v-if="hasLoadError" class="image-slot" :style="getWidthStyle()">
      <icon-poweroff icon="dazed" :size="36" colorful />
      加载失败
    </div>
    <template v-else>
      <a-image
        v-if="body?.url"
        :height="getImageHeight"
        :src="body?.url"
        :zoom-rate="1.1"
        @click="imageStore.show(body?.url)"
        @error="handleError"
      />
    </template>
  </div>
</template>
