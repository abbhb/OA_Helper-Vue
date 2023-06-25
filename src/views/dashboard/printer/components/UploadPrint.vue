<template>
  <div class="s-upload" title="上传打印">
    <a-spin :loading="loading" :size="30" style="width: 500px" dot>
      <Upload
        v-if="!success_upload"
        url="http://10.15.247.254:8081/papi/uploader"
        :draggable="true"
        @on-success="uploadSuccess"
        @on-error="uploadError"
        @on-before="beforeUpload"
      />
      <a-image
        v-else-if="success_upload"
        width="300px"
        fit="fill"
        :src="`${ImgUrl}`"
      />
    </a-spin>

    <a-form :model="form" :style="{ width: '1200px' }" @submit="MakePrint">
      <a-form-item
        field="file_name"
        label="文件名"
        :rules="[{ required: true, message: '请先上传文件' }]"
      >
        <a-input v-model="form.file_name" readonly placeholder="请先上传文件" />
      </a-form-item>

      <a-form-item
        field="uuid"
        label="文件UUID"
        :rules="[{ required: true, message: '请先上传文件' }]"
      >
        <a-input v-model="form.uuid" readonly placeholder="请先上传文件" />
      </a-form-item>

      <a-form-item
        field="first_page"
        label="起始页码"
        :rules="[
          { required: true, message: '起始页码范围：1 - 结束页码' },
          {
            type: 'number',
            min: 1,
            max: form.last_page,
            message: `起始页码范围：1 - 结束页码`,
          },
        ]"
      >
        <a-input-number
          v-model="form.first_page"
          placeholder="范围：1 - 最大页码"
        />
      </a-form-item>

      <a-form-item
        field="last_page"
        label="结束页码"
        :rules="[
          { required: true, message: '最大页码范围：1 - 99999' },
          {
            type: 'number',
            min: 1,
            max: 99999,
            message: `最大页码范围：1 - 99999`,
          },
        ]"
      >
        <a-input-number
          v-model="form.last_page"
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
          v-model="form.copies"
          type="text"
          placeholder="范围：1 - 20"
        />
      </a-form-item>

      <a-form-item field="direction" label="打印方向">
        <a-radio-group v-model="form.direction">
          <a-radio value="竖直">竖直</a-radio>
          <a-radio value="横向">横向</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item field="mode" label="打印模式">
        <a-radio-group v-model="form.mode">
          <a-radio value="单面打印">单面打印</a-radio>
          <a-radio value="双面打印">双面打印</a-radio>
          <a-radio value="双面向上翻打印">双面向上翻打印</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item>
        <a-space>
          <a-button :disabled="state === 2" html-type="submit"
            >提交打印</a-button
          >
          <a-button :disabled="state === 2" @click="onRest()">复位</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
  <a-modal v-model:visible="visible" @ok="onRest" @cancel="onRest">
    <template #title> 提示 </template>
    <div>{{ tipMsg }}</div>
  </a-modal>
</template>

<script lang="ts">
  import Upload from '@/components/upload/index.vue';
  import {Message, Modal} from '@arco-design/web-vue';
  import axios from 'axios';

  export default {
    name: 'UploadPrint',
    components: { Upload },
    data() {
      return {
        form: {
          file_name: '',
          uuid: '',
          first_page: 1,
          last_page: 1,
          copies: 1,
          direction: '竖直',
          mode: '单面打印',
        },
        ImgUrl:
          'https://webvpn.beihua.edu.cn/http/77726476706e69737468656265737421f1e2559434357a467b1ac7ae9d5c2b20b5a829ed924fb0cb/authserver/custom/images/login-bg-autumn.jpg?vpn-1',
        visible: false,
        tipMsg: '',
        success_upload: false,
        loading: false,
        state: 1, // 1为未打印，2为打印中，3为打印完成
      };
    },
    methods: {
      async MakePrint(value: any, errors: any) {
        this.state = 2;
        try {
          if (this.form.uuid === '') {
            Modal.warning({
              title: '提示',
              content: `请点击复位然后重新上传文件`,
            });
              this.state = 1;

              return;
          }
            Message.info("开始打印,请勿关闭页面")
            this.loading = true;
          let modeNum = 1;
          let Position = 1;
          if (this.form.mode === '单面打印') {
            modeNum = 1;
          }
          if (this.form.mode === '双面打印') {
            modeNum = 2;
          }
          if (this.form.mode === '双面向上翻打印') {
            modeNum = 3;
          }

          if (this.form.direction === '竖直') {
            Position = 1;
          }
          if (this.form.direction === '横向') {
            Position = 2;
          }

          const res = await axios.get(
            `http://10.15.247.254:8081/papi/print/${this.form.uuid}/${this.form.first_page}/${this.form.last_page}/${this.form.copies}/${modeNum}/${Position}`
          );

          const ResResult = res.data;
          this.state = 3;
          if (ResResult.error <= 0) {
            Modal.error({
              title: '错误',
              content: `${ResResult.msg}`,
            });
          } else {
            console.log(ResResult.msg);
            Modal.success({
              title: '成功',
              content: ResResult.msg,
            });
            this.onRest();
          }
        } catch (e: any) {
          Modal.error({
            title: '提示',
            content: `${e.message}`,
          });
        }
        this.form.uuid = '';
        this.form.last_page = 0;
        this.form.file_name = '';
        this.loading = false;
      },
      onRest() {
        this.state = 1;
        this.loading = false;
        this.success_upload = false;
        this.form.file_name = '';
        this.form.uuid = '';
        this.form.last_page = 1;
        this.form.copies = 1;
        this.form.direction = '竖直';
        this.form.mode = '单面打印';
      },
      uploadSuccess(data: any) {
        const ResResult = data;
        console.log(ResResult);
        if (ResResult.error <= 0) {
          this.tipMsg = ResResult.msg;
          this.visible = true;
          return;
        }
        this.form.uuid = ResResult.uuid;
        this.form.file_name = ResResult.file_name;
        this.form.last_page = ResResult.page_num;
        setTimeout(async () => {
          const res = await axios.get(
            `http://10.15.247.254:8081/papi/get_thumbnail/${this.form.uuid}`,
            {
              withCredentials: true,
            }
          );
          this.success_upload = true;
          this.ImgUrl = `data:image/png;base64,${res.data}`;

          this.loading = false;
        }, 3000);
      },
      beforeUpload(a: any, b: any) {
        this.loading = true;
      },
      uploadError(r: any) {
        this.tipMsg = '文件上传错误，请重新上传！';
        this.visible = true;
      },
    },
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
