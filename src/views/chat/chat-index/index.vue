<script setup lang="ts">
  import {
    useImgPreviewStore,
    useVideoPreviewStore,
  } from '@/store/modules/chat/preview';
  import { h, onMounted, onUnmounted, ref, watch } from 'vue';
  import AddFriendModal from '@/components/AddFriendModal/index.vue';
  import MsgReadModal from '@/components/MsgReadModal/index.vue';
  import {
    clearListener,
    initListener,
    readCountQueue,
  } from '@/utils/chat/readCountQueue';
  import { useChatStore } from '@/store/modules/chat/chat';
  import { useUserStore } from '@/store';
  import { ElMessageBox } from 'element-plus';
  import {sendMsg} from "@/api/chat";
  import CreateGroupModal from '@/components/CreateGroupModal/index.vue'
  import SideBar from './components/SideBar/index.vue';
  import ToolBar from './components/ToolBar/index.vue';
  import ChatBox from './components/ChatBox/index.vue';
  import VideoPlayer from './components/VideoPlayer/index.vue';
  import PostCard from './components/PostCard/PostCard.vue';


  type TContainerDListener = {
    messageId: number | null;
    dragStart: (e: DragEvent) => any;
    dragOver: (e: DragEvent) => any;
    dragLeave: (e: DragEvent) => any;
    drop: (e: DragEvent) => any;
  };

  const imageStore = useImgPreviewStore();
  const videoStore = useVideoPreviewStore();
  const userStore = useUserStore();
  const chatStore = useChatStore();
  const container = ref<HTMLDivElement>();

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

  watch(
    () => userStore.isSign,
    (newValue) => {
      if (newValue) {
        console.log("开始更新已读数")
        initListener();
        readCountQueue();
      }
    },
    { immediate: true }
  );

  const containerDragListener: TContainerDListener = {
    messageId: null,
    dragStart(e) {
      const target = e.target as HTMLDivElement;
      this.messageId = Number(target.dataset.messageId);
    },
    dragOver(e) {
      e.preventDefault();
      const target = e.target as HTMLDivElement;
      if (target.dataset.roomId) {
        target.style.backgroundColor = 'var(--hover-bg-1)';
      }
    },
    dragLeave(e) {
      e.preventDefault();
      const target = e.target as HTMLDivElement;
      if (target.dataset.roomId) {
        target.style.backgroundColor = '';
      }
    },
    drop(e) {
      const target = e.target as HTMLDivElement;
      if (target.dataset.roomId && this.messageId) {
        target.style.backgroundColor = '';
        // 获取消息体
        const message = chatStore.getMessage(String(this.messageId));
        const session = chatStore.getSession(String(target.dataset.roomId));
        if (message && session) {
          // 发送消息
          ElMessageBox.confirm(h(PostCard, { session, message }), '发送给: ', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            draggable: true,
            dangerouslyUseHTMLString: true,
          }).then(async () => {
            // 发送消息
            const {data} = await sendMsg({
              roomId: String(target.dataset.roomId),
              msgType: message.message.type,
              body: message.message.body,
            })
            chatStore.pushMsg(data);
            // // 发完消息就要刷新会话列表，
            // //  FIXME 如果当前会话已经置顶了，可以不用刷新
            chatStore.updateSessionLastActiveTime(
              String(target.dataset.roomId)
            );


          });
        }
      }
    },
  };

  const initListeners = () => {
    container.value?.addEventListener(
      'dragstart',
      containerDragListener.dragStart
    );
    container.value?.addEventListener(
      'dragover',
      containerDragListener.dragOver
    );
    container.value?.addEventListener(
      'dragleave',
      containerDragListener.dragLeave
    );
    container.value?.addEventListener('drop', containerDragListener.drop);
  };
  const removeListeners = () => {
    container.value?.removeEventListener(
      'dragstart',
      containerDragListener.dragStart
    );
    container.value?.removeEventListener(
      'dragover',
      containerDragListener.dragOver
    );
    container.value?.removeEventListener(
      'dragleave',
      containerDragListener.dragLeave
    );
    container.value?.removeEventListener('drop', containerDragListener.drop);
  };

  onMounted(() => {
    initListeners();
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
    removeListeners();
    clearListener();
  });
</script>

<template>
  <main class="home chat">
    <div ref="container" class="wrapper">
      <ToolBar />
      <SideBar />
      <ChatBox />
    </div>

    <div
      v-if="videoStore.isPlaying"
      class="video-play"
      style="pointer-events: none"
    >
      <icon-close class="close" :size="136" @click="videoStore.close()" />

      <VideoPlayer :url="videoStore.previewUrl" style="pointer-events: auto" />
    </div>
    <AddFriendModal />
    <CreateGroupModal/>
    <MsgReadModal />
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
