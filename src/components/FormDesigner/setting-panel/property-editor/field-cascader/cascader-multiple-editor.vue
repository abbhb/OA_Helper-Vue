<template>
  <el-form-item :label="i18nt('designer.setting.multiple')">
    <el-switch v-model="/* eslint-disable-next-line vue/no-mutating-props */
        optionModel.multiple"></el-switch>
  </el-form-item>
</template>

<script>
import i18n from "@/components/FormDesigner/utils/i18n";
import propertyMixin from "@/components/FormDesigner/setting-panel/property-editor/propertyMixin";

export default {
  name: "cascader-multiple-editor",
  mixins: [i18n, propertyMixin],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
};
</script>

<style scoped></style>
