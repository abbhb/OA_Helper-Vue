<script setup lang="ts" name="ContactItem">
  import { toRefs, computed } from 'vue';
  import { ChatOnlineEnum } from '@/types/enums/chat';
  import { useUserInfo } from '@/hooks/chat/useCached';
  import type { ContactItem } from '@/types/chat';
  import AvatarImage from "@/components/image/AvatarImage.vue";

  const props = defineProps<{ item: ContactItem }>();

  const { item } = toRefs(props);

  const currentUid = computed(() => item?.value?.uid);
  const currentUser = useUserInfo(currentUid.value);
</script>

<template>
  <div class="item-info contact-item">
    <AvatarImage
      class="avatar"
      :avatar="currentUser.avatar"
      :name="currentUser.name"
      :size="40"
      show-status
      :online="item.activeStatus === ChatOnlineEnum.ONLINE"
    />
    <div class="item-info-right">
      <span class="item-info-name"> {{ currentUser.name }}</span>
    </div>
  </div>
</template>

<style lang="scss" src="./styles.scss" scoped />
