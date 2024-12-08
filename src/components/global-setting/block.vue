<template>
  <div class="block">
    <h5 class="title">{{ title }}</h5>
    <div v-for="option in options" :key="option.name" class="switch-wrapper">
      <span :style="option.isNew ? 'color: #9f35de;' : ''">{{
        $t(option.name)
      }}</span>
      <form-wrapper
        :type="option.type || 'switch'"
        :name="option.key"
        :default-value="option.defaultVal"
        @input-change="handleChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { PropType, ref } from 'vue';
  import { useAppStore } from '@/store';
  import { setConfig } from '@/store/modules/app/persistence';
  import useMenuStore from '@/store/modules/menu';
  import eventBus from '@/utils/eventBus';
  import FormWrapper from './form-wrapper.vue';

  interface OptionsProps {
    name: string;
    key: string;
    type?: string;
    defaultVal?: boolean | string | number;
    isNew?: boolean;
  }
  defineProps({
    title: {
      type: String,
      default: '',
    },
    options: {
      type: Array as PropType<OptionsProps[]>,
      default() {
        return [];
      },
    },
  });
  const appStore = useAppStore();
  const menuStore = useMenuStore();
  const handleChange = async ({
    key,
    value,
  }: {
    key: string;
    value: unknown;
  }) => {
    eventBus.emit('addLoading', { tip: '写入用户配置中~' });
    if (key === 'colorWeak') {
      document.body.style.filter = value ? 'invert(80%)' : 'none';
    }
    if (key === 'menuFromServer' && value) {
      await menuStore.fetchServerMenuConfig();
    }
    if (key === 'topMenu') {
      await appStore.updateSettings({
        menuCollapse: false,
      });
    }
    // 设置后写入浏览器设置
    await appStore.updateSettings({ [key]: value });
    const config = ref(appStore.$state);
    config.value.globalSettings = false;
    const text = JSON.stringify(config.value, null, 2);
    setConfig(text);
    eventBus.emit('removeLoading');
  };
</script>

<style scoped lang="less">
  .block {
    margin-bottom: 24px;
  }

  .title {
    margin: 10px 0;
    padding: 0;
    font-size: 14px;
  }

  .switch-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 32px;
  }
</style>
