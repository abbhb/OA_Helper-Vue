<script setup lang="ts">
  // 查询参数
  import { reactive, ref, watch } from 'vue';
  import { listForSelectUser } from '@/api/user';
  import { GroupUserFront } from '@/api/group';
  import { deptListTree, DeptManger } from '@/api/dept';
  import _ from "lodash";

  // [{id:"",name:""}...]
  const props = defineProps({
    list: {
      type: Array,
      default: () => [],
    },
    ignoreList: {
      type: Boolean,
      default: false,
    },
  });

  interface statuEI {
    levelsSelectO?: string[];

    name?: string;
    searchStatus?: boolean;
    clickLoading: boolean;
    mustHaveStudentId?: number;

    modelstatus: boolean;
    modelType: string;
    modelTitle: string;
    modelData?: GroupUserFront;
    deptId?: string;
    formModel: boolean;
    refreshKey: number;
    jilian: boolean;
    levelsOptions: string[];
  }

  const statuEs = ref<statuEI>({
    name: '',
    levelsOptions: [],
    levelsSelectO: [],
    clickLoading: false,
    mustHaveStudentId: 0,
    modelstatus: false,
    modelType: 'add',
    modelTitle: 'syscenter.user.manger.add.button',
    deptId: '1',
    formModel: false,
    refreshKey: 1,
    jilian: true,
  });
  const needExpend = ref([]);

  // 列表内容数量
  const total = ref(0);
  // 列表是否加载
  const loading = ref(true);
  // 表格实例
  const tableRef = ref();
  // 列表返回值
  // eslint-disable-next-line vue/no-dupe-keys
  const list = ref<any[]>([]);
  const queryForm = reactive({
    name: '',
    pageNo: 1,
    pageSize: 10,
  });
  // 表格选择的数据
  const tableSelectionList = ref<any[]>([]);
  export interface SelectUserType {
    id?: string;
    name?: string;
  }
  // 选择的用户信息
  const selectUserList = ref<SelectUserType[]>([]);
  const deptTreeData = ref([]);
  // eslint-disable-next-line vue/no-setup-props-destructure
  // selectUserList.value = props.list;
  /**
   * 搜索按钮操作
   */
  function handleQuery() {
    queryForm.pageNo = 1;
    getList();
  }
  const findDepartmentsWithNonEmptyChildren = (departments: DeptManger[]) => {
    const result: string[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const department of departments) {
      if (department.children.length > 0) {
        result.push(department.id);
      }
      if (department.children && department.children.length > 0) {
        // 递归查找子部门
        result.push(
          ...findDepartmentsWithNonEmptyChildren(department.children)
        );
      }
    }

    return result;
  };
  const initDeptTree = async () => {
    const { data } = await deptListTree();
    deptTreeData.value = data;
    needExpend.value = findDepartmentsWithNonEmptyChildren(data);
  };
  initDeptTree();
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
   * 查询列表
   */
  const getList = async () => {
    loading.value = true;
    const { data } = await listForSelectUser({
      pageNum: queryForm.pageNo,
      pageSize: queryForm.pageSize,
      name: queryForm.name,
      cascade: statuEs.value.jilian ? 1 : 0,
      mustHaveStudentId: statuEs.value.mustHaveStudentId,
      level:
        statuEs.value.levelsSelectO.length > 0
          ? statuEs.value.levelsSelectO.join(',').trim()
          : undefined,
      deptId:
        statuEs.value.deptId && statuEs.value.deptId.length >= 1
          ? statuEs.value.deptId[0]
          : undefined,
    });
    list.value = data.records;
    addSelectUserList();

    total.value = Number(data.total);
    loading.value = false;

    reloadTableSelect();
  };

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
  });

  const pagination = ref({
    current: 1,
    defaultPageSize: 10,
    total: 0,
    pageSize: 5,
    pageSizeOptions: [5, 10, 20, 50],
    showPageSize: true,
    showJumper: true,
    onChange(page) {
      pagination.value.current = page;
      queryForm.pageNo = pagination.value.current;
      queryForm.pageSize = pagination.value.pageSize;
      getList();
    },
    onPageSizeChange(pageSize) {
      pagination.value.pageSize = pageSize;
      pagination.value.current = 1;
      queryForm.pageNo = pagination.value.current;
      queryForm.pageSize = pageSize;
      getList();
    },
    showTotal: () => `共 ${11} 条`,
  });

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
    addSelectUserList();
    // ignoreList 开启始终排除list中的id
    let result = selectUserList.value;
    if (props.ignoreList) {
      const newResult = [];
      selectUserList.value.forEach((item) => {
        // @ts-ignore
        const index = props.list.findIndex((t) => t.id === item.id);
        if (index === -1) {
          newResult.push(item);
        }
      });
      result = newResult;
    }
    emit('ok', result);
  };
  // const ignoreList = _.cloneDeep(props.list)
  // // @ts-ignore
  // const selectable = (row: any) => (ignoreList.findIndex((t) => t.id === row.id)===-1)||(!props.ignoreList)


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

  const emit = defineEmits<{
    (event: 'ok', list: any[]): void;
  }>();
  const changeJiLiHandel = () => {
    pagination.value.current = 1;
    getList();
  };
  watch(
    () => props.list,
    async () => {
      selectUserList.value = props.list;
    },
    { deep: true, immediate: true }
  );
  const delTableSelect = (id: string) => {
    const tableIndex = tableSelectionList.value.findIndex((t) => t.id === id);
    if (tableIndex !== -1) tableSelectionList.value.splice(tableIndex, 1);
  };

  defineExpose({
    delTableSelect,
  });
  getList();
</script>

<template>
  <div class="container">
    <div class="left-side">
      <div
        style="
          padding: 2px 2px 2px 2px;
          margin-bottom: 3px;
          display: flex;

          align-items: center;
        "
      >
        <span>包含下级部门用户</span>
        <a-switch
          v-model:model-value="statuEs.jilian"
          style="margin-left: auto"
          type="round"
          @change="changeJiLiHandel"
        />
      </div>
      <div style="overflow-y: auto; max-height: 550px">
        <a-tree
          v-model:expanded-keys="needExpend"
          v-model:selected-keys="statuEs.deptId"
          :data="deptTreeData"
          :default-expand-all="true"
          :default-selected-keys="['1']"
          :field-names="{
            key: 'id',
            title: 'deptName',
            children: 'children',
          }"
          :show-line="true"
          @select="getList"
        />
      </div>
    </div>
    <div class="right-side">
      <a-space direction="vertical">
        <!--        <a-input-search-->
        <!--          v-model:model-value="statuEs.name"-->
        <!--          :allow-clear="true"-->
        <!--          :loading="statuEs.searchStatus"-->
        <!--          :placeholder="$t('syscenter.user.manger.search.tip')"-->
        <!--          :style="{ width: '320px' }"-->
        <!--          search-button-->
        <!--          style="margin-bottom: 1rem"-->
        <!--          @clear="getList()"-->
        <!--          @search="getList()"-->
        <!--          @press-enter="getList()"-->
        <!--        >-->
        <!--          <template #button-icon>-->
        <!--            <icon-search />-->
        <!--          </template>-->
        <!--          <template #button-default>-->
        <!--            {{ $t('syscenter.user.manger.search') }}-->
        <!--          </template>-->
        <!--        </a-input-search>-->
        <a-space direction="horizontal">
          <div>
            <span>仅查看学号存在</span>
            <a-switch
              v-model:model-value="statuEs.mustHaveStudentId"
              type="round"
              :unchecked-value="0"
              :checked-value="1"
              @change="getList"
            />
          </div>
          <div>
            <span>年级筛选</span>
            <a-select
              v-model="statuEs.levelsSelectO"
              :style="{ width: '460px' }"
              placeholder="通过年级筛选..."
              multiple
              :loading="statuEs.clickLoading"
              :max-tag-count="5"
              allow-search
              allow-clear
              :scrollbar="true"
              @change="getList"
            >
              <a-option
                v-for="(item, key) in statuEs.levelsOptions"
                :key="key"
                :value="item"
                >{{ item }}</a-option
              >
            </a-select>
          </div>
        </a-space>

        <a-divider class="split-line" style="margin: 3px" />
      </a-space>
      <div>
        <el-form
          :inline="true"
          :model="queryForm"
          class="demo-form-inline"
          @submit.prevent
        >
          <el-form-item label="用户名称">
            <el-input
              v-model="queryForm.name"
              clearable
              placeholder="用户名称"
              @keyup.enter="getList"
              @clear="getList"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">查询</el-button>
          </el-form-item>
        </el-form>

        <el-table
          ref="tableRef"
          v-loading="loading"
          :data="list"
          :height="450"
          :max-height="450"
          @select="handleSelectionChange"
          @select-all="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"/>
          <el-table-column label="序号" type="index" width="100"/>
          <el-table-column label="账号昵称" align="center" prop="name" />
          <el-table-column label="用户名" align="center" prop="username" />
          <el-table-column label="部门" align="center" prop="deptName" />
          <el-table-column label="手机号" align="center" prop="phone" />
          <el-table-column label="邮箱" align="center" prop="email" />
          <el-table-column label="创建时间" align="center" prop="createTime" />
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
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .arco-btn-size-medium {
    margin-inline: 2px;
  }

  .left-side {
    width: 280px;
    margin-left: 16px;
    padding: 3px 3px 3px 3px;
    border-radius: 3px;
    border: 1px solid var(--color-border-1);
    background-color: var(--color-bg-1);
  }

  .right-side {
    flex: 1;
    overflow: auto;
  }

  .container {
    background-color: var(--color-fill-2);
    padding: 16px 20px;
    padding-bottom: 0;
    display: flex;
    //height: 500px;
  }
</style>
