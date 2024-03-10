<template>
  <div>
    <el-form :inline="true" :model="queryForm" class="demo-form-inline">
      <el-form-item label="业务key">
        <el-input
            v-model="queryForm.businessKey"
            placeholder="businessKey(不是模糊查询)"
            clearable
        />
      </el-form-item>
      <el-form-item label="流程名称">
        <el-input
            v-model="queryForm.definitionName"
            placeholder="流程名称(不是模糊查询)"
            clearable
        />
      </el-form-item>
      <el-form-item label="流程key">
        <el-input
            v-model="queryForm.definitionKey"
            placeholder="流程key(不是模糊查询)"
            clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd"
        >新增
        </el-button
        >
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="list">
      <el-table-column label="序号" type="index" width="100"/>
      <el-table-column label="业务key" align="center" prop="businessKey"/>
      <el-table-column label="流程名称" align="center" prop="definitionName"/>
      <el-table-column label="流程key" align="center" prop="definitionKey"/>
      <el-table-column label="版本" align="center" prop="definitionVersion"/>
      <el-table-column label="开始时间" align="center" prop="startTime"/>
      <el-table-column label="结束时间" align="center" prop="endTime"/>
      <el-table-column label="当前节点" align="center" prop="taskName"/>
      <el-table-column label="状态" align="center">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.status === 1">进行中</el-tag>
          <el-tag v-if="scope.row.status === 2">已完成</el-tag>
          <el-tag type="danger" v-if="scope.row.status === 3">发起人撤销</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="200">
        <template #default="scope">
          <el-button
              link
              type="primary"
              icon="Delete"
              @click="handleDelete(scope.row.id)"
          >删除
          </el-button
          >
          <el-button
              link
              type="primary"
              icon="Pointer"
              @click="handleHistoryRecord(scope.row.id)"
          >审批记录
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        v-model:page-size="queryForm.pageSize"
        v-model:current-page="queryForm.pageNo"
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="getList"
    />
    <!-- 发起流程 -->
    <StartProcess ref="startProcessRef" @ok="getList"/>

    <!-- 审批记录 -->
    <HistoryRecord ref="historyRecordRef"/>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive} from 'vue';
import HistoryRecord from '@/components/HistoryRecord/index.vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {deleteProcessStart, processStartList} from "@/api/bpmn";
import StartProcess from './model/StartProcess.vue';

// 查询参数
const queryForm = reactive({
  businessKey: '',
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
const startProcessRef = ref();

// 审批记录弹出框
const historyRecordRef = ref();

/**
 * 查询列表
 */
const getList = async () => {
  loading.value = true;
  const {data} = await processStartList({
    pageNum: queryForm.pageNo,
    pageSize: queryForm.pageSize,
    definitionName: queryForm.definitionName,
    definitionKey: queryForm.definitionKey,
    businessKey: queryForm.businessKey,
  });
  list.value = data.records;
  total.value = data.total;
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
 * 发起流程
 */
function handleAdd() {
  startProcessRef.value.init();
}

/**
 * 审批记录
 * @param instanceId 流程实例id
 */
function handleHistoryRecord(instanceId: string) {
  historyRecordRef.value.open(instanceId);
}

/**
 * 删除按钮操作
 * @param instanceId 流程实例id
 */
function handleDelete(instanceId: any) {
  ElMessageBox.confirm('确认要删除当前项吗?', '提示').then(async () => {
    const res = await deleteProcessStart(instanceId);
    ElMessage.success(res.msg);
    getList();
  });
}

getList();
</script>

<style scoped></style>
