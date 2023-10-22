<script setup lang="ts">
  // 核心的数据由这个组件负责维护

  import {onBeforeUnmount, onMounted, ref} from 'vue';
  import { PrintDeviceResp } from '@/api/printer';
  import usePrintStore from '@/store/modules/print';

  const printState = usePrintStore();

  const listDevice = ref(printState.printDeviceList);
  const mySelect = ref(printState.printDevice);

  // 在页面挂载后执行初始化工作
  onMounted(() => {
    // 数据加载、DOM 操作等
    printState.startPolling();

  });
  // 在页面销毁前执行清理工作
  onBeforeUnmount(() => {
    // 取消订阅、清除定时器、释放资源等
    printState.stopPolling();
  });

</script>

<template>
  <a-card
    class="general-card"
    :title="$t('printer.one.device.select')"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ padding: '12px 12px 20px 20px' }"
  >
    <div style="border: 1px #d7d6d6 solid; border-radius: 5px">
<!--      <a-select :style="{ width: '100%' }" :bordered="false" field-names="statusTypeMessage">-->
<!--        <template #label="{ data }">-->
<!--          <span><a-tag color="green">{{data}}</a-tag>{{ data?.label }}</span>-->
<!--        </template>-->
<!--        <a-option v-for="item in listDevice" :key="item" :value="item.id" :extra="item"-->
<!--          >{{item.name}}</a-option-->
<!--        >-->
<!--      </a-select>-->
      <div v-if="mySelect==null" style="position:relative;border:1px solid #ccc;flex-direction: row;align-items: center;height: 35px;">
        <div>
          <span style="font-size: 18px;color: red">未选择打印机</span>
      </div>

        <a-button :shape="'circle'" :type="'primary'" style="position: absolute;right: 1px;top: 0px;">选择</a-button>
      </div>

      <div v-else style="display:flex;flex-direction: row;padding: 3px 3px 3px 3px">
        <div style="display: flex;flex-direction: column;padding: 3px 3px 3px 3px">
          <div class="titles">
            打印机
          </div>
          <div class="miaoshu">
            {{mySelect.name}}
          </div>

        </div>
        <div class="zhuangtai">
          <a-tag :color="String(mySelect.status)==='1'?'green':String(mySelect.status)==='0'?'red':'yellow'">{{mySelect.statusTypeMessage}}</a-tag>
        </div>
        <div style="display: flex;flex-direction: column">
          <div class="titles">
            等待队列
          </div>
          <div class="dengdai">
            {{mySelect.listNums}}
          </div>

        </div>
      </div>

    </div>
  </a-card>
</template>

<style scoped lang="less"></style>
