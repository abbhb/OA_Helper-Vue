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
      v-model="
/* eslint-disable-next-line vue/no-mutating-props */
optionModel.fileTypes"
      multiple
      allow-create
      filterable
      default-first-option
      style="width: 100%"
    >
      <el-option
        v-for="(ft, ftIdx) in uploadPictureTypes"
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
  name: 'PictureUploadFileTypesEditor',
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
      uploadPictureTypes: [
        {
          value: 'jpg',
          label: 'jpg',
        } /* label如用大写字母，选择两个文件类型就会导致设置面板快速抖动、闪烁，非常奇怪！！ */,
        {value: 'jpeg', label: 'jpeg'},
        {value: 'png', label: 'png'},
        {value: 'gif', label: 'gif'},
      ],
    };
  },
};
</script>

<style scoped></style>
