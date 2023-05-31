<template>
    <div class="wrappers">
        <div class="container">
            <div class="left-side">
                <UploadPrint />
            </div>
            <div class="right-side">
                <a-grid :cols="24" :row-gap="16">
                    <a-grid-item :span="24">
                        <div class="panel moduler-wrap">
                            <QuickOperation />
                        </div>
                    </a-grid-item>
                    <a-grid-item :span="24">
                        <div class="panel moduler-wrap">
                            <DeviceState />
                        </div>
                    </a-grid-item>
                </a-grid>
            </div>
        </div>
        <PrinterTaskList class="footer-wrap" />

    </div>



</template>

<script lang="ts">
  import axios from 'axios';
  import DeviceState from '@/views/dashboard/printer/components/DeviceState.vue';
  import UploadPrint from '@/views/dashboard/printer/components/UploadPrint.vue';
  import PrinterTaskList from '@/views/dashboard/printer/components/printerTaskList.vue';
  import QuickOperation from "@/views/dashboard/workplace/components/quick-operation.vue";


  export default {
    components: {
        QuickOperation,
        PrinterTaskList, UploadPrint, DeviceState },
    setup() {
      axios.defaults.withCredentials = true;
    },
  };
</script>

<style scoped>
    .wrappers{
        display: flex;
        flex-direction: column;
        height: 100%;
    }
  .container {
    background-color: var(--color-fill-2);
    padding: 16px 20px;
    padding-bottom: 0;
    display: flex;
    flex-direction: row;
  }

  .left-side {
    flex: 1;
    overflow: auto;
  }

  .right-side {
    width: 280px;
    margin-left: 16px;
  }
  .footer-wrap {
      padding: 10px 10px 10px 10px;
  }
</style>

<style lang="less">
  .message-popover {
    .arco-popover-content {
      margin-top: 0;
    }
  }
</style>
