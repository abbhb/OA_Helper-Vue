<template>
  <a-upload
    ref="uplaods"
    :draggable="draggable"
    :custom-request="customRequest"
    accept=".xls,.xlsx,.doc,.docx,.pdf,.jpg,.png,.ppt,.pptx"
  />
</template>

<script setup>
  import axios from 'axios';
  import { Message } from '@arco-design/web-vue';
  import { ref } from 'vue';

  const props = defineProps({
    url: {
      type: String,
      default: '',
    },
    draggable: {
      type: String,
      default: '',
    },
  });
  const emit = defineEmits(['on-success', 'on-error', 'on-before']);

  const uplaods = ref(null);

  const customRequest = (option) => {
    const { onProgress, onError, onSuccess, fileItem, name } = option;
    const formData = new FormData();
    formData.append(name || 'file', fileItem.file);
    // eslint-disable-next-line vue/custom-event-name-casing
    emit('on-before', fileItem.file.name);

    axios
      .post(props.url, formData, {
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
        // eslint-disable-next-line vue/custom-event-name-casing
        emit('on-success', res.data);
        return onSuccess(res.data);
      })
      .catch((error) => {
        Message.error('服务器内部错误');
        // eslint-disable-next-line vue/custom-event-name-casing
        emit('on-error', error);
      });
  };
  defineExpose({
    getUploadRef() {
      return uplaods;
    },
  });
</script>
