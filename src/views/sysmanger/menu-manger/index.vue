<script lang="ts" setup>
import {computed, h, reactive, ref} from 'vue';
import {getColor} from '@/utils/color-index';
import {addMenu, menuList, MenuManger} from '@/api/menu';
import {setChildrenUndefined} from '@/utils/utils';
import {useAppStore} from '@/store';
import FunctionalIcons from '@/components/icon/FunctionalIcons/index.vue';
import {IconSearch} from '@arco-design/web-vue/es/icon';
import {Message} from "@arco-design/web-vue";

interface statuEI {
  clickLoading: boolean;
  model?: boolean;
  modelTitle?: string;
  modelType?: string;
}

const statuEs = ref<statuEI>({
  clickLoading: false,
  model: false,
  modelTitle: '菜单',
  modelType: 'add',
});
const form = reactive({
  id: '',
  parentId: '0',
  type: 'M',
  icon: '',
  locale: '',
  name: '',
  path: '',
  sort: 1,
  isFrame: 0,
  isCache: 0,
  isShow: 1,
  status: 1,
  perms: '',
});

const iconList = ref<string[]>([
  'icon-apps',
  'icon-check-circle',
  'icon-clock-circle',
  'icon-info',
  'icon-question-circle',
  'icon-heart-fill',
]);
const appStore = useAppStore();
const tableData = ref<MenuManger[]>([]);
const treeData = ref([{key: '0', title: '根节点'}]);

/**
 *  :fieldNames="{
 *       key: 'value',
 *       title: 'label',
 *       children: 'items'
 *     }"
 *     官方虽然有api来指定字段，但还是需要添加根节点，不如手写
 * @param table
 */
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
                thisssachild.push({key: asdd.id, title: asdd.locale});
              });
              thischild.push({
                key: asd.id,
                title: asd.locale,
                children: thisssachild,
              });
            } else {
              thischild.push({key: asd.id, title: asd.locale});
            }
          }
        });
        newas.push({key: item.id, title: item.locale, children: thischild});
      } else {
        newas.push({key: item.id, title: item.locale});
      }
    }
  });
  const tree = [{key: '0', title: '根节点', children: newas}];
  treeData.value = tree;
};
const initData = async () => {
  statuEs.value.clickLoading = true;
  const {data} = await menuList();
  setChildrenUndefined(data);
  tableData.value = data;
  tableDataToTreeData(data);
  statuEs.value.clickLoading = false;
};
initData();

const stateChange = computed(() => (status: any) => {
  return status === 1 || status === '1' ? '正常' : '停用';
});
const cleanForm = () => {
  form.type = 'M';
  form.id = '';
  form.parentId = '0';
  form.icon = '';
  form.locale = '';
  form.name = '';
  form.path = '';
  form.sort = 1;
  form.isFrame = 0;
  form.isCache = 0;
  form.isShow = 1;
  form.status = 1;
  form.perms = '';
};
const getTypeNext = (formobject) => {
  if (formobject.type === 'M') {
    return 'C';
  }
  if (formobject.type === 'C') {
    return 'F';
  }
  if (formobject.id === 0 || formobject.id === '0') {
    return 'M';
  }
  return 'M';
};
const editHandel = (record) => {
  statuEs.value.modelTitle = '编辑菜单';
  statuEs.value.modelType = 'edit';
  form.type = record.type;
  form.id = record.id;
  form.parentId = record.parentId;
  form.icon = record.icon;
  form.locale = record.locale;
  form.name = record.name;
  form.path = record.path;
  form.sort = record.sort;
  form.isFrame = Number(record.isFrame);
  form.isCache = Number(record.isCache);
  form.isShow = Number(record.isShow);
  form.status = Number(record.status);
  form.perms = record.perms;
  statuEs.value.model = true;
};
const addHandel = (record) => {
  statuEs.value.modelTitle = '添加菜单';
  statuEs.value.modelType = 'add';
  const nextType = getTypeNext(record);
  form.type = nextType;
  form.parentId = record.id;
  statuEs.value.model = true;
};
const delHandel = (record) => {
  console.log(record);
};
const handleCancel = () => {
  cleanForm();
};
const update = async (done) => {
  const forms = ref<MenuManger>({
    id: form.id,
    type: form.type,
    parentId: form.parentId,
    icon: form.icon,
    locale: form.locale,
    name: form.name,
    path: form.path,
    sort: form.sort,
    isFrame: Number(form.isFrame),
    isCache: Number(form.isCache),
    isShow: Number(form.isShow),
    status: Number(form.status),
    perms: form.perms,
  })
  try {
    const {data} = await addMenu(forms.value);
    Message.success(data)
    done(true);
  } catch (e) {
    done(false);
  }
};
const add = async (done) => {

  const forms = ref<MenuManger>({
    type: form.type,
    parentId: form.parentId,
    icon: form.icon,
    locale: form.locale,
    name: form.name,
    path: form.path,
    sort: form.sort,
    isFrame: Number(form.isFrame),
    isCache: Number(form.isCache),
    isShow: Number(form.isShow),
    status: Number(form.status),
    perms: form.perms,
  });
  try {
    const {data} = await addMenu(forms.value);
    Message.success(data)
    done(true);
  } catch (e) {
    done(false);
  }
};
const handelOk = (done) => {
  if (!form.type || form.type === '') {
    Message.error('请选择type');
    done(false);
    return;
  }
  if (form.type === 'C') {
    if (!form.parentId || form.parentId === '') {
      Message.error('请选择父节点');
      done(false);
      return;
    }
    if (Number(form.id) === 0) {
      Message.error('你不能创建根节点');
      done(false);
      return;
    }
    if (form.locale === '') {
      Message.error('请填写locale字段');
      done(false);
      return;
    }
    if (form.name === '') {
      Message.error('name');
      done(false);
      return;
    }
    if (form.path === '') {
      Message.error('请填写locale字段');
      done(false);
      return;
    }
  }
  if (form.type === 'M') {
    if (Number(form.parentId) !== 0) {
      Message.error('此时父节点只能为根节点');
      done(false);
      return;
    }
    if (Number(form.parentId) === 0) {
      Message.error('你不能创建根节点');
      done(false);
      return;
    }
    if (form.locale === '') {
      Message.error('请填写locale字段');
      done(false);
      return;
    }
  }
  if (form.type === 'C') {
    if (form.locale === '') {
      Message.error('请填写locale字段');
      done(false);
      return;
    }
  }
  // 根据form加上statuEs判断
  if (statuEs.value.modelType !== 'add') {
    update(done);
  } else {
    add(done);
  }
};
</script>

<template>
  <a-card>
    <a-space>
      <a-table
        :bordered="false"
        :data="tableData"
        :expandable="{
          defaultExpandAllRows: true,
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
              <a-button :loading="statuEs.clickLoading" type="primary">
                {{ $t('syscenter.menu-manger.menu.control.add') }}
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
            :title="$t(`syscenter.menu-manger.menu.locale`)"
          >
            <template #cell="{ record }">
              {{ $t(record.locale) }}
            </template>
          </a-table-column>
          <a-table-column
            :title="$t(`syscenter.menu-manger.menu.icon`)"
            :width="100"
          >
            <template #cell="{ record }">
              <functional-icons
                :icon="record.icon"
                size="28"
              ></functional-icons>
            </template>
          </a-table-column>
          <a-table-column
            :sortable="{
              sortDirections: ['ascend', 'descend'],
            }"
            :title="$t(`syscenter.menu-manger.menu.sort`)"
            :width="100"
            data-index="sort"
          ></a-table-column>
          <a-table-column
            :title="$t(`syscenter.menu-manger.menu.perms`)"
            data-index="perms"
          ></a-table-column>
          <a-table-column
            :ellipsis="true"
            :title="$t(`syscenter.menu-manger.menu.path`)"
            :tooltip="{ position: 'top' }"
            :width="160"
            data-index="path"
          ></a-table-column>
          <a-table-column
            :title="$t(`syscenter.menu-manger.menu.name`)"
            data-index="name"
            :width="130"
          >
          </a-table-column>
          <a-table-column
            :title="$t(`syscenter.menu-manger.menu.state`)"
            :width="130"
          >
            <template #cell="{ record }">
              <a-tag :color="getColor(record.status)">
                {{ stateChange(record.status) }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column
            :title="$t(`syscenter.menu-manger.menu.create_time`)"
            :width="130"
            data-index="createTime"
          >
          </a-table-column>
          <a-table-column :title="$t(`syscenter.menu-manger.menu.control`)">
            <template #cell="{ record }">
              <a-button @click="editHandel(record)"
              >{{ $t('syscenter.menu-manger.menu.control.edit') }}
              </a-button>
              <a-button @click="addHandel(record)"
              >{{ $t('syscenter.menu-manger.menu.control.add.item') }}
              </a-button>
              <a-popconfirm
                content="危险！将会级联删除子菜单，确认删除?"
                @ok="delHandel(record)"
              >
                <a-button
                >{{ $t('syscenter.menu-manger.menu.control.delete') }}
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
              :label="$t('syscenter.menu-manger.menu.form.parentId')"
              field="parentId"
              label-col-flex="100px"
            >
              <a-tree-select
                v-model:model-value="form.parentId"
                :data="treeData"
                :placeholder="
                  $t('syscenter.menu-manger.menu.form.tip.parentId')
                "
              >
                <template #tree-slot-title="{ title }">
                  {{ $t(title) }}
                </template>
                <template #label="{ data }">
                  {{ $t(data.label) }}
                </template>
              </a-tree-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item
              :label="$t('syscenter.menu-manger.menu.form.type')"
              field="type"
              label-col-flex="100px"
            >
              <a-radio-group v-model:model-value="form.type">
                <a-radio value="M">{{
                    $t('syscenter.menu-manger.menu.form.type.M')
                  }}
                </a-radio>
                <a-radio value="C">{{
                    $t('syscenter.menu-manger.menu.form.type.C')
                  }}
                </a-radio>
                <a-radio value="F">{{
                    $t('syscenter.menu-manger.menu.form.type.F')
                  }}
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="28">
          <a-col :span="14">
            <a-form-item
              v-if="form.type !== 'F'"
              :label="$t('syscenter.menu-manger.menu.form.icon')"
              field="icon"
              label-col-flex="100px"
            >
              <a-select
                v-model:model-value="form.icon"
                :placeholder="$t('syscenter.menu-manger.menu.form.tip.icon')"
                :style="{ width: '320px' }"
                allow-clear
                allow-create
              >
                <a-option
                  v-for="(icon, key) in iconList"
                  :key="key"
                  :value="icon"
                >
                  <functional-icons
                    :icon="icon"
                    size="18"
                    style="margin-right: 10px"
                  ></functional-icons
                  >
                  {{ icon }}
                </a-option>
                <template #prefix>
                  <functional-icons
                    :icon="form.icon"
                    size="18"
                  ></functional-icons>
                </template>
                <template #option="{ data }">
                  <functional-icons
                    :icon="data.value"
                    size="18"
                  ></functional-icons>
                  {{ data.label }}
                </template>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              :label="$t('syscenter.menu-manger.menu.form.sort')"
              field="sort"
              label-col-flex="100px"
            >
              <a-input-number
                v-model="form.sort"
                :max="100"
                :min="1"
                :placeholder="$t('syscenter.menu-manger.menu.form.tip.sort')"
                :style="{ width: '220px' }"
                class="input-demo"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="28">
          <a-col :span="14">
            <a-form-item
              :label="$t('syscenter.menu-manger.menu.form.locale')"
              :tooltip="$t('syscenter.menu-manger.menu.form.locale.tip')"
              field="locale"
              label-col-flex="100px"
            >
              <a-input
                v-model="form.locale"
                :placeholder="$t('syscenter.menu-manger.menu.form.tip.locale')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item
              v-if="form.type !== 'F'"
              :label="$t('syscenter.menu-manger.menu.form.name')"
              field="name"
              label-col-flex="80px"
            >
              <a-input
                v-model="form.name"
                :placeholder="$t('syscenter.menu-manger.menu.form.tip.name')"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="28">
          <a-col :span="14">
            <a-form-item
              v-if="form.type !== 'F'"
              :label="$t('syscenter.menu-manger.menu.form.path')"
              field="path"
              label-col-flex="100px"
            >
              <a-input
                v-model="form.path"
                :placeholder="$t('syscenter.menu-manger.menu.form.tip.path')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item
              :label="$t('syscenter.menu-manger.menu.form.perms')"
              :width="130"
              field="perms"
              label-col-flex="80px"
            >
              <a-input
                v-model="form.perms"
                :placeholder="$t('syscenter.menu-manger.menu.form.tip.perms')"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="28">
          <a-col :span="14">
            <a-form-item
              v-if="form.type !== 'F'"
              :label="$t('syscenter.menu-manger.menu.form.isFrame')"
              :tooltip="$t('syscenter.menu-manger.menu.form.isFrame.help')"
              field="isFrame"
              label-col-flex="100px"
            >
              <a-radio-group v-model:model-value="form.isFrame">
                <a-radio :value="1">{{
                    $t('syscenter.menu-manger.menu.form.isFrame.1')
                  }}
                </a-radio>
                <a-radio :value="0">{{
                    $t('syscenter.menu-manger.menu.form.isFrame.0')
                  }}
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item
              v-if="form.type !== 'F'"
              :label="$t('syscenter.menu-manger.menu.form.isCache')"
              :tooltip="$t('syscenter.menu-manger.menu.form.isCache.help')"
              field="isCache"
              label-col-flex="80px"
            >
              <a-radio-group v-model:model-value="form.isCache">
                <a-radio :value="1">{{
                    $t('syscenter.menu-manger.menu.form.isCache.1')
                  }}
                </a-radio>
                <a-radio :value="0">{{
                    $t('syscenter.menu-manger.menu.form.isCache.0')
                  }}
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="28">
          <a-col :span="14">
            <a-form-item
              v-if="form.type !== 'F'"
              :label="$t('syscenter.menu-manger.menu.form.isShow')"
              :tooltip="$t('syscenter.menu-manger.menu.form.isShow.help')"
              field="isShow"
              label-col-flex="100px"
            >
              <a-radio-group v-model:model-value="form.isShow">
                <a-radio :value="1">{{
                    $t('syscenter.menu-manger.menu.form.isShow.1')
                  }}
                </a-radio>
                <a-radio :value="0">{{
                    $t('syscenter.menu-manger.menu.form.isShow.0')
                  }}
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item
              :label="$t('syscenter.menu-manger.menu.form.status')"
              :tooltip="$t('syscenter.menu-manger.menu.form.status.help')"
              field="status"
              label-col-flex="80px"
            >
              <a-radio-group v-model:model-value="form.status">
                <a-radio :value="1">{{
                    $t('syscenter.menu-manger.menu.form.status.1')
                  }}
                </a-radio>
                <a-radio :value="0">{{
                    $t('syscenter.menu-manger.menu.form.status.0')
                  }}
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </a-card>
</template>

<style lang="less" scoped></style>
