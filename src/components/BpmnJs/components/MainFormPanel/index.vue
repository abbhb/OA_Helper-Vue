<template>
  <el-card class="box-card main-form" shadow="hover" :style="cardStyle">
    <template #header>
      <div class="card-header">
        <span>主表单信息</span>
      </div>
    </template>
    <div v-loading="loading">
      <userinfobaseext
        v-if="definitionKey === 'Process_system_1'"
        :key="instanceId"
        :privie="true"
        :task-id="instanceId"
      />
      <RenewalSigninForm
        v-else-if="definitionKey === 'Process_system_2'"
        :key="instanceId"
        :task-id="instanceId"
      />
      <MainForm
        v-else
        ref="mainForm"
        :form-json="formData.formJson"
        :form-data="formData.formData"
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
  import { ref, watchEffect, defineProps } from 'vue';
  import { getMainFormInfo } from '@/api/bpmn';
  import userinfobaseext from '@/components/userinfo-base-ext/index.vue';
  import RenewalSigninForm from "@/components/BpmnJs/components/MainFormPanel/RenewalSigninForm.vue";
  import MainForm from './MainForm.vue';

  const props = defineProps({
    instanceId: {
      type: String,
      required: true,
    },
    definitionKey: {
      type: String,
      default: '',
    },
    cardStyle: {
      type: String,
      default: 'height: 600px; overflow-y: auto',
    },
  });

  const loading = ref(false);
  const formData = ref<any>({});

  watchEffect(async () => {
    if (props.instanceId) {
      try {
        loading.value = true;
        const res = await getMainFormInfo(props.instanceId);
        formData.value = res.data;
      } finally {
        loading.value = false;
      }
    }
  });
</script>

<style scoped lang="scss">
  .main-form {
    width: 100%;

    :deep(.el-card__body) {
      height: calc(100% - 56px);
      overflow: auto;
    }
  }
</style>
