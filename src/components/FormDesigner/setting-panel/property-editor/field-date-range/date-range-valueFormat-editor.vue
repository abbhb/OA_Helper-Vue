<template>
  <el-form-item :label="i18nt('designer.setting.valueFormat')">
    <el-select v-model="
/* eslint-disable-next-line vue/no-mutating-props */
  optionModel.valueFormat" filterable allow-create disabled>
      <el-option label="YYYY-MM-DD" value="YYYY-MM-DD"></el-option>
      <el-option label="YYYY-MM-DD HH:mm:ss" value="YYYY-MM-DD HH:mm:ss"></el-option>
    </el-select>
  </el-form-item>
</template>

<script>
import i18n from "@/components/FormDesigner/utils/i18n";

export default {
  name: "date-range-valueFormat-editor",
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
};
</script>

<style scoped></style>
