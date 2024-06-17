<script setup lang="ts" name="CreateGroupModal">
  import { computed, ref } from 'vue';
  import { RoomTypeEnum } from '@/types/enums/chat';
  import { ElMessage } from 'element-plus';
  import { useGlobalStore } from '@/store/modules/chat/global';
  import { useGroupStore } from '@/store/modules/chat/group';
  import { judgeClient } from '@/utils/chat/detectDevice';
  import { createGroup, inviteGroupMember } from '@/api/chat';
  import {useChatStore} from "@/store/modules/chat/chat";
  import SelectUser from './SelectUser.vue';

  const client = judgeClient();

  const globalStore = useGlobalStore();
  const groupStore = useGroupStore();
  const chatStore = useChatStore();

  const selectUserRef = ref<string[]>([]);

  const loading = ref(false);
  const inviteLoading = ref(false);

  const show = computed(() => globalStore.createGroupModalInfo.show);
  const isInvite = computed(() => globalStore.createGroupModalInfo.isInvite);
  const close = () => {
    globalStore.createGroupModalInfo.show = false;
    globalStore.createGroupModalInfo.isInvite = false;
    globalStore.createGroupModalInfo.selectedUid = [];
  };
  const onSend = async () => {
    if (selectUserRef.value.length === 0) return;
    if (isInvite.value) {
      await inviteGroupMember({
        roomId: globalStore.currentSession.roomId,
        uidList: selectUserRef.value,
      });
      // 更新群成员列表
      groupStore.getGroupUserList(true);
    } else {
      const { data } = await createGroup({ uidList: selectUserRef.value });
      ElMessage.success('群聊创建成功~');
      await chatStore.getSessionList(true);

      globalStore.currentSession.roomId = String(data.id);
      globalStore.currentSession.type = RoomTypeEnum.Group;
    }

    close();
  };
  const onChecked = (checked: string[]) => {
    selectUserRef.value = checked;
  };
</script>

<template>
  <ElDialog
    class="setting-box-modal"
    :model-value="show"
    :width="client === 'PC' ? 620 : '50%'"
    :close-on-click-modal="false"
    center
    :show-close="false"
    @close="close"
  >
    <SelectUser @checked="onChecked" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button
          type="primary"
          :loading="loading || inviteLoading"
          :disabled="selectUserRef.length === 0"
          @click="onSend"
        >
          {{ isInvite ? '邀请' : '创建' }}
        </el-button>
      </span>
    </template>
  </ElDialog>
</template>

<style lang="scss" src="./styles.scss" scoped />
