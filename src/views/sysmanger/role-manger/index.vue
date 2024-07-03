<script lang="ts" setup>
  import { computed, h, reactive, ref } from 'vue';
  import { getColor } from '@/utils/color-index';
  import {
    addrole,
    deleterole,
    listDataScopes,
    roleList,
    RoleManger,
    updaterole,
  } from '@/api/role';
  import { useAppStore } from '@/store';
  import { IconSearch } from '@arco-design/web-vue/es/icon';
  import { Message } from '@arco-design/web-vue';
  import {deptListForBPM, deptListTree} from '@/api/dept';

  interface statuEI {
    clickLoading: boolean;
    model?: boolean;
    modelTitle?: string;
    modelType?: string;
    deptFuziliandong?: boolean;
  }

  const deptLists = ref<any[]>([]);
  const tableRef = ref(null);
  const statuEs = ref<statuEI>({
    clickLoading: false,
    model: false,
    deptFuziliandong: false,
    modelTitle: '角色',
    modelType: 'add',
  });
  const canSelectData = ref([]);
  const form = reactive({
    id: '',
    name: '',
    key: '',
    sort: 1,
    status: 1,
    deptIds: [],
    dataScope: 1,
    zhankai: false,
    quanxuan: false,
    fuziliandong: false,
  });

  const appStore = useAppStore();
  const tableData = ref<RoleManger[]>([]);

  const allCheckedKeys = ref([]);
  const allExpandedKeys = ref([]);

  const selectedKeys = ref([]);
  const checkedKeys = ref([]);
  const expandedKeys = ref([]);
  const treeData = ref([]);


  const deptTreeData = ref([]);
  const deptAllCheckedKeys = ref([]);
  const deptAllExpandedKeys = ref([]);

  const deptSelectedKeys = ref([]);
  const deptExpandedKeys = ref([]);

  /**
   *  :fieldNames="{
   *       key: 'value',
   *       title: 'label',
   *       children: 'items'
   *     }"
   *     官方虽然有api来指定字段，但还是需要添加根节点，不如手写
   * @param table
   */


  const getList = async () => {
    const { data } = await deptListTree();
    deptTreeData.value = data;
    getDeptAllId(data);
    deptAllCheckedKeys.value = deptAllExpandedKeys.value;
    if (deptExpandedKeys.value?.length === 0) {
      toggleDeptExpanded();
    }

  };



  const tableDataToTreeData = (table: any) => {
    const newas = [];
    console.log(table);
    table.forEach((item) => {
      if (item.parentId === '0') {
        const thischild = [];
        if (item.children) {
          item.children.forEach((asd) => {
            if (asd.parentId === item.id) {
              if (asd.children) {
                const thisssachild = [];
                asd.children.forEach((asdd) => {
                  thisssachild.push({ key: asdd.id, title: asdd.locale });
                });
                thischild.push({
                  key: asd.id,
                  title: asd.locale,
                  children: thisssachild,
                });
              } else {
                thischild.push({ key: asd.id, title: asd.locale });
              }
            }
          });
          newas.push({ key: item.id, title: item.locale, children: thischild });
        } else {
          newas.push({ key: item.id, title: item.locale });
        }
      }
    });
  };
  const getAllId = (yuan) => {
    if (yuan) {
      for (let i = 0; i < yuan.length; i += 1) {
        allExpandedKeys.value.push(yuan[i].id);
        if (yuan[i].children) {
          if (yuan[i].children.length > 0) {
            getAllId(yuan[i].children);
          }
        }
      }
    }
  };
  const canSelectDataScope = async () => {
    const { data } = await listDataScopes();
    canSelectData.value = data;
  };

  const toggleDeptChecked = () => {
    form.deptIds = form.deptIds?.length ? [] : deptAllCheckedKeys.value;
  };
  const toggleDeptExpanded = () => {
    deptExpandedKeys.value = deptExpandedKeys?.value.length
      ? []
      : deptAllExpandedKeys.value;
  };

  const getDeptAllId = (yuan) => {
    if (yuan) {
      for (let i = 0; i < yuan.length; i += 1) {
        deptAllExpandedKeys.value.push(yuan[i].id);
        if (yuan[i].children) {
          if (yuan[i].children.length > 0) {
            getDeptAllId(yuan[i].children);
          }
        }
      }
    }
  };
  const initData = async () => {
    statuEs.value.clickLoading = true;
    const { data } = await roleList();
    tableData.value = data.mangers;
    treeData.value = data.menuMangerList;
    getAllId(data.menuMangerList);
    allCheckedKeys.value = allExpandedKeys.value;
    await canSelectDataScope();
    await getList();
    statuEs.value.clickLoading = false;
  };
  initData();

  const stateChange = computed(() => (status: any) => {
    return status === 1 || status === '1' ? '正常' : '停用';
  });
  const cleanForm = () => {
    form.id = '';
    form.name = '';
    form.key = '';
    form.fuziliandong = false;
    form.quanxuan = false;
    form.deptIds = [];
    form.zhankai = false;
    form.sort = 1;
    form.dataScope = 1;
    form.status = 1;
  };

  const editHandel = (record) => {
    statuEs.value.modelTitle = '编辑角色';
    statuEs.value.modelType = 'edit';
    checkedKeys.value = record.haveKey;
    form.id = record.id;
    form.name = record.roleName;
    form.sort = record.roleSort;
    console.log(deptExpandedKeys.value?.length)
    if (deptExpandedKeys.value?.length === 0) {
      toggleDeptExpanded();
    }
    form.deptIds = record.deptIds;
    form.dataScope = record.dataScope;
    form.status = Number(record.status);
    form.key = record.roleKey;
    statuEs.value.model = true;
  };
  const addHandel = (record) => {
    statuEs.value.modelTitle = '添加角色';
    statuEs.value.modelType = 'add';
    statuEs.value.model = true;
  };
  const delHandel = async (record) => {
    const { data } = await deleterole(record.id);
    Message.success(data);
    initData();
  };
  const handleCancel = () => {
    cleanForm();
  };
  const update = async (done) => {
    const forms = ref<RoleManger>({
      id: form.id,
      roleName: form.name,
      roleSort: form.sort,
      dataScope: form.dataScope,
      deptIds: form.deptIds,
      status: Number(form.status),
      roleKey: form.key,
      haveKey: checkedKeys.value,
    });
    try {
      const { data } = await updaterole(forms.value);

      Message.success(data);
      done(true);
      initData();
    } catch (e) {
      done(false);
    }
  };
  const add = async (done) => {
    const forms = ref<RoleManger>({
      roleName: form.name,
      roleSort: form.sort,
      dataScope: form.dataScope,
      deptIds: form.deptIds,
      status: Number(form.status),
      roleKey: form.key,
      haveKey: checkedKeys.value,
    });
    try {
      const { data } = await addrole(forms.value);

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
  const toggleChecked = () => {
    checkedKeys.value = checkedKeys?.value.length ? [] : allCheckedKeys.value;
  };
  const toggleExpanded = () => {
    expandedKeys.value = expandedKeys?.value.length
      ? []
      : allExpandedKeys.value;
  };


  const onSelect = (newSelectedKeys, event) => {
    // console.log('select: ', newSelectedKeys, event);
  };
  const onCheck = (newCheckedKeys, event) => {
    // console.log('check: ', newCheckedKeys, event);
  };
  const onExpand = (newExpandedKeys, event) => {
    // console.log('expand: ', newExpandedKeys, event);
  };

  const handleSelectionChange = (selectData: any[]) => {

  };
</script>

<template>
  <a-card>
    <a-alert banner center
      >注意:用户侧的角色的更新只会在重新登录后！！！
    </a-alert>
    <a-alert banner center
      >角色排序涉及到权限权重，比如都有管理权限，超级管理员（2）无权管理系统管理员（1）
    </a-alert>
    <a-space>
      <a-table
        :bordered="false"
        :data="tableData"
        :loading="statuEs.clickLoading"
        :pagination="false"
        :size="'medium'"
        row-key="id"
        :scrollbar="true"
        :scroll="{ y: 600 }"
      >
        <template #columns>
          <a-space direction="vertical">
            <a-space direction="vertical">
              <a-button
                :loading="statuEs.clickLoading"
                type="primary"
                @click="addHandel"
              >
                {{ $t('syscenter.role-manger.role.control.add') }}
              </a-button>
            </a-space>
            <a-divider class="split-line" style="margin: 3px" />
          </a-space>

          <a-table-column
            :filterable="{
              filter: (value, record) => record.locale.includes(value),
              slotName: 'locale-filter',
              icon: () => h(IconSearch),
            }"
            :title="$t(`syscenter.role-manger.role.name`)"
          >
            <template #cell="{ record }">
              {{ $t(record.roleName) }}
            </template>
          </a-table-column>
          <a-table-column
            :title="$t(`syscenter.role-manger.role.key`)"
            :width="100"
          >
            <template #cell="{ record }">
              {{ record.roleKey }}
            </template>
          </a-table-column>
          <a-table-column
            :sortable="{
              sortDirections: ['ascend', 'descend'],
            }"
            :title="$t(`syscenter.role-manger.role.sort`)"
            :width="100"
          >
            <template #cell="{ record }">
              {{ record.roleSort }}
            </template>
          </a-table-column>
          <a-table-column
            :title="$t(`syscenter.role-manger.role.state`)"
            :width="130"
          >
            <template #cell="{ record }">
              <a-tag :color="getColor(record.status)">
                {{ stateChange(record.status) }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column
            :title="$t(`syscenter.role-manger.role.create_time`)"
            :width="130"
            data-index="createTime"
          >
          </a-table-column>
          <a-table-column :title="$t(`syscenter.role-manger.role.control`)">
            <template #cell="{ record }">
              <a-button @click="editHandel(record)"
                >{{ $t('syscenter.role-manger.role.control.edit') }}
              </a-button>
              <a-button @click="addHandel(record)"
                >{{ $t('syscenter.role-manger.role.control.add.item') }}
              </a-button>
              <a-popconfirm
                content="危险！将会级联删除子角色，确认删除?"
                @ok="delHandel(record)"
              >
                <a-button
                  >{{ $t('syscenter.role-manger.role.control.delete') }}
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
      <el-scrollbar :height="600" style="overflow-y: hidden">
        <a-form :model="form" style="overflow-y: hidden">
          <div>
            <div>
              <a-form-item
                :label="$t('syscenter.role-manger.role.form.name')"
                :tooltip="$t('syscenter.role-manger.role.form.name.help')"
                field="name"
                label-col-flex="80px"
              >
                <a-input
                  v-model="form.name"
                  :placeholder="$t('syscenter.role-manger.role.form.tip.name')"
                ></a-input>
              </a-form-item>
            </div>
          </div>
          <div>
            <div>
              <a-form-item
                :label="$t('syscenter.role-manger.role.form.key')"
                field="key"
                label-col-flex="80px"
              >
                <a-input v-model="form.key"></a-input>
              </a-form-item>
            </div>
            <div>
              <a-form-item
                :label="$t('syscenter.role-manger.role.form.sort')"
                field="sort"
                label-col-flex="80px"
              >
                <a-input-number
                  v-model="form.sort"
                  :max="100"
                  :min="1"
                ></a-input-number>
              </a-form-item>
            </div>
          </div>
          <div>
            <div>
              <a-form-item
                :label="$t('syscenter.role-manger.role.form.status')"
                :tooltip="$t('syscenter.role-manger.role.form.status.help')"
                field="status"
                label-col-flex="80px"
              >
                <a-radio-group v-model:model-value="form.status">
                  <a-radio :value="1"
                  >{{ $t('syscenter.role-manger.role.form.status.1') }}
                  </a-radio>
                  <a-radio :value="0"
                  >{{ $t('syscenter.role-manger.role.form.status.0') }}
                  </a-radio>
                </a-radio-group>
              </a-form-item>
            </div>
          </div>
          <div>
            <a-card title="数据权限">
              <a-form-item
                label="数据可见性"
                field="dataScope"
                label-col-flex="80px"
              >
                <a-select v-model:model-value="form.dataScope">
                  <a-option
                    v-for="(item, index) in canSelectData"
                    :key="index"
                    :value="item.type"
                  >{{ item.name }}</a-option
                  >
                </a-select>
              </a-form-item>

              <div v-if="form?.dataScope === 3">
                <div> 不包含子部门！请手动选择所需要的所有部门</div>
                <a-button-group style="margin-bottom: 20px">
                  <a-button type="primary" @click="toggleDeptChecked">
                    {{ form.deptIds?.length ? '反全选' : '全选' }}
                  </a-button>
                  <a-button type="primary" @click="toggleDeptExpanded">
                    {{ deptExpandedKeys?.length ? '折叠' : '展开全部' }}
                  </a-button>
                </a-button-group>
                <a-tree
                  v-model:checked-keys="form.deptIds"
                  v-model:expanded-keys="deptExpandedKeys"
                  v-model:selected-keys="deptSelectedKeys"
                  :check-strictly="!statuEs.deptFuziliandong"
                  :checkable="true"
                  :data="deptTreeData"
                  :field-names="{
              key: 'id',
              title: 'deptName',
              children: 'children',
            }"
                  style="overflow-y: scroll; height: 20rem"
                >
                </a-tree>
              </div>
            </a-card>
          </div>
          <div>
            <div>
              <a-card title="授权菜单">
                <a-button-group style="margin-bottom: 20px">
                  <a-button type="primary" @click="toggleChecked">
                    {{ checkedKeys?.length ? 'deselect all' : 'select all' }}
                  </a-button>
                  <a-button type="primary" @click="toggleExpanded">
                    {{ expandedKeys?.length ? 'fold' : 'unfold' }}
                  </a-button>
                </a-button-group>
                <a-tree
                  v-model:checked-keys="checkedKeys"
                  v-model:expanded-keys="expandedKeys"
                  v-model:selected-keys="selectedKeys"
                  style="overflow-y: scroll; height: 30rem"
                  :check-strictly="!form.fuziliandong"
                  :checkable="true"
                  :data="treeData"
                  :field-names="{
                  key: 'id',
                  title: 'locale',
                  children: 'children',
                  icon: 'customIcon',
                }"
                  @check="onCheck"
                  @expand="onExpand"
                  @select="onSelect"
                >
                  <template #title="data">
                    {{ $t(data.locale) }}
                  </template>
                </a-tree>
              </a-card>
            </div>
          </div>
        </a-form>
      </el-scrollbar>

    </a-modal>
  </a-card>
</template>

<style lang="less" scoped></style>
