<script lang="ts" setup>
  import { computed, h, reactive, ref } from 'vue';
  import { getColor } from '@/utils/color-index';
  import { setChildrenUndefined } from '@/utils/utils';
  import { useAppStore } from '@/store';
  import { IconSearch } from '@arco-design/web-vue/es/icon';
  import { Message } from '@arco-design/web-vue';
  import {
    addDept,
    deleteDept,
    deptList,
    DeptManger,
    updateDept,
  } from '@/api/dept';
  import { Role, roleTagList } from '@/api/role';
  import {userSelectOnlyXUserList} from "@/api/user";

  interface statuEI {
    clickLoading: boolean;
    model?: boolean;
    modelTitle?: string;
    modelType?: string;
  }

  const statuEs = ref<statuEI>({
    clickLoading: false,
    model: false,
    modelTitle: '部门',
    modelType: 'add',
  });
  const form = reactive({
    id: '',
    parentId: '1',
    leaderId: '',
    deptName: '',
    orderNum: 1,
    phone: '',
    email: '',
    status: 1,
    roles: [],
    leaderRoles: [],
  });

  const appStore = useAppStore();
  const tableData = ref<DeptManger[]>([]);
  const selectTree = ref([]);
  const deptUserList = ref([]);
  const rolesStore = ref<Role[]>([]);
  const buildSelectTree = (tabel: any) => {
    selectTree.value = [];
    tabel.forEach((item) => {
      selectTree.value.push(item);
    });
  };

  const initSelect = async () => {
    const { data } = await roleTagList();
    rolesStore.value = data;
  };
  const initData = async () => {
    statuEs.value.clickLoading = true;
    const { data } = await deptList();
    setChildrenUndefined(data);
    tableData.value = data;
    buildSelectTree(data);
    statuEs.value.clickLoading = false;
  };
  initData();
  initSelect();

  const initDeptLeaderUser = async () => {
    const {data} = await userSelectOnlyXUserList(form.id);
    deptUserList.value = data.options;
  }
  const stateChange = computed(() => (status: any) => {
    return status === 1 || status === '1' ? '正常' : '停用';
  });
  const cleanForm = () => {
    form.id = '';
    form.parentId = '1';
    form.status = 1;
    form.leaderId = '';
    form.deptName = '';
    form.orderNum = 1;
    form.phone = '';
    form.email = '';
    form.status = 1;
    form.roles = [];
    form.leaderRoles = [];
  };

  const editHandel = async (record) => {
    statuEs.value.modelTitle = '编辑';
    statuEs.value.modelType = 'edit';
    form.id = record.id;
    form.parentId = record.parentId;
    form.status = Number(record.status);
    form.deptName = record.deptName;
    form.orderNum = record.orderNum;
    form.leaderId = record.leaderId;
    const sadas = [];
    const sadas2 = [];
    if (record.roles) {
      record.roles.forEach((item) => {
        sadas.push(item.id);
      });
    }
    if (record.leaderRoles) {
      record.leaderRoles.forEach((item) => {
        sadas2.push(item.id);
      });
    }
    form.roles = sadas;
    form.leaderRoles = sadas2;
    await initDeptLeaderUser();
    statuEs.value.model = true;
  };
  const addHandel = (record) => {
    if (record) {
      form.parentId = record.id;
    } else {
      form.parentId = '1';
    }
    statuEs.value.modelTitle = '添加部门';
    statuEs.value.modelType = 'add';
    statuEs.value.model = true;
  };
  const delHandel = async (record) => {
    const { data } = await deleteDept(record.id);
    Message.success(data);
    initData();
  };
  const handleCancel = () => {
    cleanForm();
  };
  const update = async (done) => {
    const dasf = ref<Role[]>([]);
    const dasf2 = ref<Role[]>([]);
    if (form.roles) {
      form.roles.forEach((item) => {
        dasf.value.push({ id: item });
      });
    }
    if (form.leaderRoles) {
      form.leaderRoles.forEach((item) => {
        dasf2.value.push({ id: item });
      });
    }
    const forms = ref<DeptManger>({
      id: form.id,
      parentId: form.parentId,
      deptName: form.deptName,
      leaderId: form.leaderId,
      orderNum: form.orderNum,
      roles: dasf.value,
      leaderRoles: dasf2.value,
      status: Number(form.status),
    });
    try {
      const { data } = await updateDept(forms.value);
      Message.success(data);
      done(true);
      initData();
    } catch (e) {
      done(false);
    }
  };

  const add = async (done) => {
    const dasf = ref<Role[]>([]);
    const dasf2 = ref<Role[]>([]);
    if (form.roles) {
      form.roles.forEach((item) => {
        dasf.value.push({ id: item });
      });
    }
    if (form.leaderRoles) {
      form.leaderRoles.forEach((item) => {
        dasf2.value.push({ id: item });
      });
    }
    const forms = ref<DeptManger>({
      parentId: form.parentId,
      deptName: form.deptName,
      orderNum: form.orderNum,
      roles: dasf.value,
      leaderRoles: dasf2.value,
      status: Number(form.status),
    });
    try {
      const { data } = await addDept(forms.value);
      Message.success(data);
      done(true);
      initData();
    } catch (e) {
      done(false);
    }
  };
  const handelOk = (done) => {
    // 根据form加上statuEs判断
    if (statuEs.value.modelType !== 'add') {
      update(done);
    } else {
      add(done);
    }
  };
</script>

<template>
<!--  todo:// 无法上下滚动-->
  <a-card>
    <a-alert banner center
      >注意:用户侧的部门的更新只会在重新登录后！！！
    </a-alert>
    <a-space>
      <a-table
        :scrollbar="true"
        :scroll="{y:600}"
        :bordered="false"
        :data="tableData"
        :expandable="{
          defaultExpandAllRows: true,
        }"
        :field-names="{
          key: 'id',
          title: 'deptName',
          children: 'children',
        }"
        :loading="statuEs.clickLoading"
        :pagination="false"
        :size="'medium'"
        row-key="id"
      >
        <template
          #locale-filter="{
            filterValue,
            setFilterValue,
            handleFilterConfirm,
            handleFilterReset,
          }"
        >
          <div class="custom-filter">
            <a-space direction="vertical">
              <a-input
                :model-value="filterValue[0]"
                @input="(value) => setFilterValue([value])"
              />
              <div class="custom-filter-footer">
                <a-button @click="handleFilterConfirm">Confirm</a-button>
                <a-button @click="handleFilterReset">Reset</a-button>
              </div>
            </a-space>
          </div>
        </template>
        <template #columns>
          <a-space direction="vertical">
            <a-space direction="vertical">
              <a-button
                :loading="statuEs.clickLoading"
                type="primary"
                @click="addHandel"
              >
                {{ $t('syscenter.dept-manger.dept.control.add') }}
              </a-button>
            </a-space>
            <a-divider class="split-line" style="margin: 3px" />
          </a-space>

          <a-table-column
            :filterable="{
              filter: (value, record) => record.deptName.includes(value),
              slotName: 'locale-filter',
              icon: () => h(IconSearch),
            }"
            :title="$t(`syscenter.dept-manger.dept.name`)"
          >
            <template #cell="{ record }">
              {{ $t(record.deptName) }}
            </template>
          </a-table-column>
          <a-table-column
            :sortable="{
              sortDirections: ['ascend', 'descend'],
            }"
            :title="$t(`syscenter.dept-manger.dept.sort`)"
            :width="100"
            data-index="orderNum"
          ></a-table-column>
          <a-table-column
            :title="$t(`syscenter.dept-manger.dept.leader`)"
            :width="100"
          >
            <template #cell="{ record }">
              {{ record.leader }}
            </template>
          </a-table-column>

          <a-table-column
            :title="$t(`syscenter.dept-manger.dept.phone`)"
            data-index="phone"
            :width="120"

          ></a-table-column>
          <a-table-column
            :ellipsis="true"
            :title="$t(`syscenter.dept-manger.dept.email`)"
            :tooltip="{ position: 'top' }"
            :width="170"
            data-index="email"
          ></a-table-column>
          <a-table-column
            :title="$t(`syscenter.dept-manger.dept.role`)"
            :tooltip="{ position: 'top' }"
            :width="200"
          >
            <template #cell="{ record }">
              <a-tag
                v-for="(role, index) of record.roles"
                :key="index"
                :color="getColor(role.roleSort)"
                bordered
                style="margin-left: 3px"
                >{{ role.roleName }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column
            title="部门负责人角色"
            :tooltip="{ position: 'top' }"
            :width="200"
          >
            <template #cell="{ record }">
              <a-tag
                v-for="(role, index) of record.leaderRoles"
                :key="index"
                :color="getColor(role.roleSort)"
                bordered
                style="margin-left: 3px"
                >{{ role.roleName }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column
            :title="$t(`syscenter.dept-manger.dept.status`)"
            :width="130"
          >
            <template #cell="{ record }">
              <a-tag :color="getColor(record.status)">
                {{ stateChange(record.status) }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column
            :title="$t(`syscenter.dept-manger.dept.create_time`)"
            :width="130"
            data-index="createTime"
          >
          </a-table-column>
          <a-table-column :title="$t(`syscenter.dept-manger.dept.control`)">
            <template #cell="{ record }">
              <a-button @click="editHandel(record)"
                >{{ $t('syscenter.dept-manger.dept.control.edit') }}
              </a-button>
              <a-button @click="addHandel(record)"
                >{{ $t('syscenter.dept-manger.dept.control.add.item') }}
              </a-button>
              <a-popconfirm
                content="危险！将会级联删除子部门，确认删除?"
                @ok="delHandel(record)"
              >
                <a-button
                  >{{ $t('syscenter.dept-manger.dept.control.delete') }}
                </a-button>
              </a-popconfirm>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-space>
    <a-modal
      v-model:visible="statuEs.model"
      :draggable="false"
      :fullscreen="appStore.modelFullscreen"
      :hide-cancel="false"
      :title="statuEs.modelTitle"
      :title-align="'start'"
      :width="700"
      unmount-on-close
      @close="handleCancel()"
      @before-ok="handelOk"
    >
      <a-form :model="form">
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item
              v-if="String(form.id) !== '1'"
              :label="$t('syscenter.dept-manger.dept.form.parentId')"
              field="parentId"
              label-col-flex="100px"
            >
              <!-- field-names 属性不能和插槽一起使用 -->
              <a-tree-select
                v-model:model-value="form.parentId"
                :data="selectTree"
                :field-names="{
                  key: 'id',
                  title: 'deptName',
                  children: 'children',
                }"
                :placeholder="
                  $t('syscenter.dept-manger.dept.form.tip.parentId')
                "
                @change="console.log(form.parentId)"
              >
              </a-tree-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="28">
          <a-col :span="14">
            <a-form-item
              :label="$t('syscenter.dept-manger.dept.form.name')"
              field="deptName"
              label-col-flex="100px"
            >
              <a-input
                v-model="form.deptName"
                :placeholder="$t('syscenter.dept-manger.dept.form.tip.name')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              :label="$t('syscenter.dept-manger.dept.form.sort')"
              field="orderNum"
              label-col-flex="100px"
            >
              <a-input-number
                v-model="form.orderNum"
                :max="100"
                :min="1"
                :placeholder="$t('syscenter.dept-manger.dept.form.tip.sort')"
                :style="{ width: '220px' }"
                class="input-demo"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item
          :tooltip="$t('syscenter.dept-manger.dept.form.leader.tip')"
          field="leaderId"
          label="负责人选择"
          label-col-flex="100px"
        >
          <a-select
            v-model="form.leaderId"
            :placeholder="$t('syscenter.dept-manger.dept.form.tip.leader')"
          >
            <a-option v-for="item in deptUserList" :key="item.id" :value="item.id">{{ item.name }}</a-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="部门角色选择"
        >
          <a-select
            v-model:model-value="form.roles"
            :default-value="[]"
            :scrollbar="true"
            :style="{ width: '360px' }"
            multiple
            placeholder="Please select role"
          >
            <a-option
              v-for="role in rolesStore"
              :key="role.id"
              :tag-props="{ color: getColor(role.roleSort) }"
              :value="role.id"
            >
              {{ role.roleName }}
            </a-option>
          </a-select>
          <a-tag color="green">下级部门也会继承此角色</a-tag>
        </a-form-item>


            <a-form-item
              :label="$t('syscenter.dept-manger.dept.form.status')"
              :tooltip="$t('syscenter.dept-manger.dept.form.status.help')"
              field="status"
              label-col-flex="80px"
            >
              <a-radio-group v-model:model-value="form.status">
                <a-radio :value="1"
                >{{ $t('syscenter.dept-manger.dept.form.status.1') }}
                </a-radio>
                <a-radio :value="0"
                >{{ $t('syscenter.dept-manger.dept.form.status.0') }}
                </a-radio>
              </a-radio-group>
            </a-form-item>


        <a-form-item
          label="部门负责人角色选择"
        >
          <a-select
            v-model:model-value="form.leaderRoles"
            :default-value="[]"
            :scrollbar="true"
            :style="{ width: '360px' }"
            multiple
            placeholder="Please select role"
          >
            <a-option
              v-for="role in rolesStore"
              :key="role.id"
              :tag-props="{ color: getColor(role.roleSort) }"
              :value="role.id"
            >
              {{ role.roleName }}
            </a-option>
          </a-select>
        </a-form-item>

      </a-form>
    </a-modal>
  </a-card>
</template>

<style lang="less" scoped></style>
