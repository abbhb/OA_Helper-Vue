<script setup lang="ts">
  import { ref } from 'vue';
  import usePasskey from '@/hooks/passkey';
  import { Message, Notification } from '@arco-design/web-vue';
  import {
    actionPasskeyRegistration,
    listPasskeyRegistrations,
    UserPasskey,
  } from '@/api/webauthn';
  import eventBus from "@/utils/eventBus";

  const { isSupported, createPasskeyCredential } = usePasskey();

  // 模拟的 passkey 列表数据
  const passkeyList = ref<UserPasskey[]>([]);

  const removeModel = ref({
    visible: false,
    credentialId: '',
    label: '',
  });
  const renameModel = ref({
    visible: false,
    credentialId: '',
    label: '',
    labelValue: '', // 用于表单
  });
  const loading = ref(false);
  const createSteps = ref([
    { title: '检查设备兼容性', status: 'wait' },
    { title: '生成密钥', status: 'wait' },
    { title: '验证并保存', status: 'wait' },
  ]);
  const showSteps = ref(false);

  const handleCreatePasskey = async () => {
    showSteps.value = true;
    try {
      loading.value = true;

      // 步骤1：检查兼容性
      createSteps.value[0].status = 'process';
      const supported = await isSupported();
      if (!supported) {
        createSteps.value[0].status = 'error';
        Message.error('您的设备不支持 Passkey');
        return;
      }
      createSteps.value[0].status = 'finish';
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, 500)); // 动画过渡

      // 步骤2：生成密钥
      createSteps.value[1].status = 'process';
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, 500)); // 动画过渡

      // 步骤3：验证并保存
      createSteps.value[1].status = 'finish';
      createSteps.value[2].status = 'process';
      const ds = await createPasskeyCredential();
      createSteps.value[2].status = 'finish';

      Message.success('Passkey 创建成功');
      setTimeout(() => {
        showSteps.value = false;
        // 重置步骤状态
        // eslint-disable-next-line no-return-assign
        createSteps.value.forEach((step) => (step.status = 'wait'));
      }, 1500);
      reNameButtonHandel(ds);
    } catch (error) {
      console.error(error);
      Message.error('创建 Passkey 失败');
      createSteps.value.forEach((step) => {
        if (step.status === 'process') step.status = 'error';
      });
    } finally {
      loading.value = false;
    }
  };

  const initPasskey = async () => {
    eventBus.emit("addLoading", {tip: "获取中~"});

    const { data } = await listPasskeyRegistrations();
    passkeyList.value = data;
    eventBus.emit("removeLoading");

  };
  const removeButtonHandel = (item: UserPasskey) => {
    if (!item.credentialId || !item.name) {
      return;
    }
    removeModel.value.label = item.name;
    removeModel.value.credentialId = item.credentialId;
    removeModel.value.visible = true;
  };
  const reNameButtonHandel = (item: UserPasskey) => {
    if (!item.credentialId || !item.name) {
      return;
    }
    renameModel.value.label = item.name;
    renameModel.value.labelValue = item.name;
    renameModel.value.credentialId = item.credentialId;
    renameModel.value.visible = true;
  };

  const removeModelHandleBeforeOk = async () => {
    // 实际业务
    try {
      const response = await actionPasskeyRegistration({
        action: 'delete',
        credentialId: removeModel.value.credentialId,
      });
      // @ts-ignore
      Message.success(response.msg);
    } catch (e) {
      Notification.error(e);
    } finally {
      removeModel.value.visible = false;
      removeModel.value.label = '';
      removeModel.value.credentialId = '';
    }
    initPasskey()

  };
  const removeModelHandleCancel = () => {
    removeModel.value.visible = false;
    removeModel.value.label = '';
    removeModel.value.credentialId = '';
    initPasskey()
  };

  const renameModelHandleBeforeOk = async () => {
    // 实际业务
    try {
      const response = await actionPasskeyRegistration({
        action: 'rename',
        credentialId: renameModel.value.credentialId,
        label: renameModel.value.labelValue,
      });
      // @ts-ignore
      Message.success(response.msg);
    } catch (e) {
      Notification.error(e);
    } finally {
      renameModel.value.visible = false;
      renameModel.value.label = '';
      renameModel.value.credentialId = '';
    }
    initPasskey()
  };
  const renameModelHandleCancel = () => {
    renameModel.value.visible = false;
    renameModel.value.label = '';
    renameModel.value.credentialId = '';
    renameModel.value.labelValue = '';
  };
  initPasskey();
</script>

<template>
  <div class="passkey-manager">
    <a-card class="general-card" :bordered="false">
      <template #title> Passkey 管理 </template>
      <template #extra>
        <a-button
          type="primary"
          :loading="loading"
          @click="handleCreatePasskey"
        >
          <template #icon>
            <icon-plus />
          </template>
          创建 Passkey
        </a-button>
      </template>

      <div v-if="showSteps" class="steps-container">
        <a-steps :current="1">
          <a-step
            v-for="(step, index) in createSteps"
            :key="index"
            :status="step.status"
            :title="step.title"
          />
        </a-steps>
      </div>

      <a-table :data="passkeyList" :bordered="false" :stripe="true">
        <template #columns>
          <a-table-column title="名称" data-index="name" />
          <a-table-column title="创建时间" data-index="createTime" />
          <a-table-column title="最后认证时间" data-index="updateTime" />
          <a-table-column title="操作">
            <template #cell="{ record }">
              <a-button
                type="text"
                status="normal"
                @click="reNameButtonHandel(record)"
              >
                <template #icon>
                  <icon-edit />
                </template>
                改名
              </a-button>
              <a-button
                type="text"
                status="danger"
                @click="removeButtonHandel(record)"
              >
                <template #icon>
                  <icon-delete />
                </template>
                删除
              </a-button>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
    <a-modal
      v-model:visible="removeModel.visible"
      :on-before-ok="removeModelHandleBeforeOk"
      unmount-on-close
      @cancel="removeModelHandleCancel"
    >
      <template #title> 删除认证器 </template>
      <div
        >此操作不可逆，确定删除认证器：<a-tag>{{ removeModel.label }}</a-tag
        >？<span style="font-size: 10px; color: red"
          >（仅删除服务器端，客户端win11以上或mac可自行移除）</span
        >
      </div>
    </a-modal>
    <a-modal
      v-model:visible="renameModel.visible"
      :on-before-ok="renameModelHandleBeforeOk"
      unmount-on-close
      @cancel="renameModelHandleCancel"
    >
      <template #title> 重命名认证器 </template>
      <div>
        <label>认证器:</label>
        <a-input v-model:model-value="renameModel.labelValue"></a-input>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
  .passkey-manager {
    padding: 20px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .passkey-list {
    margin-top: 20px;
  }
</style>
