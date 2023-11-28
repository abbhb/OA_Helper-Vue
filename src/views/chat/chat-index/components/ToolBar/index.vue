<script setup lang="ts">
  import { computed } from 'vue';
  import { useGlobalStore } from '@/store/modules/chat/global';

  const globalStore = useGlobalStore();
  const unReadMark = computed(() => globalStore.unReadMark);
</script>

<template>
  <aside class="side-toolbar">
    <div class="tool-icons">
      <!-- 会话 -->
      <router-link exact-active-class="tool-icon-active" to="/chat/chat">
        <a-badge
          :count="unReadMark.newMsgUnreadCount"
          :dot="unReadMark.newMsgUnreadCount === 0"
          :max-count="99"
        >
          <icon-message class="tool-icon" :size="28" />
        </a-badge>
      </router-link>
      <!-- 联系人 -->
      <router-link exact-active-class="tool-icon-active" to="/chat/contact">
        <a-badge
          :count="unReadMark.newFriendUnreadCount"
          :dot="unReadMark.newFriendUnreadCount === 0"
          :max-count="99"
        >
          <icon-user-group class="tool-icon" :size="28" />
        </a-badge>
      </router-link>
    </div>
  </aside>
</template>

<style scoped lang="less">
  .tool-icons {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    margin-top: 16px;
  }

  .tool-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
  }

  .tool-icon-active {
    color: var(--color-primary-light-4);
    background-color: var(--color-secondary-hover);
    border-radius: 8px;
    transition: background-color 0.3s;

    &:hover {
      background-color: var(--color-secondary-hover);
    }
  }

  .side-toolbar {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80px;
    color: var(--font-family);
    user-select: none;
    border: var(--color-border) 1px solid;
    padding: 20px 0;
    overflow-y: auto;
    margin: 20px 0px;
    .menu {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;

      &-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 6px 0;
        line-height: 1.2;
        text-align: center;

        &-name {
          margin-top: 4px;
          font-size: 12px;
          white-space: nowrap;
        }
      }
    }


    .icon-qcloud {
      font-size: 23px !important;
    }

    .icon-zhankai {
      display: none;
    }
  }
</style>
