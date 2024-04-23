<template>
  <form-item-wrapper
    :designer="designer"
    :field="field"
    :rules="rules"
    :design-state="designState"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
    :sub-form-row-index="subFormRowIndex"
    :sub-form-col-index="subFormColIndex"
    :sub-form-row-id="subFormRowId"
  >
    <div :class="[!!field.options.autoFullWidth ? 'auto-full-width' : '']">
      <el-time-picker
        ref="fieldEditor"
        v-model="fieldModel"
        is-range
        :class="[!!field.options.autoFullWidth ? 'full-width-input' : '']"
        :disabled="field.options.disabled"
        :readonly="field.options.readonly"
        :size="widgetSize"
        :clearable="field.options.clearable"
        :editable="field.options.editable"
        :format="field.options.format"
        value-format="HH:mm:ss"
        :start-placeholder="
          field.options.startPlaceholder ||
          i18nt('render.hint.startTimePlaceholder')
        "
        :end-placeholder="
          field.options.endPlaceholder ||
          i18nt('render.hint.endTimePlaceholder')
        "
        @focus="handleFocusCustomEvent"
        @blur="handleBlurCustomEvent"
        @change="handleChangeEvent"
      >
      </el-time-picker>
    </div>
  </form-item-wrapper>
</template>

<script>
import emitter from '@/components/FormDesigner/utils/emitter';
import i18n, {translate} from '@/components/FormDesigner/utils/i18n';
import fieldMixin from '@/components/FormDesigner/form-widget/field-widget/fieldMixin';
import FormItemWrapper from './form-item-wrapper.vue';

export default {
  name: 'TimeRangeWidget',
  componentName: 'FieldWidget',
  components: {
    FormItemWrapper,
  }, //必须固定为FieldWidget，用于接收父级组件的broadcast事件
  mixins: [emitter, fieldMixin, i18n],
  props: {
    field: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,

    designState: {
      type: Boolean,
      default: false,
    },

    subFormRowIndex: {
      /* 子表单组件行索引，从0开始计数 */ type: Number,
      default: -1,
    },
    subFormColIndex: {
      /* 子表单组件列索引，从0开始计数 */ type: Number,
      default: -1,
    },
    subFormRowId: {
      /* 子表单组件行Id，唯一id且不可变 */ type: String,
      default: '',
    },
  },
  data() {
    return {
      oldFieldValue: null, //field组件change之前的值
      fieldModel: null,
      rules: [],
    };
  },
  computed: {},
  beforeCreate() {
    /* 这里不能访问方法和属性！！ */
  },

  created() {
    /* 注意：子组件mounted在父组件created之后、父组件mounted之前触发，故子组件mounted需要用到的prop
       需要在父组件created中初始化！！ */
    this.initFieldModel();
    this.registerToRefList();
    this.initEventHandler();
    this.buildFieldRules();

    this.handleOnCreated();
  },

  mounted() {
    this.handleOnMounted();
  },

  beforeUnmount() {
    this.unregisterFromRefList();
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
@import '../../styles/global.scss'; /* form-item-wrapper已引入，还需要重复引入吗？ */

.full-width-input {
  width: 100% !important;
}

.auto-full-width {
  width: 100%;

  :deep(.el-range-editor) {
    width: 100% !important;
  }
}
</style>