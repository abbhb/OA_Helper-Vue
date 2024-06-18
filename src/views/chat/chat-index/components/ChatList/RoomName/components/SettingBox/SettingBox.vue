<script setup lang="ts">
  import { useChatStore } from '@/store/modules/chat/chat';
  import { computed } from 'vue';
  import BasedSetting from './components/BasedSetting/BasedSetting.vue';
  import AdvancedSetting from './components/AdvancedSetting/AdvancedSetting.vue';
  import DeadZoneSetting from './components/DeadZoneSetting/DeadZoneSetting.vue';

  const chatStore = useChatStore();

  const isHot = computed(() => {
    return chatStore.isGroup && chatStore.currentSessionInfo?.hot_Flag;
  });
</script>

<template>
  <div class="setting-box">
    <el-divider content-position="left">基础</el-divider>
    <div class="base">
      <BasedSetting />
    </div>
    <el-divider content-position="left">高级</el-divider>
    <div class="advanced">
      <AdvancedSetting v-show="!isHot" />
      <a-empty v-show="isHot" />
    </div>
    <el-divider content-position="left">危险区</el-divider>
    <div class="dead-zone">
      <DeadZoneSetting v-show="!isHot" />
      <a-empty v-show="isHot" />
    </div>
  </div>
</template>
