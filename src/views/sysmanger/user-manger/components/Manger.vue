<script lang="ts" setup>
  import { useI18n } from 'vue-i18n';
  import { computed, ref } from 'vue';
  import { useAppStore } from '@/store';
  import { GroupUserFront } from '@/api/group';
  import {getUserListManger, updataUserByAdmin, updataUserStatusByAdmin, UserManger} from '@/api/user';
  import { Message } from '@arco-design/web-vue';
  import AvatarImage from '@/components/image/AvatarImage.vue';
  import { getColor } from '@/utils/color-index';
  import { deptListTree } from '@/api/dept';
  import { Role, roleTagList } from '@/api/role';
  import ImageUpload from '@/components/image/ImageUpload.vue';

  const { t } = useI18n();
  const appStore = useAppStore();

  interface statuEI {
    name?: string;
    searchStatus?: boolean;
    clickLoading: boolean;
    modelstatus: boolean;
    modelType: string;
    modelTitle: string;
    modelData?: GroupUserFront;
    deptId?: string;
    formModel: boolean;
    refreshKey: number;
    jilian:boolean;
  }

  const statuEs = ref<statuEI>({
    name: '',
    clickLoading: false,
    modelstatus: false,
    modelType: 'add',
    modelTitle: 'syscenter.user.manger.add.button',
    deptId: '1',
    formModel: false,
    refreshKey: 1,
    jilian:true,
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

  const tableData = ref<UserManger[]>([]);
  const deptTreeData = ref([]);
  const rolesStore = ref<Role[]>([]);

  const initSelect = async () => {
    const { data } = await roleTagList();
    rolesStore.value = data;
  };
  initSelect();
  const initDeptTree = async () => {
    const { data } = await deptListTree();
    deptTreeData.value = data;
  };
  initDeptTree();
  const getData = async (pagination) => {
    const { data } = await getUserListManger({
      pageNum: pagination.value.current,
      pageSize: pagination.value.pageSize,
      name: statuEs.value.name,
      cascade: statuEs.value.jilian ? 1 : 0,
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
    statuEs.value.searchStatus = true;
    const { data } = await getUserListManger({
      pageNum: pagination.value.current,
      pageSize: pagination.value.pageSize,
      name: statuEs.value.name,
      cascade:statuEs.value.jilian?1:0,
      deptId:
        statuEs.value.deptId && statuEs.value.deptId.length >= 1
          ? statuEs.value.deptId[0]
          : undefined,
    });
    statuEs.value.searchStatus = false;
    tableData.value = data.records;
    pagination.value.total = Number(data.total);
  };
  const editAGroup = (record) => {
    statuEs.value.modelData = record;
    statuEs.value.modelstatus = true;
    statuEs.value.modelType = 'edit';
    statuEs.value.modelTitle = 'syscenter.user.manger.edit.button';

    // 数据传入
    form.value.deptId = record.deptId;
    form.value.id = record.id;
    form.value.avatar = record.avatar;
    form.value.status = record.status;
    form.value.sex = record.sex;
    form.value.username = record.username;
    form.value.name = record.name;
    const sadas = [];
    if (record.roles) {
      record.roles.forEach((item) => {
        sadas.push(item.id);
      });
    }
    form.value.roles = sadas;
    form.value.email = record.email;
    form.value.phone = record.phone;
    form.value.studentId = record.studentId;
    form.value.password = '';
  };

  const refreshData = () => {
    getDataB();
  };

  const IBan = async (record) => {
    if (record.status === 1) {
      // 封禁
      const {data} = await updataUserStatusByAdmin(record.id, '0');
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

  const handleBeforeOk = (done) => {
    if (statuEs.value.modelType === 'edit') {
      handelEditOK(done);
    } else {
      Message.error('无此类别');
      done(false);
    }
  };
  const handleModelCancel = () => {
    statuEs.value.modelstatus = false;
    // 表单数据清除
    form.value.deptId = '';
    form.value.id = '';
    form.value.avatar = '';
    form.value.status = 1;
    form.value.sex = '男';
    form.value.username = '';
    form.value.roles = [];
    form.value.email = '';
    form.value.phone = '';
    form.value.studentId = '';
    form.value.password = '';
  };

  const handleSuccess = (data) => {
    // r为data
    if (data.indexOf('http') !== -1) {
      // eslint-disable-next-line prefer-destructuring
      form.value.avatar = data.split('aistudio/')[1];
    } else {
      form.value.avatar = data;
    }
    Message.success('上传成功!');
  };
  const changeJiLiHandel = () => {
    pagination.value.current = 1;
    getDataB();

  }
</script>

<template>
  <div class="container">
    <div class="left-side">
      <div style="padding: 2px 2px 2px 2px;margin-bottom: 3px;display: flex;align-items: center;">
        <span>包含下级部门用户</span>
        <a-switch v-model:model-value="statuEs.jilian" style="margin-left: auto" type="round" @change="changeJiLiHandel"/>
      </div>


      <a-tree
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
        <a-table :data="tableData" :pagination="pagination">
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
              <a-space direction="vertical">
                <a-button
                  :loading="statuEs.clickLoading"
                  type="primary"
                  @click="Message.info('暂时仅支持通过oauth2认证登录!')"
                >
                  {{ $t('syscenter.user.manger.add') }}
                </a-button>
              </a-space>
              <a-divider class="split-line" style="margin: 3px" />
            </a-space>

            <a-table-column
              :sortable="{ sortDirections: ['ascend', 'descend'] }"
              :title="$t(`syscenter.user.manger.id`)"
              :width="120"
              data-index="id"
            ></a-table-column>
            <a-table-column
              :sortable="{ sortDirections: ['ascend', 'descend'] }"
              :title="$t(`syscenter.user.manger.name`)"
              data-index="name"
            ></a-table-column>
            <a-table-column
              :sortable="{ sortDirections: ['ascend', 'descend'] }"
              :title="$t(`syscenter.user.manger.username`)"
              data-index="username"
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
            <a-table-column
              :sortable="{ sortDirections: ['ascend', 'descend'] }"
              :title="$t(`syscenter.user.manger.roles`)"
              :width="220"
            >
              <template #cell="{ record }">
                <a-tag
                  v-for="(role, index) of record.roles"
                  :key="index"
                  :color="getColor(role.sort)"
                  bordered
                  >{{ role.name }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column
              :title="$t(`syscenter.user.manger.control`)"
              :width="220"
            >
              <template #cell="{ record }">
                <a-button @click="editAGroup(record)"
                  >{{ $t('syscenter.user.manger.control.edit') }}
                </a-button>
                <a-button
                  :status="record.status === 1 ? 'danger' : 'success'"
                  @click="IBan(record)"
                >
                  <span v-if="record.status === 1">{{
                    $t('syscenter.user.manger.control.banned')
                  }}</span>
                  <span v-else>{{
                    $t('syscenter.user.manger.control.Nobanned')
                  }}</span>
                </a-button>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-card>
      <a-modal
        v-model:visible="statuEs.modelstatus"
        :draggable="false"
        :fullscreen="appStore.modelFullscreen"
        :title="$t(statuEs.modelTitle)"
        :width="720"
        unmount-on-close
        @cancel="handleModelCancel"
        @before-ok="handleBeforeOk"
      >
        <a-form :model="form">
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item
                :label="$t('syscenter.user.manger.name')"
                :tooltip="$t('syscenter.user.manger.name.tip')"
                field="name"
                label-col-flex="80px"
              >
                <a-input
                  v-model="form.name"
                  :placeholder="$t('syscenter.user.manger.name.tip')"
                ></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item
                :label="$t('syscenter.user.manger.username')"
                field="username"
                label-col-flex="80px"
              >
                <a-input
                  v-model="form.username"
                  :placeholder="$t('syscenter.user.manger.username.tip')"
                  disabled
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item
                :label="$t('syscenter.user.manger.sex')"
                field="sex"
                label-col-flex="80px"
              >
                <a-select
                  v-model:model-value="form.sex"
                  :style="{ width: '320px' }"
                  default-value="男"
                  placeholder="Please select sex"
                >
                  <a-option value="男">男</a-option>
                  <a-option value="女">女</a-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="28">
            <a-col :span="12">
              <a-form-item
                :label="$t('syscenter.user.manger.phone')"
                field="phone"
                label-col-flex="80px"
              >
                <a-input
                  v-model="form.phone"
                  :placeholder="$t('syscenter.user.manger.phone.tip')"
                  inputmode="phone"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                :label="$t('syscenter.user.manger.studentId')"
                field="studentId"
                label-col-flex="80px"
              >
                <a-input
                  v-model="form.studentId"
                  :placeholder="$t('syscenter.user.manger.studentId.tip')"
                ></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="statuEs.formModel" :gutter="28">
            <a-col :span="12">
              <a-form-item
                :label="$t('syscenter.user.manger.email')"
                field="email"
                label-col-flex="80px"
              >
                <a-input
                  v-model="form.email"
                  :placeholder="$t('syscenter.user.manger.email.tip')"
                  inputmode="email"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-tag color="green"
                >请注意，此处电子邮箱涉及用户安全邮箱!勿轻易改动
              </a-tag>
            </a-col>
          </a-row>
          <a-row :gutter="28">
            <a-col :span="10">
              <a-form-item
                :label="$t('syscenter.user.manger.status')"
                :tooltip="$t('syscenter.user.manger.status.tip')"
                field="status"
                label-col-flex="80px"
              >
                <a-radio-group v-model:model-value="form.status">
                  <a-radio :value="1"
                    >{{ $t('syscenter.user.manger.status.1') }}
                  </a-radio>
                  <a-radio :value="0"
                    >{{ $t('syscenter.user.manger.status.0') }}
                  </a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="14">
              <a-form-item
                :label="$t('syscenter.user.manger.dept')"
                :tooltip="$t('syscenter.user.manger.dept.tip')"
                field="status"
                label-col-flex="80px"
              >
                <!-- field-names 属性不能和插槽一起使用 -->
                <a-tree-select
                  v-model:model-value="form.deptId"
                  :data="deptTreeData"
                  :field-names="{
                    key: 'id',
                    title: 'deptName',
                    children: 'children',
                  }"
                  :placeholder="
                    $t('syscenter.dept-manger.dept.form.tip.parentId')
                  "
                  @change="console.log(form.deptId)"
                >
                </a-tree-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item
            :label="$t('syscenter.user.manger.roles')"
            :tooltip="$t('syscenter.user.manger.roles.tip')"
            field="status"
            label-col-flex="80px"
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
          </a-form-item>
          <a-form-item
            :label="$t('syscenter.user.manger.avatar')"
            :tooltip="$t('syscenter.user.manger.avatar.tip')"
            field="avatar"
            label-col-flex="80px"
          >
            <ImageUpload
              :draggable="true"
              :image="form.avatar"
              url="./api/common/uploadimage"
              @on-success="handleSuccess"
            />
          </a-form-item>
          <a-form-item
            :label="$t('syscenter.user.manger.highModel')"
            :tooltip="$t('syscenter.user.manger.highModel.tip')"
            field="model"
            label-col-flex="80px"
          >
            <a-checkbox v-model:model-value="statuEs.formModel" :value="true"
              >高级模式
            </a-checkbox>
          </a-form-item>
        </a-form>
      </a-modal>
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
