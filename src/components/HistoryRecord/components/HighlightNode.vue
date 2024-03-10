<template>
  <div v-if="Object.keys(highlightNode).length !== 0" class="root">
    <DesignerDetails
      id="highlightNode"
      :xml="highlightNode.xml"
      :settings="settings"
    />
    <el-card v-show="open" id="nodeInfo" class="box-card">
      <div v-for="(item, index) in nodeInfoItem" :key="index">
        <HistoryNodeInfo :node-item="item"/>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {ref, watch, onBeforeUnmount, nextTick} from 'vue';
import DesignerDetails from '@/components/BpmnJs/components/Designer';
import Popper from 'popper.js';
import type Modeler from 'bpmn-js/lib/Modeler';
import Canvas from 'diagram-js/lib/core/Canvas';
import eventBus from '@/utils/eventBus';
import HistoryNodeInfo from './HistoryNodeInfo.vue';

// 弹框实例
let bpmnModeler: Modeler;
// 弹框实例
let popper: Popper;
// 是否显示
const open = ref<boolean>(false);
// 选择的历史审批记录
const nodeInfoItem = ref<any[]>([]);

// bpmn配置
const settings = {
  processEngine: 'activiti',
  paletteMode: 'custom',
  contextPadMode: 'custom',
};

const pops = defineProps({
  // 流程图高亮信息
  highlightNode: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

watch(
  () => pops.highlightNode,
  async () => {
    // 高亮流程图
    setTimeout(() => {
      const canvas: Canvas = bpmnModeler?.get('canvas');
      if (Object.keys(pops.highlightNode).length === 0) return;
      nextTick(() => {
        pops.highlightNode.nodeInfo.forEach((item) => {
          canvas.addMarker(
            item.activityId,
            // eslint-disable-next-line eqeqeq
            item.status == 1 ? 'executed' : 'unfinished'
          );
        });
      });
    }, 50);
  },
  {deep: true, immediate: true}
);

/**
 * 弹出节点信息
 * @param elementId 节点id
 */
const showNodeInfo = (elementId: string) => {
  nodeInfoItem.value = pops.highlightNode.nodeInfo.find(
    (t: any) => t.activityId === elementId
  )?.historyRecordVo;
  if (!nodeInfoItem.value) return;

  const element = document.querySelector(
    `[data-element-id='${elementId}']`
  ) as HTMLElement;
  const nodeInfo = document.querySelector(`#nodeInfo`) as HTMLElement;
  open.value = true;
  popper = new Popper(element, nodeInfo, {
    placement: 'bottom',
  });
};

/**
 * 获取bpmn事件
 */
eventBus.on('modelerInit', ({modeler}: { modeler: any }) => {
  bpmnModeler = modeler;
  // 移入移出节点
  let elementId: string;
  modeler.on('element.hover', (event) => {
    // 移出时摧毁上一个
    // eslint-disable-next-line eqeqeq
    if (elementId && event.element.id != elementId) {
      popper?.destroy();
      open.value = false;
    }
    // 移入的如果是用户节点，就弹出框
    if (event.element.type === 'bpmn:UserTask') {
      showNodeInfo(event.element.id);
    }
    elementId = event.element.id;
  });
});

/**
 * 销毁事件，防止重复触发
 */
onBeforeUnmount(async () => {
  await eventBus.off('modelerInit');
});
</script>

<style scoped>
.root {
  height: 100%;
}

#highlightNode {
  height: 100%;
}
</style>
