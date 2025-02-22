<template>
  <el-card class="box-card history-container" shadow="hover">
    <template #header>
      <div class="card-header">
        <span>历史记录</span>
      </div>
    </template>
    <div class="hint-container">
      <div class="history">审批通过</div>
      <div class="history_reject">审批不通过</div>
      <div class="next">待审批</div>
    </div>
    <el-timeline>
      <el-timeline-item
        key="start"
        :color="getTimelineColor(1)"
      >
        流程开始
      </el-timeline-item>
      <el-timeline-item
        v-for="(item, index) in historyRecordList"
        :key="index"
        :color="getTimelineColor(item.status)"
      >
        <HistoryNodeInfo :node-item="item" />
      </el-timeline-item>
    </el-timeline>
  </el-card>
</template>

<script setup lang="ts">
  import { defineProps, ref, watchEffect } from 'vue';
  import { getHistoryRecord } from '@/api/bpmn';
  import HistoryNodeInfo from '@/components/BpmnJs/components/HistoryRecord/HistoryNodeInfo.vue';

  const props = defineProps({
    instanceId: {
      type: String,
      required: true,
    },
  });

  const historyRecordList = ref<any[]>([]);

  // 颜色映射方法
  const getTimelineColor = (status: number) => {
    // eslint-disable-next-line no-nested-ternary
    return status === 1 ? '#0bbd87' : status === 3 ? 'red' : '#e4e7ed';
  };

  // 监听instanceId变化自动加载数据
  watchEffect(async () => {
    if (props.instanceId) {
      const { data } = await getHistoryRecord(props.instanceId);
      historyRecordList.value = data;
    }
  });
</script>

<style scoped lang="scss">
  .history-container {
    min-width: 500px;

    :deep(.el-card__body) {
      display: flex;
      flex-direction: column;
      align-items: baseline;
      height: calc(100% - 56px);
    }
  }

  .hint-container {
    display: flex;
    justify-content: center;
    margin: 30px 10px;
    padding: 0 20px;

    > div {
      margin: 0 20px;
      font-size: 16px;
      font-weight: 500;
      color: black;
      display: flex;
      justify-content: center;
      align-items: baseline;

      &::before {
        content: ' ';
        height: 12px;
        width: 12px;
        display: block;
        border-radius: 50%;
        margin-right: 8px;
      }
    }

    .history::before {
      background-color: #0bbd87 !important;
    }

    .history_reject::before {
      background-color: red !important;
    }

    .next::before {
      background-color: #e4e7ed !important;
    }
  }

  :deep(.el-timeline) {
    overflow: auto;
  }
</style>
