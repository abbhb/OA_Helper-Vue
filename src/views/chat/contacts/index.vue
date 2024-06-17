<script setup lang="ts">
  import { onBeforeMount } from 'vue';
  import { useContactStore } from '@/store/modules/chat/contacts';
  import AddFriendModal from '@/components/AddFriendModal/index.vue';
  import VideoPlayer from '@/views/chat/chat-index/components/VideoPlayer/index.vue';
  import SideBar from '@/views/chat/chat-index/components/SideBar/index.vue';
  import ChatBox from '@/views/chat/chat-index/components/ChatBox/index.vue';
  import ToolBar from '@/views/chat/chat-index/components/ToolBar/index.vue';
  import CreateGroupModal from "@/components/CreateGroupModal/index.vue";
  import ContactList from './components/ContactList/index.vue';

  const contactStore = useContactStore();
  onBeforeMount(() => {
    // 默认执行一次
    contactStore.getContactList(true);
    contactStore.getRequestFriendsList(true);
  });
</script>

<template>
  <main class="home chat">
    <div class="wrapper">
      <ToolBar />
      <SideBar v-show="false"/>
      <ContactList />
    </div>
    <CreateGroupModal/>

    <AddFriendModal />
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
