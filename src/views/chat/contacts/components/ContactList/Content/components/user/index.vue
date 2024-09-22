<script setup lang="ts">
  import AvatarImage from '@/components/image/AvatarImage.vue';
  import { useUserInfo } from '@/hooks/chat/useCached';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { sessionDetailWithFriends } from '@/api/chat';
  import { RoomTypeEnum } from '@/types/enums/chat';
  import Router from '@/router';
  import { useChatStore } from '@/store/modules/chat/chat';
  import { useGlobalStore } from '@/store/modules/chat/global';
  import { computed } from 'vue';
  import { ContactItemW } from '@/types/chat';
  import EditableRemark from '../edit/index.vue'

  const chatStore = useChatStore();
  const globalStore = useGlobalStore();

  const selectedContact = computed(
    () => globalStore.currentSelectedContact as ContactItemW
  );
  const haveRemark = computed(
    () => !!selectedContact.value?.remarkName
  );
  // 不一定是用户，可能select的是个群组，也可能是新的朋友等其他模块，具体type具体
  const selectedContactUid = computed(() => selectedContact?.value?.id);

  const currentUser = useUserInfo(selectedContactUid);
  const onDeleteContact = (uid: string) => {
    ElMessageBox.confirm('确认退出该群组?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        // await contactStore.onDeleteContact(uid);
        ElMessage.success('退出成功!');
      })
      .catch(() => {
        //
      });
  };
  const onStartSession = async (uid: string) => {
    const { data } = await sessionDetailWithFriends({ uid });
    if (data?.roomId){
      globalStore.currentSession.roomId = data.roomId;
      globalStore.currentSession.type = RoomTypeEnum.Single;
      chatStore.updateSessionLastActiveTime(data.roomId, data);
      Router.push('/chat/chat');
    }

  };

  const handleEdit = (model) => {
    console.log(model)
  }
</script>

<template>
  <div class="contact-content">
    <div v-if="selectedContactUid" class="contact-main">
      <div class="contact-info-wrapper">
        <AvatarImage
          :key="selectedContact.avatar"
          class="avatar"
          :avatar="selectedContact.avatar"
          :name="selectedContact.name"
          :size="70"
        />
        <div class="contact-info">
          <span class="contact-info-name">{{ haveRemark?selectedContact.remarkName:selectedContact.name }}</span>
          <span class="contact-info-nameb" v-if="haveRemark"> 昵称: {{ selectedContact.name }}</span>
          <span class="contact-info-uid"> uid: {{ selectedContact.id }}</span>
          <span class="contact-info-place">
            地区: {{ currentUser.locPlace || '-' }}</span
          >
        </div>
      </div>
      <el-divider />
      <div class="contact-info-wrapper">
        <div class="contact-info">
          <div class="contact-info-nameb"> 备注:
            <editable-remark v-model="globalStore.currentSelectedContact.remarkName" :onEdit="handleEdit"></editable-remark>

          </div>

        </div>
      </div>
      <el-divider />

      <div class="contact-info-buttons">
        <ElButton type="primary" @click="onStartSession(selectedContact.id)"
        >发消息</ElButton
        >
<!--                  <ElButton type="danger" @click="onDeleteContact(selectedContact.uid)">-->
<!--                    删除联系人-->
<!--                  </ElButton>-->
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<style lang="scss" src="./styles.scss" scoped />
