<template>
  <el-form-item>
    <template #label>
      <span
      >{{ i18nt('designer.setting.fileTypes') }}
        <el-tooltip
          effect="light"
          :content="i18nt('designer.setting.fileTypesHelp')"
        >
          <svg-icon icon-class="el-info"
          /></el-tooltip>
      </span>
    </template>
    <el-select
      v-model="/* eslint-disable-next-line vue/no-mutating-props */
      optionModel.fileTypes"
      multiple
      allow-create
      filterable
      default-first-option
      style="width: 100%"
    >
      <el-option
        v-for="(ft, ftIdx) in uploadFileTypes"
        :key="ftIdx"
        :label="ft.label"
        :value="ft.value"
      >
      </el-option>
    </el-select>
  </el-form-item>
</template>

<script>
import i18n from '@/components/FormDesigner/utils/i18n';
import SvgIcon from '@/components/FormDesigner/svg-icon/index.vue';

export default {
  name: 'FileUploadFileTypesEditor',
  components: {
    SvgIcon,
  },
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object,
  },
  data() {
    return {
      uploadFileTypes: [
        {value: 'doc', label: 'doc'},
        {value: 'xls', label: 'xls'},
        {value: 'docx', label: 'docx'},
        {value: 'xlsx', label: 'xlsx'},
      ],
    };
  },
};
</script>

<style scoped></style>
