<script setup lang="ts">
  import { computed, defineProps } from 'vue';
  import CardSync from "@/views/signin/device/components/sync/CardSync.vue";
  import FaceSync from './FaceSync.vue';

  const props = defineProps({
    support: {
      type: String,
      required: true,
      default: '',
    },
    deviceId: {
      type: String,
      required: true,
      default: '',
    },
  });
  const modelKey = computed(() => {
    if (props.support === '') {
      return 'Error';
    }
    if (props.deviceId === '') {
      return 'Error';
    }
    if (props.support === 'face') {
      return FaceSync;
    }
    if (props.support === 'card') {
      return CardSync;
    }
    return 'Error';
  });
</script>

<template>
  <div>
    <div v-if="modelKey === 'Error'"> 组件调用异常[该设备暂不支持] </div>
    <div v-else>
      <component :is="modelKey" :support="props.support" :device-id="props.deviceId" />
    </div>
  </div>
</template>

<style scoped></style>
