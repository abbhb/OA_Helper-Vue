<template>
  <el-form-item :label="i18nt('designer.setting.showScore')">
    <el-switch v-model="/* eslint-disable-next-line vue/no-mutating-props */
  optionModel.showScore"></el-switch>
  </el-form-item>
</template>

<script>
import i18n from "@/components/FormDesigner/utils/i18n";

export default {
  name: "showScore-editor",
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
};
</script>

<style scoped></style>
