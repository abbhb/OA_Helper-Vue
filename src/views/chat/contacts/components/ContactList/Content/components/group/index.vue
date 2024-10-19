<script setup lang="ts">
  import AvatarImage from '@/components/image/AvatarImage.vue';
  import EditableRemark from '@/views/chat/contacts/components/ContactList/Content/components/edit/index.vue';
  import { useChatStore } from '@/store/modules/chat/chat';
  import { useGlobalStore } from '@/store/modules/chat/global';
  import { computed } from 'vue';
  import { ContactItemW } from '@/types/chat';
  import { useUserInfo } from '@/hooks/chat/useCached';
  import {sessionDetail, sessionDetailWithFriends, setRemark} from "@/api/chat";
  import {RoomTypeEnum} from "@/types/enums/chat";
  import Router from "@/router";
  import {Message} from "@arco-design/web-vue";
  import {useContactStore} from "@/store/modules/chat/contacts";

  const chatStore = useChatStore();
  const globalStore = useGlobalStore();
  const contactStore = useContactStore();

  const selectedContact = computed(
    () => globalStore.currentSelectedContact as ContactItemW
  );
  const haveRemark = computed(() => !!selectedContact.value?.remarkName);
  // 不一定是用户，可能select的是个群组，也可能是新的朋友等其他模块，具体type具体
  const selectedContactUid = computed(() => selectedContact?.value?.id);

  const onStartSession = async (id: string) => {
    const { data } = await sessionDetail({ id });
    if (data?.roomId) {
      globalStore.currentSession.roomId = data.roomId;
      globalStore.currentSession.type = RoomTypeEnum.Single;
      chatStore.updateSessionLastActiveTime(data.roomId, data);
      Router.push('/chat/chat');
    }

  };
  const handleEdit = async (val) => {
    const data = await setRemark({
      // @ts-ignore
      toId: globalStore.currentSelectedContact.id ,
      type: 1,
      // @ts-ignore
      remarkName: globalStore.currentSelectedContact.remarkName,
    })
    // @ts-ignore
    if (data.code===1){
      Message.success("修改备注成功");
      await contactStore.getContactList(true);
    }
  }
</script>

<template>
  <div class="contact-content">
    <div v-if="selectedContactUid" class="contact-main">
      <div class="contact-info-wrapper">
        <AvatarImage
          :key="selectedContact.id+'group211'+selectedContact.name"
          class="avatar"
          :avatar="selectedContact.avatar"
          :name="selectedContact.name"
          :size="70"
        />
        <div class="contact-info">
          <span class="contact-info-name">{{
            haveRemark ? selectedContact.remarkName : selectedContact.name
          }}</span>
          <span v-if="haveRemark" class="contact-info-nameb">
            群名称: {{ selectedContact.name }}</span
          >
          <span class="contact-info-uid">
            人数: {{ selectedContact?.ext?.room_user?.length }}</span
          >
          <div class="contact-info-nameb">
            备注:
            <editable-remark
              v-model="globalStore.currentSelectedContact.remarkName"
              :on-edit="handleEdit"
            ></editable-remark>
          </div>
        </div>
      </div>
      <el-divider />
      <div class="contact-info-wrapper">
        <div
          v-if="selectedContact?.ext?.room_user?.length > 0"
          class="contact-info"
        >
          <div
            v-for="(item, key) in selectedContact.ext.room_user"
            :key="key"
            style="display: flex; flex-direction: row"
          >
            <div>
              <avatar-image
                :avatar="useUserInfo(item).value.avatar"
                :name="useUserInfo(item).value.name"
              />
            </div>
            <div>
              {{ useUserInfo(item).value.name }}
            </div>
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
