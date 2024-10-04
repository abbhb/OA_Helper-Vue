<template>
  <a-config-provider :locale="locale">
    <a-spin style="width: 100%;height: 100%" :loading="loading" :tip="loadingTip">
      <router-view />
    </a-spin>

    <global-setting />
  </a-config-provider>
</template>

<script lang="ts" setup>
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
  import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
  import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';
  import GlobalSetting from '@/components/global-setting/index.vue';
  import useLocale from '@/hooks/locale';
  import { useAppStore } from '@/store';
  import eventBus from '@/utils/eventBus';

  const loading = ref(false);
  const loadingTip = ref('');
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

  const addLoading = ({ tip }: { tip: string }) => {
    loading.value = true;
    loadingTip.value = tip;
  };
  const removeLoading = () => {
    loading.value = false;
  };

  onMounted(() => {
    eventBus.on('addLoading', addLoading);
    eventBus.on('removeLoading', removeLoading);
  });
  onBeforeUnmount(() => {
    eventBus.off('addLoading', addLoading);
    eventBus.off('removeLoading', removeLoading);
  });
</script>

<style>
  html,
  body {
    height: 100%;
  }
  #app {
    width: 100%;
    height: 100%;
  }
</style>
