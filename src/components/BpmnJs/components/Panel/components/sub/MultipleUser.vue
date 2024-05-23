<!-- 多选用户组件 -->
<template>
  <div class="select-container">
    <div class="tag-input">
      <el-tag
        v-for="(tag, index) in selectUserList"
        :key="tag.id"
        closable
        @close="handleDel(index)"
      >
        {{ tag.name }}
      </el-tag>
    </div>
    <el-button type="primary" @click="handleOpen">
      <el-icon>
        <Edit/>
      </el-icon>
      选择
    </el-button>
  </div>
  <el-dialog
    v-model="open"
    title="选择人"
    width="1200px"
    append-to-body
    :before-close="submit"
  >
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" >
      <el-form-item label="用户名称">
        <el-input v-model="queryForm.name" clearable placeholder="用户名称"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="list"
      @select="handleSelectionChange"
      @select-all="handleSelectionChange"
      :height="500"
      :max-height="500"
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column label="序号" type="index" width="100"/>
      <el-table-column label="账号昵称" align="center" prop="name"/>
      <el-table-column label="用户名" align="center" prop="username"/>
      <el-table-column label="部门" align="center" prop="deptName"/>
      <el-table-column label="手机号" align="center" prop="phone"/>
      <el-table-column label="邮箱" align="center" prop="email"/>
      <el-table-column label="创建时间" align="center" prop="createTime"/>
    </el-table>

    <el-pagination
      v-model:page-size="queryForm.pageSize"
      v-model:current-page="queryForm.pageNo"
      background
      layout="sizes, prev, pager, next"
      :page-sizes="[20, 40, 60, 80]"
      :total="total"
      @current-change="getList"
      @size-change="getList"
    />

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="submit">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {reactive, ref, watch} from 'vue';
import {listForBMPN} from '@/api/user';

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});

// 表格实例
const tableRef = ref();

// 表格选择的数据
const tableSelectionList = ref<any[]>([]);

// 选择的用户信息
const selectUserList = ref<any[]>([]);

watch(
  () => props.list,
  async () => {
    selectUserList.value = props.list;
  },
  {deep: true, immediate: true}
);

// 查询参数
const queryForm = reactive({
  name: '',
  pageNo: 1,
  pageSize: 10,
});
// 列表内容数量
const total = ref(0);
const daterange = ref([]);
// 列表是否加载
const loading = ref(true);
// 列表返回值
// eslint-disable-next-line vue/no-dupe-keys
const list = ref<any[]>([]);
// 是否打开弹出框
const open = ref(false);

/**
 * 打开选择器
 */
const handleOpen = async () => {
  await getList();
  open.value = true;
};

/**
 * 查询列表
 */
const getList = async () => {
  loading.value = true;
  const {data} = await listForBMPN({
    pageNum: queryForm.pageNo,
    pageSize: queryForm.pageSize,
    name: queryForm.name,
  });
  addSelectUserList();
  list.value = data.records;

  total.value = Number(data.total);
  loading.value = false;

  reloadTableSelect();
};

/**
 * 添加到selectUserList
 */
const addSelectUserList = () => {
  tableSelectionList.value.forEach((item) => {
    const selectIndex = selectUserList.value.findIndex(
      (t) => t.id === item.id
    );
    if (selectIndex === -1) {
      selectUserList.value.push({
        id: item.id,
        name: item.name,
      });
    }
  });
};

/**
 * 加载选择的table项
 */
const reloadTableSelect = () => {
  setTimeout(() => {
    selectUserList.value.forEach((item) => {
      const index = list.value.findIndex((t) => t.id === item.id);
      if (index !== -1) {
        tableRef.value.toggleRowSelection(list.value[index], undefined);
      }
    });
  }, 100);
};

/**
 * 选择table数据
 * @param selectData 选择的数据
 */
const handleSelectionChange = (selectData: any[]) => {
  tableSelectionList.value = selectData;
  // 删除取消的
  list.value.forEach((item) => {
    const tableIndex = tableSelectionList.value.findIndex(
      (t) => t.id === item.id
    );
    if (tableIndex === -1) {
      const selectIndex = selectUserList.value.findIndex(
        (t) => t.id === item.id
      );
      if (selectIndex !== -1) selectUserList.value.splice(selectIndex, 1);
    }
  });

  emit('ok', selectUserList.value);
};

/**
 * 搜索按钮操作
 */
function handleQuery() {
  queryForm.pageNo = 1;
  getList();
}

/**
 * 删除
 * @param index 下标
 */
function handleDel(index: number) {
  const row: any = selectUserList.value.splice(index, 1);
  const tableIndex = tableSelectionList.value.findIndex(
    (t) => t.id === row[0].id
  );
  if (tableIndex !== -1) tableSelectionList.value.splice(tableIndex, 1);
  emit('ok', selectUserList.value);
}

/**
 * 提交数据
 */
function submit() {
  addSelectUserList();
  emit('ok', selectUserList.value);
  open.value = false;
}

defineExpose({
  handleOpen,
});

const emit = defineEmits<{
  (event: 'ok', list: any[]): void;
}>();
</script>

<style scoped>
.select-container {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.tag-input {
  margin-right: 10px;
  min-height: 32px;
  width: 100%;
  border-radius: 5px;
  padding: 2px 10px;
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
}

.tag-input > span {
  margin-right: 5px;
}
</style>
