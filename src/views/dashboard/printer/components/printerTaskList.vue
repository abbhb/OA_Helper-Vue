<template>
  <div title="打印机列表" hoverable>
    <a-card title="当前打印机任务列表[2s刷新一次]" :bordered="true">
      <a-table :data="printStore.printDevice == null?[]:printStore.printDevice.printJobs" :bordered="false">
        <template #columns>
          <a-table-column data-index="id" title="任务ID" />
          <a-table-column data-index="documentName" title="文件名" />
          <a-table-column data-index="pagesPrinted" title="已印页" />
          <a-table-column data-index="pageCount" title="剩余页" />
          <a-table-column data-index="jobStatus" title="状态" />
          <a-table-column title="操作">
            <template #cell="{ record }">
              <a-button @click="handleChangeJob(record.id, 3)">取消 </a-button>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
  import axios from 'axios';
  import {Message, Modal} from '@arco-design/web-vue';
  import { onMounted, onUnmounted, reactive, ref } from 'vue';
  import usePrintStore from '@/store/modules/print';
  import {cancelPrint} from "@/api/printer";

  const printStore = usePrintStore();

  const handleChangeJob = async (FileUuid: any, state: any) => {
    const {data} = await cancelPrint(FileUuid, printStore.printDevice.id);
    Message.success(data)
  };
</script>

<style scoped></style>
