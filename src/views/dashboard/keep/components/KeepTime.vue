<script setup lang="ts">
import {ref} from 'vue';

const studyState = ref(1);
studyState.value = 2
</script>

<template>
  <a-space
    direction="vertical"
    size="large"
    :style="{ width: '1300px' }"
    class="keep-root"
  >
    <span class="keep-title">
      {{ $t('keep.one.title') }}
    </span>
    <!--  主功能区-->
    <a-space direction="vertical" size="large">
      <a-space v-if="studyState === 1" direction="horizontal" size="large">
        <span class="item-title--1">今日还未开始学习</span>
      </a-space>
      <a-space v-else-if="studyState === 2" direction="horizontal" size="large">
        <span class="item-title">签到时间</span>12:33:51
        <span class="item-title">今日已学时间</span>33分钟
      </a-space>
    </a-space>
  </a-space>
</template>

<style scoped lang="less">
.keep-root {
  background-color: var(--color-bg-2);
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.keep-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--color-text-1);
}

.item-title {
  font-size: 14px;
  font-weight: 500;
  font-weight: bold;
  color: var(--color-text-1);
}

.item-title--1 {
  font-size: 18px;
  font-weight: 500;
  font-weight: bold;
  color: red;
}
</style>
