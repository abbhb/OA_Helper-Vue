<script lang="ts" setup>
import {signinDeviceList} from '@/api/signin';
import {ref} from 'vue';

const emit = defineEmits(['commitWay']);
const props = defineProps({
  added: {
    type: Array,
  },
});
const allDeviceList = ref([]);
// 初始化可添加设备列表
const initDevice = async () => {
  const {data} = await signinDeviceList();
  allDeviceList.value = data;
};
initDevice();

const addHandel = (record) => {
  emit('commitWay', record.deviceId);
}
</script>

<template>
  <div>
    <a-table
      :bordered="false"
      :data="allDeviceList"
      :pagination="false"
      :size="'medium'"
      row-key="deviceId"
    >
      <template #columns>


        <a-table-column
          :width="200"
          title="设备名"
        >
          <template #cell="{ record }">
            {{ record.name }}
          </template>
        </a-table-column>
        <a-table-column
          :width="200"
          title="在线"
        >
          <template #cell="{ record }">
            {{ record.online }}
          </template>
        </a-table-column>
        <a-table-column
          :width="200"
          title="支持"
        >
          <template #cell="{ record }">
            {{ record.support }}
          </template>
        </a-table-column>

        <a-table-column title="操作">
          <template #cell="{ record }">
            <a-button :disabled="props.added.includes(record.deviceId)" @click="addHandel(record)">
              {{ props.added.includes(record.deviceId) ? '已添加' : '添加' }}
            </a-button>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
