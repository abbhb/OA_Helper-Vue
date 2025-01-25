<script setup lang="ts">
  import type { PropType } from 'vue';
  import { computed, ref, toRef } from 'vue';

  import { UserItem } from '@/types/chat';
  import { useUserInfo } from '@/hooks/chat/useCached';
  import { useUserStore } from '@/store';
  import AvatarImage from '@/components/image/AvatarImage.vue';
  import ContextMenu from '@/views/chat/chat-index/components/UserList/ContextMenu/index.vue';
  import { ChatOnlineEnum } from '@/types/enums/chat';
  import { GROUP_ROLE_MAP } from '@/types/enums/group';

  const props = defineProps<{ user: UserItem }>();
  const propUser = toRef(props.user);
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
  const computedRole = computed(() => {
    if (props.user.roleId) {
      return GROUP_ROLE_MAP[props.user.roleId];
    }
    return '';
  });
</script>

<template>
  <li
    :key="user.uid"
    class="user-list-item"
    @contextmenu.prevent.stop="handleRightClick($event)"
  >
      <AvatarImage
        :key="userInfo.id+'suk12'+userInfo.avatar + userInfo.name"
        :avatar="userInfo.avatar"
        :name="userInfo.name"
        :size="24"
        show-status
        :online="user.activeStatus === ChatOnlineEnum.ONLINE"
      />
    <div class="user-name">
      <div class="text">{{ userInfo.name }}</div>
      <div
        v-if="computedRole"
        class="badge flex-center"
        :class="computedRole.class"
      >
        {{ computedRole.text }}
      </div>
    </div>

    <ContextMenu
      v-model:show="isShowMenu"
      :options="menuOptions"
      :uid="(user?.uid as string)"
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

      &:hover,
      &:focus {
        background-color: var(--background-mask);
      }

      .avatar {
        margin-right: 8px;
      }
    }

    .user-name {
      display: flex;

      .text {
        max-width: 90px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .badge {
        padding: 2px 4px;
        margin-left: 5px;
        font-size: 10px;
        border-radius: 3px;
      }

      .lord {
        color: #777;
        background-color: #f2c55c;
        border: 1px solid #fff;
      }

      .admin {
        color: #fff;
        background-color: #aa6d4b;
        border: 1px solid #fff;
      }
    }
  }
</style>
