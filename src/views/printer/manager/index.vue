<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { Message, Modal } from '@arco-design/web-vue';
  import { useRouter } from 'vue-router';
  import {
    getPrintDeviceList,
    updatePrintDeviceStatus,
    deletePrintDevice,
    createPrintDevice,
    addPrintDeviceLinks, updatePrintDeviceLinkRole,
    getUnRegisterPrintDeviceList, PrintDeviceNotRegisterVO,
  } from '@/api/print-device';
  import type { PrintDevice } from './types';
  import { PrintDeviceRole } from './types';

  const router = useRouter();
  const dataSource = ref<PrintDevice[]>([]);
  const loading = ref(false);

  // 添加权限管理对话框相关状态
  const showAuthDialog = ref(false);
  const currentDevice = ref<PrintDevice>();
  const authLoading = ref(false);

  // 用户选择相关
  const selectedUsers = ref<string[]>([]);
  const selectedRole = ref<PrintDeviceRole>(PrintDeviceRole.USER);

  const roleOptions = [
    { label: '管理员', value: PrintDeviceRole.MANAGER },
    { label: '普通用户', value: PrintDeviceRole.USER },
  ];

  // 表格列定义
  const columns = [
    {
      title: '打印机ID',
      dataIndex: 'deviceId',
    },
    {
      title: '打印机名称',
      dataIndex: 'deviceName',
    },
    {
      title: '描述',
      dataIndex: 'deviceDescription',
    },
    {
      title: '创建人',
      dataIndex: 'createUserName',
    },
    {
      title: '当前所有者',
      dataIndex: 'ownerName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      slotName: 'operations',
      width: 280,
    },
  ];

  // 获取打印机列表
  const fetchData = async () => {
    loading.value = true;
    try {
      const { data } = await getPrintDeviceList();
      dataSource.value = data;
    } catch (error) {
      Message.error('获取打印机列表失败');
      console.error('获取打印机列表错误:', error);
    } finally {
      loading.value = false;
    }
  };

  // // 转移所有权
  // const handleTransferOwnership = async (record: PrintDevice) => {
  //   try {
  //     await Modal.confirm({
  //       title: '确认转移',
  //       content: '转移所有权后，您将失去对此打印机的所有权限，确认继续吗？',
  //     });
  //
  //     // 更新接口包含转交
  //     const { data } = await updatePrintDeviceLinkRole({
  //       linkIds: [], // TODO:转交的人选择
  //       printDeviceId: record.id,
  //       role: 1,
  //     });
  //     Message.success('所有权转移成功');
  //     await fetchData();
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       Message.error('转移所有权失败');
  //       console.error('转移所有权错误:', error);
  //     }
  //   }
  // };

  // 打开权限管理对话框
  const handleManageUsers = (record: PrintDevice) => {
    router.push({
      name: 'printerManagerUser',
      query: {
        deviceId: record.id,
      },
    });
  };

  // // 确认授权
  // const handleConfirmAuth = async () => {
  //   if (!selectedUsers.value.length) {
  //     Message.warning('请选择要授权的用户');
  //     return;
  //   }
  //   if (!currentDevice.value) {
  //     Message.error('设备信息异常');
  //     return;
  //   }
  //
  //   authLoading.value = true;
  //   try {
  //     const { data } = await addPrintDeviceLinks({
  //       printDeviceId: currentDevice.value.id,
  //       linkIds: selectedUsers.value,
  //       role: selectedRole.value,
  //     });
  //     Message.success('授权成功');
  //     showAuthDialog.value = false;
  //     await fetchData();
  //   } catch (error) {
  //     Message.error('授权失败');
  //     console.error('授权错误:', error);
  //   } finally {
  //     authLoading.value = false;
  //   }
  // };

  // 检查是否有编辑权限
  const hasEditPermission = (role?: number) => {
    return role === PrintDeviceRole.OWNER || role === PrintDeviceRole.MANAGER;
  };

  // 检查是否有删除权限
  const hasDeletePermission = (role?: number) => {
    return role === PrintDeviceRole.OWNER;
  };

  // 删除打印机
  const handleDelete = async (record: PrintDevice) => {
    try {
      await Modal.confirm({
        title: '确认删除',
        content: '删除后无法恢复，确认继续吗？',
      });

      const { data } = await deletePrintDevice(record.id);
      Message.success('删除成功');
      await fetchData();
    } catch (error) {
      if (error instanceof Error) {
        Message.error('删除失败');
        console.error('删除打印机错误:', error);
      }
    }
  };

  // 切换状态
  const handleToggleStatus = async (record: PrintDevice) => {
    try {
      const { data } = await updatePrintDeviceStatus(
        record.id,
        record.status === 1 ? 0 : 1
      );
      Message.success('状态更新成功');
      await fetchData();
    } catch (error) {
      Message.error('状态更新失败');
      console.error('更新状态错误:', error);
    }
  };

  // 注册新打印机
  const showCreateDialog = ref(false);
  const createLoading = ref(false);
  const unregisteredDevices = ref<PrintDeviceNotRegisterVO[]>([]);
  const createForm = ref({
    deviceId: '',
    deviceSecret: '',
  });

  const fetchUnregisteredDevices = async () => {
    try {
      const { data } = await getUnRegisterPrintDeviceList();
      unregisteredDevices.value = data;
    } catch (error) {
      Message.error('获取未注册打印机列表失败');
      console.error('获取未注册打印机列表错误:', error);
    }
  };

  const handleCreateDevice = () => {
    showCreateDialog.value = true;
    fetchUnregisteredDevices();
  };

  const handleConfirmCreate = async () => {
    if (!createForm.value.deviceId) {
      Message.warning('请选择打印机');
      return;
    }
    if (!createForm.value.deviceSecret) {
      Message.warning('请输入打印机密钥');
      return;
    }

    createLoading.value = true;
    try {
      await createPrintDevice(createForm.value);
      Message.success('注册成功');
      showCreateDialog.value = false;
      createForm.value = {
        deviceId: '',
        deviceSecret: '',
      };
      await fetchData();
    } catch (error) {
      Message.error('注册失败');
      console.error('注册打印机错误:', error);
    } finally {
      createLoading.value = false;
    }
  };

  onMounted(() => {
    fetchData();
  });
</script>

<template>
  <div class="container">
    <a-card class="general-card" :bordered="false">
      <div class="header">
        <h2>打印机管理</h2>
        <a-button type="primary" @click="handleCreateDevice">
          <template #icon>
            <icon-plus />
          </template>
          注册打印机
        </a-button>
      </div>

      <a-table
        :columns="columns"
        :data="dataSource"
        :loading="loading"
        :pagination="{
          showTotal: true,
          showJumper: true,
        }"
        row-key="id"
      >
        <template #status="{ record }">
          <a-tag :color="record.status === 1 ? 'green' : 'red'">
            {{ record.status === 1 ? '正常' : '停用' }}
          </a-tag>
        </template>

        <template #operations="{ record }">
          <a-space>
            <a-button
              v-if="hasEditPermission(record.userRole)"
              type="text"
              :status="record.status === 1 ? 'warning' : 'success'"
              @click="handleToggleStatus(record)"
            >
              <icon-power-off />
              {{ record.status === 1 ? '停用' : '启用' }}
            </a-button>

            <a-button
              v-if="hasEditPermission(record.userRole)"
              type="text"
              @click="handleManageUsers(record)"
            >
              <icon-user-group />
              权限管理
            </a-button>

<!--            <a-popconfirm-->
<!--              v-if="record.userRole === PrintDeviceRole.OWNER"-->
<!--              content="确认转移设备所有权吗？"-->
<!--              @ok="handleTransferOwnership(record)"-->
<!--            >-->
<!--              <a-button type="text" status="warning">-->
<!--                <icon-swap />-->
<!--                转移所有权-->
<!--              </a-button>-->
<!--            </a-popconfirm>-->

            <a-popconfirm
              v-if="hasDeletePermission(record.userRole)"
              content="确认删除该打印机吗？"
              @ok="handleDelete(record)"
            >
              <a-button type="text" status="danger">
                <icon-delete />
                删除
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>

      <!-- 添加权限管理对话框 -->
      <a-modal
        v-model:visible="showAuthDialog"
        title="权限管理"
        :loading="authLoading"
        @cancel="showAuthDialog = false"
      >
        <!--        @ok="handleConfirmAuth"-->

        <a-form :model="{ selectedRole }" layout="vertical">
          <a-form-item label="选择用户" required>
            <a-select
              v-model="selectedUsers"
              placeholder="请选择用户"
              multiple
              allow-search
            >
              <a-option value="1">用户1</a-option>
              <a-option value="2">用户2</a-option>
              <a-option value="3">用户3</a-option>
            </a-select>
          </a-form-item>

          <a-form-item label="设置角色" required>
            <a-radio-group v-model="selectedRole">
              <a-radio
                v-for="option in roleOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item>
            <a-alert type="info">
              <template #message>
                <div>权限说明：</div>
                <div>- 管理员可以管理打印机状态和用户权限</div>
                <div>- 普通用户仅可查看和使用打印机</div>
              </template>
            </a-alert>
          </a-form-item>
        </a-form>
      </a-modal>

      <a-modal
        v-model:visible="showCreateDialog"
        title="注册打印机"
        @ok="handleConfirmCreate"
        @cancel="showCreateDialog = false"
        :loading="createLoading"
      >
        <a-form :model="createForm" layout="vertical">
          <a-form-item label="选择打印机" required>
            <a-select
              v-model="createForm.deviceId"
              placeholder="请选择未注册的打印机"
              allow-search
            >
              <a-option
                v-for="device in unregisteredDevices"
                :key="device.id"
                :value="device.id"
              >
                {{ device.name || device.id }}
              </a-option>
            </a-select>
          </a-form-item>

          <a-form-item label="打印机密钥" required>
            <a-input
              v-model="createForm.deviceSecret"
              placeholder="请输入打印机密钥"
              allow-clear
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<style scoped>
  .container {
    padding: 24px;
    background-color: var(--color-fill-2);
    min-height: 100%;
  }

  .general-card {
    border-radius: 4px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
</style>
