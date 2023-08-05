<script lang="ts" setup>
import {useI18n} from 'vue-i18n';
import {ref} from 'vue';
import {useAppStore} from '@/store';
import {GroupUserFront,} from '@/api/group';
import {getUserListManger, UserManger} from '@/api/user';
import {Message} from "@arco-design/web-vue";
import AvatarImage from "@/components/image/AvatarImage.vue";

const {t} = useI18n();

const appStore = useAppStore();

interface statuEI {
  name?: string;
  searchStatus?: boolean;
  clickLoading: boolean;
  modelstatus: boolean;
  modelType: string;
  modelData?: GroupUserFront;
}

const statuEs = ref<statuEI>({
  name: '',
  clickLoading: false,
  modelstatus: false,
  modelType: 'add',
});
const tableData = ref<UserManger[]>([]);
const getData = async (pagination) => {
  const {data} = await getUserListManger({
    pageNum: pagination.value.current,
    pageSize: pagination.value.pageSize,
    name: statuEs.value.name,
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
  statuEs.value.searchStatus = true;
  console.log(statuEs.value);
  const {data} = await getUserListManger({
    pageNum: pagination.value.current,
    pageSize: pagination.value.pageSize,
    name: statuEs.value.name,
  });
  statuEs.value.searchStatus = false;
  tableData.value = data.records;
  pagination.value.total = Number(data.total);
};
const readAGroup = (record) => {
  statuEs.value.modelData = record;
  statuEs.value.modelstatus = true;
  statuEs.value.modelType = 'edit';
};
const IBan = (record) => {
  if (record.status === 1) {
    // 封禁
    console.log(record);
    return;
  }
  console.log(record);
  // 解封
};

const handleCancel = () => {
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
            :placeholder="$t('usercenter.manger.search.tip')"
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
              {{ $t('usercenter.manger.search') }}
            </template>
          </a-input-search>
          <a-space direction="vertical">
            <a-button
              :loading="statuEs.clickLoading"
              type="primary"
              @click="Message.info('暂时仅支持通过oauth2认证登录!')"
            >
              {{ $t('usercenter.manger.add') }}
            </a-button>
          </a-space>
          <a-divider class="split-line" style="margin: 3px"/>
        </a-space>

        <a-table-column
          :sortable="{ sortDirections: ['ascend', 'descend'] }"
          :title="$t(`usercenter.manger.id`)"
          :width="120"
          data-index="id"
        ></a-table-column>
        <a-table-column
          :sortable="{ sortDirections: ['ascend', 'descend'] }"
          :title="$t(`usercenter.manger.name`)"
          data-index="name"
        ></a-table-column>
        <a-table-column
          :sortable="{ sortDirections: ['ascend', 'descend'] }"
          :title="$t(`usercenter.manger.username`)"
          data-index="username"
        ></a-table-column>

        <a-table-column
          :sortable="{ sortDirections: ['ascend', 'descend'] }"
          :title="$t(`usercenter.manger.avatar`)"
        >
          <template #cell="{ record }">
            <AvatarImage :avatar="record.avatar" :name="record.name"/>
          </template>
        </a-table-column>
        <a-table-column
          :sortable="{ sortDirections: ['ascend', 'descend'] }"
          :title="$t(`usercenter.manger.sex`)"
          data-index="sex"
        ></a-table-column>
        <a-table-column
          :sortable="{ sortDirections: ['ascend', 'descend'] }"
          :title="$t(`usercenter.manger.createTime`)"
          data-index="createTime"
        ></a-table-column>
        <a-table-column
          :sortable="{ sortDirections: ['ascend', 'descend'] }"
          :title="$t(`usercenter.manger.updateTime`)"
          data-index="updateTime"
        ></a-table-column>
        <a-table-column
          :sortable="{ sortDirections: ['ascend', 'descend'] }"
          :title="$t(`usercenter.manger.status`)"
        >
          <template #cell="{ record }">
            <a-tag :color="record.status === 1 ? 'green' : 'red'" bordered>{{
                record.status === 1 ? '正常' : '封禁'
              }}
            </a-tag>
          </template>
        </a-table-column>
        <a-table-column
          :sortable="{ sortDirections: ['ascend', 'descend'] }"
          :title="$t(`usercenter.manger.permissionName`)"
          data-index="permissionName"
        ></a-table-column>
        <a-table-column :title="$t(`usercenter.manger.control`)">
          <template #cell="{ record }">
            <a-button @click="readAGroup(record)"
            >{{ $t('usercenter.manger.control.read') }}
            </a-button>
            <a-button :status="record.status===1?'danger':'success'" @click="IBan(record)">
              <span v-if="record.status===1">{{ $t('usercenter.manger.control.banned') }}</span>
              <span v-else>{{ $t('usercenter.manger.control.Nobanned') }}</span>

            </a-button>

          </template>
        </a-table-column>
      </template>
    </a-table>
  </a-card>
</template>

<style lang="less" scoped>
.arco-btn-size-medium {
  margin-inline: 2px;
}
</style>
