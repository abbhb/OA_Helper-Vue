<script lang="ts" setup>
  import { ref } from 'vue';
  import { getNoticeRead } from '@/api/notice';

  const props = defineProps({
    noticeId: {
      type: String,
      default: '',
    },
    isPre: {
      type: Boolean,
      default: false, // 默认不是预发布
    },
  });
  // const emit = defineEmits(['alertSome']);

  const statuEs = ref({
    error: '',
    status: 1, // 默认为1，就是还没请求的状态，为0就是有异常，2就是正常返回了数据正常预览
    data: null,
  });

  const initData = async () => {
    if (props.isPre) {
      // 预发布的不能直接获取，会显示密码输入窗
      return;
    }
    const res = await getNoticeRead(props.noticeId);
    if (res.code === 1) {
      statuEs.value.status = 2;
      statuEs.value.data = res.data;
    } else {
      statuEs.value.status = 0;
      statuEs.value.error = res.msg;
    }
  };
  initData();
  const download = (downloadUrl: string) => {
    window.open(downloadUrl);
  };
</script>

<template>
  <a-spin :loading="statuEs.status === 1" style="width: 100%">
    <div v-if="statuEs.status === 0" class="error"></div>
    <div v-else-if="statuEs.status === 2" style="height: 760px">
      <div
        style="
          overflow-y: auto;

          overflow-x: auto;
          height: 100%;
        "
        v-html="statuEs.data.notice.content"
      ></div>
      <div v-if="statuEs.data.noticeAnnexes?.length > 0">
        <div style="font-size: 20px; font-weight: 800">附件区</div>
        <div style="display: flex">
          <div
            v-for="(item, key) in statuEs.data.noticeAnnexes"
            :key="key"
            class="fujian-item"
          >
            <div>
              <icon-file :size="38" />
            </div>
            <div>
              <div>
                {{ item.fileName }}
              </div>
              <div>
                <a-button type="text" @click="download(item.fileUrl)"
                  >下载</a-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<style lang="less" scoped>
  .fujian-item {
    display: flex;
    flex-direction: row;
    margin-left: 5px;
  }
</style>
