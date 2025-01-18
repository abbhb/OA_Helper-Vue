<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { Message, Modal } from '@arco-design/web-vue';
  import { IconLeft, IconPlus, IconDelete } from '@arco-design/web-vue/es/icon';
  import {
    getPrintDeviceUsers,
    addPrintDeviceUsers,
    removePrintDeviceUser,
    updatePrintDeviceUserRole,
    PrintDeviceUser, getPrintDeviceUserIds,
  } from '@/api/print-device';
  import { useUserStore } from '@/store';
  import SelectUser, {SelectUserType} from '@/components/select-user/index.vue';

  type UserRole = PrintDeviceUser;

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
  const printId = ref<string>('');
  const activeType = ref<number>(0);
  const currentUserRole = ref<1 | 2 | 3>(1);
  const tableData = ref<UserRole[]>([]);
  const pagination = ref<PaginationState>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const visible = ref(false);
  const loading = ref(false);

  const tableLoading = ref(false);

  const selectUserList = ref([]);
  const selectUserListPre = ref<SelectUserType[]>([]); // 展示用
  const types = [
    { label: '全部用户', value: 0 },
    { label: '所有者', value: 1 },
    { label: '管理员', value: 2 },
    { label: '普通用户', value: 3 },
  ];

  onMounted(() => {
    const id = route.query.deviceId as string;
    if (!id) {
      Message.error('参数异常：缺少打印机ID');
      return;
    }
    printId.value = id;
    loadTableData();
  });

  const loadTableData = async () => {
    tableLoading.value = true;
    try {
      await getSelectIds();
      const res = await getPrintDeviceUsers({
        printDeviceId: printId.value,
        role: activeType.value,
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
    const {data} = await getPrintDeviceUserIds(printId.value);
    selectUserListPre.value = data.map((value)=>{
      return {id:value,name:''}
    })
  }
  getSelectIds()
  const getRoleNumber = (role: string): number => {
    const roleMap: Record<string, number> = {
      owner: 1,
      manager: 2,
      user: 3,
    };
    return roleMap[role];
  };

  const handleRoleChange = async (row: UserRole, newRole: number) => {
    if (currentUserRole.value !== 1) {
      Message.error('只有所有者可以修改角色');
      return;
    }

    if (String(row.userId) === String(currentUserId)) {
      Message.error('不能修改自己的角色');
      return;
    }

    if (row.role === 1) {
      try {
        await Modal.warning({
          title: '警告',
          content: '转让所有者权限后，您将变成普通用户，确认继续吗？',
          okText: '确认',
          cancelText: '取消',
        });
        // TODO: 调用转让所有者接口
      } catch {
        return;
      }
    }

    try {
      await updatePrintDeviceUserRole({
        printDeviceId: printId.value,
        userIds: [row.userId],
        role: row.role,
      });
      Message.success('角色修改成功');
      await loadTableData();
    } catch (error) {
      Message.error('角色修改失败');
    }
  };

  const selectUser = (userList) => {
    selectUserList.value = userList;
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

  const handleAdd = () => {
    selectUserList.value = [];
    visible.value = true;
  };

  const handleOk = async () => {
    loading.value = true;
    try {
      if (selectUserList.value.length < 1) {
        Message.error('请选择用户');

        return;
      }
      const uids = selectUserList.value.map((value) => value.id);
      await addPrintDeviceUsers({
        printDeviceId: printId.value,
        userIds: uids,
        role: 3,
      });
      Message.success('添加成功');
      visible.value = false;
      await loadTableData();
    } catch (error) {
      Message.error('添加用户失败');
    } finally {
      selectUserList.value = [];
      loading.value = false;
    }
  };

  const handleCancel = () => {
    selectUserList.value = [];
    visible.value = false;
  };

  const handleRemove = async (row: UserRole) => {
    if (String(row.userId) === String(currentUserId)) {
      Message.error('不能移除自己');
      return;
    }

    if (currentUserRole.value === 2 && row.role !== 3) {
      Message.error('管理员只能移除普通用户');
      return;
    }

    try {
      await removePrintDeviceUser(printId.value, row.userId);
      Message.success('移除成功');
      await loadTableData();
    } catch {
      return;
    }
  };
  const selectMenu = (type) => {
    activeType.value = type.value;
    pagination.value.current = 1;
    loadTableData();
  };
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <a-space>
        <a-button type="text" @click="handleBack">
          <template #icon>
            <icon-left />
          </template>
          返回设备管理
        </a-button>
      </a-space>
    </div>

    <div v-if="printId" class="container">
      <div class="header">
        <a-button type="primary" @click="handleAdd">
          <template #icon>
            <icon-plus />
          </template>
          添加用户
        </a-button>
      </div>
      <div class="layout">
        <div class="sidebar">
          <a-menu :selected-keys="[activeType]">
            <a-menu-item
              v-for="type in types"
              :key="type.value"
              @click="selectMenu(type)"
            >
              {{ type.label }}
            </a-menu-item>
          </a-menu>
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
              <a-table-column title="用户名" data-index="username" />
              <a-table-column title="邮箱" data-index="email" />
              <a-table-column title="角色">
                <template #cell="{ record }">
                  <a-select
                    v-if="
                      currentUserRole === 1 &&
                      String(record.userId) !== String(currentUserId)
                    "
                    v-model="record.role"
                    @change="(val) => handleRoleChange(record, val)"
                  >
                    <a-option :value="1">所有者</a-option>
                    <a-option :value="2">管理员</a-option>
                    <a-option :value="3">普通用户</a-option>
                  </a-select>
                  <span v-else>
                    {{
                      record.role === 1
                        ? '所有者'
                        : record.role === 2
                        ? '管理员'
                        : '普通用户'
                    }}
                  </span>
                </template>
              </a-table-column>
              <a-table-column title="创建时间" data-index="createTime" />
              <a-table-column title="操作" width="100">
                <template #cell="{ record }">
                  <a-button
                    v-if="
                      (currentUserRole === 1 &&
                        String(record.userId) !== String(currentUserId)) ||
                      (currentUserRole === 2 && record.role === 3)
                    "
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
    <div v-else class="error-container">
      <a-empty description="参数异常：缺少打印机ID" />
    </div>
    <a-modal
      v-model:visible="visible"
      :unmount-on-close="true"
      :loading="loading"
      title="添加用户"
      :width="1200"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-alert type="info"> 新添加的用户默认为普通用户角色 </a-alert>
      <a-divider/>
      <SelectUser :list="selectUserListPre" @ok="selectUser"/>
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
