<script setup lang="ts">
  import { useChatStore } from '@/store/modules/chat/chat';
  import { ref } from 'vue';

  const chatStore = useChatStore();
  const isShowSetting = ref<boolean>(false);
</script>

<template>
  <div class="room-name">
    <span class="name">{{ chatStore.currentSessionInfo?.name }}</span>
    <span
      v-if="chatStore.isGroup && !chatStore.currentSessionInfo?.hot_Flag"
      class="setting"
      @click="isShowSetting = true"
    >
      设置
    </span>
  </div>
</template>

<style scoped lang="less">
.room-name {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 10px;
  background: var(--background-mask);
  border-radius: 8px 8px 0 0;

  .setting {
    font-size: 13px;
    cursor: pointer;

    &:hover {
      color: var(--hover-primary);
    }
  }
}

</style>
