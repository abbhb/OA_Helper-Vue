<script lang="ts" setup>
import {onMounted, onUnmounted, reactive, ref} from 'vue';
import router from '@/router';
import {onBeforeRouteLeave} from 'vue-router';
import tinymce from 'tinymce/tinymce'; //  tinymce核心文件
import 'tinymce/models/dom'; //   引入dom模块。从 Tinymce6，开始必须有此模块导入
import 'tinymce/themes/silver'; //  默认主题
import 'tinymce/icons/default'; //  引入编辑器图标icon，不引入则不显示对应图标
import 'tinymce/langs/zh-Hans'; //  引入编辑器语言包
/* 引入编辑器插件
 * 位于 ./node_modules/tinymce/plugins 目录下，版本不同，插件会有所差异。根据自己版本来导入，若不存在的，不能导入，会报错。
 */
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/ui/oxide/content.min.css';
import 'tinymce/skins/ui/oxide/content.css';

import 'tinymce/plugins/advlist'; //  高级列表
import 'tinymce/plugins/anchor'; //  锚点
import 'tinymce/plugins/autolink'; //  自动链接
import 'tinymce/plugins/autoresize'; //  编辑器高度自适应,注：plugins里引入此插件时，Init里设置的height将失效
import 'tinymce/plugins/autosave'; //  自动存稿
import 'tinymce/plugins/charmap'; //  特殊字符
import 'tinymce/plugins/code'; //  编辑源码
import 'tinymce/plugins/codesample'; //  代码示例
import 'tinymce/plugins/directionality'; //  文字方向
import 'tinymce/plugins/emoticons'; //  表情
import 'tinymce/plugins/fullscreen'; //  全屏
import 'tinymce/plugins/help'; //  帮助
import 'tinymce/plugins/image'; //  插入编辑图片
import 'tinymce/plugins/importcss'; //  引入css
import 'tinymce/plugins/insertdatetime'; //  插入日期时间
import 'tinymce/plugins/link'; //  超链接
import 'tinymce/plugins/lists'; //  列表插件
import 'tinymce/plugins/media'; //  插入编辑媒体
import 'tinymce/plugins/nonbreaking'; //  插入不间断空格
import 'tinymce/plugins/pagebreak'; //  插入分页符
import 'tinymce/plugins/preview'; //  预览
import 'tinymce/plugins/quickbars'; //  快速工具栏
import 'tinymce/plugins/save'; //  保存
import 'tinymce/plugins/searchreplace'; //  查找替换
import 'tinymce/plugins/table'; //  表格
import 'tinymce/plugins/template'; //   内容模板
import 'tinymce/plugins/visualblocks'; //   显示元素范围
import 'tinymce/plugins/visualchars'; //   显示不可见字符
import 'tinymce/plugins/wordcount';
import axios from 'axios';
import {Message} from '@arco-design/web-vue';
import {getUploadUrl} from '@/api/chat';
import {NoticeAnnex, NoticeViewResp, updateNotice, viewNotice,} from '@/api/notice';
import {deptListTree} from '@/api/dept';
import {NoticeAnnexItem} from '@/utils/notice/NoticeAnnexItem';

const videoHouzhui = '.avi,.mkv,.mp3, .mp4';
const imageHouzhui = '.jpg, .jpeg, .png, .gif, .tif, .bmp';

type StatuE = {
  id: string;
  uploadPercent: number;
  uploading: boolean;
  tagList: any[];
  deptFuziliandong: boolean;
  noticeDepts: any;
  visibilityManger: boolean;
  annexList: NoticeAnnexItem[];
  updateFromLastTime: number; // 只记录分钟
  updateLastTimer: any;
  saved: boolean;
};
const statusE = ref<StatuE>({
  id: '',
  uploadPercent: 0,
  uploading: false,
  tagList: [],
  deptFuziliandong: false,
  noticeDepts: [],
  visibilityManger: false,
  annexList: [],
  updateFromLastTime: -1, // 小于1为刚刚更新
  updateLastTimer: null,
  saved: false,
});
const routerQuery = router.currentRoute.value.query;
if (routerQuery.noticeId) {
  statusE.value.id = routerQuery.noticeId as string;
}

const deptTreeData = ref([]);
const deptAllCheckedKeys = ref([]);
const deptAllExpandedKeys = ref([]);

const deptSelectedKeys = ref([]);
const deptExpandedKeys = ref([]);

const noticeData = reactive<NoticeViewResp>({
  notice: {
    status: 0,
    id: statusE.value.id,
    isAnnex: 0,
    title: '',
    amount: 0,
    content: '',
    tag: '',
    urgency: 1,
    visibility: 1,
  },
  noticeAnnexes: [],
  noticeDepts: [],
});

const toggleChecked = () => {
  statusE.value.noticeDepts = statusE.value.noticeDepts?.length
    ? []
    : deptAllCheckedKeys.value;
};
const toggleExpanded = () => {
  deptExpandedKeys.value = deptExpandedKeys?.value.length
    ? []
    : deptAllExpandedKeys.value;
};
const getAllId = (yuan) => {
  if (yuan) {
    for (let i = 0; i < yuan.length; i += 1) {
      deptAllExpandedKeys.value.push(yuan[i].id);
      if (yuan[i].children) {
        if (yuan[i].children.length > 0) {
          getAllId(yuan[i].children);
        }
      }
    }
  }
};

// 先获取基本信息
const init = async () => {
  const {data} = await viewNotice(statusE.value.id);
  noticeData.notice = data.notice;
  noticeData.noticeDepts = data.noticeDepts;
  noticeData.noticeAnnexes = data.noticeAnnexes;
  statusE.value.annexList = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < noticeData.noticeAnnexes.length; i++) {
    const noticeAnnexItem = new NoticeAnnexItem(
      data.notice.id,
      noticeData.noticeAnnexes[i].sortNum,
      noticeData.noticeAnnexes[i].fileUrl,
      noticeData.noticeAnnexes[i].fileName,
      '?'
    );
    statusE.value.annexList.push(noticeAnnexItem);
  }
  statusE.value.tagList = noticeData.notice.tag.split(',');
  for (let i = 0; i < noticeData.noticeDepts.length; i += 1) {
    statusE.value.noticeDepts.push(noticeData.noticeDepts[i].deptId);
  }
  document.getElementById('tinydemo').innerHTML = noticeData.notice.content;
};

const initData = async () => {
  const {data} = await deptListTree();
  deptTreeData.value = data;
  getAllId(data);
  deptAllCheckedKeys.value = deptAllExpandedKeys.value;
  if (deptExpandedKeys.value?.length === 0) {
    toggleExpanded();
  }
};

initData();
onBeforeRouteLeave((to, from, next) => {
  if (!statusE.value.saved) {
    const answer = window.confirm(
      '当前数据未保存，离开会导致修改丢失，确定要离开？'
    );
    if (answer) {
      next();
    } else {
      next(false);
    }
  }
  if (statusE.value.saved) {
    next();
  } else {
    next(false);
  }
});

onMounted(async () => {
  await init();

  tinymce.remove();
  //  eslint-disable-next-line vue/no-export-in-script-setup
  tinymce.init({
    selector: '#tinydemo',
    language: 'zh-Hans',
    promotion: false, //  Upgrade是否开启
    branding: false, //  tiny技术支持信息是否显示
    plugins:
      'codesample preview searchreplace autolink directionality visualblocks visualchars image link media template table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount autosave', // 使用image插件
    menu: {
      file: {title: '文件', items: 'newdocument'},
      edit: {
        title: '编辑',
        items: 'undo redo | cut copy paste pastetext | selectall',
      },
      insert: {title: '插入', items: 'image link media | template hr'},
      view: {title: '查看', items: 'visualaid'},
      format: {
        title: '格式',
        items:
          'bold italic underline strikethrough superscript subscript | formats | removeformat',
      },
      table: {
        title: '表格',
        items: 'inserttable tableprops deletetable | cell row column',
      },
      tools: {title: '工具', items: 'spellchecker code'},
    },
    toolbar:
      'preview codesample code forecolor backcolor styles directionality fontfamily fontsize searchreplace image  media link alignleft aligncenter alignright template table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount autosave ', // 工具栏显示
    line_height_formats: '1 1.2 1.4 1.6 2', // 行高
    font_size_formats:
      '12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 48px 56px 72px', // 字体大小
    font_family_formats:
      '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
    file_browser_callback_types: 'file image media', //  这个根据个人需要配置
    paste_data_images: true,
    file_picker_callback(callback, value, meta) {
      const types = meta.filetype;
      console.log(types); // 打印上传的类型
      //  //  要先模拟出一个input用于上传本地文件
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      //  你可以给input加accept属性来限制上传的文件类型
      //  例如：input.setAttribute('accept', '.jpg,.png')
      // eslint-disable-next-line eqeqeq
      if (types == 'image') {
        input.setAttribute('accept', imageHouzhui);
      } else if (types === 'media') {
        input.setAttribute('accept', videoHouzhui);
      } else {
        input.setAttribute(
          'accept',
          '.ppt,.pptx,.jpg, .jpeg, .png, .gif,.pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx,.mp3, .mp4'
        );
      }
      input.click();
      if (types === 'image' || types === 'media') {
        input.onchange = function () {
          // @ts-ignore
          const file = this.files[0];
          // console.log(this.files); // 文件 整体列表
          // console.log(file); // 文件的五种类型\
          const houzhuiname = file.name.split('.');
          if (
            !videoHouzhui.includes(houzhuiname[houzhuiname.length - 1]) &&
            !imageHouzhui.includes(houzhuiname[houzhuiname.length - 1])
          ) {
            Message.info('暂时不支持该文件类型')!;
            return;
          }
          console.log(file.name); // 文件的name名
          //  下方被注释掉的是官方的一个例子
          //  放到下面给大家参考
          statusE.value.uploading = true;
          statusE.value.uploadPercent = 0;
          const reader = new FileReader();
          reader.onload = function () {
            // console.log(window.tinymce); // 打印tinymce编辑器里面的参数
            //  Note: Now we need to register the blob in TinyMCEs image blob
            //  registry. In the next release this part hopefully won't be
            //  necessary, as we are looking to handle it internally.
            const id = `blobid${new Date().getTime()}`;
            // @ts-ignore
            const {blobCache} = window.tinymce.activeEditor.editorUpload;
            // @ts-ignore
            const base64 = reader.result.split(',')[1];
            const blobInfo = blobCache.create(id, file, base64);
            // console.log(id); // 获取时间
            // console.log(file); // 文件的五种类型
            // console.log(base64); // 解码bese64
            // console.log(file.name); // 文件的name名
            // console.log(blobInfo); // 创造 blob缓存总结（id、file、base64）
            // console.log(blobInfo.blobUri()); //

            blobCache.add(blobInfo); //

            const formData = new FormData();
            formData.append('file', file);

            getUploadUrl({
              fileName: file.name,
              scene: '1',
            })
              .then((res) => {
                // 这里需要根据自己的接口实际返回值修改
                // @ts-ignore
                if (res.code === 1) {
                  //  call the callback and populate the Title field with the file name

                  const xhr = new XMLHttpRequest();
                  xhr.open('PUT', res.data.uploadUrl, true);
                  xhr.setRequestHeader('Content-Type', file.type);
                  xhr.upload.onprogress = function (e) {
                    statusE.value.uploadPercent = Math.round(
                      e.loaded / e.total
                    );
                    console.log(Math.round(e.loaded / e.total));
                  };
                  xhr.onload = function () {
                    if (xhr.status === 200) {
                      callback(res.data.downloadUrl, {
                        text: file.name,
                        title: file.name,
                      });
                    } else {
                      setTimeout(() => {
                        const errorImg = document.querySelectorAll(
                          'img[src="uploadFail"]'
                        );
                        errorImg.forEach((item) => {
                          item.parentNode.removeChild(item);
                        });
                      }, 100);
                    }
                    statusE.value.uploading = false;
                  };
                  xhr.send(file);
                }
              })
              .catch((error) => {
                Message.error('服务器内部错误');
                statusE.value.uploading = false;

                // eslint-disable-next-line vue/custom-event-name-casing
                // setTimeOut 是为了然success函数执行到位后在删除，否则可能查不到对应的图片
                setTimeout(() => {
                  const errorImg = document.querySelectorAll(
                    'img[src="uploadFail"]'
                  );
                  errorImg.forEach((item) => {
                    item.parentNode.removeChild(item);
                  });
                }, 100);
              });
          };
          reader.readAsDataURL(file);
        };
      } else {
        Message.info('该文件类型暂不支持');
      }
    },
    // 粘贴的图片上传函数
    // @ts-ignore
    images_upload_handler(blobInfo, progress) {
      const fileInfo = blobInfo.blob();
      // @ts-ignore
      if (fileInfo.name === 'image.png') {
        // uploadTimeOut = setTimeout(() => upload(fileInfo), 30);
        // this.myUpload 是 上传文件的逻辑了，用promise包了一下
        const formData = new FormData();
        formData.append('file', fileInfo);
        return new Promise((resolve, reject) => {
          axios
            .post('./api/common/uploadimage', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
              onUploadProgress: (event) => {
                let percent;
                if (event.total > 0) {
                  percent = (event.loaded / event.total) * 100;
                }
                progress(parseInt(percent, 10));
              },
            })
            .then((res) => {
              // 这里需要根据自己的接口实际返回值修改
              // @ts-ignore
              if (res.code !== 1) {
                // @ts-ignore
                reject(res.msg);
              }
              // @ts-ignore
              if (res.code === 1) {
                resolve(import.meta.env.VITE_Image_BASE_URL + res.data);
                //  call the callback and populate the Title field with the file name
                // success(import.meta.env.VITE_Image_BASE_URL + res.data);
              }
            })
            .catch((error) => {
              // eslint-disable-next-line vue/custom-event-name-casing
              // setTimeOut 是为了然success函数执行到位后在删除，否则可能查不到对应的图片
              reject(error);
            });
        });
      }
      const formData = new FormData();
      formData.append('file', fileInfo);
      return new Promise((resolve, reject) => {
        axios
          .post('./api/common/uploadimage', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            onUploadProgress: (event) => {
              let percent;
              if (event.total > 0) {
                percent = (event.loaded / event.total) * 100;
              }
              progress(parseInt(percent, 10));
            },
          })
          .then((res) => {
            // 这里需要根据自己的接口实际返回值修改
            // @ts-ignore
            if (res.code !== 1) {
              // @ts-ignore
              reject(res.msg);
            }
            // @ts-ignore
            if (res.code === 1) {
              console.log('成功2');
              resolve(import.meta.env.VITE_Image_BASE_URL + res.data);
              //  call the callback and populate the Title field with the file name

              // success(import.meta.env.VITE_Image_BASE_URL + res.data);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  });
});

const updateBase = async () => {
  noticeData.notice.content = tinymce.activeEditor.getContent();
  const tempAnnexList: NoticeAnnex[] = [];
  for (let i = 0; i < statusE.value.annexList.length; i += 1) {
    tempAnnexList.push({
      noticeId: statusE.value.annexList[i].noticeId,
      fileName: statusE.value.annexList[i].fileName,
      fileUrl: statusE.value.annexList[i].fileUrl,
      sortNum: statusE.value.annexList[i].sortNum,
    });
  }
  let tags = '';
  for (let i = 0; i < statusE.value.tagList.length; i += 1) {
    tags += statusE.value.tagList[i];
    tags += ',';
  }

  tags = tags.substring(0, tags.length - 1);
  noticeData.notice.tag = tags;
  // 更新的公共方法
  const {data} = await updateNotice({
    notice: noticeData.notice,
    deptIds: statusE.value.noticeDepts,
    annexes: tempAnnexList,
  });
  statusE.value.saved = true;
  Message.success(data);
  setTimeout(() => {
    statusE.value.saved = false;
  }, 10000);
};

const update = () => {
  // console.log(tinymce.activeEditor.getContent());
  statusE.value.updateFromLastTime = 0;
  if (statusE.value.updateLastTimer != null) {
    clearInterval(statusE.value.updateLastTimer); // 停止计时器
    statusE.value.updateLastTimer = null;
  }
  // 更新了
  statusE.value.updateLastTimer = setInterval(() => {
    statusE.value.updateFromLastTime += 1;
  }, 60000); // 每分钟更新一次
  updateBase();
};
const updateR = async () => {
  // console.log(tinymce.activeEditor.getContent());
  await updateBase();
  router.push({name: 'DocNotification'});
  // tinymce.activeEditor.setContent("需要设置的编辑器内容")
};

const updateToCaoGao = async () => {
  // 保存为草稿
  noticeData.notice.status = 0;
  statusE.value.updateFromLastTime = 0;
  if (statusE.value.updateLastTimer != null) {
    clearInterval(statusE.value.updateLastTimer); // 停止计时器
    statusE.value.updateLastTimer = null;
  }
  // 更新了
  statusE.value.updateLastTimer = setInterval(() => {
    statusE.value.updateFromLastTime += 1;
  }, 60000); // 每分钟更新一次
  // console.log(tinymce.activeEditor.getContent());
  await updateBase();
  // tinymce.activeEditor.setContent("需要设置的编辑器内容")
};

onUnmounted(() => {
  // 在组件卸载后取消订阅
  if (statusE.value.updateLastTimer != null) {
    clearInterval(statusE.value.updateLastTimer); // 停止计时器
    statusE.value.updateLastTimer = null;
  }
  tinymce.remove('#tinydemo');
});

const handleChange = (_data) => {
  console.log(_data);
  const tempList: NoticeAnnexItem[] = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < _data.length; i++) {
    _data[i].sortNum = i + 1;
    tempList.push(_data[i]);
  }
  statusE.value.annexList = tempList;
};
const customRequest = (option) => {
  const {onProgress, onError, onSuccess, fileItem, name} = option;
  const formData = new FormData();
  formData.append(name || 'file', fileItem.file);
  axios
    .post(`./api/common/uploadimage`, formData, {
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
        onProgress(parseInt(percent, 10), event);
      },
    })
    .then((res) => {
      // 这里需要根据自己的接口实际返回值修改
      // @ts-ignore
      if (res.code !== 1) {
        // @ts-ignore
        Message.error(res.msg || '服务器内部错误');
        // @ts-ignore
        return onError(res.msg);
      }
      const annexItem = new NoticeAnnexItem(
        statusE.value.id,
        statusE.value.annexList.length + 1,
        import.meta.env.VITE_Image_BASE_URL + res.data,
        fileItem.file.name,
        '?'
      );
      statusE.value.annexList.push(annexItem);
      return onSuccess(res.data);
    })
    .catch((error) => {
      console.log(error);
      Message.error('上传附件失败');
      // eslint-disable-next-line vue/custom-event-name-casing
      return onError(error);
    });
};

const deleteAnnexFile = (record) => {
  const tempList: NoticeAnnexItem[] = [];
  let isJianyi = false;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < statusE.value.annexList.length; i++) {
    statusE.value.annexList[i].sortNum = i + 1;
    if (isJianyi) {
      statusE.value.annexList[i].sortNum -= 1;
    }
    if (statusE.value.annexList[i].fileUrl === record.fileUrl) {
      isJianyi = true;
    } else {
      tempList.push(statusE.value.annexList[i]);
    }
  }
  statusE.value.annexList = tempList;
};
</script>

<template>
  <div>
    <div v-if="statusE.id === ''">
      <h1> 参数异常! </h1>
      <h2>可能是通知已经被删除了！</h2>
    </div>
    <div v-else style="display: flex; flex-direction: column">
      <div class="top-menu">
        <div class="top-menu-left">
          <div
            v-if="
              statusE.updateFromLastTime >= 1 && statusE.updateFromLastTime < 60
            "
            style="margin-left: 5rem"
          >
            {{ statusE.updateFromLastTime }}分钟前更新
          </div>
          <div
            v-else-if="
              statusE.updateFromLastTime >= 0 && statusE.updateFromLastTime < 1
            "
            style="margin-left: 5rem"
          >
            刚刚更新
          </div>
          <div v-else style="margin-left: 5rem">
            上次更新于{{ noticeData.notice.updateTime }}
          </div>
        </div>
        <div class="top-menu-right">
          <a-button
            v-if="noticeData.notice?.status !== 0"
            type="text"
            class="button-item"
            @click="updateToCaoGao"
          >保存为草稿
          </a-button>

          <a-button class="button-item" @click="update">更新</a-button>
          <a-button type="primary" class="button-item" @click="updateR"
          >更新并返回
          </a-button>
        </div>
      </div>
      <div style="display: flex">
        <div class="left-body">
          <div id="tinydemo" style="height: 55rem"></div>
        </div>
        <div class="right-body">
          <a-tabs default-active-key="1">
            <a-tab-pane key="1" title="文章">
              <div class="menu-item">
                状态：
                <a-select
                  v-model:model-value="noticeData.notice.status"
                  :style="{ width: '220px' }"
                  :size="'large'"
                  placeholder="请选择状态"
                >
                  <a-option :value="0">草稿</a-option>
                  <a-option :value="1">预发布</a-option>
                  <a-option :value="2">{{ '发布' }}/定时发布</a-option>
                  <a-option :value="3">禁止查看</a-option>
                </a-select>
              </div>
              <div class="menu-item">
                通知标题
                <a-input v-model:model-value="noticeData.notice.title"/>
              </div>
              <div class="menu-item">
                通知标签
                <a-input-tag
                  v-model:model-value="statusE.tagList"
                  :style="{ width: '320px' }"
                  placeholder="请输入通知的tag（回车创建tag）"
                  allow-clear
                />
              </div>
              <div class="menu-item">
                紧要程度
                <a-select
                  v-model:model-value="noticeData.notice.urgency"
                  :style="{ width: '140px' }"
                  placeholder="请选紧要程度"
                >
                  <template #label="{ data }">
                    <a-tag
                      :color="
                        data.value === 2
                          ? 'green'
                          : data.value === 3
                          ? 'red'
                          : ''
                      "
                    >
                      {{ data.label }}
                    </a-tag>
                  </template>
                  <a-option :value="1">
                    <a-tag>一般</a-tag>
                  </a-option>
                  <a-option :value="2">
                    <a-tag color="green">不急</a-tag>
                  </a-option>
                  <a-option :value="3">
                    <a-tag color="red">紧急</a-tag>
                  </a-option>
                </a-select>
              </div>
              <div class="menu-item">
                可见性
                <a-select
                  v-model:model-value="noticeData.notice.visibility"
                  :scrollbar="true"
                  :style="{ width: '140px' }"
                  placeholder="请选择可见模式"
                >
                  <a-option :value="1"> 全体成员</a-option>
                  <a-option :value="2"> 指定部门可见</a-option>
                </a-select>
              </div>
              <div v-if="noticeData.notice.visibility === 2" class="menu-item">
                <a-button @click="statusE.visibilityManger = true"
                >管理可见部门
                </a-button>
              </div>
              <div class="menu-item">
                <div style="font-size: 20px; font-weight: 800"> 添加附件</div>
                <div>
                  附件列表
                  <div>
                    <a-table
                      :data="statusE.annexList"
                      :draggable="{}"
                      style="margin-top: 30px"
                      @change="handleChange"
                    >
                      <template #columns>
                        <a-table-column
                          title="排序"
                          data-index="sortNum"
                          width="30"
                        ></a-table-column>
                        <a-table-column title="解析图标" width="50">
                          <template #cell="{ record }">
                            <icon-question v-if="record.image === '?'"/>
                            <icon-file v-else-if="record.image === 'word'"/>
                            <icon-file-pdf v-else-if="record.image === 'pdf'"/>
                            <icon-file-image
                              v-else-if="record.image === 'image'"
                            />
                            <icon-file-video
                              v-else-if="record.image === 'video'"
                            />
                            <icon-file v-else/>
                          </template>
                        </a-table-column>
                        <a-table-column title="文件信息">
                          <template #cell="{ record }">
                            <div style="display: flex; flex-direction: column">
                              <div>
                                <div> {{ record.fileName }}</div>
                              </div>
                              <div style="display: flex">
                                <a-button
                                  :type="'text'"
                                  @click="
                                    $modal.info({
                                      title: 'Name',
                                      content: record.fileUrl,
                                    })
                                  "
                                >查看
                                </a-button>
                                <a-button
                                  type="primary"
                                  @click="deleteAnnexFile(record)"
                                >
                                  <template #icon>
                                    <icon-delete/>
                                  </template>
                                  <!-- Use the default slot to avoid extra spaces -->
                                  <template #default>Delete</template>
                                </a-button>
                              </div>
                            </div>
                          </template>
                        </a-table-column>
                      </template>
                    </a-table>
                  </div>
                  <a-upload
                    ref="uploadNoticeRef"
                    :custom-request="customRequest"
                    :draggable="true"
                    :multiple="true"
                    accept=".xls,.xlsx,.doc,.docx,.pdf,.jpg,.png,.ppt,.pptx"
                    :show-file-list="false"
                  >
                  </a-upload>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </div>
    <a-modal
      v-model:visible="statusE.uploading"
      style="z-index: 2100000"
      :fullscreen="false"
      :footer="false"
      :esc-to-close="false"
      :closable="false"
      :mask-closable="false"
      :mask="true"
      title="上传中"
    >
      <a-progress :percent="statusE.uploadPercent"/>
    </a-modal>

    <a-modal
      v-model:visible="statusE.visibilityManger"
      :fullscreen="false"
      :footer="false"
      :esc-to-close="true"
      :closable="true"
      :mask-closable="true"
      :mask="true"
      title="管理可见部门"
    >
      <div>不包含子部门！请手动选择所需要的所有部门</div>
      <div v-if="noticeData.notice.visibility === 2">
        <a-button-group style="margin-bottom: 20px">
          <a-button type="primary" @click="toggleChecked">
            {{ noticeData.noticeDepts?.length ? '反全选' : '全选' }}
          </a-button>
          <a-button type="primary" @click="toggleExpanded">
            {{ deptExpandedKeys?.length ? '折叠' : '展开全部' }}
          </a-button>
        </a-button-group>
        <a-tree
          v-model:checked-keys="statusE.noticeDepts"
          v-model:expanded-keys="deptExpandedKeys"
          v-model:selected-keys="deptSelectedKeys"
          :data="deptTreeData"
          style="overflow-y: scroll; height: 20rem"
          :check-strictly="!statusE.deptFuziliandong"
          :checkable="true"
          :field-names="{
            key: 'id',
            title: 'deptName',
            children: 'children',
          }"
        >
        </a-tree>
      </div>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
.top-menu {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: right;
  background: #fff;
  max-width: 100vw;
}

@media (min-width: 280px) {
  .top-menu {
    flex-wrap: nowrap;
  }
}

.left-body {
  flex: 1 1 0%;
  background-color: var(--wp--preset--color--background);
  color: var(--wp--preset--color--base);
  font-family: var(--wp--preset--font-family--inter);
  font-size: var(--wp--preset--font-size--base);
  font-style: normal;
  font-weight: 400;
  line-height: 1.6;
  padding-top: 0px;
  padding-right: 24px;
  padding-bottom: 0px;
  padding-left: 24px;

  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
  z-index: 20;
}

.right-body {
  overflow: auto;
  height: 55rem;
  background: #fff;
  bottom: 0;
  color: #1e1e1e;
  flex-shrink: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  position: relative !important;
  width: 22rem;
}

@media (min-width: 782px) {
  .right-body {
    border-left: 1px solid #e0e0e0;
  }
}

@media (min-width: 782px) {
  .right-body {
    border-left: 1px solid #e0e0e0;
  }
}

.top-menu-left {
  flex: 1;
}

.top-menu-right {
}

.button-item {
  margin-left: 4px;
  margin-right: 6px;
}

.menu-item {
  margin-bottom: 10px;
  padding: 5px 5px 5px 5px;
}
</style>
