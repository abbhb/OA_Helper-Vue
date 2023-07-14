<template>
  <a-card
    class="general-card"
    :title="$t('callback.one.upload.device.state')"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ padding: '24px 20px 20px 20px' }"
  >
    <a-list>
      <a-list-item>设备名：{{ formDevice.list }}</a-list-item>
      <a-list-item>设备接口：{{ formDevice.prot }}</a-list-item>
      <a-list-item>设备状态：{{ formDevice.status }}</a-list-item>
    </a-list>
  </a-card>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, reactive} from 'vue';
import axios from 'axios';

const formDevice = reactive({
  list: '获取中',
  prot: '别着急',
  status: '正常',
});
const timeState = reactive({
  timeInter: null, // 定义定时器
});
onMounted(() => {
  const interval = () => {
    timeState.timeInter = setTimeout(async () => {
      // 执行代码块
      const resB = await axios.get(`http://10.15.247.254:8081/papi/status`);
      formDevice.list = resB.data.list;
      formDevice.prot = resB.data.prot;
      formDevice.status = resB.data.status;
      interval();
    }, 2000);
  };
  interval();
});
onUnmounted(() => {
  clearTimeout(timeState.timeInter); // 销毁
  timeState.timeInter = null;
});
</script>

<style scoped></style>
