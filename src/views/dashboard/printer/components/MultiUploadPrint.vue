<script lang="ts" setup>
import axios from 'axios';
import {Message, Modal} from '@arco-design/web-vue';
import {ref} from 'vue';
import {useAppStore} from '@/store';
import left from '@/assets/images/left.png';
import setting from '@/config/setting';

// 文件列表
interface fileItemType {
  file_name?: string;
  page_start?: number;
  page_end?: number;
  max_num?: number;
  duplex?: number;
  position?: number;
  copies_num?: number;
  percent?: number;
  uuid?: string;
  state: string;
}

interface thisStateType {
  visible: boolean;
  tempImg?: string;
  loading: boolean;
  printing: boolean;
}

const thisState = ref<thisStateType>({
  visible: false,
  loading: false,
  printing: false,
});
const fileList = ref<fileItemType[]>([]);
const appState = useAppStore();

const delListItem = (filename) => {
  const aass = fileList.value.some((item, i) => {
    if (item.file_name === filename) {
      fileList.value.splice(i, 1);
      // 在数组的some方法中，如果return true，就会立即终止这个数组的后续循环,所以相比较foreach，如果想要终止循环，那么建议使用some
      return true;
    }
    return false;
  });
  console.log(aass);
};
const customRequest = (option) => {
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
  const formData = new FormData();
  const myfilea = ref<fileItemType>({state: 'init'});
  myfilea.value.file_name = fileItem.file.name;
  fileList.value.push(myfilea.value);
  formData.append(name || 'file', fileItem.file);
  axios
    .post(`${setting.printBaseUrl}/uploader`, formData, {
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
      if (res.code !== 1) {
        Message.error('服务器内部错误');
        myfilea.value.state = 'error';
        delListItem(fileItem.file.name);
        return onError(res.msg);
      }
      if (res.data.error) {
        if (Number(res.data.error) < 1) {
          // eslint-disable-next-line no-eval
          Message.error(res.data.msg);
          myfilea.value.state = 'error';
          delListItem(fileItem.file.name);
          return onError(res.msg);
        }
      } else {
        const errordata = JSON.parse(res.data);
        if (errordata.error < 1) {
          // eslint-disable-next-line no-eval
          Message.error(errordata.msg);
          myfilea.value.state = 'error';
          delListItem(fileItem.file.name);
          return onError(errordata.msg);
        }
      }
      myfilea.value.state = 'success';
      myfilea.value.page_start = 1;
      myfilea.value.max_num = res.data.page_num;
      myfilea.value.page_end = res.data.page_num;
      myfilea.value.uuid = res.data.uuid;
      // 默认单面
      myfilea.value.duplex = 1;
      myfilea.value.position = 1;
      // 默认份数
      myfilea.value.copies_num = 1;

      // eslint-disable-next-line vue/custom-event-name-casing
      return onSuccess(res.data);
    })
    .catch((error) => {
      myfilea.value.state = 'error';
      delListItem(fileItem.file.name);
      Message.error('服务器内部错误');
      // eslint-disable-next-line vue/custom-event-name-casing
    });
};
const Preview = async (record) => {
  thisState.value.loading = true;
  thisState.value.visible = true;
  const res = await axios.get(
    `${setting.printBaseUrl}/get_thumbnail/${record.uuid}`,
    {
      withCredentials: true,
    }
  );
  if (res.code !== 1) {
    Message.error('错误');
    return;
  }
  thisState.value.tempImg = `data:image/png;base64,${res.data}`;
  thisState.value.loading = false;
};
const printers = async () => {
  // 开始打印
  thisState.value.printing = true;
  try {
    const res = await axios.post(
      `${setting.printBaseUrl}/prints`,
      fileList.value
    );
    console.log(fileList.value);
    const ResResult = res.data;
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
      fileList.value = [];
    }
  } catch (e: any) {
    Modal.error({
      title: '提示',
      content: `${e.message}`,
    });
  }
  thisState.value.printing = false;
};
</script>

<template>
  <a-spin :loading="thisState.printing" dot>
    <div>
      <a-card>
        <div hoverable>
          <span v-if="fileList.length >= 5">最大同时5个文件！！！</span>
          <a-upload
            v-if="fileList.length < 5"
            :custom-request="customRequest"
            :draggable="true"
            :multiple="true"
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
                        <icon-folder-add size="40" type="ios-trash-outline"></icon-folder-add>
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
                    v-if="record.state === 'success'"
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
                    v-if="record.state === 'success'"
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

              <a-table-column title="单双面">
                <template #cell="{ record }">
                  <a-radio-group
                    v-if="record.state === 'success'"
                    v-model:model-value="record.duplex"
                    size="small"
                    type="button"
                  >
                    <a-radio :value="1">单面</a-radio>
                    <a-radio :value="2">双面</a-radio>
                    <a-radio :value="3">双面向上翻</a-radio>
                  </a-radio-group>
                </template>
              </a-table-column>
              <a-table-column title="打印方向">
                <template #cell="{ record }">
                  <a-radio-group
                    v-if="record.state === 'success'"
                    v-model:model-value="record.position"
                    size="small"
                    type="button"
                  >
                    <a-radio :value="1">垂直</a-radio>
                    <a-radio :value="2">水平</a-radio>
                  </a-radio-group>
                </template>
              </a-table-column>
              <a-table-column title="份数">
                <template #cell="{ record }">
                  <a-input-number
                    v-if="record.state === 'success'"
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
                      v-if="record.state === 'success'"
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
                        <icon-delete/>
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
        <a-spin v-if="thisState.loading" dot/>
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
