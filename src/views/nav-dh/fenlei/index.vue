<script lang="ts" setup>
import {computed, h, reactive, ref} from 'vue';
import {RoleManger,} from '@/api/role';
import {useAppStore} from '@/store';
import {IconSearch} from '@arco-design/web-vue/es/icon';
import {Message} from '@arco-design/web-vue';
import {addNavFenlei, deleteCategorize, navFenLeiList, updateNavFenlei} from "@/api/nav";
import {deptListTree} from "@/api/dept";

interface statuEI {
  clickLoading: boolean;
  model?: boolean;
  modelTitle?: string;
  modelType?: string;
  name?: string;
}

const statuEs = ref<statuEI>({
  clickLoading: false,
  model: false,
  modelTitle: '导航分类',
  name: '',
  modelType: 'add',
});
const form = reactive({
  id: '',
  name: '',
  visibility: 0,
  depts: [],
});

const appStore = useAppStore();
const tableData = ref<RoleManger[]>([]);

const allCheckedKeys = ref([]);
const allExpandedKeys = ref([]);

const selectedKeys = ref([]);
const checkedKeys = ref([]);
const expandedKeys = ref([]);
const treeData = ref([]);


const deptData = ref([]);
/**
 *  :fieldNames="{
 *       key: 'value',
 *       title: 'label',
 *       children: 'items'
 *     }"
 *     官方虽然有api来指定字段，但还是需要添加根节点，不如手写
 * @param table
 */

const toggleExpanded = () => {
  expandedKeys.value = expandedKeys?.value.length
    ? []
    : allExpandedKeys.value;
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
const initData = async () => {
  const {data} = await deptListTree();
  deptData.value = data;

  getAllId(data);
  toggleExpanded();
};


initData();

const getData = async (pagination) => {
  const {data} = await navFenLeiList(pagination.value.current, pagination.value.pageSize, statuEs.value.name);
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
  pagination.value.current = 1;
  statuEs.value.clickLoading = true;
  const {data} = await navFenLeiList(pagination.value.current, pagination.value.pageSize, statuEs.value.name);
  tableData.value = data.records;
  pagination.value.total = Number(data.total);
  statuEs.value.clickLoading = false;

};

const stateChange = computed(() => (status: any) => {
  return status === 1 || status === '1' ? '正常' : '停用';
});
const cleanForm = () => {
  form.id = '';
  form.name = '';
  form.depts = [];
  form.visibility = 0;
};


const editHandel = (record) => {
  statuEs.value.modelTitle = '编辑导航分类';
  statuEs.value.modelType = 'edit';
  checkedKeys.value = record.haveKey;
  form.id = record.id;
  form.name = record.name;
  const deptaa = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < record.depts.length; i++) {
    deptaa.push(record.depts[i].id);
  }
  form.depts = deptaa;
  form.visibility = record.visibility;
  statuEs.value.model = true;
};
const addHandel = (record) => {
  statuEs.value.modelTitle = '添加导航分类';
  statuEs.value.modelType = 'add';
  statuEs.value.model = true;
};
const delHandel = async (record) => {
  const {data} = await deleteCategorize(record.id);
  Message.success(data);
  getDataB()
};
const handleCancel = () => {
  cleanForm();
};
const update = async (done) => {
  const forms = ref({
    id: form.id,
    name: form.name,
    visibility: form.visibility,
    depts: form.depts,
  });
  try {
    const {data} = await updateNavFenlei(forms.value);
    Message.success(data);
    done(true);
    getDataB()
  } catch (e) {
    done(false);
  }
};
const add = async (done) => {
  if (form.visibility === 1 && form.depts.length === 0) {
    Message.error("请最少选择一个部门")
    return;
  }
  const forms = ref({
    name: form.name,
    visibility: form.visibility,
    depts: form.depts,
  });
  try {
    const {data} = await addNavFenlei(forms.value);
    Message.success(data);
    done(true);
    getDataB()
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

const onSelect = (newSelectedKeys, event) => {
  // console.log('select: ', newSelectedKeys, event);
};
const onCheck = (newCheckedKeys, event) => {
  // console.log('check: ', newCheckedKeys, event);
};
const onExpand = (newExpandedKeys, event) => {
  // console.log('expand: ', newExpandedKeys, event);
};
</script>

<template>
  <a-card>
    <a-table
      :bordered="false"
      :data="tableData"
      :loading="statuEs.clickLoading"
      :pagination="pagination"
      row-key="id"
    >
      <template #columns>
        <a-space direction="vertical">
          <a-space direction="vertical">
            <a-button
              :loading="statuEs.clickLoading"
              type="primary"
              @click="addHandel"
            >
              添加
            </a-button>
          </a-space>
          <a-divider class="split-line" style="margin: 3px"/>
        </a-space>

        <a-table-column
          :filterable="{
              filter: (value, record) => record.locale.includes(value),
              slotName: 'locale-filter',
              icon: () => h(IconSearch),
            }"
          title="分类名称"
        >
          <template #cell="{ record }">
            {{ $t(record.name) }}
          </template>
        </a-table-column>
        <a-table-column :width="100" title="可见性">
          <template #cell="{ record }">
            <a-tag v-if="record.visibility!==1" color="green">全部可见</a-tag>
            <a-tag v-else color="red">仅部门可见</a-tag>
          </template>
        </a-table-column>

        <a-table-column :width="130" title="可见部门">
          <template #cell="{ record }">
            <a-tag v-if="record.visibility!==1" color="#fc00ffff">全部部门</a-tag>
            <a-tag v-for="dept in record.depts" :key="dept.id">
              {{ dept.deptName }}
            </a-tag>
          </template>
        </a-table-column>

        <a-table-column title="控制区">
          <template #cell="{ record }">
            <a-button @click="editHandel(record)">编辑</a-button>
            <a-button @click="delHandel(record)">删除</a-button>
          </template>
        </a-table-column>
      </template>
    </a-table>
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
        <a-form-item
          field="name"
          label="分类名"
          label-col-flex="80px"
          tooltip="请填写分类名"
        >
          <a-input v-model="form.name" placeholder="请填写分类名"></a-input>
        </a-form-item>
        <a-form-item
          field="visibility"
          label="可见性"
          label-col-flex="80px"
        >
          <a-radio-group v-model:model-value="form.visibility">
            <a-radio :value="0">全部可见</a-radio>
            <a-radio :value="1">仅部门可见</a-radio>
          </a-radio-group>

        </a-form-item>
        <a-form-item
          v-if="form.visibility===1"
          field="depts"
          label="可见部门"
          label-col-flex="80px"
        >
          <a-tree
            v-model:checked-keys="form.depts"
            v-model:expanded-keys="expandedKeys"
            v-model:selected-keys="selectedKeys"
            :check-strictly="false"
            :checkable="true"
            :data="deptData"
            :field-names="{
              key: 'id',
              title: 'deptName',
              children: 'children',
            }"
            style="overflow-y: scroll; height: 20rem"
          >
          </a-tree>
        </a-form-item>

      </a-form>
    </a-modal>
  </a-card>
</template>

<style lang="less" scoped></style>
