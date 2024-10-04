<template>
  <a-upload
    ref="uplaods"
    v-model:file-list="fileList"
    :draggable="draggable"
    :custom-request="customRequest"
    accept=".xls,.xlsx,.doc,.docx,.pdf,.jpg,.png,.ppt,.pptx"
  />
</template>

<script setup>
  import axios from 'axios';
  import { Message,Modal } from '@arco-design/web-vue';
  import { ref, defineExpose } from 'vue';
  import SparkMD5 from "spark-md5";
  import {preUploadPrintFile} from "@/api/printer";
  import { h } from 'vue';

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

 const get_file_hash = (file) =>{
   // eslint-disable-next-line func-names
    return new Promise(function (resolve, reject) {
      try {
        const fileReader = new FileReader();
        const spark = new SparkMD5.ArrayBuffer();
        // 获取文件二进制数据
        fileReader.readAsArrayBuffer(file);
        fileReader.onload =(e)=>{
          spark.append(e.target.result);
          const fileHash = spark.end();
          console.log(fileHash, '文件哈希值');
          resolve(fileHash);
        };
      }catch (e) {
        reject(e)
      }


    })
  };



  const uplaods = ref(null);
  const fileList = ref([]);
  const customRequest = async (option) => {
    const {onProgress, onError, onSuccess, fileItem, name} = option;
    const formData = new FormData();
    formData.append(name || 'file', fileItem.file);
    // eslint-disable-next-line vue/custom-event-name-casing
    emit('on-before', fileItem.file.name);
    const isLargeFile = fileItem.file.size / 1024 / 1024 > 50 && fileItem.file.size / 1024 / 1024 < 1024;
    if (isLargeFile){

      const ModalContent = {
        setup() {

          return () => h('div', {class: 'info-modal-content'}, [
            h('span', {style: 'margin-bottom: 10px;'}, '您的文件大于50M,所需时间可能较长，请耐心等待转换!'),
          ])
        },
      }
      Modal.warning({
        title: '大文件警告',
        content: () => h(ModalContent)
      });
    }
    let fileHash = ""
    let url = props.url + "";

    // 计算文件hash
    // 预检
    try {
      fileHash = await get_file_hash(fileItem.file)
      const {data} = await preUploadPrintFile({
        originFileName:fileItem.file.name,
        hash:fileHash
      });
      if (data){
        // eslint-disable-next-line vue/custom-event-name-casing
        emit('on-success', data);
        return onSuccess(data);
      }
    } catch (e) {
      // 预检查失败就正常走流程即可！
      console.error(e);
    }
    if (fileHash !== "") {
      url += "?hash=" + fileHash
    }
    console.log("预检流程结束")
    axios
      .post(url, formData, {
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
  const cleanUploadList = () => {
    console.log('我是子组件方法:清理上传列表');
    try {
      fileList.value = [];
    } catch (e) {
      console.log(e);
    }
  };

  defineExpose({
    getUploadRef() {
      return uplaods;
    },
    cleanUploadList,
  });
</script>
