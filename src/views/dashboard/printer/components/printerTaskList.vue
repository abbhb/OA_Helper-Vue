<template>
  <a-spin :loading="list_loading" tip="加载中...">
    <div title="打印机列表" hoverable>
      <a-table :data="data" style="margin-top: 30px">
        <template #columns>
          <a-table-column data-index="JobId" title="任务ID" />
          <a-table-column data-index="file_name" title="文件名" />
          <a-table-column data-index="file_uuid" title="文件UUID" />
          <a-table-column data-index="time" title="时间" />
          <a-table-column data-index="user_name" title="用户名" />
          <a-table-column data-index="PagesPrinted" title="已印页" />
          <a-table-column data-index="TotalPages" title="总页" />
          <a-table-column data-index="Status" title="状态" />
          <a-table-column title="操作">
            <template #cell="{ record }">
              <a-button @click="handleChangeJob(record.file_uuid, 3)"
                >取消</a-button
              >
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
  </a-spin>
</template>

<script lang="ts">
  import axios from 'axios';
  import { Modal } from '@arco-design/web-vue';

  export default {
    name: 'PrinterTaskList',
    data() {
      return {
        list_loading: false,
        data: [],
        timer: null,
      };
    },
    mounted() {
      this.TimeDo();
      this.timer = window.setInterval(() => {
        setTimeout(() => {
          this.TimeDo();
        }, 5000);
      }, 5000);
    },
    beforeUnmount() {
      clearInterval(this.timer);
      this.timer = null;
    },
    methods: {
      async handleChangeJob(FileUuid: any, state: any) {
        this.list_loading = true;
        try {
          const res = await axios.get(
            `http://10.15.245.1:8081/papi/setJob/${FileUuid}/${state}`,
            {
              withCredentials: true,
            }
          );
          this.TimeDo();
          const ResResult = res.data;
          Modal.error({
            title: '提示',
            content: `${ResResult.msg}`,
          });
        } catch (e: any) {
          Modal.error({
            title: '提示',
            content: `${e.message}`,
          });
        }
        this.list_loading = false;
      },
      async TimeDo() {
        try {
          const res = await axios.get(`http://10.15.245.1:8081/papi/list`);
          this.data = res.data;
        } catch (e: any) {
          this.$notification.warning(`${e.message}`);
        }
      },
    },
  };
</script>

<style scoped></style>
