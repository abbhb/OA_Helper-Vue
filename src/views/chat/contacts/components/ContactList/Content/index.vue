<script setup lang="ts" name="ContactSide">
  import { computed } from 'vue';
  import { useGlobalStore } from '@/store/modules/chat/global';
  import { ContactItemW, RequestFriendAgreeStatus } from '@/types/chat';
  import UserContent from './components/user/index.vue';
  import GroupContent from './components/group/index.vue';

  const globalStore = useGlobalStore();

  const selectedContact = computed(
    () => globalStore.currentSelectedContact as ContactItemW
  );
  // 不一定是用户，可能select的是个群组，也可能是新的朋友等其他模块，具体type具体
  const selectedContactType = computed(() => selectedContact?.value?.type);
</script>

<template>

  <UserContent v-if="selectedContactType === 3" />
  <GroupContent v-else-if="selectedContactType === 2" />
  <el-empty style="width: 100%;position: relative" v-else/>
</template>
