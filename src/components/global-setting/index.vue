<template>
  <div v-if="!appStore.navbar" class="fixed-settings" @click="setVisible">
    <a-button type="primary">
      <template #icon>
        <icon-settings />
      </template>
    </a-button>
  </div>
  <a-drawer
    :width="300"
    unmount-on-close
    :visible="visible"
    :cancel-text="$t('settings.close')"
    :ok-text="$t('settings.copySettings')"
    @ok="copySettings"
    @cancel="cancel"
  >
    <template #title> {{ $t('settings.title') }} </template>
    <Block :options="contentOpts" :title="$t('settings.content')" />
    <Block :options="othersOpts" :title="$t('settings.otherSettings')" />
    <a-alert>{{ $t('settings.alertContent') }}</a-alert>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import { useClipboard } from '@vueuse/core';
  import { useAppStore } from '@/store';
  import Block from './block.vue';

  const emit = defineEmits(['cancel']);

  const appStore = useAppStore();
  console.log(appStore.$state);
  const { t } = useI18n();
  const { copy } = useClipboard();
  const visible = computed(() => appStore.globalSettings);
  const contentOpts = computed(() => [
    {name: 'settings.navbar', key: 'navbar', defaultVal: appStore.navbar, isNew: false},
    {
      name: 'settings.menu',
      key: 'menu',
      defaultVal: appStore.menu, isNew: false
    },
    {
      name: 'settings.topMenu',
      key: 'topMenu',
      defaultVal: appStore.topMenu, isNew: false
    },
    {name: 'settings.footer', key: 'footer', defaultVal: appStore.footer, isNew: false},
    {name: 'settings.tabBar', key: 'tabBar', defaultVal: appStore.tabBar, isNew: false},
    {
      name: 'settings.modelFullscreen',
      key: 'modelFullscreen',
      defaultVal: appStore.modelFullscreen, isNew: false
    },
    // {
    //   name: 'settings.menuFromServer',
    //   key: 'menuFromServer',
    //   defaultVal: appStore.menuFromServer,
    // },
    // {
    //   name: 'settings.menuWidth',
    //   key: 'menuWidth',
    //   defaultVal: appStore.menuWidth,
    //   type: 'number',
    // },
  ]);
  const othersOpts = computed(() => [
    {
      name: 'settings.colorWeak',
      key: 'colorWeak',
      defaultVal: appStore.colorWeak, isNew: true
    },
  ]);

  const cancel = () => {
    appStore.updateSettings({ globalSettings: false });
    emit('cancel');
  };
  const copySettings = async () => {
    const text = JSON.stringify(appStore.$state, null, 2);
    await copy(text);
    Message.success(t('settings.copySettings.message'));
  };
  const setVisible = () => {
    appStore.updateSettings({ globalSettings: true });
  };
</script>

<style scoped lang="less">
  .fixed-settings {
    position: fixed;
    top: 280px;
    right: 0;

    svg {
      font-size: 18px;
      vertical-align: -4px;
    }
  }
</style>
