<script setup lang="ts">
  import {
    ContextMenu,
    ContextMenuItem,
    type MenuOptions,
  } from '@imengyu/vue3-context-menu';
  import { useGlobalStore } from '@/store/modules/chat/global';
  import eventBus from '@/utils/eventBus';
  import {sessionDetailWithFriends} from "@/api/chat";
  import {RoomTypeEnum} from "@/types/enums/chat";
  import Router from "@/router";
  import {useChatStore} from "@/store/modules/chat/chat";

  const props = defineProps<{
    // 用户id
    uid: string;
    // 菜单设置-其它的参数透传
    options?: MenuOptions;
  }>();
  const globalStore = useGlobalStore();
  const chatStore = useChatStore();

  // 添加好友
  const onAddFriend = async () => {
    globalStore.addFriendModalInfo.show = true;
    globalStore.addFriendModalInfo.uid = props.uid;
  };

  const onAtUser = (uid: string, ignoreCheck: boolean) =>
    eventBus.emit('onSelectPerson', { uid, ignoreCheck });

  const onStartSession = async () => {
    const { uid }  = props;
    const { data } = await sessionDetailWithFriends({ uid });
    if (data?.roomId){
      globalStore.currentSession.roomId = data.roomId;
      globalStore.currentSession.type = RoomTypeEnum.Single;
      chatStore.updateSessionLastActiveTime(data.roomId, data);
      Router.push('/chat/chat');
    }

  };
</script>

<template>
  <ContextMenu
    :options="{
      theme: 'dark',
      x: 0,
      y: 0,
      ...props.options,
    }"
  >
    <ContextMenuItem
      label="艾特Ta"
      @click="onAtUser?.(props.uid, true)"
    >
      <template #icon> <span class="icon">@</span> </template>
    </ContextMenuItem>
<!--    <ContextMenuItem-->
<!--      v-is-frient="uid"-->
<!--      label="添加好友"-->
<!--      @click="onAddFriend"-->
<!--    > -->

<!--      <template #icon>-->
<!--        <Icon icon="tianjia" :size="13" />-->
<!--      </template>-->
<!--    </ContextMenuItem>-->
     <ContextMenuItem v-login-show label="发送消息" @click="onStartSession">
      <template #icon>
        <Icon icon="tianjia" :size="13" />
      </template>
    </ContextMenuItem>
  </ContextMenu>
</template>

<style lang="less">
  .mx-context-menu {
    padding: 6px;
    background-color: var(--color-bg-3);
    border-radius: 6px;

    .mx-context-menu-item {
      padding: 2px 4px;
      color: var(--color-text-1);
      border-radius: 4px;

      .label {
        padding: 0.5rem 0.5rem 0.5rem 0.5rem;
        font-size: 14px;
      }
    }

    .mx-context-menu-item:hover {
      background-color: var(--color-bg-2);
    }

    .mx-icon-placeholder {
      width: auto !important;
      padding-right: 4px;
    }

    .mx-context-menu-item-sperator {
      background-color: var(--color-bg-3);
    }

    .mx-context-menu-item-sperator::after {
      background-color: var(--bg-2);
    }
  }
</style>
