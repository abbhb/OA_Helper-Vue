<template>
  <el-form-item :label="i18nt('designer.setting.inactiveColor')">
    <el-color-picker v-model="/* eslint-disable-next-line vue/no-mutating-props */
        optionModel.inactiveColor"></el-color-picker>
  </el-form-item>
</template>

<script>
import i18n from "@/components/FormDesigner/utils/i18n";

export default {
  name: "inactiveColor-editor",
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
};
</script>

<style scoped></style>
