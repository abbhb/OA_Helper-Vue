<script setup lang="ts">
import {useImgPreviewStore, useVideoPreviewStore,} from '@/store/modules/chat/preview';
import {onUnmounted, watch} from 'vue';
import SideBar from './components/SideBar/index.vue';
import ToolBar from './components/ToolBar/index.vue';
import ChatBox from './components/ChatBox/index.vue';
import VideoPlayer from './components/VideoPlayer/index.vue';

const imageStore = useImgPreviewStore();
  const videoStore = useVideoPreviewStore();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      videoStore.close();
    }
  };

  watch(
    () => videoStore.isPlaying,
    (newValue) => {
      if (newValue) {
        window.addEventListener('keydown', handleKeyDown);
      } else {
        window.removeEventListener('keydown', handleKeyDown);
      }
    }
  );

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });
</script>

<template>
  <main class="home chat">
    <div class="wrapper">
      <ToolBar />
      <SideBar />
      <ChatBox />
    </div>

    <div
      v-if="videoStore.isPlaying"
      class="video-play"
      style="pointer-events: none"
    >
      <icon-close
        class="close"

        :size="136"
        @click="videoStore.close()"
      />


      <VideoPlayer :url="videoStore.previewUrl" style="pointer-events: auto" />
    </div>
  </main>
</template>

<style lang="less" scoped>
  .home {
    position: relative;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 2vh 0;

    .video-play {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: #fff;
      text-align: right;

      .close {
        position: absolute;
        top: 100px;
        left: 250px;
        padding: 8px;
        line-height: 20px;
        color: var(--color-text-1);
        pointer-events: auto;
        background-color: var(--color-mask-bg);
        border-color: #fff;
        border-radius: 50%;

        &:hover {
          box-shadow: 0 0 5px 3px var(--background-2);
          transform: scale(0.95);
        }
      }

      .xgplayer {
        .xgplayer-controls {
          height: auto !important;
        }
      }
    }
  }

  .wrapper {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    width: 80vw;
    height: 83vh;
    margin: 0 auto;
    color: var(--font-main);
    background-color: var(--background-wrapper);
    border-radius: 16px;
  }

  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 12px;
    font-size: 12px;
    color: var(--font-main);
    text-align: center;
  }

  @media only screen and (max-width: 640px) {
    .home {
      padding: 0;
    }

    .wrapper {
      flex-direction: column;
      width: 100%;
      height: 100%;
      border-radius: 0;
    }

    .footer {
      position: relative;
      padding: 4px 0;
      background-color: var(--background-secondary);
      transform: scale(0.9);

    }
  }
  .chat {
    background-color: var(--color-bg-1);
  }
</style>
