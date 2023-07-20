<script lang="ts" setup>
import {useI18n} from 'vue-i18n';
import {ref} from 'vue';
import getGroupUser from "@/api/group";
import {useAppStore} from "@/store";
import AddGroup from "@/views/usercenter/group/components/AddGroup.vue";

const {t} = useI18n();

const appStore = useAppStore();

interface statuEI {
  name?: string;
  searchStatus?: boolean;
  clickLoading: boolean;
  addModel: boolean;
}

const statuEs = ref<statuEI>({name: undefined, clickLoading: false, addModel: false});
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
getData(pagination)


const getDataB = async () => {
  statuEs.value.searchStatus = true;
  // 获取日数据 pagination.value.current pagination.value.pageSize
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
  console.log(record);
};
const addOnclick = () => {
  statuEs.value.addModel = true;
}

</script>

<template>
  <a-card direction="vertical">
    <a-table :data="tableData" :pagination="pagination">
      <template #columns>
        <a-space direction="vertical">
          <a-input-search :allow-clear="true" :loading="statuEs.searchStatus" :model-value="statuEs.name"
                          :placeholder="$t('usercenter.group.search.tip')" :style="{width:'320px'}" search-button
                          style="margin-bottom: 1rem" @search="getDataB()" @press-enter="getDataB()">
            <template #button-icon>
              <icon-search/>
            </template>
            <template #button-default>
              {{ $t('usercenter.group.search') }}
            </template>
          </a-input-search>
          <a-space direction="vertical">
            <a-button :loading="statuEs.clickLoading" type="primary" @click="addOnclick()">
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
            <a-button @click="readAGroup(record)">查看</a-button>
          </template>
        </a-table-column>
      </template>
    </a-table>
    <a-modal
      v-model:visible="statuEs.addModel"
      :draggable="true"
      :footer="false"
      :fullscreen="appStore.modelFullscreen"
      :width="1500"
    >
      <template #title>
        {{ $t('usercenter.group.add') }}
      </template>
      <add-group/>
    </a-modal>
  </a-card>
</template>

<style lang="less" scoped></style>
