<!--
/**
 * author: vformAdmin
 * email: vdpadmin@163.com
 * website: https://www.vform666.com
 * date: 2021.08.18
 * remark: 如果要分发VForm源码，需在本文件顶部保留此文件头信息！！
 */
-->

<template>
  <el-form
    ref="renderForm"
    :label-position="labelPosition"
    :size="size"
    :class="[customClass]"
    class="render-form"
    :label-width="labelWidth"
    :validate-on-rule-change="false"
    :model="formDataModel"
    @submit.prevent
  >
    <template v-for="(widget, index) in widgetList">
      <template v-if="'container' === widget.category">
        <component
          :is="getContainerWidgetName(widget)"
          :key="widget.id"
          :widget="widget"
          :parent-list="widgetList"
          :index-of-parent-list="index"
          :parent-widget="null"
        >
          <!-- 递归传递插槽！！！ -->
          <template v-for="slot in Object.keys($slots)" #[slot]="scope">
            <slot :name="slot" v-bind="scope"/>
          </template>
        </component>
      </template>
      <template v-else>
        <component
          :is="getWidgetName(widget)"
          :key="widget.id"
          :field="widget"
          :form-model="formDataModel"
          :designer="null"
          :parent-list="widgetList"
          :index-of-parent-list="index"
          :parent-widget="null"
        >
          <!-- 递归传递插槽！！！ -->
          <template v-for="slot in Object.keys($slots)" #[slot]="scope">
            <slot :name="slot" v-bind="scope"/>
          </template>
        </component>
      </template>
    </template>
  </el-form>
</template>

<script>
//import ElForm from 'element-ui/packages/form/src/form.vue'  /* 用于源码调试Element UI */
import emitter from '@/components/FormDesigner/utils/emitter';
import './container-item/index';
import FieldComponents from '@/components/FormDesigner/form-widget/field-widget/index';
import {
  generateId,
  deepClone,
  insertCustomCssToHead,
  insertGlobalFunctionsToHtml,
  getAllContainerWidgets,
  getAllFieldWidgets,
  traverseFieldWidgets,
  buildDefaultFormJson,
} from '@/components/FormDesigner/utils/util';
import i18n, {changeLocale} from '@/components/FormDesigner/utils/i18n';

export default {
  name: 'VFormRender',
  componentName: 'VFormRender',
  components: {
    //ElForm,

    ...FieldComponents,
  },
  mixins: [emitter, i18n],
  provide() {
    return {
      refList: this.widgetRefList,
      sfRefList: this.subFormRefList, //收集SubForm引用
      getFormConfig: () =>
        this.formJsonObj
          .formConfig /* 解决provide传递formConfig属性的响应式更新问题！！ */,
      getGlobalDsv: () => this.globalDsv, // 全局数据源变量
      globalOptionData: this.optionData,
      getOptionData: () =>
        this
          .optionData /* 该方法用于在异步更新option-data之后重新获取到最新值 */,
      globalModel: {
        formModel: this.formDataModel,
      },
      previewState: this.previewState,
    };
  },
  props: {
    formJson: {
      //prop传入的表单JSON配置
      type: Object,
      default: () => buildDefaultFormJson(),
    },
    formData: {
      //prop传入的表单数据
      type: Object,
      default: () => ({}),
    },
    optionData: {
      //prop传入的选项数据
      type: Object,
      default: () => ({}),
    },
    previewState: {
      //是否表单预览状态
      type: Boolean,
      default: false,
    },
    globalDsv: {
      // 全局数据源变量
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      formJsonObj: this.formJson,

      formDataModel: {
        //
      },

      widgetRefList: {},
      subFormRefList: {},
      formId: null, //表单唯一Id，用于区分页面上的多个v-form-render组件！！

      externalComponents: {}, //外部组件实例集合
    };
  },
  computed: {
    formConfig() {
      return this.formJsonObj.formConfig;
    },

    widgetList() {
      return this.formJsonObj.widgetList;
    },

    labelPosition() {
      if (!!this.formConfig && !!this.formConfig.labelPosition) {
        return this.formConfig.labelPosition;
      }

      return 'left';
    },

    labelWidth() {
      if (!!this.formConfig && !!this.formConfig.labelWidth) {
        return this.formConfig.labelWidth + 'px';
      }

      return '80px';
    },

    size() {
      if (!!this.formConfig && !!this.formConfig.size) {
        return this.formConfig.size;
      }

      return 'default';
    },

    customClass() {
      return !!this.formConfig && !!this.formConfig.customClass
        ? this.formConfig.customClass
        : '';
    },
  },
  watch: {
    //
  },
  created() {
    this.buildFormModel(
      !this.formJsonObj ? null : this.formJsonObj.widgetList
    );
    this.initFormObject();
  },
  mounted() {
    this.initLocale();
    this.handleOnMounted();
  },
  methods: {
    initFormObject(insertHtmlCodeFlag = true) {
      this.formId = 'vfRender' + generateId();
      if (insertHtmlCodeFlag) {
        this.insertCustomStyleAndScriptNode();
      }
      this.addFieldChangeEventHandler();
      this.addFieldValidateEventHandler();
      this.registerFormToRefList();
      this.handleOnCreated();
    },

    getContainerWidgetName(widget) {
      if (widget.type === 'grid') {
        //grid-item跟VueGridLayout全局注册组件重名，故特殊处理！！
        return 'vf-grid-item';
      }

      return widget.type + '-item';
    },

    getWidgetName(widget) {
      return widget.type + '-widget';
    },

    initLocale() {
      const curLocale = localStorage.getItem('v_form_locale') || 'zh-CN';
      this.changeLanguage(curLocale);
    },

    insertCustomStyleAndScriptNode() {
      if (!!this.formConfig && !!this.formConfig.cssCode) {
        insertCustomCssToHead(
          this.formConfig.cssCode,
          this.previewState ? '' : this.formId
        );
      }

      if (!!this.formConfig && !!this.formConfig.functions) {
        insertGlobalFunctionsToHtml(
          this.formConfig.functions,
          this.previewState ? '' : this.formId
        );
      }
    },

    buildFormModel(widgetList) {
      if (!!widgetList && widgetList.length > 0) {
        widgetList.forEach((wItem) => {
          this.buildDataFromWidget(wItem);
        });
      }
    },

    buildDataFromWidget(wItem) {
      if (wItem.category === 'container') {
        if (wItem.type === 'grid') {
          if (!!wItem.cols && wItem.cols.length > 0) {
            wItem.cols.forEach((childItem) => {
              this.buildDataFromWidget(childItem);
            });
          }
        } else if (wItem.type === 'table') {
          if (!!wItem.rows && wItem.rows.length > 0) {
            wItem.rows.forEach((rowItem) => {
              if (!!rowItem.cols && rowItem.cols.length > 0) {
                rowItem.cols.forEach((colItem) => {
                  this.buildDataFromWidget(colItem);
                });
              }
            });
          }
        } else if (wItem.type === 'tab') {
          if (!!wItem.tabs && wItem.tabs.length > 0) {
            wItem.tabs.forEach((tabItem) => {
              if (!!tabItem.widgetList && tabItem.widgetList.length > 0) {
                tabItem.widgetList.forEach((childItem) => {
                  this.buildDataFromWidget(childItem);
                });
              }
            });
          }
        } else if (wItem.type === 'sub-form') {
          const subFormName = wItem.options.name;
          if (!this.formData.hasOwnProperty(subFormName)) {
            const subFormDataRow = {};
            if (wItem.options.showBlankRow) {
              wItem.widgetList.forEach((subFormItem) => {
                if (subFormItem.formItemFlag) {
                  subFormDataRow[subFormItem.options.name] =
                    subFormItem.options.defaultValue;
                }
              });

              this.formDataModel[subFormName] = [subFormDataRow];
            } else {
              this.formDataModel[subFormName] = [];
            }
          } else {
            const initialValue = this.formData[subFormName];
            this.formDataModel[subFormName] = deepClone(initialValue);
          }
        } else if (wItem.type === 'grid-col' || wItem.type === 'table-cell') {
          if (!!wItem.widgetList && wItem.widgetList.length > 0) {
            wItem.widgetList.forEach((childItem) => {
              this.buildDataFromWidget(childItem);
            });
          }
        } else {
          //自定义容器组件
          if (!!wItem.widgetList && wItem.widgetList.length > 0) {
            wItem.widgetList.forEach((childItem) => {
              this.buildDataFromWidget(childItem);
            });
          }
        }
      } else if (wItem.formItemFlag) {
        if (!this.formData.hasOwnProperty(wItem.options.name)) {
          this.formDataModel[wItem.options.name] = wItem.options.defaultValue;
        } else {
          const initialValue = this.formData[wItem.options.name];
          this.formDataModel[wItem.options.name] = deepClone(initialValue);
        }
      }
    },

    addFieldChangeEventHandler() {
      this.off$('fieldChange'); //移除原有事件监听
      this.on$(
        'fieldChange',
        (fieldName, newValue, oldValue, subFormName, subFormRowIndex) => {
          this.handleFieldDataChange(
            fieldName,
            newValue,
            oldValue,
            subFormName,
            subFormRowIndex
          );
          this.$emit(
            'formChange',
            fieldName,
            newValue,
            oldValue,
            this.formDataModel,
            subFormName,
            subFormRowIndex
          );
        }
      );
    },

    addFieldValidateEventHandler() {
      this.off$('fieldValidation'); //移除原有事件监听
      this.on$('fieldValidation', (fieldName) => {
        this.$refs.renderForm.validateField(fieldName);
      });
    },

    registerFormToRefList() {
      this.widgetRefList.v_form_ref = this;
    },

    handleFieldDataChange(
      fieldName,
      newValue,
      oldValue,
      subFormName,
      subFormRowIndex
    ) {
      if (!!this.formConfig && !!this.formConfig.onFormDataChange) {
        const customFunc = new Function(
          'fieldName',
          'newValue',
          'oldValue',
          'formModel',
          'subFormName',
          'subFormRowIndex',
          this.formConfig.onFormDataChange
        );
        customFunc.call(
          this,
          fieldName,
          newValue,
          oldValue,
          this.formDataModel,
          subFormName,
          subFormRowIndex
        );
      }
    },

    handleOnCreated() {
      if (!!this.formConfig && !!this.formConfig.onFormCreated) {
        const customFunc = new Function(this.formConfig.onFormCreated);
        customFunc.call(this);
      }
    },

    handleOnMounted() {
      if (!!this.formConfig && !!this.formConfig.onFormMounted) {
        const customFunc = new Function(this.formConfig.onFormMounted);
        customFunc.call(this);
      }
    },

    findWidgetAndSetDisabled(widgetName, disabledFlag) {
      const foundW = this.getWidgetRef(widgetName);
      if (foundW) {
        foundW.setDisabled(disabledFlag);
      } else {
        //没找到，可能是子表单中的组件
        this.findWidgetOfSubFormAndSetDisabled(widgetName, disabledFlag);
      }
    },

    findWidgetOfSubFormAndSetDisabled(widgetName, disabledFlag) {
      this.findWidgetNameInSubForm(widgetName).forEach((wn) => {
        const sw = this.getWidgetRef(wn);
        if (sw) {
          sw.setDisabled(disabledFlag);
        }
      });
    },

    findWidgetAndSetHidden(widgetName, hiddenFlag) {
      const foundW = this.getWidgetRef(widgetName);
      if (foundW) {
        foundW.setHidden(hiddenFlag);
      } else {
        //没找到，可能是子表单中的组件
        this.findWidgetOfSubFormAndSetHidden(widgetName, hiddenFlag);
      }
    },

    findWidgetOfSubFormAndSetHidden(widgetName, hiddenFlag) {
      this.findWidgetNameInSubForm(widgetName).forEach((wn) => {
        const sw = this.getWidgetRef(wn);
        if (sw) {
          sw.setHidden(hiddenFlag);
        }
      });
    },

    findWidgetNameInSubForm(widgetName) {
      const result = [];
      let subFormName = null;
      const handlerFn = (field, parent) => {
        if (!!field.options && field.options.name === widgetName) {
          subFormName = parent.options.name;
        }
      };
      traverseFieldWidgets(this.widgetList, handlerFn);

      if (subFormName) {
        const subFormRef = this.getWidgetRef(subFormName);
        if (subFormRef) {
          const rowIds = subFormRef.getRowIdData();
          if (!!rowIds && rowIds.length > 0) {
            rowIds.forEach((rid) => {
              result.push(widgetName + '@row' + rid);
            });
          }
        }
      }

      return result;
    },

    //--------------------- 以下为组件支持外部调用的API方法 begin ------------------//
    /* 提示：用户可自行扩充这些方法！！！ */

    changeLanguage(langName) {
      changeLocale(langName);
    },

    getNativeForm() {
      //获取原生form引用
      return this.$refs.renderForm;
    },

    getFormRef() {
      return this;
    },

    getWidgetRef(widgetName, showError = false) {
      const foundRef = this.widgetRefList[widgetName];
      if (!foundRef && !!showError) {
        this.$message.error(
          this.i18nt('render.hint.refNotFound') + widgetName
        );
      }
      return foundRef;
    },

    clearFormDataModel() {
      for (const pkey in this.formDataModel) {
        delete this.formDataModel[pkey];
      }
    },

    /**
     * 动态加载表单JSON
     * @param newFormJson
     */
    setFormJson(newFormJson) {
      if (newFormJson) {
        if (
          typeof newFormJson === 'string' ||
          newFormJson.constructor === Object
        ) {
          let newFormJsonObj = null;
          if (typeof newFormJson === 'string') {
            newFormJsonObj = JSON.parse(newFormJson);
          } else {
            newFormJsonObj = newFormJson;
          }

          if (!newFormJsonObj.formConfig || !newFormJsonObj.widgetList) {
            this.$message.error('Invalid format of form json.');
            return;
          }

          /* formDataModel必须在widgetList赋值完成初始化，因为widgetList赋值意味着子组件开始创建！！！ */
          //this.formDataModel = {}  //清空表单数据对象（有bug，会导致表单校验失败！！）
          this.clearFormDataModel(); //上行代码有问题，会导致表单校验失败，故保留原对象引用只清空对象属性！！
          this.buildFormModel(newFormJsonObj.widgetList);

          this.formJsonObj.formConfig = newFormJsonObj.formConfig;
          this.formJsonObj.widgetList = newFormJsonObj.widgetList;

          this.insertCustomStyleAndScriptNode(); /* 必须先插入表单全局函数，否则VForm内部引用全局函数会报错！！！ */
          this.$nextTick(() => {
            this.initFormObject(false);
            this.handleOnMounted();
          });
        } else {
          this.$message.error('Set form json failed.');
        }
      }
    },

    /**
     * 重新加载选项数据
     * @param widgetNames 指定重新加载的组件名称或组件名数组，不传则重新加载所有选项字段
     */
    reloadOptionData(widgetNames) {
      let eventParams = [];
      if (!!widgetNames && typeof widgetNames === 'string') {
        eventParams = [widgetNames];
      } else if (!!widgetNames && Array.isArray(widgetNames)) {
        eventParams = [...widgetNames];
      }
      this.broadcast('FieldWidget', 'reloadOptionItems', eventParams);
    },

    getFormData(needValidation = true) {
      if (!needValidation) {
        return this.formDataModel;
      }

      let callback = function nullFunc() {
      };
      const promise = new window.Promise(function (resolve, reject) {
        callback = function (formData, error) {
          !error ? resolve(formData) : reject(error);
        };
      });

      this.$refs.renderForm.validate((valid) => {
        if (valid) {
          callback(this.formDataModel);
        } else {
          callback(
            this.formDataModel,
            this.i18nt('render.hint.validationFailed')
          );
        }
      });

      return promise;
    },

    setFormData(formData) {
      //设置表单数据
      Object.keys(this.formDataModel).forEach((propName) => {
        if (!!formData && formData.hasOwnProperty(propName)) {
          this.formDataModel[propName] = deepClone(formData[propName]);
        }
      });

      // 通知SubForm组件：表单数据更新事件！！
      this.broadcast('ContainerItem', 'setFormData', this.formDataModel);
      // 通知FieldWidget组件：表单数据更新事件！！
      this.broadcast('FieldWidget', 'setFormData', this.formDataModel);
    },

    getFieldValue(fieldName) {
      //单个字段获取值
      const fieldRef = this.getWidgetRef(fieldName);
      if (!!fieldRef && !!fieldRef.getValue) {
        return fieldRef.getValue();
      }

      if (!fieldRef) {
        //如果是子表单字段
        const result = [];
        this.findWidgetNameInSubForm(fieldName).forEach((wn) => {
          const sw = this.getWidgetRef(wn);
          if (!!sw && !!sw.getValue) {
            result.push(sw.getValue());
          }
        });

        return result;
      }
    },

    setFieldValue(fieldName, fieldValue) {
      //单个更新字段值
      const fieldRef = this.getWidgetRef(fieldName);
      if (!!fieldRef && !!fieldRef.setValue) {
        fieldRef.setValue(fieldValue);
      }

      if (!fieldRef) {
        //如果是子表单字段
        this.findWidgetNameInSubForm(fieldName).forEach((wn) => {
          const sw = this.getWidgetRef(wn);
          if (!!sw && !!sw.setValue) {
            sw.setValue(fieldValue);
          }
        });
      }
    },

    getSubFormValues(subFormName, needValidation = true) {
      const foundSFRef = this.subFormRefList[subFormName];
      // if (!foundSFRef) {
      //   return this.formDataModel[subFormName]
      // }
      return foundSFRef.getSubFormValues(needValidation);
    },

    disableForm() {
      const wNameList = Object.keys(this.widgetRefList);
      wNameList.forEach((wName) => {
        const foundW = this.getWidgetRef(wName);
        if (foundW) {
          if (!!foundW.widget && foundW.widget.type === 'sub-form') {
            foundW.disableSubForm();
          } else {
            //!!foundW.setDisabled && foundW.setDisabled(true)
            if (foundW.setDisabled) {
              foundW.setDisabled(true);
            }
          }
        }
      });
    },

    enableForm() {
      const wNameList = Object.keys(this.widgetRefList);
      wNameList.forEach((wName) => {
        const foundW = this.getWidgetRef(wName);
        if (foundW) {
          if (!!foundW.widget && foundW.widget.type === 'sub-form') {
            foundW.enableSubForm();
          } else {
            //!!foundW.setDisabled && foundW.setDisabled(false)
            if (foundW.setDisabled) {
              foundW.setDisabled(false);
            }
          }
        }
      });
    },

    resetForm() {
      //重置表单
      const subFormNames = Object.keys(this.subFormRefList);
      subFormNames.forEach((sfName) => {
        if (this.subFormRefList[sfName].resetSubForm) {
          this.subFormRefList[sfName].resetSubForm();
        }
      });

      const wNameList = Object.keys(this.widgetRefList);
      wNameList.forEach((wName) => {
        const foundW = this.getWidgetRef(wName);
        if (!!foundW && !foundW.subFormItemFlag && !!foundW.resetField) {
          // 跳过子表单字段！！
          foundW.resetField();
        }
      });

      this.$nextTick(() => {
        this.clearValidate(); /* 清除resetField方法触发的校验错误提示 */
      });
    },

    clearValidate(props) {
      this.$refs.renderForm.clearValidate(props);
    },

    /**
     * 校验表单
     * @param callback 回调函数
     */
    validateForm(callback) {
      this.$refs.renderForm.validate((valid) => {
        callback(valid);
      });
    },

    validateFields() {
      //
    },

    disableWidgets(widgetNames) {
      if (widgetNames) {
        if (typeof widgetNames === 'string') {
          this.findWidgetAndSetDisabled(widgetNames, true);
        } else if (Array.isArray(widgetNames)) {
          widgetNames.forEach((wn) => {
            this.findWidgetAndSetDisabled(wn, true);
          });
        }
      }
    },

    enableWidgets(widgetNames) {
      if (widgetNames) {
        if (typeof widgetNames === 'string') {
          this.findWidgetAndSetDisabled(widgetNames, false);
        } else if (Array.isArray(widgetNames)) {
          widgetNames.forEach((wn) => {
            this.findWidgetAndSetDisabled(wn, false);
          });
        }
      }
    },

    hideWidgets(widgetNames) {
      if (widgetNames) {
        if (typeof widgetNames === 'string') {
          this.findWidgetAndSetHidden(widgetNames, true);
        } else if (Array.isArray(widgetNames)) {
          widgetNames.forEach((wn) => {
            this.findWidgetAndSetHidden(wn, true);
          });
        }
      }
    },

    showWidgets(widgetNames) {
      if (widgetNames) {
        if (typeof widgetNames === 'string') {
          this.findWidgetAndSetHidden(widgetNames, false);
        } else if (Array.isArray(widgetNames)) {
          widgetNames.forEach((wn) => {
            this.findWidgetAndSetHidden(wn, false);
          });
        }
      }
    },

    /**
     * 获取所有字段组件
     * @returns {*[]}
     */
    getFieldWidgets() {
      return getAllFieldWidgets(this.formJsonObj.widgetList);
    },

    /**
     * 获取所有容器组件
     * @returns {*[]}
     */
    getContainerWidgets() {
      return getAllContainerWidgets(this.formJsonObj.widgetList);
    },

    /**
     * 增加外部组件引用，可通过getEC()方法获取外部组件，以便在VForm内部调用外部组件方法
     * @param componentName 外部组件名称
     * @param externalComponent 外部组件实例
     */
    addEC(componentName, externalComponent) {
      this.externalComponents[componentName] = externalComponent;
    },

    /**
     * 判断外部组件是否可获取
     * @param componentName 外部组件名称
     * @returns {boolean}
     */
    hasEC(componentName) {
      return this.externalComponents.hasOwnProperty(componentName);
    },

    /**
     * 获取外部组件实例
     * @param componentName
     * @returns {*}
     */
    getEC(componentName) {
      return this.externalComponents[componentName];
    },

    /**
     * 获取globalDsv对象
     * @returns {*}
     */
    getGlobalDsv() {
      return this.globalDsv;
    },

    //--------------------- 以上为组件支持外部调用的API方法 end ------------------//
  },
};
</script>

<style lang="scss" scoped>
.el-form :deep(.el-row) {
  padding: 8px;
}
</style>