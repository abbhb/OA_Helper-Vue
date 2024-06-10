<template>
  <el-drawer v-model="drawer" size="100%" :with-header="false" destroy-on-close>
    <div id="designer-container" class="designer-container">
      <!-- 操作按钮 -->
      <div class="toolbar-bpmn">
        <el-button type="primary" @click="submit">保存</el-button>
        <Scales></Scales>
        <Commands></Commands>
        <Previews></Previews>
        <div class="close">
          <icon-close @click="close">
            <Close/>
          </icon-close>
        </div>
      </div>
      <div class="main-content-bpmn">
        <Designer :xml="xml" :settings="settings"/>
        <Panel style="max-width: 40%"></Panel>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import {ref, nextTick} from 'vue';
import Previews from '@/components/BpmnJs/components/Toolbar/components/Previews';
import Scales from '@/components/BpmnJs/components/Toolbar/components/Scales';
import Commands from '@/components/BpmnJs/components/Toolbar/components/Commands';
import Designer from '@/components/BpmnJs/components/Designer';
import Panel from '@/components/BpmnJs/components/Panel';
import {ElMessage, ElMessageBox, ElLoading} from 'element-plus';
import {checkd} from '@/components/BpmnJs/overwrite-modules/Lint/bpmnlint';
import {
  deployProcess,
  getDefinitionInfo,
  getWidgetDataType,
} from '@/api/bpmn';
import {modelerStore} from '@/store';

const emit = defineEmits<{
  (event: 'ok'): void;
}>();
const modeler = modelerStore();

// bpmn配置
const settings = {
  processId: `Process_${new Date().getTime()}`,
  processName: `新建流程`,
  processEngine: 'activiti',
  paletteMode: 'rewrite',
  contextPadMode: 'rewrite',
  useLint: true,
  isLabelEditingProvider: true,
  isMove: true,
};

// 是否加载抽屉
const drawer = ref<boolean>(false);

// 流程设计器
const xml = ref<string>();

/**
 * 初始化设计器
 * @param deploymentId 部署id
 */
const open = async (deploymentId: string | undefined) => {
  const loading = ElLoading.service({
    lock: true,
    text: '加载中',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  modeler.clearData();
  const {data} = await getWidgetDataType();
  modeler.setWidgetDataType(data);
  // 获取到上一个版本的流程图xml
  if (deploymentId) {
    nextTick(async () => {
      const {data} = await getDefinitionInfo(deploymentId);
      const tableInfo = data?.tableInfo;
      if (tableInfo) {
        tableInfo.type = 'ready';
        modeler.setTableInfo(tableInfo);
      }
      if (data?.icon) {
        modeler.setIcon(data?.icon);
      }
      if (data?.nodeColumns) {
        modeler.setNodeColumns(data?.nodeColumns);
      }
      data?.formJsonList.forEach((formJson) => {
        modeler.setFormJson(formJson);
      });
      xml.value = data?.xml;
      loading.close();
      drawer.value = true;
    });
  } else {
    xml.value = '';
    drawer.value = true;
    loading.close();
  }
};

/**
 * 保存
 */
const submit = async () => {
  // 判断bpmn验证结果
  if (!checkd()) {
    ElMessage.error('流程存在错误,不能保存!');
    return;
  }
  await ElMessageBox.confirm('确定要部署当前流程吗?', '提示');
  modeler.updateData();
  // 动态表单数据
  const formJsonList = modeler.getFormJsonList;
  // 节点绑定字段信息
  const nodeColumns = modeler.getNodeColumns;
  const modelIcon = modeler.getModelIcon;
  // 表信息
  const tableInfo = modeler.getTableInfo;
  const {xml} = await modeler.getModeler.saveXML({
    format: true,
    preamble: true,
  });
  await deployProcess({
    xml,
    formJsonList,
    nodeColumns,
    tableInfo,
    modelIcon,
  });
  ElMessage.success('保存成功！');
  drawer.value = false;
  emit('ok');
};

/**
 * 关闭
 */
const close = async () => {
  await ElMessageBox.confirm('确定要关闭吗?', '提示');
  drawer.value = false;
};

defineExpose({
  open,
});
</script>

<style scoped lang="scss">
#designer-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.close {
  font-size: 20px;
  color: #0085f1;
  margin-left: auto;
  margin-right: 1rem;
  i {
    cursor: pointer;
  }
}
</style>
