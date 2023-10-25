<template>
  <a-card
    class="general-card"
    :title="$t('callback.one.upload.device.state')"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ padding: '24px 20px 20px 20px' }"
  >
    <a-list v-if="printState.printDevice!=null">
      <a-list-item>设备名：{{ printState.printDevice.name }}</a-list-item>
      <a-list-item
        >当前任务数：{{ printState.printDevice.listNums }}</a-list-item
      >
      <a-list-item
        >设备状态：<a-tag
          :color="
            String(printState.printDevice.status) === '1'
              ? 'green'
              : String(printState.printDevice.status) === '0'
              ? 'red'
              : 'yellow'
          "
          >{{ printState.printDevice.statusTypeMessage }}</a-tag
        ></a-list-item
      >
    </a-list>
    <span v-else>当前未选择打印机</span>
  </a-card>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, reactive } from 'vue';
  import axios from 'axios';
  import usePrintStore from '@/store/modules/print';

  const printState = usePrintStore();
</script>

<style scoped></style>
