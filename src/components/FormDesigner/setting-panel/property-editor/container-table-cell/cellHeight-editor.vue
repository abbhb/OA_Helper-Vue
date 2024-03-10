<template>
  <el-form-item :label="i18nt('designer.setting.cellHeight')">
    <el-input type="text" v-model="/* eslint-disable-next-line vue/no-mutating-props */
        optionModel.cellHeight"></el-input>
  </el-form-item>
</template>

<script>
import i18n from "@/components/FormDesigner/utils/i18n";

export default {
  name: "cellHeight-editor",
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
};
</script>

<style scoped></style>
