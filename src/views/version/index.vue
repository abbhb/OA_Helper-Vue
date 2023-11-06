<script setup lang="ts">
  import { ref } from 'vue';

  const data = [
    {
      time: '2022-04',
      icon: 'https://unpkg.byted-static.com/latest/byted/arco-config/assets/favicon.ico',
      version: 'v1.0.0',
      info: [{ title: '首个大版本', content: '' }],
    },
    {
      time: '2023-07',
      icon: 'https://unpkg.byted-static.com/latest/byted/arco-config/assets/favicon.ico',
      version: 'v2.0.0',
      info: [{ title: '重构大版本', content: '' }],
    },
    {
      time: '2023-11',
      icon: 'https://unpkg.byted-static.com/latest/byted/arco-config/assets/favicon.ico',
      version: 'v2.0.8',
      info: [
        { title: '大版本重构', content: '重写了大多接口' },
        { title: '样式优化', content: '优化各种圆角' },
        {
          title: '打印服务优化',
          content:
            '优化打印工作流程，提升打印速度。易拓展。添加自助解决常见打印问题动画提示。',
        },
        {
          title: '娱乐中心',
          content: '娱乐中心上线，逐步完善。',
        },
        {
          title: 'Chat功能',
          content: '集成chatgpt，快来@ta使用吧。',
        },
        {
          title: '回到旧版',
          content:
            '<a href="http://192.168.12.122:8082">点我新版出了问题，回到旧版[旧版数据部分数据不会同步！且1个月内全面下线]</a>',
        },
      ],
    },
    {
      time: '2023-11',
      icon: 'https://unpkg.byted-static.com/latest/byted/arco-config/assets/favicon.ico',
      version: 'v2.0.9',
      info: [
        {
          title: '权限优化',
          content: '细粒度权限，同样的界面，可操作的内容不一样',
        },
        {
          title: '打印服务优化',
          content: 'nginx反向代理文件大小限制优化',
        },
        {
          title: 'chat优化',
          content: '优化在线列表。优化gpt',
        },
        {
          title: '动画优化',
          content: '减少了浪费时间的动画，让他变得更可用。',
        },
        {
          title: '敬请期待',
          content:
            '全新学习打卡即将上线。全新的收集表功能即将上线。一键打印历史文件即将上线。吐槽中心即将上线。',
        },
      ],
    },
  ];
  const selectVersion = ref(data[data.length - 1]);
</script>

<template>
  <div style="display: flex; flex-direction: row; width: 100%; height: 97%">
    <div style="overflow-y: auto; height: 50rem; margin-top: 12rem">
      <a-timeline :mode="'left'" :reverse="true" label-position="relative">
        <a-timeline-item
          v-for="timeit in data"
          :key="timeit"
          label="2022-04"
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
                <div v-for="title in timeit.info" :key="title">{{
                  title.title
                }}</div>
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
          :key="iteminfo"
          class="info-item"
        >
          <div class="info-title"
            ><a-tag color="#BD8E3E" :size="'large'">{{
              iteminfo.title
            }}</a-tag></div
          >
          <div class="info-content" v-html="iteminfo.content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
  .hover-click {
  }
  .hover-click:hover {
    background-color: var(--color-secondary-hover);
    cursor: pointer;
  }
  .info-body {
    margin-top: 10px;
    padding: 30px 30px 30px 30px;
    border: 1px solid var(--color-border);
    margin-left: 10rem;
    width: 70%;
  }
  .info-head {
    font-size: 30px;
    border-bottom: 1px solid #6b6b6b;
  }
  .info-info {
    margin-top: 30px;
    display: flex;
    flex-direction: column;
  }
  .info-item {
    margin-top: 30px;
    border: 2px solid #f3b17d;
    padding: 1rem 1rem 1rem 1rem;
    border-radius: 3px;
  }
  .info-title {
    display: flex;
    flex-direction: row;
  }
</style>
