<script lang="ts" setup>
import {onUnmounted, ref} from 'vue';
  import { modelerStore } from '@/store';
  import { getBusinessObject, ModdleElement } from 'bpmn-js/lib/util/ModelUtil';
  import eventBus from '@/utils/eventBus';
  import {
    getExPropValue,
    updateExModdleProp,
  } from '@/components/BpmnJs/bo-utils/popsUtils';

  // 表单参数
  type ServiceTaskProp = 'expression';
  const PROP_KEYS: ServiceTaskProp[] = ['expression'];

  const modeler = modelerStore();

  // element The element.
  let scopedElement: Element;

  // moddleElement The model element.
  let moddleElement: ModdleElement;

  // eslint-disable-next-line no-return-assign
  const EmptyUAForm = PROP_KEYS.reduce((a, b) => (a[b] = '') || a, {});
  // 表单
  const UAForm = ref(EmptyUAForm as Record<ServiceTaskProp, string>);

  /**
   * 更新表单值
   * @param key 表单属性key
   * @param value 表单值
   */
  const updateServiceTaskProp = (key: ServiceTaskProp, value: string) => {
    // 类型改变时清空之前填写的值,代理人、候选人、候选组
    // 更新组件
    updateExModdleProp(scopedElement, moddleElement, key, value);
    // 获取节点数据
    getElementData();
  };

  /**
   * 获取节点数据
   */
  const getElementData = () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const key of PROP_KEYS) {
      UAForm.value[key] = getExPropValue(moddleElement, key) || '';
    }
    if (
      moddleElement?.$type === 'bpmn:ServiceTask' &&
      (!UAForm.value.expression || UAForm.value.expression === '')
    ) {
      UAForm.value.expression = '${serviceTask.hello()}';
      updateServiceTaskProp('expression', UAForm.value.expression);
    }
  };

  // 点击用户节点，初始化用
  eventBus.on('elementInit', function () {
    scopedElement = modeler.getActive;
    moddleElement = getBusinessObject(scopedElement);
    getElementData();
    console.log("ServiceTaskInit--")
    // 重置变量
    // 如果一个都没有选择
    if (
      moddleElement?.$type === 'bpmn:ServiceTask' &&
      UAForm.value.expression === ''
    ) {
      updateServiceTaskProp('expression', UAForm.value.expression);
    }
  });

  const changeService = () => {
    updateServiceTaskProp('expression', UAForm.value.expression);
  };
</script>

<template>
  <div>
    <el-divider content-position="left">服务作业</el-divider>
    <el-form label-width="80px">
      <div class="element-external-task">
        <el-form-item label="expression表达式">
          <el-popover
            :width="200"
            content='
            @Component("serviceTask")
          public class ServiceTask {

          public void updateSigninFaceByUser(DelegateExecution execution,String needDataName){
          System.out.println("===myBean执行====");
          System.out.println("你好："+needDataName);//打印   你好：pictureupload54543
          }
          }'
            placement="top-start"
            title="后端写法"
            trigger="hover"
          >
            <template #reference>
              <el-tag
                >示例: ${serviceTask.updateSigninFaceByUser(execution,'pictureupload54543')}
                为myBean服务里的updateSigninFaceByUser方法,参数execution是流程实例中的一个操作对象，着重注意传常量记得加引号
              </el-tag>
            </template>
          </el-popover>

          <el-input
            v-model:model-value="UAForm.expression"
            @change="changeService"
          />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<style scoped></style>
