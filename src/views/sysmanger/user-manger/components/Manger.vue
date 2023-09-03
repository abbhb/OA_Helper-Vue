<script lang="ts" setup>
import {useI18n} from 'vue-i18n';
import {computed, ref} from 'vue';
import {useAppStore} from '@/store';
import {GroupUserFront} from '@/api/group';
import {getUserListManger, UserManger} from '@/api/user';
import {Message} from '@arco-design/web-vue';
import AvatarImage from '@/components/image/AvatarImage.vue';
import {getColor} from '@/utils/color-index';

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

const getRolesNameList = computed(() => (roles) => {
  const roleKeyList = [];
  roles.forEach((item) => {
    roleKeyList.push(item.name);
  });
  return roleKeyList;
});
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
            :placeholder="$t('syscenter.user.manger.search.tip')"
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
          <a-divider class="split-line" style="margin: 3px"/>
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
            <AvatarImage :avatar="record.avatar" :name="record.name"/>
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
          data-index="createTime"
        ></a-table-column>
        <a-table-column
          :sortable="{ sortDirections: ['ascend', 'descend'] }"
          :title="$t(`syscenter.user.manger.updateTime`)"
          data-index="updateTime"
        ></a-table-column>
        <a-table-column
          :sortable="{ sortDirections: ['ascend', 'descend'] }"
          :title="$t(`syscenter.user.manger.status`)"
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
          :width="240"
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
        <a-table-column :title="$t(`syscenter.user.manger.control`)">
          <template #cell="{ record }">
            <a-button @click="readAGroup(record)"
            >{{ $t('syscenter.user.manger.control.read') }}
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
</template>

<style lang="less" scoped>
.arco-btn-size-medium {
  margin-inline: 2px;
}
</style>
