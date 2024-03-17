<!-- 多选用户组件 -->
<template>
  <div class="select-container">
    <el-radio-group v-model="type" @change="changeTypeHandel">
      <el-radio value="any">指定用户</el-radio>
      <el-radio value="leader">负责人</el-radio>
    </el-radio-group>
    <div v-if="type === 'any'" class="tag-input">
      <el-tag v-if="currentRow?.name">{{ currentRow?.name }}</el-tag>
    </div>
    <el-button v-if="type === 'any'" type="primary" @click="handleOpen">
      <el-icon>
        <Edit/>
      </el-icon>
      选择
    </el-button>
    <el-tag v-if="type === 'leader'"
    >注意：当该级负责人不存在时会自动寻找上级负责人
    </el-tag>
    <el-tag v-if="type === 'leader'"
    >如果找不到一个可用的上级则发起失败
    </el-tag>
    <el-select
      v-if="type === 'leader'"
      v-model="currentLeader"
      @change="handleCurrentLeaderChange"
    >
      <el-option
        v-for="config in leaderConfig"
        :key="config.id"
        :label="config.nameS"
        :value="config.id"
      >{{ config.nameS }}
      </el-option>
    </el-select>
  </div>
  <el-dialog v-model="open" title="选择人" width="1200px" append-to-body>
    <el-form :inline="true" :model="queryForm" class="demo-form-inline">
      <el-form-item label="用户名称">
        <el-input v-model="queryForm.name" clearable placeholder="用户名称"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table ref="tableRef" v-loading="loading" :data="list">
      <el-table-column label="序号" type="index" width="100"/>
      <el-table-column label="账号名称" align="center" prop="name"/>
      <el-table-column label="部门" align="center" prop="deptName"/>
      <el-table-column label="手机号" align="center" prop="phone"/>
      <el-table-column label="邮箱" align="center" prop="email"/>
      <el-table-column label="创建时间" align="center" prop="createTime"/>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button link type="primary" @click="handleCurrentChange(scope.row)"
          >选择
          </el-button>
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

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="open = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {reactive, ref, watch} from 'vue';
import {listForBMPN} from '@/api/user';

const props = defineProps({
  user: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
const type = ref('any');

const leaderConfig = [
  {
    nameS: '直接负责人(本部)',
    id: '${assigneeLeader0}',
    name: '${assigneeLeader0Name}',
  },
  {
    nameS: '第二级负责人',
    id: '${assigneeLeader1}',
    name: '${assigneeLeader1Name}',
  },
  {
    nameS: '第三级负责人',
    id: '${assigneeLeader2}',
    name: '${assigneeLeader2Name}',
  },
];

// 表格实例
const tableRef = ref();

// 选择的行
const currentRow = ref<any>();
const currentLeader = ref<any>('${assigneeLeader0}');

watch(
  () => props.user,
  async () => {
    currentRow.value = props.user;
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
const list = ref<any[]>([]);
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

  const {data} = await listForBMPN({
    pageNum: queryForm.pageNo,
    pageSize: queryForm.pageSize,
    name: queryForm.name,
  });
  list.value = data.records;
  total.value = Number(data.total);
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
 * 选择行事件
 * @param val 选择的行数据
 */
function handleCurrentChange(val: any) {
  currentRow.value = val;
  emit('ok', {id: val.id, name: val.name});
  open.value = false;
}

function handleCurrentLeaderChange(val: any) {
  currentLeader.value = val;
  currentRow.value.id = val;
  for (const leaderConfigElement of leaderConfig) {
    if (leaderConfigElement.id === val) {
      currentRow.value.name = leaderConfigElement.name;
      break;
    }
  }
  emit('ok', {id: currentRow.value.id, name: currentRow.value.name});
}

const changeTypeHandel = (val) => {
  console.log(val)
  if (val === 'any') {
    console.log('暂不写');
  } else if (val === 'leader') {
    handleCurrentLeaderChange(currentLeader.value);
  }
};

defineExpose({
  handleOpen,
});

const emit = defineEmits<{
  (event: 'ok', currentRow: any): void;
}>();
</script>

<style scoped>
.select-container {
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
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
