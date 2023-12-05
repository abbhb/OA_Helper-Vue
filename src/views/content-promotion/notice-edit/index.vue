<script lang="ts" setup>
import {ref} from 'vue';
import router from '@/router';

type StatuE = {
  id: string;
};
const statusE = ref<StatuE>({
  id: '',
});
const routerQuery = router.currentRoute.value.query;
if (routerQuery.noticeId) {
  statusE.value.id = routerQuery.noticeId as string;
}
</script>

<template>
  <div>
    <div v-if="statusE.id === ''">
      <h1> 参数异常! </h1>
      <h2>可能是通知已经被删除了！</h2>
    </div>
    <div v-else>
      {{ statusE.id }}
    </div>
  </div>
</template>

<style lang="less" scoped></style>
