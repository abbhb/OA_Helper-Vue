<script lang="ts" setup>
  import { useI18n } from 'vue-i18n';
  import { computed, reactive, ref } from 'vue';
  import { useAppStore } from '@/store';
  import { GroupUserFront } from '@/api/group';
  import {
    getUserListManger,
    listForLevels,
    updataUserByAdmin,
    updataUserStatusByAdmin,
    UserManger,
  } from '@/api/user';
  import { Message } from '@arco-design/web-vue';
  import AvatarImage from '@/components/image/AvatarImage.vue';
  import { deptListTree, DeptManger } from '@/api/dept';
  import { Role, roleTagList } from '@/api/role';
  import {cloneDeep} from "lodash";

  const { t } = useI18n();
  const appStore = useAppStore();

  const emit = defineEmits(['commitUser']);
  const props = defineProps({
    preSelectUser: {
      default: [],
      require: false,
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

  const form = ref<UserManger>({
    id: '',
    name: '',
    username: '',
    sex: '',
    studentId: '',
    phone: '',
    avatar: '',
    roles: [],
    deptId: '',
    status: 1,
    email: '',
    password: '',
  });
  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
  });
  const tableData = ref<UserManger[]>([]);
  const deptTreeData = ref([]);
  const needExpend = ref([]);
  const rolesStore = ref<Role[]>([]);

  const initSelect = async () => {
    const { data } = await roleTagList();
    rolesStore.value = data;
  };
  const initLevelsSelect = async () => {
    const { data } = await listForLevels();
    statuEs.value.levelsOptions = data;
  };
  initSelect();
  initLevelsSelect();

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
  const getData = async (pagination) => {
    const { data } = await getUserListManger({
      pageNum: pagination.value.current,
      pageSize: pagination.value.pageSize,
      name: statuEs.value.name,
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
    tableData.value = data.records;
    pagination.value.total = data.total;
  };
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
      getData(pagination);
    },
    onPageSizeChange(pageSize) {
      pagination.value.pageSize = pageSize;
      getData(pagination);
    },
    showTotal: () => `共 ${11} 条`,
  });
  getData(pagination);

  const getDataB = async () => {
    statuEs.value.refreshKey += 1;
    pagination.value.current = 1;
    statuEs.value.searchStatus = true;
    const { data } = await getUserListManger({
      pageNum: pagination.value.current,
      pageSize: pagination.value.pageSize,
      name: statuEs.value.name,
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
    statuEs.value.searchStatus = false;
    tableData.value = data.records;
    pagination.value.total = Number(data.total);
  };

  const refreshData = () => {
    getDataB();
  };

  const IBan = async (record) => {
    if (record.status === 1) {
      // 封禁
      const { data } = await updataUserStatusByAdmin(record.id, '0');
      Message.success(data);
      refreshData();
      return;
    }
    await updataUserStatusByAdmin(record.id, '1');
    refreshData();

    // 解封
  };

  const handleCancel = () => {
    getData(pagination);
  };

  const getRolesNameList = computed(() => (roles) => {
    const roleKeyList = [];
    roles.forEach((item) => {
      roleKeyList.push(item.name);
    });
    return roleKeyList;
  });
  const selectedRowKeys = ref();

  if (props.preSelectUser?.length>0){
    selectedRowKeys.value = cloneDeep(props.preSelectUser)
  }

  const handelEditOK = async (done) => {
    const rolesIdList = [];
    form.value.roles.forEach((role) => {
      rolesIdList.push({ id: role });
    });
    // 拿取form数据进行修改，成功就done(true);
    try {
      const { data } = await updataUserByAdmin({
        id: form.value.id,
        deptId: form.value.deptId,
        username: form.value.username,
        studentId: form.value.studentId,
        status: form.value.status,
        roles: rolesIdList,
        name: form.value.name,
        sex: form.value.sex,
        phone: form.value.phone,
        avatar: form.value.avatar,
        email: form.value.email,
      });
      refreshData();
      Message.success(data);
      done(true);
    } catch (e) {
      done(false);
    }
  };

  const selectCommit = () => {
    emit('commitUser', selectedRowKeys);
  };

  const changeJiLiHandel = () => {
    pagination.value.current = 1;
    getDataB();
  };
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
        block-node
        @select="getDataB"
      />
    </div>
    <div class="right-side">
      <a-card direction="vertical">
        <a-table
          v-model:selectedKeys="selectedRowKeys"
          :data="tableData"
          :hoverable="true"
          :pagination="pagination"
          :row-selection="rowSelection"
          row-key="id"
        >
          <template #columns>
            <a-space direction="vertical">
              <a-input-search
                v-model:model-value="statuEs.name"
                :allow-clear="true"
                :loading="statuEs.searchStatus"
                :placeholder="$t('syscenter.user.manger.search.tip')"
                :style="{ width: '320px' }"
                search-button
                style="margin-bottom: 1rem"
                @clear="getDataB()"
                @search="getDataB()"
                @press-enter="getDataB()"
              >
                <template #button-icon>
                  <icon-search />
                </template>
                <template #button-default>
                  {{ $t('syscenter.user.manger.search') }}
                </template>
              </a-input-search>
              <a-space direction="horizontal">
                <div>
                  <span>仅查看学号存在</span>
                  <a-switch
                    v-model:model-value="statuEs.mustHaveStudentId"
                    type="round"
                    :unchecked-value="0"
                    :checked-value="1"
                    @change="refreshData"
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
                    @change="refreshData"
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

            <a-table-column
              :sortable="{ sortDirections: ['ascend', 'descend'] }"
              :title="$t(`syscenter.user.manger.name`)"
              data-index="name"
            ></a-table-column>
            <a-table-column
              :sortable="{ sortDirections: ['ascend', 'descend'] }"
              :title="$t(`syscenter.user.manger.studentId`)"
              data-index="studentId"
            ></a-table-column>
            <a-table-column
              :sortable="{ sortDirections: ['ascend', 'descend'] }"
              :title="$t(`syscenter.user.manger.avatar`)"
            >
              <template #cell="{ record }">
                <AvatarImage
                  :key="Number(record.id) + Number(statuEs.refreshKey)"
                  :avatar="record.avatar"
                  :name="record.name"
                />
              </template>
            </a-table-column>
            <a-table-column
              :sortable="{ sortDirections: ['ascend', 'descend'] }"
              :title="$t(`syscenter.user.manger.sex`)"
              data-index="sex"
            ></a-table-column>
            <a-table-column
              :sortable="{ sortDirections: ['ascend', 'descend'] }"
              :title="$t(`syscenter.user.manger.createTime`)"
              :width="120"
              data-index="createTime"
            ></a-table-column>
            <a-table-column
              :sortable="{ sortDirections: ['ascend', 'descend'] }"
              :title="$t(`syscenter.user.manger.updateTime`)"
              :width="120"
              data-index="updateTime"
            ></a-table-column>
            <a-table-column
              :sortable="{ sortDirections: ['ascend', 'descend'] }"
              :title="$t(`syscenter.user.manger.status`)"
              :width="90"
            >
              <template #cell="{ record }">
                <a-tag :color="record.status === 1 ? 'green' : 'red'" bordered
                  >{{ record.status === 1 ? '正常' : '封禁' }}
                </a-tag>
              </template>
            </a-table-column>
          </template>
        </a-table>
<!--        <a-button @click="console.log(selectedRowKeys)">查看</a-button>-->
        <a-button :type="'primary'" @click="selectCommit">确定 </a-button>
      </a-card>
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
  }
</style>
