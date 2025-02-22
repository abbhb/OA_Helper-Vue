<template>
  <div class="root">
    <el-drawer v-model="drawer" size="70%" :destroy-on-close="true">
      <el-tabs
        v-model="tabsValue"
        v-loading="loading"
        type="border-card"
        @tab-change="tabChange"
      >
        <el-tab-pane label="审批记录" name="1">
          <div class="history-root">
            <MainFormPanel
              :instance-id="instanceId"
              :definition-key="mydefinitionKey"
            />

            <!-- 替换为新的历史记录组件 -->
            <HistoryRecord :instance-id="instanceId" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="流程节点" name="2">
          <HighlightNode :highlight-node="highlightNodee" />
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import {
    getHighlightNodeInfo,
    getMainFormInfo,
  } from '@/api/bpmn';
  import MainFormPanel from '@/components/BpmnJs/components/MainFormPanel/index.vue';
  import HistoryRecord from '@/components/BpmnJs/components/HistoryRecord/index.vue';
  import HighlightNode from '../../../BpmnJs/components/HistoryRecord/HighlightNode.vue';

  // 是否打开弹出框
  const drawer = ref(false);
  // 流程图高亮信息
  const highlightNodee = ref<any>({});
  // 主表单信息
  const mainFormInfo = ref<any>({});
  // 流程实例id
  const instanceId = ref('');

  // 加载中
  const loading = ref(false);
  // tab 选择的值
  const tabsValue = ref('1');
  let mydefinitionKey = '';

  /**
   * 初始化
   * @param id 流程实例id
   */
  /**
   * 审批记录
   */
  const historyRecord = async () => {
    loading.value = true;
    mainFormInfo.value = {};

    const res = await getMainFormInfo(instanceId.value);
    mainFormInfo.value = res.data;

    loading.value = false;
  };
  const open = (instance_id: string, definitionKey?: string) => {
    instanceId.value = instance_id;
    tabsValue.value = '1';
    mydefinitionKey = definitionKey;
    drawer.value = true;
    historyRecord();
  };

  /**
   * 查询流程图信息(高亮信息)
   */
  const highlightNodeInfo = async () => {
    highlightNodee.value = {};
    loading.value = true;
    const { data } = await getHighlightNodeInfo(instanceId.value);
    highlightNodee.value = data;
    loading.value = false;
  };

  /**
   * 切换tab
   * @param name tab的item name的名称
   */
  const tabChange = (name: string) => {
    // eslint-disable-next-line default-case
    switch (name) {
      case '1':
        historyRecord();
        break;
      case '2':
        highlightNodeInfo();
        break;
    }
  };

  defineExpose({
    open,
  });
</script>

<style scoped lang="scss">
  .history-root {
    display: flex;
    height: 100%;
  }

  .history-container {
    min-width: 500px;
  }

  .shenpi-container {
    min-width: 500px;
  }

  .history-container :deep() .el-card__body {
    display: flex;
    flex-direction: column;
    align-items: baseline;
    height: calc(100% - 56px);
  }
  .shenpi-container :deep() .el-card__body {
    display: flex;
    flex-direction: column;
    align-items: baseline;
    height: calc(100% - 56px);
  }

  .main-form {
    width: 100%;
  }

  .hint-container {
    display: flex;
    justify-content: center;
    margin: 30px 10px;
    padding: 0 20px;
  }

  .hint-container > div {
    margin: 0 20px;
    font-size: 16px;
    font-weight: 500;
    color: black;
    display: flex;
    justify-content: center;
    align-items: baseline;
  }

  .hint-container > div::before {
    content: ' ';
    height: 12px;
    width: 12px;
    display: block;
    border-radius: 50%;
    margin-right: 8px;
  }

  .history::before {
    background-color: #0bbd87 !important;
  }

  .history_reject::before {
    background-color: red !important;
  }

  .next::before {
    background-color: #e4e7ed !important;
  }

  :deep(.el-tabs__content) {
    height: 100% !important;
  }

  .root :deep() .el-drawer__body {
    overflow: hidden;
  }

  .root :deep() .el-tabs--border-card {
    height: 100% !important;
    display: flex;
    flex-direction: column;
  }

  .root :deep() .el-tab-pane {
    height: 100% !important;
    display: flex;
    flex-direction: column;
  }

  .root :deep() .el-timeline {
    overflow: auto;
  }
</style>
