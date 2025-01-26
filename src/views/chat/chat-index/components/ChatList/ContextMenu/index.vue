<script setup lang="ts">
  import { computed } from 'vue';
  import {
    ContextMenu,
    ContextMenuItem,
    ContextMenuSeparator,
    type MenuOptions,
  } from '@imengyu/vue3-context-menu';
  import { MessageType } from '@/types/chat';
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
  import {formatDateTime} from "@/utils/chat/computedTime";
  import {UploadTask} from "@/hooks/chat/useUploadN";

  const props = defineProps<{
    // 消息体
    msg: MessageType&UploadTask;
    // 菜单设置-其它的参数透传
    options?: MenuOptions;
  }>();

  const emojiStore = useEmojiStore();
  const { uploadEmoji } = useEmojiUpload();
  const userInfo = useUserStore()?.userInfo;
  const chatStore = useChatStore();
  const globalStore = useGlobalStore();

  // FIXME 未登录到登录这些监听没有变化。需处理
  const isCurrentUser = computed(() => props.msg?.fromUser.uid === userInfo.id);
  const upLoading = computed(()=>{
    return props.msg?.Mock || false;
  })
  const isAdmin = computed(
    () =>
      userInfo?.roles.find((el) => {
        if (String(el.id) === '10013' || String(el.id) === '1') {
          return el;
        }
      }) !== undefined
  );

  const showRecall = computed(() => {
    console.log(props.msg.message);
    console.log(isCurrentUser.value && Date.now() - formatDateTime(props.msg.message.sendTime));
    return (
      (isAdmin.value &&
        globalStore.currentSession.type === RoomTypeEnum.Group) ||
      (isCurrentUser.value &&
        Date.now() - formatDateTime(props.msg.message.sendTime) <= 120000)
    );
  });

  // 撤回
  const onRecall = async () => {
    const { id, roomId } = props.msg.message;
    if (id) {
      await apis.recallMsg({ roomId, msgId: id });
      // chatStore.updateRecallStatus({ msgId: id });
      // 无需多此一举，ws会推送撤回消息
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
    eventBus.emit('onSelectPerson', {
      uid: props.msg.fromUser.uid,
      ignoreCheck: true,
    });
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

  const onDelete = () => {
    chatStore.deleteMsg(props.msg.message.id);
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
    <div v-if="upLoading">
      <ContextMenuItem label="取消发送" @click="cancleSend">
        <template #icon>
          <icon-close-circle :size="13" />
        </template>
      </ContextMenuItem>
    </div>
    <div v-else>
      <ContextMenuItem label="回复" @click="onReplyMsg">
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
          <icon-copy  :size="13" />
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
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M11.165 7.018l.838 1.273.834-1.276A4.412 4.412 0 0116.54 5C18.982 5 21 7.03 21 9.561c0 .619-.032 1.23-.229 1.91-.195.675-.567 1.463-1.298 2.391-.591.75-2.132 2.24-3.787 3.77a228.88 228.88 0 01-3.687 3.32 226.596 226.596 0 01-3.685-3.318c-1.654-1.528-3.192-3.018-3.785-3.771h0C3.101 12.05 3 10.726 3 9.56c0-2.53 2.02-4.56 4.46-4.56L7.467 5c1.468-.007 2.858.74 3.7 2.018z" stroke="#1F2229" stroke-width="2"/></svg>
        </template>
      </ContextMenuItem>
      <ContextMenuItem
        v-if="showRecall && !msg.loading"
        label="撤回消息"
        @click="onRecall"
      >
        <template #icon>
          <svg width="13" height="13" viewBox="0 0 48 48" fill="#000000"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.121 24.778a1 1 0 010 1.414l-1.414 1.415a1 1 0 01-1.414 0L4.1 18.414a2 2 0 010-2.828l9.192-9.193a1 1 0 011.414 0l1.414 1.415a1 1 0 010 1.414l-5.778 5.777L29.586 15c7.732 0 14 6.268 14 14s-6.268 14-14 14h-8.729a1 1 0 01-1-1v-1.96a1 1 0 011-1h8.26c3.865 0 10-4.001 10-10.04 0-6.039-6.135-10-10-10H10.343l5.777 5.778z" fill="#000000"/></svg>        </template>
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
          <svg width="13" height="13" viewBox="0 0 48 48" fill="#000000"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 36a1 1 0 011 1v3h28v-3a1 1 0 011-1h2a1 1 0 011 1v5a2 2 0 01-2 2H8a2 2 0 01-2-2v-5a1 1 0 011-1h2zM23 5h2a1 1 0 01.993.883L26 6v22.071l6.02-6.02a1 1 0 011.32-.084l.095.084 1.414 1.414a1 1 0 01.084 1.32l-.084.094-9.9 9.9a1 1 0 01-1.32.083l-.093-.084-9.9-9.9a1 1 0 01-.083-1.32l.083-.093 1.414-1.415a1 1 0 011.32-.083l.095.084 5.534 5.535L22 6a1 1 0 01.883-.993L23 5h2-2z" fill="#000000"/></svg>        </template>
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem label="删除" @click="onDelete">
        <template #icon>
          <svg width="13" height="13" viewBox="0 0 48 48" fill="#000000"><path fill-rule="evenodd" clip-rule="evenodd" d="M30 4a2 2 0 012 2l-.001 1.999L42.719 8c.445 0 .606.046.77.134.162.087.29.215.377.378.088.163.134.324.134.77v1.436c0 .446-.046.607-.134.77a.908.908 0 01-.378.378c-.163.088-.324.134-.77.134L40 11.999 40 42a2 2 0 01-2 2H10a2 2 0 01-2-2l-.001-30.001L5.282 12c-.446 0-.607-.046-.77-.134a.908.908 0 01-.378-.378c-.088-.162-.134-.324-.134-.77V9.282c0-.446.046-.607.134-.77a.909.909 0 01.378-.378c.163-.088.324-.134.77-.134l10.717-.001L16 6a2 2 0 012-2h12zm5.999 7.999h-24L12 40h24l-.001-28.001zM21 18a1 1 0 011 1v14a1 1 0 01-1 1h-2a1 1 0 01-1-1V19a1 1 0 011-1h2zm8 0a1 1 0 011 1v14a1 1 0 01-1 1h-2a1 1 0 01-1-1V19a1 1 0 011-1h2z" fill="#000000"/></svg>        </template>
      </ContextMenuItem>
    </div>

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
