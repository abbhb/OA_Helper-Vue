<script setup lang="ts">
import {ClockSelfDTO, getSelfClockAll} from '@/api/keeptime';
import {ref} from 'vue';

const selfDataAll = ref<ClockSelfDTO>({
  isStandard: false,
  isSigned: false,
  why: '',
  monthTime: 0,
  integrityDay: 0,
  minOldTime: 0,
  maxFirstTime: '',
  id: '',
  userId: '',
  date: '',
  firstTime: '',
  oldTime: 0,
});
const initAll = async () => {
  const data = await getSelfClockAll();
  if (data.code === 1) {
    console.log(data);
    selfDataAll.value = data.data;
  }
};
initAll()
</script>

<template>
  <a-card
    class="general-card"
    :title="$t('keep.sidebar.title')"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ padding: '24px 20px 20px 20px' }"
  >
    <a-list>
      <a-list-item>今日已学：{{ selfDataAll.oldTime }}分钟</a-list-item>
      <a-list-item>本月累计：{{ selfDataAll.monthTime }}分钟</a-list-item>
      <a-list-item
      >本月完整完成天数：{{ selfDataAll.integrityDay }}天
      </a-list-item
      >
    </a-list>
  </a-card>
</template>

<style lang="less" scoped></style>
