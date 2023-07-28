<script lang="ts" setup>
import {ref} from 'vue';
import DayData from '@/views/dashboard/keep/components/DayData.vue';
import MonthData from '@/views/dashboard/keep/components/MonthData.vue';

const type = ref<string>('day');
const labelList = ref<string[]>(['day', 'month']);
</script>

<template>
  <div class="view-data-root">
    <div>
      <a-radio-group v-model="type" type="button">
        <a-radio v-for="label in labelList" :key="label" :value="label">
          {{ $t(`keep.admin.viewData.${label}`) }}
        </a-radio>
      </a-radio-group>
    </div>
    <DayData v-if="type === 'day'"/>
    <MonthData v-else-if="type === 'month'"/>
  </div>
</template>

<style lang="less" scoped>
.view-data-root {
  display: flex;
  flex-direction: column;
}
</style>
