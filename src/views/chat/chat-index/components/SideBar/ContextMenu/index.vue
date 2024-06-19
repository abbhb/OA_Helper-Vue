<script setup lang="ts">
  import { computed } from 'vue';
  import {
    ContextMenu,
    ContextMenuItem,
    ContextMenuSeparator,
    type MenuOptions,
  } from '@imengyu/vue3-context-menu';
  import { MessageType, SessionItem } from '@/types/chat';
  import { useEmojiStore } from '@/store/modules/chat/emoji';
  import { useEmojiUpload } from '@/hooks/chat/useEmojiUpload';
  import { useUserStore } from '@/store';
  import { useChatStore } from '@/store/modules/chat/chat';
  import * as apis from '@/api/chat';
  import { ChatMsgEnum, RoomTypeEnum } from '@/types/enums/chat';
  import { copyToClip, handleCopyImg } from '@/utils/chat/copy';
  import { Message } from '@arco-design/web-vue';
  import { urlToFile } from '@/utils/chat';
  import eventBus from '@/utils/eventBus';
  import { useGlobalStore } from '@/store/modules/chat/global';
  import { isLogin } from '@/utils/auth';
  import { deleteContact } from '@/api/chat';
  import { useContactStore } from '@/store/modules/chat/contacts';
  import _ from 'lodash';

  const props = defineProps<{
    // 消息体
    session: SessionItem;
    // 菜单设置-其它的参数透传
    options?: MenuOptions;
  }>();

  const { uploadEmoji } = useEmojiUpload();
  const userInfo = useUserStore()?.userInfo;
  const chatStore = useChatStore();
  const globalStore = useGlobalStore();

  const removeBySession = async () => {
    const roomId = _.cloneDeep(props.session.roomId);
    await deleteContact({ roomId });
    await chatStore.getSessionList(true);
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
    <ContextMenuItem label="从消息列表移除" @click="removeBySession">
      <template #icon>
        <icon-brush :size="13" />
      </template>
    </ContextMenuItem>
  </ContextMenu>
</template>

<style lang="less">
  .mx-context-menu {
    padding: 6px;
    background-color: var(--color-bg-1);
    border-radius: 6px;

    .mx-context-menu-item {
      padding: 2px 4px;
      color: var(--color-text-1);
      border-radius: 4px;

      .label {
        padding: 3px 3px 3px 3px;
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
      background-color: var(--color-bg-2);
    }
  }
</style>
