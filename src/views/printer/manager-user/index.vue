<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { Message, Modal } from '@arco-design/web-vue';
  import { IconLeft, IconPlus, IconDelete } from '@arco-design/web-vue/es/icon';

  interface UserRole {
    id: number;
    username: string;
    role: 'owner' | 'manager' | 'user';
    email: string;
    createTime: string;
    isCurrentUser: boolean;
  }

  interface PaginationState {
    current: number;
    pageSize: number;
    total: number;
  }

  interface UserForm {
    email: string;
  }

  const route = useRoute();
  const router = useRouter();
  const printId = ref<string>('');
  const activeType = ref<string>('all');
  const currentUserRole = ref<'owner' | 'manager' | 'user'>('owner');
  const tableData = ref<UserRole[]>([]);
  const pagination = ref<PaginationState>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const visible = ref(false);
  const loading = ref(false);
  const form = ref<UserForm>({
    email: '',
  });

  // Mock数据
  const mockUsers: UserRole[] = [
    {
      id: 1,
      username: '张三',
      role: 'owner',
      email: 'zhangsan@example.com',
      createTime: '2024-03-20',
      isCurrentUser: true,
    },
    {
      id: 2,
      username: '李四',
      role: 'manager',
      email: 'lisi@example.com',
      createTime: '2024-03-21',
      isCurrentUser: false,
    },
    {
      id: 3,
      username: '王五',
      role: 'user',
      email: 'wangwu@example.com',
      createTime: '2024-03-22',
      isCurrentUser: false,
    },
  ];

  const types = [
    { label: '全部用户', value: 'all' },
    { label: '所有者', value: 'owner' },
    { label: '管理员', value: 'manager' },
    { label: '普通用户', value: 'user' },
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

  const loadTableData = () => {
    // TODO: 实际接口调用
    // const res = await api.getPrinterUsers({
    //   printerId: printId.value,
    //   type: activeType.value === 'all' ? undefined : activeType.value,
    //   current: pagination.value.current,
    //   pageSize: pagination.value.pageSize
    // })

    // Mock 分页数据处理
    const filteredData = mockUsers
      .filter(
        (user) => activeType.value === 'all' || user.role === activeType.value
      )
      .sort((a, b) => {
        const roleOrder = { owner: 1, manager: 2, user: 3 };
        return roleOrder[a.role] - roleOrder[b.role];
      });

    const start = (pagination.value.current - 1) * pagination.value.pageSize;
    const end = start + pagination.value.pageSize;

    tableData.value = filteredData.slice(start, end);
    pagination.value.total = filteredData.length;
  };

  const handleRoleChange = async (row: UserRole, newRole: string) => {
    if (currentUserRole.value !== 'owner') {
      Message.error('只有所有者可以修改角色');
      return;
    }

    if (row.isCurrentUser) {
      Message.error('不能修改自己的角色');
      return;
    }

    if (row.role === 'owner') {
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

    // TODO: 调用修改角色接口
    loadTableData();
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
      name:'printerManager'
    });
  };

  const handleAdd = () => {
    visible.value = true;
  };

  const handleOk = async () => {
    if (!form.value.email) {
      Message.error('请输入用户邮箱');
      return;
    }
    loading.value = true;
    try {
      // TODO: 调用添加用户接口
      // await api.addPrinterUser({
      //   printerId: printId.value,
      //   email: form.value.email,
      //   role: 'user'
      // });
      Message.success('添加成功');
      visible.value = false;
      form.value.email = '';
      loadTableData();
    } finally {
      loading.value = false;
    }
  };

  const handleCancel = () => {
    visible.value = false;
    form.value.email = '';
  };

  const handleRemove = async (row: UserRole) => {
    if (row.isCurrentUser) {
      Message.error('不能移除自己');
      return;
    }

    if (currentUserRole.value === 'manager' && row.role !== 'user') {
      Message.error('管理员只能移除普通用户');
      return;
    }

    try {
      await Modal.warning({
        title: '警告',
        content: '确认移除该用户吗？',
        okText: '确认',
        cancelText: '取消',
      });
      // TODO: 调用移除用户接口
      // await api.removePrinterUser({
      //   printerId: printId.value,
      //   userId: row.id
      // });
      Message.success('移除成功');
      loadTableData();
    } catch {
      return;
    }
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
          <a-menu
            :selected-keys="[activeType]"
            @menu-item-click="
              (key) => {
                activeType = key;
                pagination.current = 1;
                loadTableData();
              }
            "
          >
            <a-menu-item v-for="type in types" :key="type.value">
              {{ type.label }}
            </a-menu-item>
          </a-menu>
        </div>

        <div class="content">
          <a-table
            :data="tableData"
            :pagination="pagination"
            @page-change="handlePageChange"
            @page-size-change="handlePageSizeChange"
          >
            <template #columns>
              <a-table-column title="用户名" data-index="username" />
              <a-table-column title="邮箱" data-index="email" />
              <a-table-column title="角色">
                <template #cell="{ record }">
                  <a-select
                    v-if="currentUserRole === 'owner' && !record.isCurrentUser"
                    v-model="record.role"
                    @change="(val) => handleRoleChange(record, val)"
                  >
                    <a-option value="owner">所有者</a-option>
                    <a-option value="manager">管理员</a-option>
                    <a-option value="user">普通用户</a-option>
                  </a-select>
                  <span v-else>
                    {{
                      record.role === 'owner'
                        ? '所有者'
                        : record.role === 'manager'
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
                      (currentUserRole === 'owner' && !record.isCurrentUser) ||
                      (currentUserRole === 'manager' && record.role === 'user')
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
      @ok="handleOk"
      @cancel="handleCancel"
      :loading="loading"
      title="添加用户"
    >
      <a-form :model="form">
        <a-form-item field="email" label="用户邮箱">
          <a-input
            v-model="form.email"
            placeholder="请输入用户邮箱"
            allow-clear
          />
        </a-form-item>
        <a-alert type="info">
          新添加的用户默认为普通用户角色
        </a-alert>
      </a-form>
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
