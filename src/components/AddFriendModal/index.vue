<script setup lang="ts">
import { computed, ref } from 'vue'

import { ElMessage } from 'element-plus'
import { useGlobalStore } from '@/store/modules/chat/global'
import { judgeClient } from '@/utils/chat/detectDevice'
import {sendAddFriendRequest} from "@/api/chat";

const client = judgeClient()

const globalStore = useGlobalStore()
const requestMsg = ref()
const loading = ref(false);


const show = computed(() => globalStore.addFriendModalInfo.show)
const close = () => {
  globalStore.addFriendModalInfo.show = false
  globalStore.addFriendModalInfo.uid = undefined
}
const onSend = async () => {
  loading.value = true;
  await sendAddFriendRequest({ msg: requestMsg.value, targetUid: globalStore.addFriendModalInfo.uid })
  loading.value = false;

  ElMessage.success('TA一定会被你的诚意打动的~')
  close()
}
</script>

<template>
  <ElDialog
    class="setting-box-modal"
    :model-value="show"
    :width="client === 'PC' ? 350 : '50%'"
    :close-on-click-modal="false"
    center
    :show-close="false"
    @close="close"
  >
    <ElInput
      :autosize="{ minRows: 4, maxRows: 4 }"
      :maxlength="50"
      type="textarea"
      resize="none"
      v-model="requestMsg"
      placeholder="发条有趣的问候语吧~"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="onSend" :loading="loading">发送</el-button>
      </span>
    </template>
  </ElDialog>
</template>

<style lang="scss" src="./styles.scss" scoped />
