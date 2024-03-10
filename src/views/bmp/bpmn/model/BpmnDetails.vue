<template>
  <el-drawer v-model="drawer" size="100%" destroy-on-close>
    <Designer :xml="xml" :settings="settings" style="height: 100%"></Designer>
  </el-drawer>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import Designer from '@/components/BpmnJs/components/Designer/index';
import {getDefinitionXml} from '@/api/bpmn';

// 是否加载抽屉
const drawer = ref<boolean>(false);
const xml = ref<string>();

// bpmn配置
const settings = {
  processEngine: 'activiti',
  paletteMode: 'custom',
  contextPadMode: 'custom',
};

/**
 * 初始化表单
 * @param deploymentId 流程部署id
 */
const open = async (deploymentId) => {
  const res = await getDefinitionXml(deploymentId);
  if (res.code === 1) {
    drawer.value = true;
    xml.value = res.msg;
  }
};

defineExpose({
  open,
});
</script>

<style scoped lang="scss">
.close {
  display: flex;
  justify-content: flex-end;
  margin: 5px;

  i {
    cursor: pointer;
  }
}

#designer-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
