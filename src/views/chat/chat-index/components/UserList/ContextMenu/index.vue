<script setup lang="ts">
  import { computed, toRef } from 'vue';
  import {
    ContextMenu,
    ContextMenuItem,
    type MenuOptions,
  } from '@imengyu/vue3-context-menu';
  import {useAppStore, useUserStore} from '@/store';
  import { useGlobalStore } from '@/store/modules/chat/global';
  import { useGroupStore } from '@/store/modules/chat/group';
  import eventBus from '@/utils/eventBus';
  import {RoleEnum, RoomTypeEnum} from "@/types/enums/chat";
  import {removeGroupMember, sessionDetail, sessionDetailWithFriends} from "@/api/chat";
  import Router from "@/router";
  import {useChatStore} from "@/store/modules/chat/chat";

  const props = defineProps<{
    // 消息体
    uid: string;
    // 菜单设置-其它的参数透传
    options?: MenuOptions;
  }>();

  const appStore = useAppStore();

  const uid = toRef(props.uid)
  const userInfo = useUserStore()?.userInfo;
  const chatStore = useChatStore();
  const globalStore = useGlobalStore();
  const groupStore = useGroupStore();
  const statistic = computed(() => groupStore.countInfo)
  const isMe = computed(() => userInfo?.id === uid.value)
  const onAtUser = (uid: string, ignoreCheck: boolean) =>
    eventBus.emit('onSelectPerson', { uid, ignoreCheck });

  const theme = computed(() => {
    return appStore.theme;
  });
  // 添加好友
  const onAddFriend = async () => {
    globalStore.addFriendModalInfo.show = true;
    globalStore.addFriendModalInfo.uid = props.uid;
  };

  // 移除群成员
  const onRemoveMember = async () => {
    await removeGroupMember({ uid: props.uid, roomId: globalStore.currentSession.roomId });
    // 更新群成员列表
    groupStore.getGroupUserList(true)
  }

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
  <ContextMenu :options="{ theme: theme, x: 0, y: 0, ...props.options }">
    <ContextMenuItem
      label="艾特Ta"
      @click="onAtUser?.(props.uid, true)"
    >
      <template #icon> <span class="icon">@</span> </template>
    </ContextMenuItem>
    <!--    <ContextMenuItem v-if="isAdmin" label="拉黑(管理)" @click="onBlockUser">-->
    <!--      <template #icon>-->
    <!--        <Icon icon="lahei" :size="13" />-->
    <!--      </template>-->
    <!--    </ContextMenuItem>-->
<!--    <ContextMenuItem-->
<!--      v-is-frient="uid"-->
<!--      label="添加好友"-->
<!--      @click="onAddFriend"-->
<!--    >-->
<!--      <template #icon>-->
<!--        <icon-user-add icon="tianjia" :size="13" />-->
<!--      </template>-->
<!--    </ContextMenuItem>-->
    <ContextMenuItem
      label="发消息"
      @click="onStartSession"
    >
      <template #icon>
        <icon-user-add icon="tianjia" :size="13" />
      </template>
    </ContextMenuItem>
        <ContextMenuItem
          vLoginShow
          v-if="[RoleEnum.LORD, RoleEnum.ADMIN].includes(statistic.role) && !isMe"
          label="剔出群聊"
          @click="onRemoveMember"
        >
          <template #icon>
            <Icon icon="yichu" :size="13" />
          </template>
        </ContextMenuItem>
  </ContextMenu>
</template>

<style lang="scss" scoped>
  .mx-context-menu {
    padding: 6px;
    background-color: var(--background-3);
    border-radius: 6px;

    .mx-context-menu-item {
      padding: 2px 4px;
      color: var(--color-text-3);
      border-radius: 4px;

      .label {
        padding: 0;
        font-size: 12px;
      }
    }

    .mx-context-menu-item:hover {
      background-color: var(--color-bg-1);
    }

    .mx-icon-placeholder {
      width: auto !important;
      padding-right: 4px;
    }

    .mx-context-menu-item-sperator {
      background-color: var(--color-bg-3);
    }

    .mx-context-menu-item-sperator::after {
      background-color: var(--color-bg-2);
    }
  }
</style>
