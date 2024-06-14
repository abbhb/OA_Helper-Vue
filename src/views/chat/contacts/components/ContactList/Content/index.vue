<script setup lang="ts" name="ContactSide">
  import Router from '@/router';
  import { computed } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { useContactStore } from '@/store/modules/chat/contacts';
  import { useChatStore } from '@/store/modules/chat/chat';
  import { useGlobalStore } from '@/store/modules/chat/global';
  import { useUserInfo } from '@/hooks/chat/useCached';
  import { RequestFriendAgreeStatus } from '@/types/chat';
  import type { RequestFriendItem } from '@/types/chat';
  import { RoomTypeEnum } from '@/types/enums/chat';
  import {sessionDetailWithFriends} from "@/api/chat";
  import AvatarImage from "@/components/image/AvatarImage.vue";

  const contactStore = useContactStore();
  const chatStore = useChatStore();
  const globalStore = useGlobalStore();

  const selectedContact = computed(
    () => globalStore.currentSelectedContact as RequestFriendItem
  );
  const selectedContactUid = computed(() => selectedContact?.value?.uid);
  const isNotFriend = computed(
    () => selectedContact.value?.status === RequestFriendAgreeStatus.Waiting
  );

  const currentUser = useUserInfo(selectedContactUid);
  const onDeleteContact = (uid: string) => {
    ElMessageBox.confirm('确认删除该联系人?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        await contactStore.onDeleteContact(uid);
        ElMessage.success('删除成功!');
      })
      .catch(() => {
        //
      });
  };
  const onStartSession = async (uid: string) => {
    const {data} = await sessionDetailWithFriends({ uid });
    globalStore.currentSession.roomId = data.roomId;
    globalStore.currentSession.type = RoomTypeEnum.Single;
    chatStore.updateSessionLastActiveTime(data.roomId, data);
    Router.push('/chat/chat');
  };
</script>

<template>
  <div class="contact-content">
    <div v-if="selectedContactUid" class="contact-main">
      <div class="contact-info-wrapper">
        <AvatarImage class="avatar" :avatar="currentUser.avatar" :name="currentUser.name" :size="70" />
        <div class="contact-info">
          <span class="contact-info-name">{{ currentUser.name }}</span>
          <span class="contact-info-uid"> uid: {{ currentUser.uid }}</span>
          <span class="contact-info-place">
            地区: {{ currentUser.locPlace || '-' }}</span
          >
        </div>
        <!-- <el-dropdown v-if="!isNotFriend" class="contact-info-more-dropdown" trigger="click">
          <Icon class="contact-info-more" icon="more" :size="20" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <el-text class="mx-1" type="danger">删除联系人</el-text>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown> -->
      </div>
      <el-divider />
      <template v-if="isNotFriend && selectedContact?.msg">
        <div class="contact-request-msg"> Ta说: {{ selectedContact.msg }} </div>
        <el-divider />
      </template>
      <div class="contact-info-buttons">
        <ElButton
          v-if="isNotFriend"
          type="success"
          @click="contactStore.onAcceptFriend(selectedContact.applyId)"
          >接受</ElButton
        >
        <template v-else>
          <ElButton type="primary" @click="onStartSession(selectedContact.uid)"
            >发消息</ElButton
          >
          <ElButton type="danger" @click="onDeleteContact(selectedContact.uid)">
            删除联系人
          </ElButton>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./styles.scss" scoped />
