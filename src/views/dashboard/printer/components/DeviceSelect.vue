<script setup lang="ts">
  // 核心的数据由这个组件负责维护

  import { onBeforeUnmount, onMounted, ref } from 'vue';
  import usePrintStore from '@/store/modules/print';
  import { useAppStore } from '@/store';
  import { PrintDeviceImpl } from '@/utils/print/PrintDeviceImpl';
  import { Message } from '@arco-design/web-vue';
  import { useRouter } from 'vue-router';
  import { IconSwap } from '@arco-design/web-vue/es/icon';

  const printState = usePrintStore();
  const appState = useAppStore();
  const caozuo = ref(0);
  const listDevice = ref(printState.printDeviceList);
  const router = useRouter();

  const changeNewPrintDevice = async () => {
    // 这时候选择默认可使用的打印机，优先type为1的，依次往后
    let zuikuaideIndex = 999;
    let zuixiaodezhuangtai = 999;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < printState.printDeviceList.length; i++) {
      if (
        printState.printDeviceList[i].status < zuixiaodezhuangtai &&
        printState.printDeviceList[i].status !== 0
      ) {
        zuixiaodezhuangtai = printState.printDeviceList[i].status;
        zuikuaideIndex = i;
      }
    }
    if (zuikuaideIndex === 999 && zuixiaodezhuangtai === 999) {
      // 压根没有设备，告知用户
      Message.info('当前可能所有打印机都寄掉了！');
    } else {
      printState.printDevice = printState.printDeviceList[zuikuaideIndex];
      await appState.changePrintDevice(
        printState.printDeviceList[zuikuaideIndex].id
      ); // 并且写入用户上次的选择
      // 操作数据后更新视图
    }
  };

  // 在页面挂载后执行初始化工作
  onMounted(async () => {
    await printState.getDevicePollCode();
    // 数据加载、DOM 操作等
    printState.startPolling();
    if (appState.lastPrintDevice === '' && printState.printDevice == null) {
      changeNewPrintDevice();
    } else if (
      appState.lastPrintDevice !== '' &&
      printState.printDevice == null
    ) {
      // todo:还要判断是不是这次还存在着这个
      const lastDevice = printState.isHavePrintDevice(appState.lastPrintDevice);
      if (lastDevice !== false && typeof PrintDeviceImpl) {
        // 直接选择上次的
        // @ts-ignore
        printState.printDevice = lastDevice;
        console.log('更新');
        caozuo.value += 1;
        // @ts-ignore
        await appState.changePrintDevice(lastDevice.id); // 并且写入用户上次的选择
      } else {
        await changeNewPrintDevice();
      }
    }
  });
  // 在页面销毁前执行清理工作
  onBeforeUnmount(() => {
    // 取消订阅、清除定时器、释放资源等
    printState.stopPolling();
  });
  const handleCancel = () => {
    printState.stopSelect();
  };
  const changeOtherPrintDevice = async (record) => {
    printState.setPrintDevice(record.id);
    await appState.changePrintDevice(record.id); // 并且写入用户上次的选择
    Message.success('更换打印机成功');
    printState.isSelecting = false;
  };
  const goToRegisterPrinter = () => {
    router.push({ name: 'printerManager' });
    printState.isSelecting = false; // 关闭选择弹框
  };
</script>

<template>
  <div>
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
        <div
          v-if="printState.printDevice === null"
          style="
            position: relative;
            border: 1px solid #ccc;
            flex-direction: row;
            align-items: center;
            height: 35px;
          "
        >
          <div>
            <span style="font-size: 18px; color: red">未选择打印机</span>
          </div>
          <a-button
            :shape="'circle'"
            :type="'primary'"
            style="position: absolute; right: 1px; top: 0px"
            @click="printState.startSelect()"
            >选择</a-button
          >
        </div>

        <div
          v-else
          style="
            display: flex;
            flex-direction: row;
            padding: 3px 8px 3px 8px;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div>
            {{ printState.printDevice.name }}
          </div>
          <a-button size="mini" type="text" @click="printState.startSelect()">
            <template #icon>
              <icon-swap />
            </template>
            更换
          </a-button>
        </div>
      </div>
    </a-card>
    <a-modal
      v-model:visible="printState.isSelecting"
      :draggable="true"
      :footer="false"
      :fullscreen="appState.modelFullscreen"
      :hide-cancel="false"
      :width="755"
      unmount-on-close
      @close="handleCancel()"
    >
      <template #title>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <span>选择打印机</span>
        </div>
      </template>

      <a-table :data="printState.printDeviceList">
        <template #columns>
          <a-table-column title="打印机名" data-index="name"></a-table-column>
          <a-table-column
            title="打印机描述"
            data-index="description"
          ></a-table-column>
          <a-table-column title="状态">
            <template #cell="{ record }">
              <a-tag
                :color="
                  record.status === 1
                    ? 'green'
                    : record.status === 0
                    ? 'red'
                    : 'yellow'
                "
                >{{ record.statusTypeMessage }}</a-tag
              >
            </template>
          </a-table-column>
          <a-table-column
            title="当前任务数"
            data-index="listNums"
          ></a-table-column>
          <a-table-column title="操作">
            <template #cell="{ record }">
              <a-button @click="changeOtherPrintDevice(record)">选择</a-button>
            </template>
          </a-table-column>
        </template>
      </a-table>

      <div
        style="
          position: absolute;
          left: 20px;
          bottom: 20px;
          display: flex;
          align-items: center;
          cursor: pointer;
        "
        @click="goToRegisterPrinter"
      >
        <icon-exclamation-circle-fill
          style="color: #165dff; margin-right: 4px"
        />
        <span style="color: #165dff; font-size: 14px"
          >想要注册新的打印机？点击这里</span
        >
      </div>
    </a-modal>
  </div>
</template>

<style scoped lang="less"></style>
