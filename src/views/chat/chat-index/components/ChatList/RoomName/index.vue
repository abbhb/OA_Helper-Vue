<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useChatStore } from '@/store/modules/chat/chat';
  import SettingBox from '@/views/chat/chat-index/components/ChatList/RoomName/components/SettingBox/SettingBox.vue';
  import { useGlobalStore } from '@/store/modules/chat/global';
  import setting from '@/config/setting';
  import ChatGptHelp from '@/components/ChatGptHelp/index.vue';
  import { useUserStore } from '@/store';
  import { useGroupStore } from '@/store/modules/chat/group';

  const chatStore = useChatStore();
  const isShowSetting = ref<boolean>(false);
  const isShowHelp = ref<boolean>(false);
  const userInfo = useUserStore()?.userInfo;
  const globalStore = useGlobalStore();
  const groupStore = useGroupStore();

  const isAdmin = computed(
    () =>
      userInfo?.roles.find((el) => {
        if (String(el.id) === '10013' || String(el.id) === '1') {
          return el;
        }
      }) !== undefined
  );

  const isShowSettingQ = computed(() => {
    return (
      chatStore.isGroup &&
      ((chatStore.currentSessionInfo?.hot_Flag && isAdmin) ||
        (!chatStore.currentSessionInfo?.hot_Flag &&
          (groupStore.adminUidList.includes(userInfo.id as string) ||
            groupStore.currentLordId === (userInfo.id as string))))
    );
  });
</script>

<template>
  <div class="room-name">
    <span class="name">{{ chatStore.currentSessionInfo?.name }}</span>
    <span v-if="isShowSettingQ" class="setting" @click="isShowSetting = true">
      设置
    </span>
    <span
      v-else-if="
        chatStore.currentSessionInfo?.name === setting.chatgptUserInfo.name
      "
      class="setting"
      @click="isShowHelp = true"
    >
      帮助
    </span>
  </div>
  <el-drawer v-model="isShowSetting" direction="rtl" append-to-body>
    <template #header>
      <h4 class="text-[#f5f5f5]">设置</h4>
    </template>
    <template #default>
      <SettingBox />
    </template>
  </el-drawer>
  <el-drawer v-model="isShowHelp" direction="rtl" append-to-body>
    <template #header>
      <h4 class="text-[#f5f5f5]">ChatGPT帮助</h4>
    </template>
    <template #default>
      <ChatGptHelp />
    </template>
  </el-drawer>
</template>

<style lang="scss" src="./styles.scss">
  .el-drawer__header {
    margin-bottom: 0 !important;
  }
</style>
