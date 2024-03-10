<template>
  <el-form-item :label="i18nt('designer.setting.showText')">
    <el-switch
      v-model="
        /* eslint-disable-next-line vue/no-mutating-props */
        optionModel.showText
      "
    ></el-switch>
  </el-form-item>
</template>

<script>
import i18n from '@/components/FormDesigner/utils/i18n';

export default {
  name: 'ShowTextEditor',
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object,
  },
};
</script>

<style scoped></style>
