<template>
  <div>
    <el-dialog v-model="open" title="选择流程" width="1200px" append-to-body>
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="流程名称">
          <el-input
            v-model="queryForm.definitionName"
            placeholder="流程名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="流程key">
          <el-input
            v-model="queryForm.definitionKey"
            placeholder="流程key"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="list">
        <el-table-column label="流程id" align="center" prop="id" width="300"/>
        <el-table-column label="流程名称" align="center" prop="name"/>
        <el-table-column label="流程key" align="center" prop="key"/>
        <el-table-column label="版本" align="center" prop="version"/>
        <el-table-column>
          <template #default="scope">
            <el-button link type="primary" @click="handleSelect(scope.row)"
            >选择
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
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive} from 'vue';
import {processDefinitionList} from "@/api/bpmn";

// 查询参数
const queryForm = reactive({
  definitionName: '',
  definitionKey: '',
  active: true,
  pageNo: 1,
  pageSize: 10,
});
// 列表内容数量
const total = ref(0);
// 列表是否加载
const loading = ref(true);
// 列表返回值
const list = ref<any[]>([]);

// 是否打开弹出框
const open = ref(false);

// 初始化
const init = () => {
  getList();
  open.value = true;
};

/**
 * 查询列表
 */
const getList = async () => {
  loading.value = true;
  const res = await processDefinitionList({
    pageNum: queryForm.pageNo,
    pageSize: queryForm.pageSize,
    active: queryForm.active,
    definitionKey: queryForm.definitionKey,
    definitionName: queryForm.definitionName,
  });
  loading.value = false;
  if (res.code === 1) {
    list.value = res.data.records;
    total.value = Number(res.data.total);
  } else {
    list.value = [];
  }
};

/**
 * 搜索按钮操作
 */
function handleQuery() {
  queryForm.pageNo = 1;
  getList();
}

/**
 * 选择流程
 * @param row 选择的行
 */
function handleSelect(row: any) {
  emit('ok', row);
  open.value = false;
}

const emit = defineEmits<{
  (event: 'ok', row: any): void;
}>();

defineExpose({
  init,
});
</script>

<style scoped></style>
