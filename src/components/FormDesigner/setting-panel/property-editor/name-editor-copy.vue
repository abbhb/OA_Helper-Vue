<template>
  <el-form-item prop="name" :rules="nameRequiredRule">
    <template #label>
      <span
      >{{ i18nt('designer.setting.uniqueName') }}
        <el-tooltip
          effect="light"
          :content="i18nt('designer.setting.editNameHelp')"
        >
          <svg-icon icon-class="el-info"
          /></el-tooltip>
      </span>
    </template>
    <template v-if="!!selectedWidget.category || noFieldList">
      <el-input
        v-model="/* eslint-disable-next-line vue/no-mutating-props */
        optionModel.name"
        type="text"
        :readonly="widgetNameReadonly"
        @change="updateWidgetNameAndRef"
      ></el-input>
    </template>
    <template v-else>
      <el-select
        v-model="/* eslint-disable-next-line vue/no-mutating-props */
        optionModel.name"
        allow-create
        filterable
        :disabled="widgetNameReadonly"
        :title="i18nt('designer.setting.editNameHelp')"
        @change="updateWidgetNameAndRef"
      >
        <el-option
          v-for="(sf, sfIdx) in serverFieldList"
          :key="sfIdx"
          :label="sf.label"
          :value="sf.name"
        ></el-option>
      </el-select>
    </template>
  </el-form-item>
</template>

<script>
import i18n from '@/components/FormDesigner/utils/i18n';
import {isEmptyStr} from '@/components/FormDesigner/utils/util';
import SvgIcon from '@/components/FormDesigner/svg-icon/index.vue';

export default {
  name: 'NameEditor',
  components: {
    SvgIcon,
  },
  mixins: [i18n],
  inject: ['serverFieldList', 'getDesignerConfig'],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object,
  },
  data() {
    return {
      nameRequiredRule: [{required: true, message: 'name required'}],
    };
  },
  computed: {
    noFieldList() {
      return !this.serverFieldList || this.serverFieldList.length <= 0;
    },

    widgetNameReadonly() {
      return !!this.getDesignerConfig().widgetNameReadonly;
    },
  },
  methods: {
    updateWidgetNameAndRef(newName) {
      const oldName = this.designer.selectedWidgetName;
      if (isEmptyStr(newName)) {
        // eslint-disable-next-line vue/no-mutating-props
        this.selectedWidget.options.name = oldName;
        this.$message.info(this.i18nt('designer.hint.nameRequired'));
        return;
      }

      if (this.designer.formWidget) {
        const foundRef = this.designer.formWidget.getWidgetRef(newName); // 检查newName是否已存在！！
        if (foundRef) {
          // eslint-disable-next-line vue/no-mutating-props
          this.selectedWidget.options.name = oldName;
          this.$message.info(
            this.i18nt('designer.hint.duplicateName') + newName
          );
          return;
        }

        const widgetInDesign = this.designer.formWidget.getWidgetRef(oldName);
        if (!!widgetInDesign && !!widgetInDesign.registerToRefList) {
          widgetInDesign.registerToRefList(oldName); //注册组件新的ref名称并删除老的ref！！
          const newLabel = this.getLabelByFieldName(newName);
          this.designer.updateSelectedWidgetNameAndLabel(
            this.selectedWidget,
            newName,
            newLabel
          );
        }
      }
    },

    getLabelByFieldName(fieldName) {
      for (let i = 0; i < this.serverFieldList.length; i++) {
        if (this.serverFieldList[i].name === fieldName) {
          return this.serverFieldList[i].label;
        }
      }

      return null;
    },
  },
};
</script>

<style lang="scss" scoped></style>
