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
            <div class="box-card main-form" style="overflow-y: auto">
              <el-card class="main-form" shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span>主表单信息</span>
                  </div>
                </template>
                <!--      支持额外拓展的一些组件,当definitionKey===Process_system_1使用userinfo-base-ext组件展示-->

                <userinfobaseext v-if="mydefinitionKey === 'Process_system_1'" :privie=true :taskId="instanceId"/>
                <MainForm v-else
                  ref="mainForm"
                  :form-json="mainFormInfo.formJson"
                  :form-data="mainFormInfo.formData"
                />
              </el-card>
              <el-card class="history-container" shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span>历史记录</span>
                  </div>
                </template>
                <div class="hint-container">
                  <div class="history">已审批</div>
                  <div class="next">待审批</div>
                </div>
                <el-timeline>
                  <el-timeline-item
                    v-for="(item, index) in historyRecordList"
                    :key="index"
                    :color="item.status === 1 ? '#0bbd87' : '#e4e7ed'"
                  >
                    <HistoryNodeInfo :node-item="item" />
                  </el-timeline-item>
                </el-timeline>
              </el-card>
            </div>
            <el-card class="box-card shenpi-container" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>审批区</span>
                </div>
              </template>
              <div style="width: 450px">
                <!-- 节点动态表单 -->
                <VFormRender
                  ref="preForm"
                  :form-json="formJson"
                  :preview-state="true"
                />
                <span class="dialog-footer">
                  <el-button type="primary" @click="submit">审批</el-button>
                  <el-button @click="drawer = false">取消</el-button>
                </span>
              </div>

            </el-card>
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
  import { nextTick, reactive, ref, toRef } from 'vue';
  import {
    completeProcessTodo,
    getHighlightNodeInfo,
    getHistoryRecord,
    getMainFormInfo,
    getNodeForm,
  } from '@/api/bpmn';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import VFormRender from '@/components/FormDesigner/form-render/index.vue';
  import userinfobaseext from '@/components/userinfo-base-ext/index.vue'
  import HistoryNodeInfo from './components/HistoryNodeInfo.vue';
  import MainForm from './components/MainForm.vue';
  import HighlightNode from './components/HighlightNode.vue';


  // 是否打开弹出框
  const drawer = ref(false);
  // 审批历史记录列表数据
  const historyRecordList = ref<any[]>([]);
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

  // 提交表单数据
  const form = toRef(
    reactive({
      processInstanceId: '',
      variables: {},
    })
  );

  // 动态表单实例
  const preForm = ref();
  // 动态表单结构数据
  const formJson = ref<object>({});

  // 当前节点id
  let activityId = '';
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
    historyRecordList.value = [];
    const { data } = await getHistoryRecord(instanceId.value);
    historyRecordList.value = data;

    const res = await getMainFormInfo(instanceId.value);
    mainFormInfo.value = res.data;

    loading.value = false;
  };
  const open = async (
    instance_id: string,
    taskId: string,
    taskDefinitionKey: string,
  definitionKey: string

  ) => {
    instanceId.value = instance_id;
    tabsValue.value = '1';
    mydefinitionKey = definitionKey;
    historyRecord();
    // 加载审批输一局
    form.value.processInstanceId = instance_id;
    activityId = taskDefinitionKey;
    // 获取动态表单
    const res = await getNodeForm(taskId);
    if (res.code === 1 && res.data !== '') {
      formJson.value = res.data;
      drawer.value = true;
      nextTick(() => {
        if (Object.keys(res.data).length !== 0) {
          preForm.value?.resetForm();
          preForm.value?.setFormJson(res.data);
        }
      });
    }
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
  /**
   * 提交
   */
  async function submit() {
    // 获取动态表单数据
    const formData = await preForm.value.getFormData();

    ElMessageBox.confirm('是否要提交?', '提示').then(async () => {
      // 在流程节点局部变量设置值, 可以方便使用 `${}` 直接设置流程变量
      const variables = JSON.parse(JSON.stringify(formData));

      // 在流程节点局部变量设置表单的结构和值方便以后回显使用
      variables[`${activityId}_formJson`] = formJson;
      variables[`${activityId}_formData`] = JSON.parse(
        JSON.stringify(formData)
      );
      form.value.variables = variables;
      const res = await completeProcessTodo(form.value);
      if (res.code === 1) {
        ElMessage.success(res.msg);
        open.value = false;
        emit('ok');
      }
    });
  }

  const emit = defineEmits<{
    (event: 'ok'): void;
  }>();

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
