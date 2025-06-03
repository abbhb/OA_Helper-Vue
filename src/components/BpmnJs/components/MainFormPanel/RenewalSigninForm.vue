<script setup lang="ts">
import {getRenewalSigninDataByInstantId, SigninRenewalReq} from "@/api/signin";
import {ref,watchEffect} from "vue";
import {Message} from "@arco-design/web-vue";

const loading = ref<boolean>(false);
const props = defineProps({
  taskId: {
    type: String,
    default: '',
  },
});
interface privDataI {
  selectedTimes:string[];
  timeOptions:{ label: string; value: string }[],
  reason:string,
}
const privData = ref<privDataI>({
  selectedTimes:[],
  timeOptions:[],
  reason:'',
});
const renewalSigninData = ref<SigninRenewalReq[]>([]);
const initData = async () => {
  try {
    const { data } = await getRenewalSigninDataByInstantId(props.taskId)
    renewalSigninData.value = data;
    // 示例使用

    const result = transformData(data);
    console.log(result);
    privData.value = result;
  }catch (e) {
    Message.error(e.toString())
  }

}
watchEffect(async () => {
  if (props.taskId) {
    try {
      loading.value = true;
     await initData()
    } finally {
      loading.value = false;
    }
  }
});


function transformData(data) {
  const times = data.map(item => {
    return item.renewalTime;
  });
  // 取第一个对象的 renewalReason 作为 reason
  const reason = data[0].renewalReason;
  // 构造 timeOptions ，每个对象包含 label （格式化后的时间字符串）和 value （原时间字符串）
  const timeOptions = data.map(item => ({
    label: item.renewalTime,
    value: item.renewalTime
  }));
  // 构造并返回目标接口对象
  return {
    selectedTimes: times,
    reason: reason,
    timeOptions: timeOptions
  };
}


</script>

<template>
<div  v-loading="loading">
  <div class="renewal-modal" >
    <div class="time-selection">
      <h4>选择补签时间点：</h4>
      <a-checkbox-group
        :disabled="true"
        v-model="privData.selectedTimes"
        direction="vertical"
      >
        <a-checkbox
          v-for="option in privData.timeOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </a-checkbox>
      </a-checkbox-group>
    </div>

    <div class="reason-input">
      <h4>补签理由：</h4>
      <a-textarea
        :disabled="true"
        v-model="privData.reason"
        placeholder="请输入补签理由"
        :max-length="200"
        show-word-limit
        :auto-size="{
            minRows: 3,
            maxRows: 5
          }"
      />
    </div>
  </div>

</div>
</template>

<style scoped>
.renewal-modal {
  padding: 10px 0;

  .time-selection {
    margin-bottom: 20px;

    h4 {
      margin-bottom: 10px;
      font-weight: 500;
      color: var(--color-text-1);
    }

    :deep(.arco-checkbox-group) {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
      max-height: 300px;
      overflow-y: auto;
      padding: 8px 5px;
      border: 1px solid var(--color-border-2);
      border-radius: 4px;
    }
  }

  .reason-input {
    h4 {
      margin-bottom: 10px;
      font-weight: 500;
      color: var(--color-text-1);
    }
  }
}
</style>