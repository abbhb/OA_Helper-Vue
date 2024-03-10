<template>
  <div v-if="false">
    <el-divider content-position="left">启动器配置</el-divider>
    <el-form label-width="80px">
      <el-form-item label="异步前">
        <el-input v-model="initiator" @change="setElementInitiator"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from "vue";
import {getInitiatorValue, setInitiatorValue} from "@/components/BpmnJs/bo-utils/initiatorUtil";
import {modelerStore} from "@/store";
import {Element} from "bpmn-js/lib/model/Types";
import eventBus from "@/utils/eventBus";

export default defineComponent({
  name: "ElementStartInitiator",
  setup() {
    const modelerStores = modelerStore();
    const getActive = computed<Element | null>(() => modelerStores.getActive);
    const initiator = ref<string | undefined>("");

    const getElementInitiator = () => {
      initiator.value = getInitiatorValue(getActive.value!);
    };
    const setElementInitiator = (value: string | undefined) => {
      setInitiatorValue(getActive.value!, value);
    };

    onMounted(() => {
      getElementInitiator();
      eventBus.on("elementUpdate", getElementInitiator);
    });

    return {
      initiator,
      setElementInitiator
    };
  }
});
</script>

