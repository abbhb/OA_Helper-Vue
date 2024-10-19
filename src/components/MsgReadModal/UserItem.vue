<script setup lang="ts" name="UserItem">
  import { toRefs } from 'vue';
  import { useUserInfo } from '@/hooks/chat/useCached';
  import AvatarImage from "@/components/image/AvatarImage.vue";

  const props = defineProps<{ uid: string }>();

  const { uid } = toRefs(props);
  const user = useUserInfo(props.uid);
</script>

<template>
  <li class="person-item">
    <AvatarImage class="avatar" :avatar="user.avatar" :key="user.uid+'useritem101'+user.name" :size="30" />
    <div class="person-item__name">
      {{ user.name }}
    </div>
  </li>
</template>

<style lang="scss" src="./styles.scss" scoped />
