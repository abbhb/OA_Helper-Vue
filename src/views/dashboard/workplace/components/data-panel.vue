<template>
  <a-grid :cols="24" :row-gap="16" class="panel">
    <a-grid-item
      class="panel-col"
      :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image"
          />
        </a-avatar>
        <a-statistic
          :title="$t('workplace.allUser')"
          :value="userCount"
          :precision="0"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">{{ $t('workplace.pecs') }}</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/fdc66b07224cdf18843c6076c2587eb5.svg~tplv-49unhts6dw-image.image"
          />
        </a-avatar>
        <a-statistic
          :title="$t('workplace.putInDay')"
          :value="apiCount"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">{{ $t('workplace.pecs') }}</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/77d74c9a245adeae1ec7fb5d4539738d.svg~tplv-49unhts6dw-image.image"
          />
        </a-avatar>
        <a-statistic
          :title="$t('workplace.newDay')"
          :value="printCount"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">{{ $t('workplace.pecs') }}</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
      style="border-right: none"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/c8b36e26d2b9bb5dbf9b74dd6d7345af.svg~tplv-49unhts6dw-image.image"
          />
        </a-avatar>
        <a-statistic
          :title="$t('workplace.newFromYesterday')"
          :value="apiCountRate"
          :precision="1"
          :value-from="0"
          animation
        >
          <template #suffix>
            %
            <icon-caret-up class="up-icon" />
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item :span="24">
      <a-divider class="panel-border" />
    </a-grid-item>
  </a-grid>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { getUserCount } from '@/api/user';
  import {
    queryApiCount,
    queryDayPrintCount,
    queryLastdayApiCount,
  } from '@/api/dashboard';

  const userCount = ref(0);
  const apiCount = ref(0);
  const printCount = ref(0);
  const lastApiCount = ref(0);
  const apiCountRate = computed(() => {
    // 回调函数必须return，结果就是计算的结果
    // 如果计算属性依赖的数据发生变化，那么会重新计算
      if (lastApiCount.value === 0) {
        return 100;
      }
    return ((apiCount.value - lastApiCount.value) / lastApiCount.value) * 100;
  });
  const fetchAllUserData = async () => {
    try {
      const { data } = await getUserCount();
      userCount.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
  const fetchApiCountData = async () => {
    try {
      const { data } = await queryApiCount();
      apiCount.value = data;
    } catch (err) {
      console.log(err);
      // you can report use errorHandler or other
    }
  };
  // queryDayPrintCount
  const fetchDayPrintCount = async () => {
    try {
      const { data } = await queryDayPrintCount();
      printCount.value = data;
    } catch (err) {
      console.log(err);
      // you can report use errorHandler or other
    }
  };

  // queryLastdayApiCount
  const fetchLastdayApiCount = async () => {
    try {
      const { data } = await queryLastdayApiCount();
      lastApiCount.value = data;
    } catch (err) {
      console.log(err);
      // you can report use errorHandler or other
    }
  };
  fetchAllUserData();
  fetchApiCountData();
  fetchDayPrintCount();
  fetchLastdayApiCount();
</script>

<style lang="less" scoped>
  .arco-grid.panel {
    margin-bottom: 0;
    padding: 16px 20px 0 20px;
  }

  .panel-col {
    padding-left: 43px;
    border-right: 1px solid rgb(var(--gray-2));
  }

  .col-avatar {
    margin-right: 12px;
    background-color: var(--color-fill-2);
  }

  .up-icon {
    color: rgb(var(--red-6));
  }

  .unit {
    margin-left: 8px;
    color: rgb(var(--gray-8));
    font-size: 12px;
  }

  :deep(.panel-border) {
    margin: 4px 0 0 0;
  }
</style>
