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

<script lang="ts">
  import { reactive } from 'vue';
  import axios from 'axios';

  export default {
    name: 'DeviceState',
      onUnmounted() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    },
    setup() {
      const formDevice = reactive({
        list: '获取中',
        prot: '别着急',
        status: '正常',
      });
      const timer = null;

      return {
        formDevice,
        timer,
      };
    },
    mounted() {
      this.timeRE();
      this.timer = window.setInterval(() => {
        setTimeout(() => {
          this.timeRE();
        }, 3000);
      }, 3000);
    },
    methods: {
      async timeRE() {
        const resB = await axios.get(`http://10.15.245.1:8081/papi/status`);
        this.formDevice.list = resB.data.list;
        this.formDevice.prot = resB.data.prot;
        this.formDevice.status = resB.data.status;
      },
    },
  };
</script>

<style scoped></style>
