<template>
  <div title="打印机列表" hoverable>
    <a-card title="当前打印机任务列表[1s刷新一次]" :bordered="true">
      <a-table :data="printStore.printDevice == null?[]:printStore.printDevice.printJobs" :bordered="false">
        <template #columns>
          <a-table-column data-index="id" title="任务ID" />
          <a-table-column data-index="documentName" title="文件名" />
          <a-table-column data-index="pagesPrinted" title="已印页" />
          <a-table-column data-index="pageCount" title="剩余页" />
          <a-table-column data-index="jobStatus" title="状态" />
          <a-table-column title="操作">
            <template #cell="{ record }">
              <a-button @click="handleChangeJob(record, 3)">取消 </a-button>
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

  const handleChangeJob = async (record: any, state: any) => {
    if (typeof record.jobStatus === "string"){
      if (record.jobStatus.includes("正在取消")){
        Message.info("正在取消中，无需重复操作")
        return
      }
    }
    try {
      const {data} = await cancelPrint(record.id, printStore.printDevice.id);
      Message.success(data)
    }catch (e) {
      Message.error(e.toString());
    }

  };
</script>

<style scoped></style>
