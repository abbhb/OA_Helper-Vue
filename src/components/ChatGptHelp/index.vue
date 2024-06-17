<script setup lang="ts">

</script>

<template>
<div>
  <h2>注意：上下文持续12个小时!</h2>
  <h2>注意：当前仅支持文本消息</h2>
  <h1>菜单</h1>
  <ul>
    <li>1. <a-tag>清除上下文</a-tag> : 立即删除本会话gpt上下文记录，此操作不可逆!不清消息记录仅删除上下文</li>
    <li>2. <a-tag>查看当前上下文条数</a-tag> : 从此条消息之前开始从最新往上数</li>
    <li>3. <a-tag>仅保留后x条上下文</a-tag> : 从最新往上数，保留的优先是新消息</li>

  </ul>
</div>
</template>

<style scoped>

</style>