<template>
  <div>
    <el-form-item label-width="0">
      <el-divider class="custom-divider">{{ i18nt("designer.setting.uploadSetting") }}</el-divider>
    </el-form-item>
    <el-form-item v-if="true" :label="i18nt('designer.setting.uploadURL')">
      <el-input type="text" v-model="
/* eslint-disable-next-line vue/no-mutating-props */
optionModel.uploadURL"></el-input>
    </el-form-item>
  </div>
</template>

<script>
import i18n from "@/components/FormDesigner/utils/i18n";

export default {
  name: "uploadURL-editor",
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
};
</script>

<style scoped></style>
