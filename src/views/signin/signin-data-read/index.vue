<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { getSigninGroupDate, SigninGroupDateResp } from '@/api/signin';

  const groupId = ref();
  const date = ref<Date>(new Date(Date.now()));
  const route = useRoute();
  const resultData = ref<SigninGroupDateResp>(null);
  const dataLoading = ref(false);
  groupId.value = route.query.groupId;
  const initData = async () => {
    dataLoading.value = true;
    const { data } = await getSigninGroupDate(
      groupId.value,
      `${date.value.getFullYear()}-${('0' + (date.value.getMonth() + 1)).slice(
        -2
      )}-${('0' + date.value.getDate()).slice(-2)}`
    );
    resultData.value = data;
    dataLoading.value = false;
  };
  const selectDate = () => {
    initData();
  };
  initData();
</script>

<template>
  <div>
    <a-alert>未开发完毕，现提供json，可自行处理</a-alert>
    <a-calendar v-model="date" @change="selectDate" />
    <div>
      <json-viewer v-if="resultData" :value="resultData" :key="date" copyable boxed sort />
      <a-empty v-else :description="'请选择需要加载的日期'"/>
    </div>
  </div>
</template>

<style scoped>
@import "vue3-json-viewer/dist/index.css";

</style>
