<script setup lang="ts">
import {nextTick, onMounted, provide, ref} from 'vue';
import throttle from 'lodash/throttle';

import {useChatStore} from '@/store/modules/chat/chat';
import {MessageType} from '@/types/chat';
// eslint-disable-next-line import/extensions
import VirtualList from '@/views/chat/chat-index/components/VirtualList/index.tsx';
import MsgItem from './MsgItem/index.vue';

const chatStore = useChatStore();
  const virtualListRef = ref();

  // 回到底部
  const goToBottom = () => {
    if (virtualListRef.value) {
      virtualListRef.value.scrollToBottom();
      chatStore.clearNewMsgCount();
    }
  };

  // 回到最新消息
  const goToNewMessage = () => {
    // 未读消息数 = 总数 - 新消息数
    virtualListRef.value.scrollToIndex(
      chatStore.chatMessageList.length - chatStore.newMsgCount
    );
    chatStore.clearNewMsgCount();
  };

  // 提供虚拟列表 ref 给子组件使用
  provide('virtualListRef', virtualListRef);

  onMounted(() => {
    nextTick(() => {
      chatStore.chatListToBottomAction = () => {
        goToBottom();
      };
    });
  });

  // 到顶部时触发函数 记录旧的滚动高度，加载更多消息后滚动回加载时那条消息的位置
  const onTotop = async () => {
    if (chatStore.isLoading) return;
    const oldIndex = virtualListRef.value.getSizes();
    await chatStore.loadMore();
    virtualListRef.value.scrollToIndex(
      virtualListRef.value.getSizes() - oldIndex
    );
  };

  // 滚动时触发函数，主要处理新消息提示
  const onScroll = throttle((eventData) => {
    const { offset, clientSize, scrollSize } = eventData;

    if (!offset || !clientSize || !scrollSize) return;

    // 是否已滚动到底部最后一个可视范围内
    const isScrollEnd = offset + clientSize >= scrollSize - clientSize;
    if (isScrollEnd) {
      chatStore.isStartCount = false;
      chatStore.clearNewMsgCount();
    } else {
      chatStore.isStartCount = true;
    }
  }, 100);

  const getKey = (item: MessageType) => item.message.id;
</script>

<template>
  <div class="chat-msg-list" >
    <icon-loading v-if="chatStore.isLoading" style="width: 100%" :size="14">
      消息加载中
    </icon-loading>
    <VirtualList
      v-if="chatStore.chatMessageList?.length"
      ref="virtualListRef"
      class="virtual-list scroll-hover"
      data-prop-name="msg"
      :data="chatStore.chatMessageList"
      :data-key="getKey"
      :item="MsgItem"
      :size="20"
      @totop="onTotop"
      @scroll="onScroll"
      @ok="goToBottom"
    />
    <!-- <VideoPlayer></VideoPlayer> -->
    <template
      v-if="!chatStore.isLoading && chatStore.chatMessageList?.length === 0"
    >
      <div class="empty">暂无消息，快来发送第一条消息吧~</div>
    </template>
    <span
      v-show="chatStore.newMsgCount > 0"
      class="new-msgs-tips"
      @click="goToNewMessage"
    >
      {{ chatStore.newMsgCount }} 条新消息
      <icon-loading :size="10"></icon-loading>
    </span>
  </div>
</template>

<style lang="less" scoped>
  .chat-msg-list {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 0;
    overflow: hidden;
    overflow-y: auto;

    // 取消滚动链接
    overscroll-behavior-y: contain;

    // 强制硬件加速
    transform: translate3d(0, 0, 0);
    //perspective: 1000;


    .empty {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      font-size: 14px;
      color: var(--font-light);
    }
  }

  .new-msgs-tips {
    position: absolute;
    right: 20px;
    bottom: 16px;
    display: flex;
    column-gap: 4px;
    align-items: center;
    padding: 2px 12px;
    font-size: 14px;
    color: var(--el-color-primary-light-3);
    cursor: pointer;
    background-color: var(--background-secondary);
    border: 1px solid var(--color-white);
    border-radius: 12px;
    box-shadow: 0 0 1px 1px var(--el-box-shadow-dark);

    &:hover {
      background-color: #1a1c22;
    }
  }

  .virtual-list {
    position: relative;
    width: 100%;
    height: 99%; // 100%时谷歌浏览器会出现无法滚动问题
    padding-right: 20px;
    padding-left: 20px;
    overflow-y: auto;
  }
</style>
