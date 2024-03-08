<script lang="ts" setup>
import {ref} from "vue";

const config = {
  disabled: {
    showBaseForm: true
  }
};

const designer = ref();
const fApi = ref({});
const onSubmit = (formData) => {
  alert(JSON.stringify(formData))

}
const options = ref({
  onSubmit,
  resetBtn: true
});
const jso = ref([{"type": "inputNumber", "field": "Frp01olvwbwh2h", "title": "计数器", "info": "", "$required": false, "_fc_drag_tag": "inputNumber", "hidden": false, "display": true}, {"type": "select", "field": "Fpa51olvwbxotk", "title": "选择器", "info": "", "effect": {"fetch": ""}, "$required": false, "options": [{"label": "选项1", "value": 1}, {"label": "选项2", "value": 2}], "_fc_drag_tag": "select", "hidden": false, "display": true}, {"type": "input", "field": "Ftzf1olvwbyxvv", "title": "输入框", "info": "", "$required": false, "_fc_drag_tag": "input", "hidden": false, "display": true}, {"type": "checkbox", "field": "Ft2b1olvwc086m", "title": "多选框", "info": "", "effect": {"fetch": ""}, "$required": false, "options": [{"label": "选项1", "value": 1}, {"label": "选项2", "value": 2}], "_fc_drag_tag": "checkbox", "hidden": false, "display": true}])
const dianji = () => {
  const json = designer.value.getJson()
  const r = designer.value.getOption()
  const rule = designer.value.getRule()
  console.log(json)
  console.log(r)
  console.log(rule)
}
</script>

<template>
  <div>
    <!--  <fc-designer :config="config" ref="designer" height="820px"/>-->
    <form-create v-model:api="fApi" :option="options" :rule="jso"/>
    <a-button @click="dianji">111</a-button>
  </div>
</template>

<style lang="less" scoped>

</style>