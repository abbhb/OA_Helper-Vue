<script setup lang="ts">
import {inject} from 'vue';
import {MessageType} from '@/types/chat';
import {useChatStore} from '@/store/modules/chat/chat';
// eslint-disable-next-line import/no-named-as-default
import useLikeToggle from '@/hooks/chat/useLikeToggle';
import eventBus from "@/utils/chat/eventBus";

const props = defineProps<{ msg: MessageType }>();

  const chatStore = useChatStore();

  const { isLike, isDisLike, onLike, onDisLike } = useLikeToggle(
    props.msg.message
  );

  /**
   * 回复消息
   */
  const onReplyMsg = async (msgFromUser: MessageType) => {
    if (!msgFromUser) return;
    chatStore.currentMsgReply = msgFromUser;
    eventBus.emit('onSelectPerson', { uid:msgFromUser.fromUser.uid, ignoreCheck:true });
    eventBus.emit('focusMsgInput')
  };
</script>

<template>
  <div v-if="!msg.loading" class="msg-option">
    <span class="msg-option-item" title="回复">
      <icon-reply v-is-auth="true" :size="14" @click="() => onReplyMsg(msg)" />
    </span>
    <span class="msg-option-item" title="点赞">
      <icon-thumb-up-fill
        v-is-auth="true"
        :size="14"
        :class="[{ 'like-active': isLike }]"
        @click="() => onLike()"
      />
    </span>
    <span class="msg-option-item" title="不喜欢">
      <icon-thumb-down-fill
        v-is-auth="true"
        :class="[{ 'dislike-active': isDisLike }]"
        :size="15"
        @click="onDisLike()"
      />
    </span>
  </div>
</template>

<style lang="less" scoped>
  .msg-option {
    display: inline-flex;
    padding: 2px 4px;

    &-item {
      display: inline-flex;
      align-items: center;
      padding: 0 4px;
      cursor: pointer;
      border-radius: 4px;
    }

    &-item:hover {
      background-color: var(--background-dark);
    }

    .mallchat {
      display: inline-block;
      line-height: 1;
      color: var(--font-main);
      border-radius: 50%;
    }

    .mallchat:hover {
      color: var(--color-primary);
    }

    .like-active {
      color: var(--font-pink) !important;
    }

    .dislike-active {
      color: var(--color-light-1) !important;
    }
  }
</style>
