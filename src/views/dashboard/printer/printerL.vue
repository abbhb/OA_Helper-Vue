<template>
  <div class="container">
    <div class="left-side">
      <UploadPrint v-if="printState.model === 1"/>
      <MultiUploadPrint v-else-if="printState.model === 9"/>
      <PrinterTaskList />
      <HistoryRecord/>
      <PrintDocumentTypeStatistics/>
    </div>
    <div class="right-side">
      <a-grid :cols="24" :row-gap="16">
        <a-grid-item :span="24">
          <div class="panel moduler-wrap">
            <DeviceState/>
          </div>
        </a-grid-item>
        <a-grid-item :span="24" class="panel">
          <StateManger/>
        </a-grid-item>
        <a-grid-item :span="24" class="panel">
          <PrintTopListNew/>
        </a-grid-item>
      </a-grid>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DeviceState from '@/views/dashboard/printer/components/DeviceState.vue';
import UploadPrint from '@/views/dashboard/printer/components/UploadPrint.vue';
import PrinterTaskList from '@/views/dashboard/printer/components/printerTaskList.vue';
import HistoryRecord from '@/views/dashboard/printer/components/HistoryRecord.vue';
import StateManger from '@/views/dashboard/printer/components/StateManger.vue';
import MultiUploadPrint from '@/views/dashboard/printer/components/MultiUploadPrint.vue';
import usePrintStore from '@/store/modules/print';
import PrintDocumentTypeStatistics from '@/views/dashboard/printer/components/PrintDocumentTypeStatistics.vue';
import PrintTopListNew from '@/views/dashboard/printer/components/PrintTopListNew.vue';

const printState = usePrintStore();
</script>

<style lang="less" scoped>
  .container {
    background-color: var(--color-fill-2);
    padding: 16px 20px;
    padding-bottom: 0;
    display: flex;
  }

  .left-side {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
  }

  .right-side {
    width: 280px;
    margin-left: 16px;
  }

  .panel {
    background-color: var(--color-bg-2);
    border-radius: 4px;
    overflow: auto;
  }
  :deep(.panel-border) {
    margin-bottom: 0;
    border-bottom: 1px solid rgb(var(--gray-2));
  }
  .moduler-wrap {
    border-radius: 4px;
    background-color: var(--color-bg-2);
    :deep(.text) {
      font-size: 12px;
      text-align: center;
      color: rgb(var(--gray-8));
    }

    :deep(.wrapper) {
      margin-bottom: 8px;
      text-align: center;
      cursor: pointer;

      &:last-child {
        .text {
          margin-bottom: 0;
        }
      }
      &:hover {
        .icon {
          color: rgb(var(--arcoblue-6));
          background-color: #e8f3ff;
        }
        .text {
          color: rgb(var(--arcoblue-6));
        }
      }
    }

    :deep(.icon) {
      display: inline-block;
      width: 32px;
      height: 32px;
      margin-bottom: 4px;
      color: rgb(var(--dark-gray-1));
      line-height: 32px;
      font-size: 16px;
      text-align: center;
      background-color: rgb(var(--gray-1));
      border-radius: 4px;
    }
  }
  .message-popover {
    .arco-popover-content {
      margin-top: 0;
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  .mobile {
    .container {
      display: block;
    }
    .right-side {
      // display: none;
      width: 100%;
      margin-left: 0;
      margin-top: 16px;
    }
  }
</style>
