<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Message, Modal } from '@arco-design/web-vue';
import { IconLeft, IconPlus, IconDelete } from '@arco-design/web-vue/es/icon';
import { useUserStore } from '@/store';
import SelectUser, {
  SelectUserType,
} from '@/components/select-user/index.vue';
import SelectGroup, {
  SelectGroupType,
} from '@/components/select-group/index.vue';
import LdapSyncComponent from '@/components/ldap-sync-component/index.vue'
import {
  addIkuaiAllowLinks,
  getIkuaiAllowLinkIds,
  getIkuaiAllowLinks,
  IkuaiAllowUser,
  removeIkuaiAllowLink
} from "@/api/ikuai-allow";

type UserRole = IkuaiAllowUser;

interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const currentUserId = computed(() => {
  return userStore.userInfo.id;
});
const tableData = ref<UserRole[]>([]);
const pagination = ref<PaginationState>({
  current: 1,
  pageSize: 10,
  total: 0,
});
const userVisible = ref(false);
const deptVisible = ref(false);
const transferOwnershipVisible = ref(false);
const transferOwnershipObject = ref(null);
const loading = ref(false);

const tableLoading = ref(false);

const selectUserList = ref([]);
const selectGroupList = ref([]);
const selectUserListPre = ref<SelectUserType[]>([]); // 展示用
const selectGroupListPre = ref<SelectGroupType[]>([]); // 展示用


onMounted(() => {
  loadTableData();
});

const loadTableData = async () => {
  tableLoading.value = true;
  try {
    await getSelectIds();
    const res = await getIkuaiAllowLinks({
      pageNum: pagination.value.current,
      pageSize: pagination.value.pageSize,
    });
    tableData.value = res.data.records;
    pagination.value.total = res.data.total;
  } finally {
    tableLoading.value = false;
  }
};
const getSelectIds = async () => {
  // 获取ids
  const { data } = await getIkuaiAllowLinkIds();
  selectUserListPre.value = data[1].map((value) => {
    return { id: value, name: '' };
  });
  selectGroupListPre.value = data[2].map((value) => {
    return { id: value, name: '' };
  });
};
getSelectIds();
const getRoleNumber = (role: string): number => {
  const roleMap: Record<string, number> = {
    owner: 1,
    manager: 2,
    user: 3,
  };
  return roleMap[role];
};
const selectUser = (userList) => {
  selectUserList.value = userList;
};
const selectGroup = (groupList) => {
  selectGroupList.value = groupList;
};
const handlePageChange = (current: number) => {
  pagination.value.current = current;
  loadTableData();
};

const handlePageSizeChange = (pageSize: number) => {
  pagination.value.pageSize = pageSize;
  pagination.value.current = 1;
  loadTableData();
};

const handleBack = () => {
  router.push({
    name: 'printerManager',
  });
};

const userHandleAdd = () => {
  selectUserList.value = [];
  userVisible.value = true;
};
const deptHandleAdd = () => {
  selectGroupList.value = [];
  deptVisible.value = true;
};

const userHandleOk = async () => {
  loading.value = true;
  try {
    if (selectUserList.value.length < 1) {
      Message.error('请选择用户');

      return;
    }
    const uids = selectUserList.value.map((value) => value.id);
    await addIkuaiAllowLinks({
      linkIds: uids,
      linkType: 1,
    });
    Message.success('添加成功');
    userVisible.value = false;
    await loadTableData();
  } catch (error) {
    Message.error('添加用户失败');
  } finally {
    selectUserList.value = [];
    loading.value = false;
  }
};

const userHandleCancel = () => {
  selectUserList.value = [];
  userVisible.value = false;
};

const deptHandleOk = async () => {
  loading.value = true;
  try {
    if (selectGroupList.value.length < 1) {
      Message.error('请选择部门');

      return;
    }
    const deptIds = selectGroupList.value.map((value) => value.id);
    await addIkuaiAllowLinks({
      linkIds: deptIds,
      linkType: 2,
    });
    Message.success('添加成功');
    deptVisible.value = false;
    await loadTableData();
  } catch (error) {
    Message.error('添加部门失败');
  } finally {
    selectGroupList.value = [];
    loading.value = false;
  }
};

const deptHandleCancel = () => {
  selectGroupList.value = [];
  deptVisible.value = false;
};

const handleTransferOwnershipCancel = async () => {

  transferOwnershipVisible.value = false;
  await loadTableData()

};

const handleRemove = async (row: UserRole) => {
  try {
    await removeIkuaiAllowLink(row.linkId,row.linkType);
    Message.success('移除成功');
    await loadTableData();
  } catch {
    return;
  }
  return;

};
const selectMenu = (type) => {
  pagination.value.current = 1;
  loadTableData();
};
</script>

<template>
  <div class="page-container">
    <div class="page-header" >
      <a-space>
        <a-button type="text" @click="handleBack" style="display: none">
          <template #icon>
            <icon-left />
          </template>
          返回设备管理
        </a-button>
        <a-tag>
          注意：新添加的用户需要实际登录过本平台次日后才会同步数据至Ikuai。（次日才能正常使用）<LdapSyncComponent/>
        </a-tag>
      </a-space>
    </div>

    <div class="container">
      <div class="header">
        <a-button type="primary" @click="userHandleAdd">
          <template #icon>
            <icon-plus />
          </template>
          添加用户
        </a-button>
        <a-button style="margin-left: 5px;" type="primary" @click="deptHandleAdd">
          <template #icon>
            <icon-plus />
          </template>
          添加部门
        </a-button>
      </div>
      <div class="layout">
        <div class="sidebar">
          <a-empty/>
        </div>

        <div class="content">
          <a-table
            :data="tableData"
            :pagination="pagination"
            :loading="tableLoading"
            @page-change="handlePageChange"
            @page-size-change="handlePageSizeChange"
          >
            <template #columns>
              <a-table-column title="用户名/部门名" data-index="linkName" />
              <a-table-column title="邮箱" data-index="email" />
              <a-table-column title="创建时间" data-index="createTime" />
              <a-table-column title="操作" width="100">
                <template #cell="{ record }">
                  <a-button
                    type="text"
                    status="danger"
                    @click="handleRemove(record)"
                  >
                    <template #icon>
                      <icon-delete />
                    </template>
                    移除
                  </a-button>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </div>
      </div>
    </div>
    <a-modal
      v-model:visible="userVisible"
      :unmount-on-close="true"
      :loading="loading"
      title="添加用户"
      :width="1200"
      @ok="userHandleOk"
      @cancel="userHandleCancel"
    >
      <a-alert type="info"> 新添加的用户需要实际登录过本平台次日后才会同步数据至Ikuai </a-alert>
      <a-divider />
      <SelectUser :list="selectUserListPre" @ok="selectUser" />
    </a-modal>
    <a-modal
      v-model:visible="deptVisible"
      :unmount-on-close="true"
      :loading="loading"
      title="添加部门"
      :width="1200"
      @ok="deptHandleOk"
      @cancel="deptHandleCancel"
    >
      <a-alert type="info"> 新添加的部门的用户需要实际登录过本平台次日后才会同步数据至Ikuai </a-alert>
      <a-divider />
      <SelectGroup :list="selectGroupListPre" @ok="selectGroup" />
    </a-modal>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100%;
  background: var(--color-fill-2);
  padding: 16px;
}

.page-header {
  margin-bottom: 16px;
}

.container {
  background: var(--color-bg-2);
  border-radius: 4px;
  padding: 16px;
}

.layout {
  display: flex;
  gap: 16px;
}

.sidebar {
  width: 200px;
  background: var(--color-fill-2);
  border-radius: 4px;
}

.content {
  flex: 1;
  background: var(--color-fill-2);
  border-radius: 4px;
  padding: 16px;
}

.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  background: var(--color-bg-2);
  border-radius: 4px;
}

.header {
  margin-bottom: 16px;
}
</style>
