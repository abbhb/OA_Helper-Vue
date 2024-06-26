<template>
  <el-drawer v-model="drawer" size="100%" :with-header="false" append-to-body>
    <div class="container">
      <VFormDesigner
        v-if="drawer"
        ref="vfdRef"
        :designer-config="designerConfig"
      >
        <template #customToolButtons>
          <el-button type="primary" plain @click="submit"
          >保存
          </el-button
          >
        </template>
      </VFormDesigner>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import {ref, nextTick} from 'vue';
import VFormDesigner from '@/components/FormDesigner/index.vue';
import {modelerStore} from '@/store';
import {FormJson} from '@/store/modules/modeler';

const modeler = modelerStore();

const designerConfig = ref<any>({
  languageMenu: true, //是否显示语言切换菜单
  externalLink: false, //是否显示GitHub、文档等外部链接
  formTemplates: false, //是否显示表单模板
  eventCollapse: false, //是否显示组件事件属性折叠面板
  widgetNameReadonly: false, //禁止修改组件名称

  clearDesignerButton: true, //是否显示清空设计器按钮
  previewFormButton: true, //是否显示预览表单按钮
  importJsonButton: true, //是否显示导入JSON按钮
  exportJsonButton: true, //是否显示导出JSON器按钮
  exportCodeButton: false, //是否显示导出代码按钮
  generateSFCButton: false, //是否显示生成SFC按钮

  toolbarMaxWidth: 450, //设计器工具按钮栏最大宽度（单位像素）
  toolbarMinWidth: 300, //设计器工具按钮栏最小宽度（单位像素）

  presetCssCode: '', //设计器预设CSS样式代码

  resetFormJson: true, //是否在设计器初始化时将表单内容重置为空
});

// 是否打开弹出框
const drawer = ref(false);

// vform实例
const vfdRef = ref();

const pops = defineProps({
  formJson: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

/**
 * 打开选择器
 */
const handleOpen = () => {
  drawer.value = true;
  nextTick(() => {
    vfdRef.value.setFormJson(pops.formJson);
  });
};

/**
 * 提交
 */
const submit = () => {
  // eslint-disable-next-line no-undef
  const formJson: FormJson = vfdRef.value.getFormJson();

  // 更新组件表字段,查看字段是否被删除
  modeler.updateNodeTableColumns(formJson);

  // 如果是create,更新表字段，删除没有绑定的字段
  modeler.updateTableColumn();
  emit('ok', JSON.parse(JSON.stringify(formJson)));
  drawer.value = false;
};

defineExpose({
  handleOpen,
});

const emit = defineEmits<{
  (event: 'ok', formJson: any): void;
}>();
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  height: 100%;

  :deep() .full-height {
    overflow-y: hidden;
    display: block;
  }
}
</style>
