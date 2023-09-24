<script setup lang="ts">
import {computed, inject} from 'vue';
import {useUserStore} from '@/store';
import {ContextMenuItem, type MenuOptions,} from '@imengyu/vue3-context-menu';

const onAtUser =
    inject<(uid: number, ignore: boolean) => void>('onSelectPerson');

  const props = defineProps<{
    // 消息体
    uid: number;
    // 菜单设置-其它的参数透传
    options?: MenuOptions;
  }>();

  const userInfo = useUserStore()?.userInfo;
  const isAdmin = computed(() =>
    userInfo?.roles.forEach((role) => {
      return role.id === '1';
    })
  );
</script>

<template>
  <ContentMenu
    :options="{
      theme: 'dark',
      x: 0,
      y: 0,
      ...props.options,
    }"
  >
    <ContextMenuItem
      v-is-auth="true"
      label="艾特Ta"
      @click="onAtUser?.(props.uid, true)"
    >
      <template #icon> <span class="icon">@</span> </template>
    </ContextMenuItem>
  </ContentMenu>
</template>

<style lang="less">
  .mx-context-menu {
    padding: 6px;
    background-color: var(--background-3);
    border-radius: 6px;

    .mx-context-menu-item {
      padding: 2px 4px;
      color: var(--font-light-1);
      border-radius: 4px;

      .label {
        padding: 0;
        font-size: 12px;
      }
    }

    .mx-context-menu-item:hover {
      background-color: var(--background-2);
    }

    .mx-icon-placeholder {
      width: auto !important;
      padding-right: 4px;
    }

    .mx-context-menu-item-sperator {
      background-color: var(--background-3);
    }

    .mx-context-menu-item-sperator::after {
      background-color: var(--background-2);
    }
  }
</style>
