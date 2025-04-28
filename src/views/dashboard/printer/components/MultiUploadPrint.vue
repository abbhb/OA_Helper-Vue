<script lang="ts" setup>
  import axios from 'axios';
  import { Message, Modal } from '@arco-design/web-vue';
  import { onBeforeUnmount, onMounted, ref } from 'vue';
  import { useAppStore } from '@/store';
  import left from '@/assets/images/left.png';
  import setting from '@/config/setting';
  import { fileItemType } from '@/types/printFille';
  import { PrintFileImpl } from '@/utils/print/PrintFileImpl';
  import usePrintStore from '@/store/modules/print';
  import item from '@/views/chat/chat-index/components/VirtualList/item';
  import printEventHub, {
    downloadFileFromUrl,
  } from '@/utils/print/printEventBus';
  import {preUploadPrintFile} from "@/api/printer";
  import SparkMD5 from "spark-md5/spark-md5";

  interface thisStateType {
    visible: boolean;
    tempImg?: string;
    loading: boolean;
    printing: boolean;
  }
  const printStore = usePrintStore();
  const errList = ref([]);
  const uploadRef = ref(null);

  const thisState = ref<thisStateType>({
    visible: false,
    loading: false,
    printing: false,
  });
  const fileList = ref<PrintFileImpl[]>([]);
  const appState = useAppStore();

  const delListItem = (filename) => {
    fileList.value.some((item, i) => {
      if (item.file_name === filename) {
        fileList.value.splice(i, 1);
        // 在数组的some方法中，如果return true，就会立即终止这个数组的后续循环,所以相比较foreach，如果想要终止循环，那么建议使用some
        return true;
      }
      return false;
    });
  };

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
  const customRequest = async (option) => {
    const {onProgress, onError, onSuccess, fileItem, name} = option;
    const isHava = fileList.value.some(
      (item) => item.file_name === fileItem.file.name
    );
    if (isHava) {
      Message.error('该文件已经传过了,你想干嘛?');
      return;
    }
    if (fileList.value.length >= 5) {
      Message.info('保障性能，最大支持同时5个文件！');
      return;
    }
    if (fileItem.file.size / 1024 / 1024 > 100) {
      Message.warning('保障性能，大于100M的文件请您使用单文件打印！');
      return;
    }
    const formData = new FormData();
    const myfilea = ref<PrintFileImpl>(new PrintFileImpl());
    myfilea.value.addFile(fileItem.file.name);
    fileList.value.push(myfilea.value);
    formData.append(name || 'file', fileItem.file);


    let fileHash = ""
    let url = "/api/printer/uploadPrintFile" ;

    // 计算文件hash
    // 预检
    try {
      fileHash = (await get_file_hash(fileItem.file)) as string;
      const {data} = await preUploadPrintFile({
        originFileName: fileItem.file.name,
        hash: fileHash
      });
      if (data) {
        // eslint-disable-next-line vue/custom-event-name-casing
        myfilea.value.uploadSuccess(data);
        myfilea.value.percent = 100;
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
      .post(`/api/printer/uploadPrintFile`, formData, {
        timeout: 150000,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        onUploadProgress: (event) => {
          let percent;
          if (event.total > 0) {
            percent = (event.loaded / event.total) * 100;
          }
          myfilea.value.percent = parseInt(percent, 10);
          onProgress(parseInt(percent, 10), event);
        },
      })
      .then((res) => {
        // 这里需要根据自己的接口实际返回值修改
        // @ts-ignore
        if (res.code !== 1) {
          delListItem(myfilea.value.file_name);
          // @ts-ignore
          Message.error(res.msg || '服务器内部错误');
          // @ts-ignore
          return onError(res.msg);
        }
        myfilea.value.uploadSuccess(res.data);
        return onSuccess(res.data);
      })
      .catch((error) => {
        delListItem(myfilea.value.file_name);
        Message.error('服务器内部错误');
        // eslint-disable-next-line vue/custom-event-name-casing
        return onError(error);
      });
  };
  const Preview = async (record) => {
    thisState.value.loading = true;
    if (record.canGetImage) {
      thisState.value.tempImg = record.imageUrl;
      thisState.value.visible = true;
    } else {
      Message.info('当前文件图片还没转换完');
    }
    thisState.value.loading = false;
  };

  // eslint-disable-next-line camelcase
  const printerrorCallback = (file_name: string) => {
    errList.value.push(file_name);
  };

  const printers = async () => {
    // 循环校验
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < fileList.value.length; i++) {
      if (fileList.value[i].state < 2) {
        Modal.warning({
          title: '检查异常',
          content: `请删除${fileList.value[i].file_name}再提交打印`,
        });
        return;
      }
    }
    if (printStore.printDevice == null || printStore.printDevice.id === '') {
      Modal.warning({
        title: '提示',
        content: `请先选择打印机`,
      });
      return;
    }
    // 循环提交，然后异常的放入到另一个列表中，然后清空list
    thisState.value.printing = true;
    errList.value = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < fileList.value.length; i++) {
      fileList.value[i].submitPrint(
        printStore.printDevice.id,
        printerrorCallback,
        false
      );
    }
    fileList.value = [];
    if (errList.value.length === 0) {
      // 全都成功了
      Modal.success({
        title: '提交成功',
        content: `已加入打印队列`,
      });
    } else {
      let a = '';
      errList.value.forEach((item) => {
        a = `${a}[${item}]`;
      });
      // 显示没成功的打印任务名
      Modal.info({
        title: '部分任务已成功',
        content: `不成功的任务:${a}`,
      });
    }
    thisState.value.printing = false;
  };

  // 一件打印
  const onOneClickPrinting = ({
    fileUrl,
    fileName,
  }: {
    fileUrl: string;
    fileName?: string;
  }) => {
    // 为了严谨还是判断一下打印模式
    if (printStore.getModel !== 9) {
      return;
    }
    // 否则就是该处理的逻辑
    if (!fileUrl || fileUrl === '') {
      return;
    }
    if (fileList.value.length <= 4) {
      // todo: 多文件打印模式的一键打印
      downloadFileFromUrl(fileUrl, fileName)
        .then((file) => {
          uploadRef.value.upload([file]);
        })
        .catch((error) => {
          Message.error('该文件无法一键打印，请尝试手动!');
        });
      window.scrollTo({
        top: 0,
        behavior: 'smooth', // 使用平滑滚动
      });
    } else {
      // 阻止
      Modal.error({
        title: '警告',
        content: '为了性能考虑，最大一次五个文件',
      });
    }
  };
  onMounted(() => {
    printEventHub.on('onOneClickPrinting', onOneClickPrinting);
  });
  onBeforeUnmount(() => {
    printEventHub.off('onOneClickPrinting', onOneClickPrinting);
  });
</script>

<template>
  <a-spin :loading="thisState.printing" dot>
    <div>
      <a-card>
        <div hoverable>
          <span v-if="fileList.length >= 5">最大同时5个文件！！！</span>
          <a-upload
            v-if="fileList.length < 5"
            ref="uploadRef"
            :custom-request="customRequest"
            :draggable="true"
            :multiple="true"
            accept=".xls,.xlsx,.doc,.docx,.pdf,.jpg,.png,.ppt,.pptx"
            :show-file-list="false"
          >
          </a-upload>
          <a-table
            :data="fileList"
            :pagination="false"
            :show-header="fileList.length !== 0"
            style="padding: 20px 0px 20px 0"
          >
            <template #empty>
              <a-empty :class="fileList.length === 0 ? 'table-i' : ''">
                <template #image>
                  <div class="img_div">
                    <a-image
                      :default-preview-visible="false"
                      :preview="false"
                      :src="left"
                      alt="添加文件"
                    />
                    <div class="mask">
                      <h4>
                        <icon-folder-add
                          size="40"
                          type="ios-trash-outline"
                        ></icon-folder-add>
                      </h4>
                    </div>
                  </div>
                </template>
                <div style="display: flex; flex-direction: column">
                  <div style="font-weight: 200; font-family: 黑体; color: black"
                    >请上传需要印刷的文件
                  </div>
                  <div
                    >支持格式:pdf、doc、docx、ppt、pptx、xlsx、xlt、xls、jpg、jpeg、png等
                  </div>
                </div>
              </a-empty>
            </template>
            <template #columns>
              <a-table-column :tooltip="true" :width="200" title="文件名">
                <template #cell="{ record }">
                  <div style="display: flex">
                    <span>{{ record.file_name }}</span>
                    <div
                      v-if="record.percent !== 100"
                      style="position: absolute; right: 50%"
                    >
                      <span>文件上传中！</span>
                      <a-progress
                        :percent="record.percent"
                        size="mini"
                        type="circle"
                      />
                    </div>
                    <div
                      v-if="record.percent === 100 && !record.page_start"
                      style="position: absolute; right: 50%"
                    >
                      <span>文件正在解析!</span>
                    </div>
                  </div>
                </template>
              </a-table-column>
              <a-table-column title="起始页">
                <template #cell="{ record }">
                  <a-input-number
                    v-if="record.state === 3"
                    v-model="record.page_start"
                    :max="record.max_num"
                    :min="1"
                    :style="{ width: '70px' }"
                    class="input-demo"
                    model-event="input"
                    placeholder="Please Enter"
                  />
                </template>
              </a-table-column>
              <a-table-column title="结束页">
                <template #cell="{ record }">
                  <a-input-number
                    v-if="record.state === 3"
                    v-model="record.page_end"
                    :max="record.max_num"
                    :min="record.page_start"
                    :style="{ width: '70px' }"
                    class="input-demo"
                    model-event="input"
                    placeholder="Please Enter"
                  />
                </template>
              </a-table-column>

              <a-table-column title="自动缩放">
                <template #cell="{ record }">
                  <a-radio-group
                    v-if="record.state === 3"
                    v-model:model-value="record.bShrinkToFit"
                    size="small"
                    type="button"
                  >
                    <a-radio :value="0">不缩放</a-radio>
                    <a-radio :value="1"><a-tooltip content="可能存在打印字符异常，例如堆叠字符的问题！">可缩放时缩放到纸张大小</a-tooltip></a-radio>
                  </a-radio-group>
                </template>
              </a-table-column>

              <a-table-column title="单双面">
                <template #cell="{ record }">
                  <a-radio-group
                    v-if="record.state === 3"
                    v-model:model-value="record.duplex"
                    size="small"
                    type="button"
                  >
                    <a-radio :value="1">单面打印</a-radio>
                    <a-radio :value="2">双面打印</a-radio>
                    <a-radio :value="3">双面向上翻打印</a-radio>
                  </a-radio-group>
                </template>
              </a-table-column>
              <a-table-column title="打印方向">
                <template #cell="{ record }">
                  <a-radio-group
                    v-if="record.state === 3"
                    v-model:model-value="record.position"
                    size="small"
                    type="button"
                  >
                    <a-radio :value="0">竖直</a-radio>
                    <a-radio :value="1">横向</a-radio>
                  </a-radio-group>
                </template>
              </a-table-column>
              <a-table-column title="份数">
                <template #cell="{ record }">
                  <a-input-number
                    v-if="record.state === 3"
                    v-model="record.copies_num"
                    :max="20"
                    :min="1"
                    :style="{ width: '70px' }"
                    class="input-demo"
                    model-event="input"
                    placeholder="Please Enter"
                  />
                </template>
              </a-table-column>
              <a-table-column title="操作">
                <template #cell="{ record }">
                  <div
                    style="
                      display: flex;
                      flex-direction: row;
                      justify-content: center;
                      align-items: center;
                    "
                  >
                    <a-button
                      v-if="record.state === 3"
                      type="primary"
                      @click="Preview(record)"
                      >预览
                    </a-button>
                    <a-button
                      style="margin-left: 2px"
                      type="primary"
                      @click="delListItem(record.file_name)"
                    >
                      <template #icon>
                        <icon-delete />
                      </template>
                    </a-button>
                  </div>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </div>
        <div style="display: flex; justify-content: end">
          <a-button @click="Message.info('懒得做，以后再说')"
            >批量配置
          </a-button>
          <a-button style="margin-left: 10px" type="primary" @click="printers()"
            >提交打印
          </a-button>
        </div>
      </a-card>

      <a-modal
        v-model:visible="thisState.visible"
        :draggable="true"
        :footer="false"
        :fullscreen="appState.modelFullscreen"
      >
        <template #title>
          {{ $t('printer.one.StateManger.Preview') }}
        </template>
        <!--打印预览代码-->
        <a-spin v-if="thisState.loading" dot />
        <a-image
          v-else-if="!thisState.loading"
          :height="300"
          :src="thisState.tempImg"
          :width="300"
        />
      </a-modal>
    </div>
  </a-spin>
</template>

<style lang="less" scoped>
  .img_div {
    margin: 0 auto;
    width: 72.1px;
    border-radius: 10px;
    display: block;
    position: relative;
  }

  img.arco-image-img {
    height: 100%;
    width: 100%;
    display: block;
    cursor: pointer;
    vertical-align: middle;
    border-radius: inherit;
  }

  .mask {
    position: absolute;
    background: rgba(211, 211, 211, 0.12);
    color: #ffffff;
    opacity: 0;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    pointer-events: none;
  }

  .mask h3 {
    text-align: center;
    margin-top: 25%;
  }

  .img_div:hover .mask {
  }

  .table-i:hover {
    cursor: not-allowed;
  }
</style>
