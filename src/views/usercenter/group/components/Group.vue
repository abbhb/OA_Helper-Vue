<script lang="ts" setup>
import {useI18n} from 'vue-i18n';
import {ref} from 'vue';
import {deleteGroup, forceDeleteGroup, getGroupUser, GroupUserFront} from '@/api/group';
import {useAppStore} from '@/store';
import GroupAdd from '@/views/usercenter/group/components/GroupAdd.vue';
import GroupEdit from '@/views/usercenter/group/components/GroupEdit.vue';
import {Message} from "@arco-design/web-vue";

const {t} = useI18n();

const appStore = useAppStore();

interface statuEI {
  name?: string;
  searchStatus?: boolean;
  clickLoading: boolean;
  addModel: boolean;
  modelType: string;
  modelData?: GroupUserFront;
}

const statuEs = ref<statuEI>({
  name: '',
  clickLoading: false,
  addModel: false,
  modelType: 'add',
});
const tableData = ref([
  {
    id: '16112312431241',
    name: '测试分组名',
    count: 1,
    createTime: '2023-03-12 20:12:23',
    createUserName: '谁创建的',
  },
]);
const getData = async (pagination) => {
  // 获取日数据 pagination.value.current pagination.value.pageSize
  const {data} = await getGroupUser(
    pagination.value.current,
    pagination.value.pageSize,
    statuEs.value.name
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
  statuEs.value.searchStatus = true;
  console.log(statuEs.value);
  const {data} = await getGroupUser(
    pagination.value.current,
    pagination.value.pageSize,
    statuEs.value.name
  );
  statuEs.value.searchStatus = false;
  tableData.value = data.records;
  pagination.value.total = Number(data.total);
};
const readAGroup = (record) => {
  statuEs.value.modelData = record;
  statuEs.value.addModel = true;
  statuEs.value.modelType = 'edit';
};
const delAGroup = async (record) => {
  const {data} = await deleteGroup({
    id: record.id,
  });
  Message.success(data);
  // 删除完刷新数据
  getData(pagination);
};
const forceDelAGroup = async (record) => {
  const {data} = await forceDeleteGroup({
    id: record.id,
  });
  Message.success(data);
  // 删除完刷新数据
  getData(pagination);
};

const addOnclick = () => {
  statuEs.value.addModel = true;
  statuEs.value.modelType = 'add';
};
const handleCancel = () => {
  getData(pagination);
};

const handleItemClose = () => {
  statuEs.value.addModel = false;
  getData(pagination);
};
</script>

<template>
  <a-card direction="vertical">
    <a-table :data="tableData" :pagination="pagination">
      <template #columns>
        <a-space direction="vertical">
          <a-input-search
            v-model:model-value="statuEs.name"
            :allow-clear="true"
            :loading="statuEs.searchStatus"
            :placeholder="$t('usercenter.group.search.tip')"
            :style="{ width: '320px' }"
            search-button
            style="margin-bottom: 1rem"
            @clear="getDataB()"
            @search="getDataB()"
            @press-enter="getDataB()"
          >
            <template #button-icon>
              <icon-search/>
            </template>
            <template #button-default>
              {{ $t('usercenter.group.search') }}
            </template>
          </a-input-search>
          <a-space direction="vertical">
            <a-button
              :loading="statuEs.clickLoading"
              type="primary"
              @click="addOnclick()"
            >
              {{ $t('usercenter.group.add') }}
            </a-button>
          </a-space>
          <a-divider class="split-line" style="margin: 3px"/>
        </a-space>

        <a-table-column
          :sortable="{ sortDirections: ['ascend', 'descend'] }"
          :title="$t(`usercenter.group.id`)"
          data-index="id"
        ></a-table-column>
        <a-table-column
          :sortable="{ sortDirections: ['ascend', 'descend'] }"
          :title="$t(`usercenter.group.name`)"
          data-index="name"
        ></a-table-column>
        <a-table-column
          :sortable="{ sortDirections: ['ascend', 'descend'] }"
          :title="$t(`usercenter.group.count`)"
          data-index="count"
        ></a-table-column>
        <a-table-column
          :sortable="{ sortDirections: ['ascend', 'descend'] }"
          :title="$t(`usercenter.group.createTime`)"
          data-index="createTime"
        ></a-table-column>
        <a-table-column
          :sortable="{ sortDirections: ['ascend', 'descend'] }"
          :title="$t(`usercenter.group.createUserName`)"
        >
          <template #cell="{ record }">
            <a-tag bordered color="green">{{ record.createUserName }}</a-tag>
          </template>
        </a-table-column>
        <a-table-column :title="$t(`usercenter.group.control`)">
          <template #cell="{ record }">
            <a-button @click="readAGroup(record)">{{
                $t('usercenter.group.control.read')
              }}
            </a-button>
            <a-button @click="delAGroup(record)">{{
                $t('usercenter.group.control.del')
              }}
            </a-button>
            <a-popconfirm :content="$t('usercenter.group.control.q_del.tip')" @ok="forceDelAGroup(record)">
              <a-button status="danger" type="primary">
                <template #icon>
                  <icon-delete/>
                </template>
                <!-- Use the default slot to avoid extra spaces -->
                <template #default>强制删除</template>
              </a-button>
            </a-popconfirm>
          </template>
        </a-table-column>
      </template>
    </a-table>
    <a-modal
      v-model:visible="statuEs.addModel"
      :draggable="true"
      :footer="false"
      :fullscreen="appStore.modelFullscreen"
      :hide-cancel="false"
      :width="1520"
      unmount-on-close
      @close="handleCancel()"
    >
      <template #title>
        <span v-if="statuEs.modelType === 'add'">{{
            $t('usercenter.group.add')
          }}</span>
        <span v-else>{{ $t('usercenter.group.edit') }}</span>
      </template>
      <GroupAdd v-if="statuEs.modelType === 'add'" @close="handleItemClose()"/>
      <GroupEdit
        v-else-if="statuEs.modelType === 'edit'"
        :group-data="statuEs.modelData"
        @close="handleItemClose()"
      />
    </a-modal>
  </a-card>
</template>

<style lang="less" scoped>
.arco-btn-size-medium {
  margin-inline: 2px;
}
</style>
