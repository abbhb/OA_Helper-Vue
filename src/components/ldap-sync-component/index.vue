<script setup lang="ts">
import {onMounted, ref} from "vue";
import {SyncLdapJobVO, SyncMysqlToLdap, syncMysqlToLdapJobs} from "@/api/common";
import {Message, Notification} from "@arco-design/web-vue";

interface State {
  visible:boolean;
  okLoading:boolean;
}

const state = ref<State>({
  visible:false,
  okLoading:false,
});
const syncOpen = () => {
  state.value.visible = !state.value.visible;
}
const syncLdap = async () => {
  try {
    await SyncMysqlToLdap();
    Notification.success("同步数据至Ldap成功！");
  }catch (e) {
    Notification.error(e);
  }
  return true;
}

// 表格列配置
const columns = [
  {
    title: '任务ID',
    dataIndex: 'id',
    width: 200,
    ellipsis: true
  },
  {
    title: '状态',
    slotName: 'state',
    width: 120,
    align: 'center'
  },
  {
    title: '同步任务创建时间',
    slotName: 'createTime',
    width: 180
  },
  {
    title: '同步完成时间',
    slotName: 'updateTime',
    width: 180,
    sortable: {
      sortDirections: ['ascend', 'descend']
    }
  },
  {
    title: '操作人',
    dataIndex: 'userName',
    width: 120,
    render: ({ record }) => `${record.userName} (${record.createUser})`
  }
];
// 状态映射和颜色配置
const stateMap = {
  '0': '进行中',
  '1': '成功',
  '2': '失败'
};

const getStateColor = (state: string) => {
  const colors = {
    '0': 'gray',
    '1': 'green',
    '2': 'red'
  };
  return colors[state] || 'gray';
};

// 时间格式化
const formatTime = (time: string) => {
  return time;
};

// 数据相关
const tableData = ref<SyncLdapJobVO[]>([]);
const loading = ref(false);


// 获取数据
const fetchData = async () => {
  try {
    loading.value = true;
    const { data } = await syncMysqlToLdapJobs();
    tableData.value = Array.isArray(data) ? data : [data];
  } catch (error) {
    Message.error('数据加载失败');
    console.error('Error fetching data:', error);
  } finally {
    loading.value = false;
  }
};


</script>

<template>
  <a-link @click="syncOpen"><IconRefresh></IconRefresh>立即同步</a-link>
  <a-modal
    unmount-on-close
    :footer="true"
    title="同步数据至LDAP"
    :hide-title="false"
    :on-before-ok="syncLdap"
    ok-text="立即手动同步"
    @before-open="fetchData"
    cancel-text="等待系统自动同步"
    :closable="false"
    v-model:visible="state.visible"
    :width="900"
  >
    <a-space direction="vertical" fill size="large">
      <a-table
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :pagination="false"
        row-key="id"
        bordered
      >
        <!-- 自定义状态列 -->
        <template #state="{ record }">
          <a-tag :color="getStateColor(record.state)" bordered>
            {{ stateMap[record.state] || '未知状态' }}
          </a-tag>
        </template>

        <!-- 自定义时间格式 -->
        <template #createTime="{ record }">
          {{ formatTime(record.createTime) }}
        </template>
        <template #updateTime="{ record }">
          {{ formatTime(record.updateTime) }}
        </template>
      </a-table>
    </a-space>
  </a-modal>
</template>

<style scoped>

</style>