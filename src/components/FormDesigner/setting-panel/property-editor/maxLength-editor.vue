<template>
  <el-form-item :label="i18nt('designer.setting.maxLength')">
    <el-input type="number" @input="inputNumberHandler" class="hide-spin-button" min="1" v-model="maxLength"
              style="width: 100%"></el-input>
  </el-form-item>
</template>

<script>
import i18n from "@/components/FormDesigner/utils/i18n";
import propertyMixin from "@/components/FormDesigner/setting-panel/property-editor/propertyMixin";

export default {
  name: "maxLength-editor",
  mixins: [i18n, propertyMixin],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  },
  computed: {
    maxLength: {
      get() {
        return this.optionModel.maxLength;
      },

      set(newValue) {
        // eslint-disable-next-line no-restricted-globals
        if (!newValue || isNaN(newValue)) {
          // eslint-disable-next-line vue/no-mutating-props
          this.optionModel.maxLength = null;
        } else {
          // eslint-disable-next-line vue/no-mutating-props
          this.optionModel.maxLength = Number(newValue);
        }
      }
    }
  }
};
</script>

<style scoped></style>
