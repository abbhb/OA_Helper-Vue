<template>
  <div title="打印机列表" hoverable>
    <a-table :data="data" style="margin-top: 30px">
      <template #columns>
        <a-table-column data-index="JobId" title="任务ID"/>
        <a-table-column data-index="file_name" title="文件名"/>
        <a-table-column data-index="file_uuid" title="文件UUID"/>
        <a-table-column data-index="time" title="时间"/>
        <a-table-column data-index="user_name" title="用户名"/>
        <a-table-column data-index="PagesPrinted" title="已印页"/>
        <a-table-column data-index="TotalPages" title="总页"/>
        <a-table-column data-index="Status" title="状态"/>
        <a-table-column title="操作">
          <template #cell="{ record }">
            <a-button @click="handleChangeJob(record.file_uuid, 3)"
            >取消
            </a-button
            >
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import {Modal} from '@arco-design/web-vue';
import {onMounted, onUnmounted, reactive, ref} from "vue";

const ListState = reactive({
  timeInter: null, // 定义定时器
});
const data = ref([]);
onMounted(() => {
  const interval = () => {
    ListState.timeInter = setTimeout(async () => {
      // 执行代码块
      const res = await axios.get(`http://10.15.247.254:8081/papi/list`);
      data.value = res.data;
      interval();
    }, 2000);
  };
  interval();
});
onUnmounted(() => {
  clearTimeout(ListState.timeInter); // 销毁
  ListState.timeInter = null;
});
const handleChangeJob = (FileUuid: any, state: any) => {
  Modal.error({
    title: '提示',
    content: `这个按钮是摆设`,
  });
}

</script>

<style scoped></style>
