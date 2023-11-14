<template>
  <a-upload :draggable="draggable" :custom-request="customRequest" accept=".xls,.xlsx,.doc,.docx,.pdf,.jpg,.png,.ppt,.pptx"/>
</template>

<script>
  import axios from 'axios';
  import { Message } from '@arco-design/web-vue';

  export default {
    name: 'Upload',
    // 参数：
    // url: 文件上传接口
    // draggable: 是否支持拖动上传

    // 自定义事件
    // on-success: 上传成功后触发并返回response
    props: ['url', 'draggable'],
    emits: ['on-success', 'on-error', 'on-before'],
    methods: {
      customRequest(option) {
        const { onProgress, onError, onSuccess, fileItem, name } = option;
        const tuozhanming = fileItem.file.name.split('.')[fileItem.file.name.split('.').length-1];
        if (
          '.xls,.xlsx,.doc,.docx,.pdf,.jpg,.png,.ppt,.pptx'.indexOf(
            tuozhanming
          ) < 0
        ) {
          Message.info(`${tuozhanming}文件格式不支持`);
          return;
        }
        const formData = new FormData();
        formData.append(name || 'file', fileItem.file);
        // eslint-disable-next-line vue/custom-event-name-casing
        this.$emit('on-before',fileItem.file.name);

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
          .then((res) => {
            // 这里需要根据自己的接口实际返回值修改
            if (res.code !== 1) {
              Message.error(res.msg || '服务器内部错误');
              return onError(res.msg);
            }
            console.log("123123123123")
            // eslint-disable-next-line vue/custom-event-name-casing
            this.$emit('on-success', res.data);
            return onSuccess(res.data);
          })
          .catch((error) => {
            Message.error('服务器内部错误');
            // eslint-disable-next-line vue/custom-event-name-casing
            this.$emit('on-error', error);
          });
      },
    },
  };
</script>
