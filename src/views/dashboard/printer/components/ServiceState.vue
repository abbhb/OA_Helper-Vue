<template>
  <a-card
    class="general-card"
    title="服务状态"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ padding: '24px 20px 20px 20px' }"
  >
    <template #extra>
      <a-trigger position="left" auto-fit-position :unmount-on-close="false">
        <a-link v-if="gaojinList.length > 0">告警</a-link>
        <template #content>
          <div class="demo-basic">
            <a-list>
              <a-list-item v-for="(item, index) in gaojinList" :key="index">{{
                item
              }}</a-list-item>
            </a-list>
          </div>
        </template>
      </a-trigger>
    </template>
    <a-list>
      <a-list-item>转PDF任务数：{{ serviceState.toPDFDiffNumber }}</a-list-item>
      <a-list-item
        >转缩略图任务数：{{ serviceState.toImageDiffNumber }}</a-list-item
      >
      <a-list-item
        >转pdf进程数：
        <a-tag
          :color="
            serviceState.toPDFConsumerNumber >= 3
              ? 'green'
              : serviceState.toPDFConsumerNumber < 3 &&
                serviceState.toPDFConsumerNumber >= 1
              ? 'yellow'
              : 'red'
          "
          >{{ serviceState.toPDFConsumerNumber }}</a-tag
        >
      </a-list-item>
      <a-list-item
        >转缩略图进程数：<a-tag
          :color="
            serviceState.toImageConsumerNumber >= 3
              ? 'green'
              : serviceState.toImageConsumerNumber < 3 &&
                serviceState.toImageConsumerNumber >= 1
              ? 'yellow'
              : 'red'
          "
          >{{ serviceState.toImageConsumerNumber }}</a-tag
        ></a-list-item
      >
    </a-list>
  </a-card>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
  import { unoServiceInfo, UnoServiceInfo } from '@/api/printer';

  const serviceState = ref<UnoServiceInfo>({
    toPDFDiffNumber: 0,
    toImageDiffNumber: 0,
    toPDFConsumerNumber: 0,
    toImageConsumerNumber: 0,
    chulijianyi: '',
  });
  const intervalId = ref(null);

  const getServiceStateData = async () => {
    const { data } = await unoServiceInfo();
    serviceState.value = data;
  };

  const gaojinList = computed(() => {
    const lists = [];
    for (const string of serviceState.value.chulijianyi.trim().split(';')) {
      if (string.trim() === '') {
        continue;
      }
      lists.push(string.trim());
    }
    return lists;
  });

  const startPolling = () => {
    getServiceStateData();
    if (intervalId.value) {
      stopPolling();
    }
    intervalId.value = setInterval(getServiceStateData, 2000); // 每2秒轮询一次
  };

  const stopPolling = () => {
    clearInterval(intervalId.value);
  };

  onMounted(() => {
    startPolling();
  });

  onBeforeUnmount(() => {
    stopPolling();
  });
</script>

<style scoped></style>
