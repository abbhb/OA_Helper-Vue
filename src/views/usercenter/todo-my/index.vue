<template>
  <div class="container">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{ padding: '17px 20px 21px 20px' }"
    >
      <template #title> 我的待办 </template>
      <template #extra>
        <a-link v-if="!props.noMore" @click="emit('alertSome')"
        >{{ $t('workplace.viewMore') }}
        </a-link>
      </template>
      <div>
        <el-form :inline="true" :model="queryForm" class="demo-form-inline">
          <el-form-item label="流程名称">
            <el-input
              v-model="queryForm.definitionName"
              placeholder="流程名称"
              clearable
            />
          </el-form-item>
          <!--      <el-form-item label="流程key">-->
          <!--        <el-input-->
          <!--          v-model="queryForm.definitionKey"-->
          <!--          placeholder="流程key"-->
          <!--          clearable-->
          <!--        />-->
          <!--      </el-form-item>-->
          <el-form-item>
            <el-button type="primary" @click="handleQuery">查询</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="list">
          <el-table-column label="序号" type="index" width="100" />
          <el-table-column
            label="流程名称"
            align="center"
            prop="definitionName"
          />
          <!--      <el-table-column label="流程key" align="center" prop="definitionKey"/>-->
          <el-table-column label="创建时间" align="center" prop="createTime" />
          <el-table-column label="当前节点" align="center" prop="taskName" />
          <!--      <el-table-column-->
          <!--        label="当前节点key"-->
          <!--        align="center"-->
          <!--        prop="taskDefinitionKey"-->
          <!--      />-->
          <el-table-column label="发起人" align="center" prop="startUserName" />
          <el-table-column>
            <template #default="scope">
              <el-button
                link
                type="primary"
                icon="Pointer"
                @click="handleApproval(scope.row)"
              >快捷审批
              </el-button>
              <el-button
                link
                type="primary"
                icon="Pointer"
                @click="handleHistoryRecord(scope.row)"
              >审批
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          v-model:page-size="queryForm.pageSize"
          v-model:current-page="queryForm.pageNo"
          layout="prev, pager, next"
          :total="total"
          @current-change="getList"
        />

        <!-- 审批 -->
        <Approval ref="approvalRef" @ok="getList" />

        <!-- 审批记录 -->
        <HistoryRecordApproval ref="historyRecordApprovalRef" @ok="getList" />
      </div>
    </a-card>
  </div>

</template>

<script setup lang="ts">
  import { ref, reactive, defineEmits } from 'vue';
  import HistoryRecordApproval from '@/components/HistoryRecord/components/HistoryRecordApproval/index.vue';
  import { processTodoList } from '@/api/bpmn';
  import Approval from './model/Approval.vue';

  const props = defineProps({
    noMore: {
      type: Boolean,
      default: false,
    },
  });
  const emit = defineEmits(['alertSome']);
  // 查询参数
  const queryForm = reactive({
    definitionName: '',
    definitionKey: '',
    pageNo: 1,
    pageSize: 10,
  });
  // 列表内容数量
  const total = ref(0);
  // 列表是否加载
  const loading = ref(true);
  // 列表返回值
  const list = ref<any[]>([]);

  // 发起流程弹出框
  const approvalRef = ref();
  // 审批记录弹出框
  const historyRecordApprovalRef = ref();

  /**
   * 查询列表
   */
  const getList = async () => {
    loading.value = true;
    const res = await processTodoList({
      pageNum: queryForm.pageNo,
      pageSize: queryForm.pageSize,
      definitionName: queryForm.definitionName,
      definitionKey: queryForm.definitionKey,
    });
    if (res.code === 1) {
      list.value = res.data.records;
      total.value =  Number(res.data.total);
    } else {
      list.value = [];
    }
    loading.value = false;
  };

  /**
   * 搜索按钮操作
   */
  function handleQuery() {
    queryForm.pageNo = 1;
    getList();
  }

  /**
   * 审批流程实例
   * @param row 当前行数据
   */
  function handleApproval(row: any) {
    approvalRef.value.handleOpen(
      row.processInstanceId,
      row.taskId,
      row.taskDefinitionKey
    );
  }

  /**
   * 审批记录
   * @param instanceId 流程实例id
   */
  function handleHistoryRecord(row: any) {
    historyRecordApprovalRef.value.open(
      row.processInstanceId,
      row.taskId,
      row.taskDefinitionKey,
      row.definitionKey
    );
  }

  getList();
</script>

<style scoped>
  .general-card {
    min-height: 395px;
  }
  :deep(.arco-table-tr) {
    height: 44px;
    .arco-typography {
      margin-bottom: 0;
    }
  }
  .increases-cell {
    display: flex;
    align-items: center;
    span {
      margin-right: 4px;
    }
  }
</style>
