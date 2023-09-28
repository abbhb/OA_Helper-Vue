<script setup lang="ts">
  import type { PropType } from 'vue';
  import { ref } from 'vue';

  import { UserItem } from '@/types/chat';
  import { useUserInfo } from '@/hooks/chat/useCached';
  import { useUserStore } from '@/store';
  import AvatarImage from '@/components/image/AvatarImage.vue';
  import ContextMenu from '../ContextMenu/index.vue';

  const props = defineProps({
    user: {
      type: Object as PropType<UserItem>,
      required: true,
    },
  });
  const userInfo = useUserInfo(props.user?.uid);
  const isShowMenu = ref(false); // 是否显示菜单
  // 弹出定位
  const menuOptions = ref({ x: 0, y: 0 });

  /** 右键菜单 */
  const handleRightClick = (e: MouseEvent) => {
    // 根据右键菜单上下文分析，未登录时禁用右键菜单功能
    if (!useUserStore().isSign) {
      return;
    }

    // TODO：看它源码里提供了一个transformMenuPosition函数可以控制在容器范围内弹窗 我试验了一下报错
    // https://github.com/imengyu/vue3-context-menu/blob/f91a4140b4a425fa2770449a8be3570836cdfc23/examples/views/ChangeContainer.vue#LL242C5-L242C5
    const { x, y } = e;
    menuOptions.value.x = x;
    menuOptions.value.y = y;
    isShowMenu.value = true;
  };
</script>

<template>
  <li
    :key="user.uid"
    class="user-list-item"
    @contextmenu.prevent.stop="handleRightClick($event)"
  >
    <AvatarImage
      :avatar="userInfo.avatar"
      :size="24"
      show-status
      :online="true"
    />
    <span style="margin-left: 5px">
      {{ userInfo.name }}
    </span>

    <ContextMenu
      v-model:show="isShowMenu"
      :options="menuOptions"
      :uid="(user?.uid as number)"
    />
  </li>
</template>

<style lang="less" scoped>
  .user-list {
    &-item {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 5px 2px;
      cursor: default;
      border-radius: 4px;

      // content-visibility: auto;

      &:hover {
        background-color: var(--background-mask);
      }

      .avatar {
        margin-right: 8px;
      }
    }
  }
</style>
