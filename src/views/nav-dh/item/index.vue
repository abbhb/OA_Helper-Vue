<script lang="ts" setup>
import {computed, h, reactive, ref} from 'vue';
import {getColor} from '@/utils/color-index';
import {useAppStore} from '@/store';
import {IconSearch} from '@arco-design/web-vue/es/icon';
import {Message} from '@arco-design/web-vue';
import {addNavItem, deleteItem, getCategorizeSelectOptionsList, navItemList, updateNavItem,} from '@/api/nav';
import {MdEditor} from 'md-editor-v3';
import AvatarImage from '@/components/image/AvatarImage.vue';
import ImageUpload from '@/components/image/ImageUpload.vue';

interface statuEI {
  clickLoading: boolean;
  model?: boolean;
  modelTitle?: string;
  modelType?: string;
  name?: string;
  selectCate?: string;
}

const statuEs = ref<statuEI>({
  clickLoading: false,
  model: false,
  modelTitle: '导航项',
  name: '',
  selectCate: '',
  modelType: 'add',
});
const form = reactive({
  id: '',
  name: '',
  path: '',
  image: '',
  introduction: '',
  categorizeId: '',
  type: 0,
  content: '',
});

const appStore = useAppStore();
const tableData = ref([]);

const categorizeData = ref([]);
/**
 *  :fieldNames="{
 *       key: 'value',
 *       title: 'label',
 *       children: 'items'
 *     }"
 *     官方虽然有api来指定字段，但还是需要添加根节点，不如手写
 * @param table
 */

const initData = async () => {
  const {data} = await getCategorizeSelectOptionsList();
  categorizeData.value = data;
};

initData();

const getData = async (pagination) => {
  const {data} = await navItemList(
    pagination.value.current,
    pagination.value.pageSize,
    statuEs.value.name,
    statuEs.value.selectCate
  );
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
  const {data} = await navItemList(
    pagination.value.current,
    pagination.value.pageSize,
    statuEs.value.name,
    statuEs.value.selectCate
  );
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
  form.categorizeId = '';
  form.content = '';
  form.image = '';
  form.path = '';
  form.introduction = '';
  form.type = 0;
};

const editHandel = (record) => {
  statuEs.value.modelTitle = '编辑导航项';
  statuEs.value.modelType = 'edit';
  form.id = record.id;
  form.name = record.name;
  form.categorizeId = record.categorizeId;
  form.content = record.content;
  form.image = record.image;
  form.path = record.path;
  form.introduction = record.introduction;
  form.type = record.type;
  statuEs.value.model = true;
};
const addHandel = (record) => {
  statuEs.value.modelTitle = '添加导航项';
  statuEs.value.modelType = 'add';
  statuEs.value.model = true;
};
const delHandel = async (record) => {
  const {data} = await deleteItem(record.id);
  Message.success(data);
  getDataB();
};
const handleCancel = () => {
  cleanForm();
};
const update = async (done) => {
  const forms = ref({
    id: form.id,
    name: form.name,
    categorizeId: form.categorizeId,
    content: form.content,
    image: form.image,
    path: form.path,
    introduction: form.introduction,
    type: form.type,
  });
  try {
    const {data} = await updateNavItem(forms.value);
    Message.success(data);
    done(true);
    getDataB();
  } catch (e) {
    done(false);
  }
};
const add = async (done) => {
  const forms = ref({
    name: form.name,
    categorizeId: form.categorizeId,
    content: form.content,
    image: form.image,
    path: form.path,
    introduction: form.introduction,
    type: form.type,
  });
  try {
    const {data} = await addNavItem(forms.value);
    Message.success(data);
    done(true);
    getDataB();
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

const handleSuccess = (data) => {
  // r为data
  form.image = data;
  Message.success('上传成功!');
};
</script>

<template>
  <a-card>
    <a-select
      v-model:model-value="statuEs.selectCate"
      :style="{ width: '320px' }"
      allow-clear
      placeholder="仅显示某分类"
      @change="getDataB"
    >
      <a-option
        v-for="fenlei in categorizeData"
        :key="fenlei.value"
        :value="fenlei.value"
      >{{ fenlei.label }}
      </a-option
      >
    </a-select>
    <a-table
      :scrollbar="true"
      :scroll="{y:600}"
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
          :width="200"
          title="导航项名称"
        >
          <template #cell="{ record }">
            {{ $t(record.name) }}
          </template>
        </a-table-column>
        <a-table-column :width="100" title="图标">
          <template #cell="{ record }">
            <AvatarImage :avatar="record.image" :key="record.image" :name="record.name"/>
          </template>
        </a-table-column>

        <a-table-column
          :ellipsis="true"
          :width="200"
          title="路径"
          tooltip="path"
        >
          <template #cell="{ record }">
            {{ record.path }}
          </template>
        </a-table-column>
        <a-table-column
          :ellipsis="true"
          :width="300"
          title="介绍"
          tooltip="introduction"
        >
          <template #cell="{ record }">
            {{ record.introduction }}
          </template>
        </a-table-column>
        <a-table-column
          :ellipsis="true"
          :width="300"
          title="分类"
          tooltip="categorizeName"
        >
          <template #cell="{ record }">
            <a-tag :color="getColor(record.categorizeId)">{{
                record.categorizeName
              }}
            </a-tag>
          </template>
        </a-table-column>
        <a-table-column :width="100" title="模式">
          <template #cell="{ record }">
            <a-tag :color="getColor(record.type)">{{
                record.type ? '带Markdown' : '纯跳转'
              }}
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
      :width="1280"
      unmount-on-close
      @close="handleCancel()"
      @before-ok="handelOk"
    >
      <a-form :model="form">
        <a-form-item
          field="name"
          label="项名"
          label-col-flex="80px"
          tooltip="请填写分类名"
        >
          <a-input v-model="form.name" placeholder="请填写分类名"></a-input>
        </a-form-item>
        <a-form-item
          field="categorizeId"
          label="导航分类"
          label-col-flex="80px"
        >
          <a-select
            v-model:model-value="form.categorizeId"
            :style="{ width: '320px' }"
            placeholder="请选择导航分类"
          >
            <a-option
              v-for="fenlei in categorizeData"
              :key="fenlei.value"
              :value="fenlei.value"
            >{{ fenlei.label }}
            </a-option
            >
          </a-select>
        </a-form-item>
        <a-form-item
          field="path"
          label="导航地址"
          label-col-flex="80px"
          tooltip="请填写导航地址"
        >
          <a-input v-model="form.path" placeholder="请填写导航地址"></a-input>
        </a-form-item>

        <a-form-item
          field="introduction"
          label="导航介绍"
          label-col-flex="80px"
          tooltip="请填写导航介绍"
        >
          <a-input
            v-model="form.introduction"
            placeholder="请填写导航介绍"
            type="textarea"
          ></a-input>
        </a-form-item>
        <a-form-item
          field="image"
          label="导航图标"
          label-col-flex="80px"
          tooltip="允许为空"
        >
          <ImageUpload
            :draggable="true"
            :image="form.image"
            url="./api/common/uploadimage"
            @on-success="handleSuccess"
          />
        </a-form-item>

        <a-form-item field="type" label="导航类型" label-col-flex="80px">
          <a-select
            v-model:model-value="form.type"
            :style="{ width: '320px' }"
            placeholder="请选择导航类型"
          >
            <a-option :value="0">纯导航</a-option>
            <a-option :value="1">带Markdown文档</a-option>
          </a-select>
        </a-form-item>

        <a-form-item
          v-if="form.type === 1"
          field="type"
          label="导航文档"
          label-col-flex="80px"
        >
          <MdEditor v-model:model-value="form.content"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<style lang="less" scoped></style>
