<script lang="ts" setup>
import {computed, reactive, ref} from 'vue';
import {getColor} from '@/utils/color-index';
import {menuList, MenuManger} from '@/api/menu';
import {setChildrenUndefined} from '@/utils/utils';
import {useAppStore} from '@/store';
import IconSelect from './components/iconSelect/index.vue';

interface statuEI {
  locale?: string;
  state?: string;
  clickLoading: boolean;
  model?: boolean;
  modelTitle?: string;
}

const statuEs = ref<statuEI>({
  locale: '',
  state: '',
  clickLoading: false,
  model: true,
  modelTitle: '菜单',
});
const form = reactive({
  id: '',
  parentId: '',
  type: '',
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
const getDataB = async () => {
  console.log(statuEs.value.locale);
  // const {data} = await getGroupUser(
  //   statuEs.value.name
  // );
  // statuEs.value.searchStatus = false;
  // tableData.value = data;
};

const stateChange = computed(() => (status: any) => {
  return status === 1 || status === '1' ? '正常' : '停用';
});
const editHandel = (record) => {
  statuEs.value.modelTitle = '编辑菜单';
  statuEs.value.model = true;
};
const addHandel = (record) => {
  statuEs.value.modelTitle = '添加菜单';
  statuEs.value.model = true;
};
const delHandel = (record) => {
  statuEs.value.modelTitle = '删除菜单';
  statuEs.value.model = true;
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
        row-key="id"
      >
        <template #columns>
          <a-space direction="vertical">
            <a-space direction="horizontal">
              <label>{{ $t('syscenter.menu-manger.menu.locale') }}</label>
              <a-input
                v-model:model-value="statuEs.locale"
                :allow-clear="true"
                :placeholder="$t('syscenter.menu-manger.menu.tip.locale')"
                :style="{ width: '320px' }"
              >
              </a-input>
              <label>{{ $t('syscenter.menu-manger.menu.state') }}</label>
              <a-select v-model:model-value="statuEs.state" allow-clear>
                <a-option value="1">正常</a-option>
                <a-option value="0">停用</a-option>
              </a-select>
              <a-button type="primary">
                <template #icon>
                  <icon-search/>
                </template>
                <!-- Use the default slot to avoid extra spaces -->
                <template #default>Search</template>
              </a-button>
              <a-button type="outline">
                <template #icon>
                  <icon-refresh/>
                </template>
                <!-- Use the default slot to avoid extra spaces -->
                <template #default>{{
                    $t('syscenter.menu-manger.menu.refresh')
                  }}
                </template>
              </a-button>
            </a-space>

            <a-space direction="vertical">
              <a-button :loading="statuEs.clickLoading" type="primary">
                {{ $t('syscenter.menu-manger.menu.control.add') }}
              </a-button>
            </a-space>
            <a-divider class="split-line" style="margin: 3px"/>
          </a-space>

          <a-table-column :title="$t(`syscenter.menu-manger.menu.locale`)">
            <template #cell="{ record }">
              {{ $t(record.locale) }}
            </template>
          </a-table-column>
          <a-table-column
            :title="$t(`syscenter.menu-manger.menu.icon`)"
            data-index="icon"
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
          >
          </a-table-column>
          <a-table-column :title="$t(`syscenter.menu-manger.menu.state`)">
            <template #cell="{ record }">
              <a-tag :color="getColor(record.status)">
                {{ stateChange(record.status) }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column
            :title="$t(`syscenter.menu-manger.menu.create_time`)"
            data-index="createTime"
          >
          </a-table-column>
          <a-table-column :title="$t(`syscenter.menu-manger.menu.control`)">
            <template #cell="{ record }">
              <a-button @click="editHandel(record)">{{
                  $t('syscenter.menu-manger.menu.control.edit')
                }}
              </a-button>
              <a-button @click="addHandel(record)">{{
                  $t('syscenter.menu-manger.menu.control.add.item')
                }}
              </a-button>
              <a-button @click="delHandel(record)">{{
                  $t('syscenter.menu-manger.menu.control.delete')
                }}
              </a-button>
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
      @ok="handelOk()"
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
                <template #tree-slot-title="{title}">
                  {{ $t(title) }}
                </template>
                <template #label="{data}">
                  {{ $t(data.label) }}
                </template>
              </a-tree-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item :label="$t('syscenter.menu-manger.menu.form.type')" field="type" label-col-flex="100px">
              <a-radio-group v-model:model-value="form.type">
                <a-radio value="M">{{ $t('syscenter.menu-manger.menu.form.type.M') }}</a-radio>
                <a-radio value="C">{{ $t('syscenter.menu-manger.menu.form.type.C') }}</a-radio>
                <a-radio value="F">{{ $t('syscenter.menu-manger.menu.form.type.F') }}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item :label="$t('syscenter.menu-manger.menu.form.icon')" field="icon" label-col-flex="100px">
              <IconSelect v-model:active-icon="form.icon"></IconSelect>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="16">
            <a-form-item field="value4" label="Value 4" label-col-flex="100px">
              <a-input v-model="form.value4" placeholder="please enter..."/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="value5" label="Value 5" label-col-flex="80px">
              <a-input v-model="form.value5" placeholder="please enter..."/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </a-card>
</template>

<style lang="less" scoped></style>
