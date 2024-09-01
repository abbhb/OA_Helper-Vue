<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue/dist/vue';
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
  import { Message } from '@arco-design/web-vue';
  import { getUploadUrl } from '@/api/chat';
  import { getAllImageUrl } from '@/api/common';
  import { agreementGet, agreementUpdate } from '@/api/oauth';

  const props = defineProps(['cid', 'ctype']);
  const videoHouzhui = '.avi,.mkv,.mp3, .mp4';
  const imageHouzhui = '.jpg, .jpeg, .png, .gif, .tif, .bmp';
  type StatuE = {
    id: string;
    uploadPercent: number;
    uploading: boolean;
    deptFuziliandong: boolean;
    noticeDepts: any;
    visibilityManger: boolean;
    updateFromLastTime: number; // 只记录分钟
    updateLastTimer: any;
    saved: boolean;
    content: string;
  };
  const statusE = ref<StatuE>({
    id: '',
    uploadPercent: 0,
    uploading: false,
    deptFuziliandong: false,
    noticeDepts: [],
    visibilityManger: false,
    updateFromLastTime: -1, // 小于1为刚刚更新
    updateLastTimer: null,
    saved: false,
    content: '',
  });

  const updateBase = async () => {
    statusE.value.content = tinymce.activeEditor.getContent();

    // 更新的公共方法
    const res = await agreementUpdate(
      {
        privacyShieldAgreement: statusE.value.content,
        serviceAgreement: statusE.value.content,
        id: props.cid,
      },
      props.ctype
    );
    statusE.value.saved = true;
    // @ts-ignore
    Message.success(res.msg);
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

  // 先获取基本信息
  const init = async () => {
    const { data } = await agreementGet(props.cid, props.ctype);
    statusE.value.content = data;
    document.getElementById('tinydemo').innerHTML = statusE.value.content;
  };

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
        file: { title: '文件', items: 'newdocument' },
        edit: {
          title: '编辑',
          items: 'undo redo | cut copy paste pastetext | selectall',
        },
        insert: { title: '插入', items: 'image link media | template hr' },
        view: { title: '查看', items: 'visualaid' },
        format: {
          title: '格式',
          items:
            'bold italic underline strikethrough superscript subscript | formats | removeformat',
        },
        table: {
          title: '表格',
          items: 'inserttable tableprops deletetable | cell row column',
        },
        tools: { title: '工具', items: 'spellchecker code' },
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
              const { blobCache } = window.tinymce.activeEditor.editorUpload;
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
                  getAllImageUrl({ key: res.data }).then((resp) => {
                    // @ts-ignore
                    if (resp.code === 1) {
                      resolve(resp.data);
                    }
                  });
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
                getAllImageUrl({ key: res.data }).then((resp) => {
                  // @ts-ignore
                  if (resp.code === 1) {
                    resolve(resp.data);
                  }
                });
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

  onUnmounted(() => {
    // 在组件卸载后取消订阅
    if (statusE.value.updateLastTimer != null) {
      clearInterval(statusE.value.updateLastTimer); // 停止计时器
      statusE.value.updateLastTimer = null;
    }
    tinymce.remove('#tinydemo');
  });
</script>

<template>
  <div>
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
      </div>
      <div class="top-menu-right">
        <a-button class="button-item" @click="update">更新</a-button>
      </div>
    </div>
    <div class="left-body">
      <div id="tinydemo" style="height: 55rem"></div>
    </div>
  </div>
</template>

<style scoped></style>
