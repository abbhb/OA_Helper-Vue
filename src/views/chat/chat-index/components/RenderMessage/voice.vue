<script setup lang="ts">
  import { computed } from 'vue';
  import { MessageType, VoiceBody } from '@/types/chat';
  import { useVoicePreviewStore } from '@/store/modules/chat/preview';
  import { UploadTask } from '@/hooks/chat/useUploadN';

  const props = defineProps<{
    body: VoiceBody;
    origin: MessageType & UploadTask;
  }>();
  const voiceStore = useVoicePreviewStore();

  const playUrl = computed(() => {
    return props.origin?.Mock
      ? props.origin?.fileInfo?.tempUrl
      : props.body.url;
  });
  // 判断当前这个消息组件是否正在播放
  const isPlay = computed(
    () => voiceStore.previewUrl === playUrl.value && voiceStore.isPlaying
  );
</script>

<template>
  <div class="voice" @click="voiceStore.open(playUrl)">
    <div class="saying">
      <span :class="['shelter', { play: isPlay }]" />
      <icon-voice icon="saying" :size="18" />
    </div>
    <span class="num">{{ body?.second }}"</span>
  </div>
</template>
