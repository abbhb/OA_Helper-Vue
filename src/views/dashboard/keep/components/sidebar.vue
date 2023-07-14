<script setup lang="ts">

</script>

<template>
  <a-card
    class="general-card"
    :title="$t('keep.sidebar.title')"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ padding: '24px 20px 20px 20px' }"
  >
    <a-list>
      <a-list-item>今日已学：{{ 33 }}分钟</a-list-item>
      <a-list-item>本月累计：{{ 51 }}分钟</a-list-item>
      <a-list-item>本月完整完成天数：{{ 3 }}天</a-list-item>
    </a-list>
  </a-card>
</template>

<style scoped lang="less">

</style>