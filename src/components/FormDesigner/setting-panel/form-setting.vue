<template>
  <div>
    <el-form
      :model="formConfig"
      size="small"
      label-position="left"
      label-width="120px"
      class="setting-form"
      @submit.prevent
    >
      <el-collapse v-model="formActiveCollapseNames" class="setting-collapse">
        <el-collapse-item
          name="1"
          :title="i18nt('designer.setting.basicSetting')"
        >
          <el-form-item :label="i18nt('designer.setting.formSize')">
            <el-select v-model="/* eslint-disable-next-line vue/no-mutating-props */
            formConfig.size">
              <el-option
                v-for="item in formSizes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="i18nt('designer.setting.labelPosition')">
            <el-radio-group
              v-model="/* eslint-disable-next-line vue/no-mutating-props */
              formConfig.labelPosition"
              class="radio-group-custom"
            >
              <el-radio-button label="left">{{
                i18nt('designer.setting.leftPosition')
                }}
              </el-radio-button>
              <el-radio-button label="top">{{
                i18nt('designer.setting.topPosition')
                }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="i18nt('designer.setting.labelAlign')">
            <el-radio-group
              v-model="/* eslint-disable-next-line vue/no-mutating-props */
              formConfig.labelAlign"
              class="radio-group-custom"
            >
              <el-radio-button label="label-left-align">{{
                i18nt('designer.setting.leftAlign')
                }}
              </el-radio-button>
              <el-radio-button label="label-center-align">{{
                i18nt('designer.setting.centerAlign')
                }}
              </el-radio-button>
              <el-radio-button label="label-right-align">{{
                i18nt('designer.setting.rightAlign')
                }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="i18nt('designer.setting.labelWidth')">
            <el-input-number
              v-model="/* eslint-disable-next-line vue/no-mutating-props */
              formConfig.labelWidth"
              :min="0"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
          <el-form-item :label="i18nt('designer.setting.formCss')">
            <el-button
              type="info"
              icon="el-icon-edit"
              plain
              round
              @click="editFormCss"
            >{{ i18nt('designer.setting.addCss') }}
            </el-button
            >
          </el-form-item>
          <!-- -->
          <el-form-item :label="i18nt('designer.setting.customClass')">
            <el-select
              v-model="
              /* eslint-disable-next-line vue/no-mutating-props */
              formConfig.customClass"
              multiple
              filterable
              allow-create
              default-first-option
            >
              <el-option
                v-for="(item, idx) in cssClassList"
                :key="idx"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- -->
          <el-form-item :label="i18nt('designer.setting.globalFunctions')">
            <el-button
              type="info"
              icon="el-icon-edit"
              plain
              round
              @click="editGlobalFunctions"
            >{{ i18nt('designer.setting.addEventHandler') }}
            </el-button
            >
          </el-form-item>
          <el-form-item label-width="0">
            <el-divider class="custom-divider">{{
              i18nt('designer.setting.formSFCSetting')
              }}
            </el-divider>
          </el-form-item>
          <el-form-item :label="i18nt('designer.setting.formModelName')">
            <el-input v-model="
/* eslint-disable-next-line vue/no-mutating-props */
formConfig.modelName" type="text"></el-input>
          </el-form-item>
          <el-form-item :label="i18nt('designer.setting.formRefName')">
            <el-input v-model="/* eslint-disable-next-line vue/no-mutating-props */
            formConfig.refName" type="text"></el-input>
          </el-form-item>
          <el-form-item :label="i18nt('designer.setting.formRulesName')">
            <el-input v-model="/* eslint-disable-next-line vue/no-mutating-props */
            formConfig.rulesName" type="text"></el-input>
          </el-form-item>
        </el-collapse-item>

        <el-collapse-item
          v-if="showEventCollapse()"
          name="2"
          :title="i18nt('designer.setting.eventSetting')"
        >
          <el-form-item label="onFormCreated" label-width="150px">
            <el-button
              type="info"
              icon="el-icon-edit"
              plain
              round
              @click="editFormEventHandler('onFormCreated')"
            >
              {{ i18nt('designer.setting.addEventHandler') }}
            </el-button
            >
          </el-form-item>
          <el-form-item label="onFormMounted" label-width="150px">
            <el-button
              type="info"
              icon="el-icon-edit"
              plain
              round
              @click="editFormEventHandler('onFormMounted')"
            >
              {{ i18nt('designer.setting.addEventHandler') }}
            </el-button
            >
          </el-form-item>
          <!-- -->
          <el-form-item label="onFormDataChange" label-width="150px">
            <el-button
              type="info"
              icon="el-icon-edit"
              plain
              round
              @click="editFormEventHandler('onFormDataChange')"
            >
              {{ i18nt('designer.setting.addEventHandler') }}
            </el-button
            >
          </el-form-item>
          <!-- -->
          <!--
          <el-form-item label="onFormValidate">
            <el-button type="info" icon="el-icon-edit" plain round @click="editFormEventHandler('onFormValidate')">
              {{i18nt('designer.setting.addEventHandler')}}</el-button>
          </el-form-item>
          -->
        </el-collapse-item>
      </el-collapse>
    </el-form>

    <div
      v-if="showFormEventDialogFlag"
      v-drag="['.drag-dialog.el-dialog', '.drag-dialog .el-dialog__header']"
      class=""
    >
      <el-dialog
        v-model="showFormEventDialogFlag"
        :title="i18nt('designer.setting.editFormEventHandler')"
        :show-close="true"
        class="drag-dialog small-padding-dialog"
        append-to-body
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
      >
        <el-alert
          type="info"
          :closable="false"
          :title="'form.' + eventParamsMap[curEventName]"
        ></el-alert>
        <code-editor
          ref="ecEditor"
          v-model="formEventHandlerCode"
          :mode="'javascript'"
          :readonly="false"
        ></code-editor>
        <el-alert type="info" :closable="false" title="}"></el-alert>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showFormEventDialogFlag = false">
              {{ i18nt('designer.hint.cancel') }}
            </el-button
            >
            <el-button type="primary" @click="saveFormEventHandler">
              {{ i18nt('designer.hint.confirm') }}
            </el-button
            >
          </div>
        </template>
      </el-dialog>
    </div>

    <div
      v-if="showEditFormCssDialogFlag"
      v-drag="['.drag-dialog.el-dialog', '.drag-dialog .el-dialog__header']"
      class=""
    >
      <el-dialog
        v-model="showEditFormCssDialogFlag"
        :title="i18nt('designer.setting.formCss')"
        :show-close="true"
        class="drag-dialog small-padding-dialog"
        append-to-body
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
      >
        <code-editor
          v-model="formCssCode"
          :mode="'css'"
          :readonly="false"
        ></code-editor>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showEditFormCssDialogFlag = false">
              {{ i18nt('designer.hint.cancel') }}
            </el-button
            >
            <el-button type="primary" @click="saveFormCss">
              {{ i18nt('designer.hint.confirm') }}
            </el-button
            >
          </div>
        </template>
      </el-dialog>
    </div>

    <div
      v-if="showEditFunctionsDialogFlag"
      v-drag="['.drag-dialog.el-dialog', '.drag-dialog .el-dialog__header']"
      class=""
    >
      <el-dialog
        v-model="showEditFunctionsDialogFlag"
        :title="i18nt('designer.setting.globalFunctions')"
        :show-close="true"
        class="drag-dialog small-padding-dialog"
        append-to-body
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
      >
        <code-editor
          ref="gfEditor"
          v-model="functionsCode"
          :mode="'javascript'"
          :readonly="false"
        ></code-editor>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showEditFunctionsDialogFlag = false">
              {{ i18nt('designer.hint.cancel') }}
            </el-button
            >
            <el-button type="primary" @click="saveGlobalFunctions">
              {{ i18nt('designer.hint.confirm') }}
            </el-button
            >
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import i18n from '@/components/FormDesigner/utils/i18n';
import CodeEditor from '@/components/FormDesigner/code-editor/index.vue';
import {
  deepClone,
  insertCustomCssToHead,
  insertGlobalFunctionsToHtml,
} from '@/components/FormDesigner/utils/util';

export default {
  name: 'FormSetting',
  components: {
    CodeEditor,
  },
  mixins: [i18n],
  inject: ['getDesignerConfig'],
  props: {
    designer: Object,
    formConfig: Object,
  },
  data() {
    return {
      designerConfig: this.getDesignerConfig(),

      formActiveCollapseNames: ['1', '2'],

      formSizes: [
        {label: 'default', value: ''},
        {label: 'large', value: 'large'},
        //{label: 'medium', value: 'medium'},
        {label: 'small', value: 'small'},
        //{label: 'mini', value: 'mini'},
      ],

      showEditFormCssDialogFlag: false,
      formCssCode: '',
      cssClassList: [],

      showEditFunctionsDialogFlag: false,
      functionsCode: '',

      showFormEventDialogFlag: false,
      formEventHandlerCode: '',
      curEventName: '',

      eventParamsMap: {
        onFormCreated: 'onFormCreated() {',
        onFormMounted: 'onFormMounted() {',
        onFormDataChange:
          'onFormDataChange(fieldName, newValue, oldValue, formModel, subFormName, subFormRowIndex) {',
        //'onFormValidate':     'onFormValidate() {',
      },
    };
  },
  created() {
    //导入表单JSON后需要重新加载自定义CSS样式！！！
    this.designer.handleEvent('form-json-imported', () => {
      this.formCssCode = this.formConfig.cssCode;
      insertCustomCssToHead(this.formCssCode);
      this.extractCssClass();
      this.designer.emitEvent(
        'form-css-updated',
        deepClone(this.cssClassList)
      );
    });
  },
  mounted() {
    /* SettingPanel和FormWidget为兄弟组件, 在FormWidget加载formConfig时，
       此处SettingPanel可能无法获取到formConfig.cssCode, 故加个延时函数！ */
    setTimeout(() => {
      this.formCssCode = this.formConfig.cssCode;
      insertCustomCssToHead(this.formCssCode);
      this.extractCssClass();
      this.designer.emitEvent(
        'form-css-updated',
        deepClone(this.cssClassList)
      );
    }, 1200);
  },
  methods: {
    showEventCollapse() {
      if (this.designerConfig.eventCollapse === undefined) {
        return true;
      }

      return !!this.designerConfig.eventCollapse;
    },

    editFormCss() {
      this.formCssCode = this.designer.formConfig.cssCode;
      this.showEditFormCssDialogFlag = true;
    },

    extractCssClass() {
      const regExp = /\..*{/g;
      const result = this.formCssCode.match(regExp);
      const cssNameArray = [];

      if (!!result && result.length > 0) {
        result.forEach((rItem) => {
          const classArray = rItem.split(','); //切分逗号分割的多个class
          if (classArray.length > 0) {
            classArray.forEach((cItem) => {
              const caItem = cItem.trim();
              if (caItem.indexOf('.', 1) !== -1) {
                //查找第二个.位置
                const newClass = caItem.substring(
                  caItem.indexOf('.') + 1,
                  caItem.indexOf('.', 1)
                ); //仅截取第一、二个.号之间的class
                if (newClass) {
                  cssNameArray.push(newClass.trim());
                }
              } else if (caItem.indexOf(' ') !== -1) {
                //查找第一个空格位置
                const newClass = caItem.substring(
                  caItem.indexOf('.') + 1,
                  caItem.indexOf(' ')
                ); //仅截取第一、二个.号之间的class
                if (newClass) {
                  cssNameArray.push(newClass.trim());
                }
              } else {
                if (caItem.indexOf('{') !== -1) {
                  //查找第一个{位置
                  const newClass = caItem.substring(
                    caItem.indexOf('.') + 1,
                    caItem.indexOf('{')
                  );
                  cssNameArray.push(newClass.trim());
                } else {
                  const newClass = caItem.substring(caItem.indexOf('.') + 1);
                  cssNameArray.push(newClass.trim());
                }
              }
            });
          }
        });
      }

      //this.cssClassList.length = 0
      this.cssClassList.splice(0, this.cssClassList.length); //清除数组必须用splice，length=0不会响应式更新！！
      this.cssClassList = Array.from(new Set(cssNameArray)); //数组去重
    },

    saveFormCss() {
      this.extractCssClass();
      // eslint-disable-next-line vue/no-mutating-props
      this.designer.formConfig.cssCode = this.formCssCode;
      insertCustomCssToHead(this.formCssCode);
      this.showEditFormCssDialogFlag = false;

      this.designer.emitEvent(
        'form-css-updated',
        deepClone(this.cssClassList)
      );
    },

    editGlobalFunctions() {
      this.functionsCode = this.designer.formConfig.functions;
      this.showEditFunctionsDialogFlag = true;
    },

    saveGlobalFunctions() {
      const codeHints = this.$refs.gfEditor.getEditorAnnotations();
      let syntaxErrorFlag = false;
      if (!!codeHints && codeHints.length > 0) {
        codeHints.forEach((chItem) => {
          if (chItem.type === 'error') {
            syntaxErrorFlag = true;
          }
        });

        if (syntaxErrorFlag) {
          this.$message.error(
            this.i18nt('designer.setting.syntaxCheckWarning')
          );
          return;
        }
      }

      // eslint-disable-next-line vue/no-mutating-props
      this.designer.formConfig.functions = this.functionsCode;
      insertGlobalFunctionsToHtml(this.functionsCode);
      this.showEditFunctionsDialogFlag = false;
    },

    editFormEventHandler(eventName) {
      this.curEventName = eventName;
      this.formEventHandlerCode = this.formConfig[eventName];
      this.showFormEventDialogFlag = true;
    },

    saveFormEventHandler() {
      const codeHints = this.$refs.ecEditor.getEditorAnnotations();
      let syntaxErrorFlag = false;
      if (!!codeHints && codeHints.length > 0) {
        codeHints.forEach((chItem) => {
          if (chItem.type === 'error') {
            syntaxErrorFlag = true;
          }
        });

        if (syntaxErrorFlag) {
          this.$message.error(
            this.i18nt('designer.setting.syntaxCheckWarning')
          );
          return;
        }
      }

      // eslint-disable-next-line vue/no-mutating-props
      this.formConfig[this.curEventName] = this.formEventHandlerCode;
      this.showFormEventDialogFlag = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.setting-form {
  :deep(.el-form-item__label) {
    font-size: 13px;
    //text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  :deep(.el-form-item--small.el-form-item) {
    margin-bottom: 10px;
  }

  .radio-group-custom {
    :deep(.el-radio-button__inner) {
      padding-left: 12px;
      padding-right: 12px;
    }
  }

  .custom-divider.el-divider--horizontal {
    margin: 10px 0;
  }
}

.setting-collapse {
  :deep(.el-collapse-item__content) {
    padding-bottom: 6px;
  }

  :deep(.el-collapse-item__header) {
    font-style: italic;
    font-weight: bold;
  }
}

.small-padding-dialog {
  :deep(.el-dialog__body) {
    padding: 6px 15px 12px 15px;
  }
}
</style>
