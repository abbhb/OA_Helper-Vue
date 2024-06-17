<script setup lang="ts">
  import { computed } from 'vue';
  import { TextBody } from '@/types/chat';
  import { MdPreview } from 'md-editor-v3';
  import 'md-editor-v3/lib/style.css';

  const props = defineProps<{ body: TextBody }>();

  // 获取所有匹配的字符串
  const urlMap = props.body.urlContentMap || {};
  const keys = Object.keys(urlMap);
  // 使用匹配字符串创建动态正则表达式，并将文本拆分为片段数组
  const fragments = computed(() => {
    const content = props.body.content || '';
    return content;
  });

  // 打开链接
  const openUrl = (url: string) => {
    if (!url) return;
    // 当没有协议时，自动添加协议
    window.open(url.startsWith('http') ? url : `//${url}`, '_blank');
  };
</script>

<template>
  <div class="text">
    <MdPreview :key="fragments" :model-value="fragments"> </MdPreview>
    <div
      v-if="keys.includes(fragments)"
      :key="fragments"
      rel="noopener noreferrer nofollow"
      target="_blank"
      class="text-card"
      @click="openUrl(fragments.trim())"
    >
      <div
        v-if="urlMap[fragments].image"
        class="text-card-image"
        :style="{ backgroundImage: `url(${urlMap[fragments].image})` }"
      />
      <div class="text-card-link-content">
        <span class="text-card-link ellipsis-1"> {{ fragments.trim() }}</span>
        <span class="text-card-title ellipsis-2">
          {{ urlMap[fragments].title }}</span
        >
        <span class="text-card-desc ellipsis-1">{{
          urlMap[fragments].description
        }}</span>
      </div>
    </div>
  </div>
</template>

