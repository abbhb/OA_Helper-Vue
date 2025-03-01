<script setup lang="ts">
  import CardItem from '@/views/entertainment/center/components/card-item.vue';
  // eslint-disable-next-line import/no-unresolved
  import TwoZeroFourEight from '@/assets/images/2048.jpg';
</script>

<template>
  <div class="game-list fullscreen-background">
    <CardItem
      name="2048"
      description="这是一个益智小游戏。"
      :image="TwoZeroFourEight"
      start="Game2048"
    />

  </div>
</template>

<style scoped lang="less">
  /* 设置包含卡片的容器样式 */

  .game-list {
    display: flex;
    padding: 2.5rem 15.5rem 2.25rem 15.5rem;
    justify-content: space-between; /* 均匀分布，可以根据需要调整对齐方式 */
    gap: 5rem; /* 间距，根据需要调整 */
    flex-wrap: wrap; /* 自动换行 */
  }
  .fullscreen-background {
    width: 100%; /* 占据宽度 */
    height: 100vh; /* 占据视口高度 */
    //background-image: url('your-background-image.jpg'); /* 设置背景图片 */
    background-color: #9cc4a3;
    background-size: cover; /* 等比例缩放背景图片，以填充整个容器 */
    background-position: center center; /* 居中对齐背景图片 */
    background-repeat: no-repeat; /* 不重复背景图片 */
  }
</style>
