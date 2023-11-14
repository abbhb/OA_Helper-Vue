<template>
  <div class="s-upload" title="上传打印">
    <a-spin :loading="tishi.loading" :size="30" style="width: 500px" dot>
      <Upload
        v-if="tishi.showUpload"
        url="/api/printer/uploadPrintFile"
        :draggable="true"
        @on-success="uploadSuccess"
        @on-error="uploadError"
        @on-before="beforeUpload"
      />
      <a-image
        v-else-if="thisPrint.state !== 0 && thisPrint.canGetImage"
        width="300px"
        fit="fill"
        :src="`${thisPrint.imageUrl}`"
      />
      <div v-else>图片获取中，现在可以开始打印了</div>
    </a-spin>

    <a-form :model="thisPrint" :style="{ width: '1200px' }" @submit="MakePrint">
      <a-form-item
        v-if="thisPrint.state !== 0"
        field="file_name"
        label="文件名"
        :rules="[{ required: true, message: '请先上传文件' }]"
      >
        <a-input
          v-model="thisPrint.file_name"
          readonly
          placeholder="请先上传文件"
        />
      </a-form-item>

      <div v-if="thisPrint.state >= 3">
        <a-form-item
          field="uuid"
          label="文件UUID"
          :rules="[{ required: true, message: '请先上传文件' }]"
        >
          <a-input
            v-model="thisPrint.uuid"
            readonly
            placeholder="请先上传文件"
          />
        </a-form-item>

        <a-form-item
          field="page_start"
          label="起始页码"
          :rules="[
            { required: true, message: '起始页码范围：1 - 结束页码' },
            {
              type: 'number',
              min: 1,
              max: thisPrint.max_num,
              message: `起始页码范围：1 - 结束页码`,
            },
          ]"
        >
          <a-input-number
            v-model="thisPrint.page_start"
            placeholder="范围：1 - 最大页码"
          />
        </a-form-item>

        <a-form-item
          field="page_end"
          label="结束页码"
          :rules="[
            {
              required: true,
              message: '最大页码范围：文件起始页 - 文件最后一页',
            },
            {
              type: 'number',
              min: thisPrint.page_start,
              max: thisPrint.max_num,
              message: `最大页码范围：1 - 文件最后一页`,
            },
          ]"
        >
          <a-input-number
            v-model="thisPrint.page_end"
            placeholder="范围：1 - 99999"
          />
        </a-form-item>

        <a-form-item
          field="copies"
          label="份数"
          :rules="[
            { required: true, message: '份数范围：1-20' },
            {
              type: 'number',
              min: 1,
              max: 20,
              message: `份数范围：1-20`,
            },
          ]"
        >
          <a-input-number
            v-model="thisPrint.copies_num"
            type="text"
            placeholder="范围：1 - 20"
          />
        </a-form-item>

        <a-form-item field="direction" label="打印方向">
          <a-radio-group v-model="thisPrint.position">
            <a-radio :value="0">竖直</a-radio>
            <a-radio :value="1">横向</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item field="mode" label="打印模式">
          <a-radio-group v-model="thisPrint.duplex">
            <a-radio :value="1">单面打印</a-radio>
            <a-radio :value="2">双面打印</a-radio>
            <a-radio :value="3">双面向上翻打印</a-radio>
          </a-radio-group>
        </a-form-item>
      </div>
      <div v-else-if="thisPrint.state !== 0"> 解析中！ </div>
      <a-form-item>
        <a-space>
          <a-button :disabled="thisPrint.state < 3" html-type="submit"
            >提交打印</a-button
          >
          <a-button @click="onRest()">复位</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
  <a-modal v-model:visible="tishi.visible" @ok="onRest" @cancel="onRest">
    <template #title> 提示 </template>
    <div>{{ tishi.tipMsg }}</div>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { PrintFileImpl } from '@/utils/print/PrintFileImpl';
  import { Message, Modal } from '@arco-design/web-vue';
  import Upload from '@/components/upload/index.vue';
  import usePrintStore from '@/store/modules/print';

  const printStore = usePrintStore();
  const thisPrint = ref(new PrintFileImpl());
  const tishi = ref({
    visible: false,
    tipMsg: '',
    loading: false,
    showUpload: true,
  });

  const onRest = () => {
    // 复位
    thisPrint.value.endThisClass();
    tishi.value.loading = false;
    tishi.value.showUpload = true;
  };

  const uploadSuccess = (data: any) => {
    // 失败不可能到这步
    const ResResult = data;
    thisPrint.value.uploadSuccess(ResResult);
    tishi.value.loading = false;

    tishi.value.showUpload = false;
  };

  const beforeUpload = (name: any) => {

    tishi.value.loading = true;
    thisPrint.value.addFile(name);
  };

  const uploadError = (r: any) => {
    tishi.value.loading = false;
    tishi.value.tipMsg = '文件上传错误，请重新上传！';
    tishi.value.visible = true;
  };

  const MakePrint = (value: any, errors: any) => {
    if (thisPrint.value.state < 2) {
      Modal.warning({
        title: '提示',
        content: `请点击复位然后重新上传文件`,
      });
      return;
    }
    if (printStore.printDevice == null || printStore.printDevice.id === '') {
      Modal.warning({
        title: '提示',
        content: `请先选择打印机`,
      });
      return;
    }
    thisPrint.value.submitPrint(printStore.printDevice.id);
    tishi.value.tipMsg = '已添加打印队列';
    tishi.value.visible = true;
  };
</script>

<style scoped lang="less">
  .s-upload {
    padding: 10px 10px 10px 10px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: var(--color-bg-2);
  }
</style>

<style lang="less" scoped>
  // responsive
  .mobile {
    .s-upload {
      padding: 10px 10px 10px 10px;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      flex-flow: wrap;
      justify-content: center;
      align-items: center;
      background-color: var(--color-bg-2);
    }
  }
</style>
