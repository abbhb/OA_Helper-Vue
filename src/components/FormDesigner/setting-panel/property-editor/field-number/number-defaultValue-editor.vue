<template>
  <el-form-item :label="i18nt('designer.setting.defaultValue')">
    <el-input-number v-if="!hasConfig('optionItems')" type="text" style="width: 100%" v-model="optionModel.defaultValue"
                     @change="emitDefaultValueChange"></el-input-number>
  </el-form-item>
</template>

<script>
import i18n from "@/components/FormDesigner/utils/i18n";
import propertyMixin from "@/components/FormDesigner/setting-panel/property-editor/propertyMixin";

export default {
  name: "number-defaultValue-editor",
  mixins: [i18n, propertyMixin],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
};
</script>

<style scoped></style>
