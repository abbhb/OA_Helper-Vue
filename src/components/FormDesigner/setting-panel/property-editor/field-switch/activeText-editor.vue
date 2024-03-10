<template>
  <el-form-item :label="i18nt('designer.setting.activeText')">
    <el-input v-model="/* eslint-disable-next-line vue/no-mutating-props */
        optionModel.activeText"></el-input>
  </el-form-item>
</template>

<script>
import i18n from "@/components/FormDesigner/utils/i18n";

export default {
  name: "activeText-editor",
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
};
</script>

<style scoped></style>
