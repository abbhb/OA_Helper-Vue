<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { Message, Modal } from '@arco-design/web-vue';
  import { IconLeft, IconPlus, IconDelete } from '@arco-design/web-vue/es/icon';
  import {
    getPrintDeviceLinks,
    addPrintDeviceLinks,
    removePrintDeviceLink,
    updatePrintDeviceLinkRole,
    PrintDeviceUser,
    getPrintDeviceLinkIds, getPrintDeviceList,
  } from '@/api/print-device';
  import { useUserStore } from '@/store';
  import SelectUser, {
    SelectUserType,
  } from '@/components/select-user/index.vue';
  import SelectGroup, {
    SelectGroupType,
  } from '@/components/select-group/index.vue';
  import {PrintDevice} from "@/views/printer/manager/types";

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
  // eslint-disable-next-line vue/return-in-computed-property
  const currentUserRole = computed(() => {
    return dataSource.value.filter((value)=>{return (String(value.id) === printId.value)})[0].userRole || 3;
  })
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
  const dataSource = ref<PrintDevice[]>([]);

  const selectUserList = ref([]);
  const selectGroupList = ref([]);
  const selectUserListPre = ref<SelectUserType[]>([]); // 展示用
  const selectGroupListPre = ref<SelectGroupType[]>([]); // 展示用
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
      const { data } = await getPrintDeviceList();
      dataSource.value = data;

      await getSelectIds();
      const res = await getPrintDeviceLinks({
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
    if (!printId.value){
      return
    }
    // 获取ids
    const { data } = await getPrintDeviceLinkIds(printId.value);
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

  const handleRoleChange = async (row: UserRole, newRole: any) => {

    transferOwnershipObject.value = null;
    if (currentUserRole.value !== 1) {
      Message.error('只有所有者可以修改角色');
      return;
    }


    if (String(row.linkId) === String(currentUserId)) {
      Message.error('不能修改自己的角色');
      return;
    }
    if (row.role === 1) {
      if (row.linkType===2){
        Message.error('只有人可以修改角色');
        return;
      }
      transferOwnershipVisible.value = true;
      transferOwnershipObject.value = row;
      return;
    }
    try {
      await updatePrintDeviceLinkRole({
        printDeviceId: printId.value,
        linkIds: [row.linkId],
        role: row.role,
        linkType: row.linkType,
      });
      Message.success('角色修改成功');
      await loadTableData();
    } catch (error) {
      Message.error('角色修改失败');
    }
    return


  };

  const handleTransferOwnership = async () => {
    try {
      await updatePrintDeviceLinkRole({
        printDeviceId: printId.value,
        linkIds: [transferOwnershipObject.value.linkId],
        role: transferOwnershipObject.value.role,
        linkType: transferOwnershipObject.value.linkType
      });
      Message.success('角色修改成功');
      await loadTableData();
    } catch (error) {
      Message.error('角色修改失败');
    }
  }

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
      await addPrintDeviceLinks({
        printDeviceId: printId.value,
        linkIds: uids,
        role: 3,
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
      await addPrintDeviceLinks({
        printDeviceId: printId.value,
        linkIds: deptIds,
        role: 3,
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
    if (row.linkType===1){
      if (String(row.linkId) === String(currentUserId)) {
        Message.error('不能移除自己');
        return;
      }
    }

    if (currentUserRole.value === 2 && row.role !== 3) {
      Message.error('管理员只能移除普通用户');
      return;
    }
    try {
      await removePrintDeviceLink(printId.value,row.linkId,row.linkType);
      Message.success('移除成功');
      await loadTableData();
    } catch {
      return;
    }
    return;

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
              <a-table-column title="用户名/部门名" data-index="linkName" />
              <a-table-column title="邮箱" data-index="email" />
              <a-table-column title="角色">
                <template #cell="{ record }">
                  <a-select
                    v-if="
                      currentUserRole === 1 &&
                      String(record.linkId) !== String(currentUserId)
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
                       (currentUserRole<3)&&(currentUserRole === 1 &&
                        (((String(record.linkId) !== String(currentUserId))))|| (record.linkType===2&& record.role > 2)) ||
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
      v-model:visible="userVisible"
      :unmount-on-close="true"
      :loading="loading"
      title="添加用户"
      :width="1200"
      @ok="userHandleOk"
      @cancel="userHandleCancel"
    >
      <a-alert type="info"> 新添加的用户默认为普通用户角色 </a-alert>
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
      <a-alert type="info"> 新添加的部门默认为普通用户角色 </a-alert>
      <a-divider />
      <SelectGroup :list="selectGroupListPre" @ok="selectGroup" />
    </a-modal>
    <a-modal
      v-model:visible="transferOwnershipVisible"
      title="转交所有权"
      @ok="handleTransferOwnership"
      @cancel="handleTransferOwnershipCancel"
    >
      确认转交所有权？你将成为普通成员
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
