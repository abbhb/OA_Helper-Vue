<script setup lang="ts">
import { ref } from 'vue';
import version from '@/config/version.json';
import AvatarImage from "@/components/image/AvatarImage.vue";

const data = version;
const selectVersion = ref(data[data.length - 1]);
</script>

<template>
  <div style="display: flex; flex-direction: row; width: 100%; height: 97%">
    <div style="overflow-y: auto; height: 50rem; margin-top: 12rem">
      <a-timeline :mode="'left'" :reverse="true" label-position="relative">
        <a-timeline-item
          v-for="timeit in data"
          :key="timeit"
          :label="timeit.time"
          @click="selectVersion = timeit"
        >
          <a-row
            class="hover-click"
            :style="{ display: 'inline-flex', alignItems: 'center' }"
          >
            <img
              width="40"
              :style="{ marginRight: '16px', marginBottom: '12px' }"
              :src="timeit.icon"
            />
            <div :style="{ marginBottom: '12px' }">
              {{ timeit.version }}
              <div :style="{ fontSize: '12px', color: '#4E5969' }">
                <div v-for="title in timeit.info" :key="title">{{ title.title }}</div>
              </div>
            </div>
          </a-row>
        </a-timeline-item>
      </a-timeline>
    </div>
    <div class="info-body">
      <!--    详情窗-->
      <div class="info-head">{{ selectVersion.version }}</div>
      <div class="info-info">
        <div
          v-for="iteminfo in selectVersion.info"
          :key="iteminfo.title"
          class="info-item"
        >
          <div class="info-title">
            <AvatarImage :avatar="iteminfo.icon" :key="iteminfo.icon" :name="iteminfo.title" alt="icon" class="title-icon" />
            <strong>{{ iteminfo.title }}</strong>
          </div>
          <div class="info-content" v-html="iteminfo.content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.hover-click:hover {
  background-color: var(--color-secondary-hover);
  cursor: pointer;
}
.info-body {
  margin-top: 10px;
  padding: 30px;
  border: 1px solid var(--color-border);
  margin-left: 10rem;
  width: 70%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.info-head {
  font-size: 30px;
  border-bottom: 1px solid #6b6b6b;
  padding-bottom: 10px;
  margin-bottom: 20px;
}
.info-info {
  display: flex;
  flex-direction: column;
}
.info-item {
  margin-top: 20px;
  border: 1px solid #f3b17d;
  padding: 1rem;
  border-radius: 5px;
  background-color: #fafafa;
}
.info-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  margin-bottom: 10px;
}
.title-icon {
  //width: 24px;
  //height: 24px;
  margin-right: 10px;
}
.info-content {
  font-size: 16px;
  color: #333;
  line-height: 1.5;
}
</style>
