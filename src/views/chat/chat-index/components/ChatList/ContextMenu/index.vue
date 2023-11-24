<script setup lang="ts">
  import { computed } from 'vue';
  import {
    ContextMenu,
    ContextMenuSeparator,
    ContextMenuItem,
    type MenuOptions,
  } from '@imengyu/vue3-context-menu';
  import { MessageType } from '@/types/chat';
  import { useEmojiStore } from '@/store/modules/chat/emoji';
  import { useEmojiUpload } from '@/hooks/chat/useEmojiUpload';
  import { useUserStore } from '@/store';
  import { useChatStore } from '@/store/modules/chat/chat';
  import * as apis from '@/api/chat';
  import { ChatMsgEnum } from '@/types/enums/chat';
  import { copyToClip, handleCopyImg } from '@/utils/chat/copy';
  import { Message } from '@arco-design/web-vue';
  import { urlToFile } from '@/utils/chat';
  import {inject} from "vue/dist/vue";
  import eventBus from "@/utils/chat/eventBus";

  const props = defineProps<{
    // 消息体
    msg: MessageType;
    // 菜单设置-其它的参数透传
    options?: MenuOptions;
  }>();


  const emojiStore = useEmojiStore();
  const { uploadEmoji } = useEmojiUpload();
  const userInfo = useUserStore()?.userInfo;
  const chatStore = useChatStore();

  // FIXME 未登录到登录这些监听没有变化。需处理
  const isCurrentUser = computed(() => props.msg?.fromUser.uid === userInfo.id);
  // 撤回
  const onRecall = async () => {
    const { id, roomId } = props.msg.message;
    if (id) {
      await apis.recallMsg({ roomId, msgId: id });
      chatStore.updateRecallStatus({ msgId: id });
    }
  };

  // 拷贝内容-(此版本未针对不同Body体进行处理)
  const copyContent = () => {
    const msg = props.msg.message;
    if (msg.type === ChatMsgEnum.TEXT) {
      const content = msg.body?.content;
      copyToClip(content);
      Message.success('复制成功~');
    }
    if (msg.type === ChatMsgEnum.IMAGE) {
      handleCopyImg(msg.body.url);
      Message.success('复制成功~');
    }
  };
  // 回复
  const onReplyMsg = () => {
    if (!props.msg) return;
    chatStore.currentMsgReply = props.msg;
    eventBus.emit('onSelectPerson', { uid:props.msg.fromUser.uid, ignoreCheck:true });
    eventBus.emit('focusMsgInput');
  };


  // 下载
  const download = () => {
    const { body } = props.msg.message;
    const url = body?.url;
    if (!url) return;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';

    // eslint-disable-next-line consistent-return
    xhr.onreadystatechange = () => {
      // 下载失败提示
      if (xhr.status !== 200) return Message.error('下载失败~');
      if (xhr.readyState === 4 && xhr.status === 200) {
        const blob = xhr.response;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = body.fileName || '未知文件';
        link.dispatchEvent(new MouseEvent('click'));
        link.remove();
      }
    };

    xhr.send();
  };

  const onAddEmoji = () => {
    const { type, body } = props.msg.message;
    if (type === ChatMsgEnum.EMOJI) {
      emojiStore.addEmoji(body.url);
    } else {
      urlToFile(body.url).then((file) => {
        uploadEmoji(file);
      });
    }
  };

  const onDelete = () => chatStore.deleteMsg(props.msg.message.id);
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
      label="回复"
      @click="onReplyMsg"
    >
      <template #icon>
        <icon-reply :size="13" />
      </template>
    </ContextMenuItem>
    <ContextMenuItem
      v-if="
        msg.message.type === ChatMsgEnum.TEXT ||
        msg.message.type === ChatMsgEnum.IMAGE
      "
      label="复制"
      @click="copyContent"
    >
      <template #icon>
        <Icon icon="copy" :size="13" />
      </template>
    </ContextMenuItem>
    <ContextMenuItem
      v-if="
        (msg.message.type === ChatMsgEnum.EMOJI ||
          msg.message.type === ChatMsgEnum.IMAGE) &&
        !isCurrentUser &&
        emojiStore.emojiList.length < 50
      "
      label="添加到表情"
      @click="onAddEmoji"
    >
      <template #icon>
        <Icon icon="aixin" :size="13" />
      </template>
    </ContextMenuItem>
    <ContextMenuItem
      v-if="isCurrentUser && !msg.loading"
      label="撤回消息"
      @click="onRecall"
    >
      <template #icon>
        <Icon icon="chehui" :size="14" />
      </template>
    </ContextMenuItem>
    <ContextMenuItem
      v-if="
        (msg.message.type === ChatMsgEnum.FILE ||
          msg.message.type === ChatMsgEnum.IMAGE) &&
        !msg.loading
      "
      label="下载"
      @click="download"
    >
      <template #icon>
        <Icon icon="xiazai" :size="15" />
      </template>
    </ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem label="删除" @click="onDelete">
      <template #icon>
        <Icon icon="shanchu" :size="13" />
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
