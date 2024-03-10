<template>
  <el-form-item :label="i18nt('designer.setting.textContent')">
    <el-input v-model="/* eslint-disable-next-line vue/no-mutating-props */
        optionModel.textContent" type="textarea" :rows="3"></el-input>
  </el-form-item>
</template>

<script>
import i18n from "@/components/FormDesigner/utils/i18n";

export default {
  name: "textContent-editor",
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
};
</script>

<style scoped></style>
