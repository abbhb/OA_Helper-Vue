<template>
  <el-form-item :label="i18nt('designer.setting.startPlaceholder')">
    <el-input type="text" v-model="/* eslint-disable-next-line vue/no-mutating-props */
        optionModel.startPlaceholder"></el-input>
  </el-form-item>
</template>

<script>
import i18n from "@/components/FormDesigner/utils/i18n";

export default {
  name: "startPlaceholder-editor",
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
};
</script>

<style scoped></style>
