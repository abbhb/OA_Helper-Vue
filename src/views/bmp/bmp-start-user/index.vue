<template>
  <div>
    <div
      v-loading="loading"
      style="
        display: flex;
        flex-direction: column;
        padding: 30px 30px 30px 30px;
      "
    >
      <div v-if="list.length == 0">
        <el-empty />
      </div>
      <div v-for="group in list" :key="group.sort" class="group">
        <div v-if="group?.definitionListVoList?.length > 0" class="group-title">
          {{ group.deployGroupName }}
        </div>
        <div class="group-inner">
          <div class="icon-selector">
            <div
              v-for="(it, index) in group?.definitionListVoList"
              :key="index"
              class="icon-item"
              @click="startProcess(it)"
            >
              <SelectIcon
                :icon-data="it?.icon"
                :only-show="true"
                style="width: 70px; height: 70px"
              />
              <div style="max-width: 150px; font-size: 12px">
                {{ it.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-drawer v-model="open" append-to-body size="600px" title="发起流程">
      <!--      <el-alert title="需要注意的事项" type="success" :closable="false">-->
      <!--        <template #title>-->
      <!--          <div-->
      <!--            >1.业务key-->
      <!--            businessKey的作用:可以提供businessKey来将流程实例与具有明确业务含义的某个标识符关联起来。例如，在订单流程中，业务键可以是订单id。然后可以使用该业务键轻松地查找流程实例.-->
      <!--          </div>-->
      <!--          <div>-->
      <!--            2.当然一个订单业务可以有多个流程实例,多个流程实例绑定一个businessKey,假设一个流程实例在某一个节点结束了,但是这个实例没有通过审核,那我们可以重新起一个流程实例,查询历史记录时可以根据businessKey来查找-->
      <!--          </div>-->
      <!--          <div-->
      <!--            >3.主表单-->
      <!--            比如:张三要请5天假,那么张三就要填写:请假天数、请假类型、请假理由等信息,那么这里的主表单就要选择请假相关表单和流程,在流程定义中可以设置成流程条件-->
      <!--          </div>-->
      <!--        </template>-->
      <!--      </el-alert>-->
      <br />
      <!--      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">-->
      <!--        <el-form-item label="业务key" prop="businessKey">-->
      <!--          <el-input-->
      <!--            v-model="form.businessKey"-->
      <!--            placeholder="businessKey就是业务key"-->
      <!--          />-->
      <!--        </el-form-item>-->

      <!--        <el-form-item-->
      <!--          label="选择流程"-->
      <!--          prop="definitionId"-->
      <!--          class="disabled-color"-->
      <!--        >-->
      <!--          <el-input v-model="form.definitionName" readonly="readonly">-->
      <!--            <template #append>-->
      <!--              <el-button :icon="Search" @click="selectProcess.init()" />-->
      <!--            </template>-->
      <!--          </el-input>-->
      <!--        </el-form-item>-->
      <!--      </el-form>-->
      <div v-if="Object.keys(form.formJson).length === 0">
        无主表单，直接点击确定发起流程
      </div>
      <el-card v-if="Object.keys(form.formJson).length !== 0" class="box-card">
        <template #header>
          <div class="card-header">
            <span>主表单</span>
          </div>
        </template>
        <!-- 节点动态表单 -->
        <VFormRender ref="preForm" :preview-state="true" />
      </el-card>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="open = false">取 消</el-button>
        </div>
      </template>
    </el-drawer>
    <SelectProcess ref="selectProcess" @ok="selectProcessOk" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, toRef, nextTick } from 'vue';
  import { ElMessage } from 'element-plus';
  import VFormRender from '@/components/FormDesigner/form-render/index.vue';
  import { listDeployGroupAct, startProcessStart } from '@/api/bpmn';
  import SelectIcon from '@/components/BpmnJs/components/Panel/components/sub/SelectIcon.vue';

  // 是否打开弹出框
  const open = ref(false);

  // 选择流程
  const selectProcess = ref();

  // 列表是否加载
  const loading = ref(true);
  // 列表返回值
  const list = ref<any[]>([]);

  // 动态表单实例
  const preForm = ref();

  // 表单实例
  // const formRef = ref();

  // 提交表单数据
  const form = toRef(
    reactive({
      businessKey: '',
      formId: '',
      formName: '',
      formJson: {},
      definitionId: '',
      definitionName: '',
    })
  );
  // 表单验证
  const rules = ref({
    businessKey: [
      { required: true, message: '业务key不能为空', trigger: 'blur' },
    ],
    definitionId: [
      { required: true, message: '流程必须选择', trigger: 'blur' },
    ],
  });

  // 初始化
  const init = () => {
    open.value = true;
    form.value = {
      businessKey: '',
      formId: '',
      formName: '',
      formJson: {},
      definitionId: '',
      definitionName: '',
    };
    nextTick(() => {
      preForm.value?.setFormJson({});
      // formRef.value?.resetFields();
    });
  };

  /**
   * 查询列表
   */
  const getList = async () => {
    loading.value = true;
    const { data } = await listDeployGroupAct();
    list.value = data;

    loading.value = false;
  };
  getList();
  /**
   * 选择流程返回数据
   * @param data 表单数据
   */
  const selectProcessOk = (data: any) => {
    form.value.definitionId = data.id;
    form.value.definitionName = data.name;
    form.value.formJson = data.formJson || {};
    nextTick(() => {
      preForm.value?.setFormJson(form.value.formJson);
    });
  };

  /**
   * 提交按钮
   */
  async function submitForm() {
    // 获取动态表单数据
    const formData = (await preForm.value?.getFormData()) || {};

    // 真实要提交的数据
    const subForm = {
      businessKey: form.value.businessKey,
      definitionId: form.value.definitionId,
      variables: {},
    };
    // 设置流程变量
    subForm.variables = JSON.parse(JSON.stringify(formData));

    // 由于回显使用
    subForm.variables[`${form.value.businessKey}_formData`] = JSON.parse(
      JSON.stringify(formData)
    );
    subForm.variables[`${form.value.businessKey}_formJson`] =
      form.value.formJson;
    const res = await startProcessStart(subForm);
    ElMessage.success(res.msg);
    open.value = false;
  }

  const startProcess = (item) => {
    open.value = true;
    selectProcessOk(item);
  };
</script>

<style scoped>
  .icon-selector {
    display: flex;
    flex-wrap: wrap;
  }

  .icon-item {
    cursor: pointer;
    margin-right: 25px;
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .icon-item i {
    font-size: 24px;
  }

  .group {
    margin-bottom: 35px;
  }

  .group-title {
    font-size: 24px;
  }



  /* 空列表样式 */
  .el-empty {
    margin: 20px auto;
  }

  /* 分组标题样式 */
  .group-title {
    font-size: 1.25em; /* 增大字体大小 */
    color: #333; /* 深色文字 */
    padding: 10px 0;
    border-bottom: 2px solid #ddd; /* 分隔线 */
    margin-bottom: 15px;
  }

  /* 分组内容样式 */
  .group-inner {
    display: flex;
    flex-wrap: wrap;
    gap: 15px; /* 调整间隔 */
    padding-top: 10px;
  }

  /* 图标选择器样式 */
  .icon-selector {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .icon-item {
    width: calc(25% - 20px); /* 四列布局，减去间隔 */
    padding: 15px;
    background-color: #fff; /* 白色背景 */
    border-radius: 8px; /* 圆角 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影 */
    transition: transform 0.3s ease, box-shadow 0.3s ease; /* 平滑过渡 */
    cursor: pointer;
    text-align: center;
  }

  .icon-item:hover {
    transform: translateY(-5px); /* 鼠标悬浮时上移 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 阴影加深 */
  }

  /* 图标样式 */
  .SelectIcon {
    width: 50px;
    height: 50px;
    margin-bottom: 8px;
  }

  /* 图标名称样式 */
  .icon-item > div {
    font-size: 0.9em; /* 适当减小字体大小 */
    color: #666; /* 较深的辅助文字颜色 */
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
