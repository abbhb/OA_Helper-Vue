<!-- 监听器组件 -->
<template>
  <el-dialog v-model="open" title="选择监听器" width="1200px" append-to-body>
    <el-form :inline="true" :model="queryForm" class="demo-form-inline">
      <el-form-item label="监听器名称">
        <el-input
          v-model="queryForm.listenerName"
          placeholder="监听器名称"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table ref="tableRef" v-loading="loading" :data="list" :height="500" :max-height="500">
      <el-table-column label="序号" type="index" width="70"/>
      <el-table-column
        label="监听器名称"
        align="center"
        prop="listenerName"
        width="200"
      />
      <el-table-column
        label="java类"
        align="center"
        prop="javaClass"
        show-overflow-tooltip
      />
      <el-table-column
        label="备注"
        align="center"
        prop="remark"
        show-overflow-tooltip
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="150"
      />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button link type="primary" @click="handleCurrentChange(scope.row)"
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
      @size-change="getList"
    />

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="open = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref, reactive} from 'vue';
import {listenerList} from '@/api/bpmn';

// 表格实例
const tableRef = ref();

// 查询参数
const queryForm = reactive({
  listenerName: '',
  pageNo: 1,
  pageSize: 10,
});
// 列表内容数量
const total = ref(0);
// 列表是否加载
const loading = ref(true);
// 列表返回值
const list = ref<any[]>([
  {
    listenerName:"不存在的监听器",
    javaClass:"com.java.c",
    remark:"请勿选择",
  }
]);
// 是否打开弹出框
const open = ref(false);

/**
 * 打开选择器
 */
const handleOpen = () => {
  getList();
  open.value = true;
};

/**
 * 查询列表
 */
const getList = async () => {

  loading.value = true;
  // const {data} = await listenerList({
  //   pageSize: queryForm.pageSize,
  //   pageNum: queryForm.pageNo,
  //   listenerName: queryForm.listenerName,
  // });
  loading.value = false;
  // list.value = data.records;
  // total.value = data.total;
};

/**
 * 搜索按钮操作
 */
function handleQuery() {
  queryForm.pageNo = 1;
  getList();
}

/**
 * 选择行事件
 * @param val 选择的行数据
 */
function handleCurrentChange(val: any) {
  emit('ok', val);
  open.value = false;
}

defineExpose({
  handleOpen,
});

const emit = defineEmits<{
  (event: 'ok', row: any): void;
}>();
</script>
