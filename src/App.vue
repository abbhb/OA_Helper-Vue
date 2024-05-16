<template>
  <a-config-provider :locale="locale">
    <router-view/>
    <global-setting />
  </a-config-provider>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';
import GlobalSetting from '@/components/global-setting/index.vue';
import useLocale from '@/hooks/locale';
import {useAppStore} from '@/store';

const appStore = useAppStore();
  appStore.initSettings();
  const { currentLocale } = useLocale();
  const locale = computed(() => {
    switch (currentLocale.value) {
      case 'zh-CN':
        return zhCN;
      case 'en-US':
        return enUS;
      default:
        return enUS;
    }
  });
</script>

<style>
  /* 在 App.vue 中定义全局的过渡效果 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  /* 1. 声明过渡效果 */
  .fade-move,
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.1s cubic-bezier(0.55, 0, 1.25, 1);
  }

  /* 2. 声明进入和离开的状态 */
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: scaleY(0.01) translate(30px, 0);
  }

  /* 3. 确保离开的项目被移除出了布局流
    以便正确地计算移动时的动画效果。 */
  .fade-leave-active {
    position: absolute;
  }
</style>
