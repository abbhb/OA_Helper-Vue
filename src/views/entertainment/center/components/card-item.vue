<script setup lang="ts">
  import ImagePreview from '@/components/image/ImagePreview.vue';
  import AvatarImage from '@/components/image/AvatarImage.vue';
  import { defineProps,onMounted, ref } from 'vue';
  import router from '@/router';

  const props = defineProps({
    image: {
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // 可以为路由Name，也可以为第三方Url
    start: {
      type: String,
      required: true,
    },
    startTitle: {
      type: String,
      required: false,
      default: '开始游玩',
    },
  });

  const goto = (start: string) => {
    if (start.includes('http')) {
      window.open(start);
    } else {
      router.push({ name: start });
    }
  };
</script>

<template>
  <div class="game-card">
    <div class="game-card-body">
      <img class="game-card-body-image" :src="image" />
      <div class="game-card-body-content">
        <div class="game-card-body-title">{{ name }}</div>
        <div class="game-card-body-description">{{ description }}</div>
      </div>
    </div>
    <div class="game-card-footer" @click="goto(start)"> {{ startTitle }} </div>
  </div>
</template>

<style scoped lang="less">
  /* 卡片样式 */
  .game-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 23rem; /* 计算卡片宽度，减去间距 */
    height: 31rem;
    background-color: #f0f0f0; /* 卡片背景颜色 */
    padding: 20px; /* 卡片内边距 */
    border: 1px solid #ccc; /* 卡片边框 */
    box-sizing: border-box; /* 盒子模型 */
    border-radius: 1rem;
  }
  .game-card-body {
    .game-card-body-image {
      width: 15rem;
      height: 15rem;
      //background-color: #cbcecb;
      border-radius: 1rem;
      padding: 0.5rem 0.5rem 0.5rem 0.5rem;
    }
    .game-card-body-content {
      margin-top: 1rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      height: 5rem;
      .game-card-body-title {
        font-size: 18px;
        font-weight: 800;
      }
      .game-card-body-description {
        margin-left: 10px;
        font-weight: 200;
        font-size: 12px;
      }
    }
  }
  .game-card-footer {
    display: flex;
    align-items: center;
    padding: 0 5rem 0 5rem;
    background-color: #25b63e;
    height: 4rem;
    border-radius: 1rem;
    text-align: center;
    font-size: 20px;
  }
</style>
