<script setup lang="ts">
  import signinDetail from '@/components/signin/signin-detail/index.vue';
  import router from '@/router';

  const userId = String(router.currentRoute.value.query.userId);
  const date = String(router.currentRoute.value.query.date);
</script>

<template>
  <signin-detail :user-id="userId" :date="date" />
</template>

<style scoped></style>
