<template>
  <el-form-item :label="i18nt('designer.setting.switchWidth')">
    <el-input-number v-model="/* eslint-disable-next-line vue/no-mutating-props */
        optionModel.switchWidth" style="width: 100%"></el-input-number>
  </el-form-item>
</template>

<script>
import i18n from "@/components/FormDesigner/utils/i18n";

export default {
  name: "switchWidth-editor",
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
};
</script>

<style scoped></style>
