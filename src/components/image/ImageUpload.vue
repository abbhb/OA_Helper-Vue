<template>
  <a-space direction="vertical">
    <a-upload
      :custom-request="customRequest"
      :draggable="draggable"
      :file-list="file ? [file] : []"
      :show-file-list="false"
    >
      <template #upload-button>
        <div
          :class="`arco-upload-list-item${
            file && file.status === 'error'
              ? ' arco-upload-list-item-error'
              : ''
          }`"
        >
          <div
            v-if="file && file.url"
            class="arco-upload-list-picture custom-upload-avatar"
          >
            <ImagePreview :key="file.url" :img="file.url"/>
            <!--            <img :src="file.url"/>-->
            <div class="arco-upload-list-picture-mask">
              <IconEdit/>
            </div>
            <a-progress
              v-if="file.status === 'uploading' && file.percent < 100"
              :percent="file.percent"
              :style="{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translateX(-50%) translateY(-50%)',
              }"
              size="mini"
              type="circle"
            />
          </div>
          <div v-else class="arco-upload-picture-card">
            <div class="arco-upload-picture-card-text">
              <IconPlus/>
              <div style="margin-top: 10px; font-weight: 600">Upload</div>
            </div>
          </div>
        </div>
      </template>
    </a-upload>
  </a-space>
</template>

<script>
import axios from 'axios';
import {Message} from '@arco-design/web-vue';
import {getAllImageUrl} from '@/api/common';
import ImagePreview from "@/components/image/ImagePreview.vue";

export default {
  components: {ImagePreview},
    // 参数：
    // url: 文件上传接口
    // draggable: 是否支持拖动上传

    // 自定义事件
    // on-success: 上传成功后触发并返回response
    props: ['url', 'draggable', 'image'],
    data() {
      return {
        file: null,
      };
    },
    created() {
      if (this.image !== '') {
        this.file = {
          url: this.image,
        };
      }
    },
    methods: {
      customRequest(option) {
        const { onProgress, onError, onSuccess, fileItem } = option;
        const formData = new FormData();
        formData.append('file', fileItem.file);
        axios
          .post(this.url, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            onUploadProgress: (event) => {
              let percent;
              if (event.total > 0) {
                percent = (event.loaded / event.total) * 100;
              }
              onProgress(parseInt(percent, 10), event);
            },
          })
          .then(async (res) => {
            // 这里需要根据自己的接口实际返回值修改
            if (res.code !== 1) {
              Message.error('服务器内部错误');
              return onError(res.msg);
            }
            // eslint-disable-next-line vue/custom-event-name-casing
            this.$emit('on-success', res.data);
            if (
              !res.data.includes('data:image') &&
              !res.data.includes('http')
            ) {
              const {data} = await getAllImageUrl({key: res.data});
              this.file = {
                ...fileItem,
                url: data,
              };
            } else {
              this.file = {
                ...fileItem,
                url: res.data,
              };
            }

            return onSuccess(res.data);
          })
          .catch((error) => {
            Message.error('服务器内部错误');
          });
      },
    },
  };
</script>
