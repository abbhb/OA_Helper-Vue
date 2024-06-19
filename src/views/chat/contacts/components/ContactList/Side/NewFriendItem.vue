<script setup lang="ts" name="NewFriendItem">
  import { toRefs, computed } from 'vue';
  import { useContactStore } from '@/store/modules/chat/contacts';
  import type { RequestFriendItem } from '@/types/chat';
  import { RequestFriendAgreeStatus } from '@/types/chat';
  import { useUserInfo } from '@/hooks/chat/useCached';
  import AvatarImage from "@/components/image/AvatarImage.vue";

  const props = defineProps<{ item: RequestFriendItem }>();

  const { item } = toRefs(props);

  const contactStore = useContactStore();

  const currentUid = computed(() => item?.value?.uid);
  const currentUser = useUserInfo(currentUid.value);
</script>

<template>
  <div class="item-info">
    <AvatarImage class="avatar" :avatar="currentUser.avatar" :key="currentUser.avatar"  :name="currentUser.name" :size="40" />
    <div class="item-info-right">
      <span class="item-info-name">
        {{ currentUser.name }}

        <el-button
          v-if="item.status === RequestFriendAgreeStatus.Waiting"
          @click="contactStore.onAcceptFriend(item.applyId)"
        >
          接受
        </el-button>
        <span v-else class="item-info-accept-text">已添加</span>
      </span>
      <span class="item-info-msg">{{ item?.msg }}</span>
    </div>
  </div>
</template>

<style lang="scss" src="./styles.scss" scoped />
