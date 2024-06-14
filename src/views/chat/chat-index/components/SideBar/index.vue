<script setup lang="ts">
  import { computed, onBeforeMount, ref } from 'vue';
  import { useChatStore } from '@/store/modules/chat/chat';
  import { useUserInfo } from '@/hooks/chat/useCached';
  import { formatTimestamp } from '@/utils/chat/computedTime';
  import AvatarImage from '@/components/image/AvatarImage.vue';
  import { ChatMsgEnum, RoomTypeEnum } from '@/types/enums/chat';
  import { IsAllUserEnum } from '@/types/chat';
  import { useGlobalStore } from '@/store/modules/chat/global';
  import renderReplyContent from '@/utils/chat/renderReplyContent';

  // 选中的聊天对话
  const chatStore = useChatStore();
  const globalStore = useGlobalStore();

  onBeforeMount(() => {
    // 请求回话列表
    chatStore.getSessionList();
  });

  // 选中的聊天对话
  const currentSession = computed(() => globalStore.currentSession);

  const sessionList = computed(() =>
    chatStore.sessionList.map((item) => {
      // 最后一条消息内容
      const lastMsg = Array.from(
        chatStore.messageMap.get(item.roomId)?.values() || []
      )?.slice(-1)?.[0];
      let LastUserMsg = '';
      if (lastMsg) {
        const lastMsgUserName = useUserInfo(lastMsg.fromUser.uid);
        LastUserMsg =
          lastMsg.message?.type === ChatMsgEnum.RECALL
            ? `${lastMsgUserName.value.name}:'撤回了一条消息'`
            : renderReplyContent(
                lastMsgUserName.value.name,
                lastMsg.message?.type,
                lastMsg.message?.body?.content || lastMsg.message?.body
              );
      }
      return {
        ...item,
        tag: item.hot_Flag === IsAllUserEnum.Yes ? '官方' : '',
        lastMsg: LastUserMsg || item.text || '欢迎使用EasyChat',
        lastMsgTime: formatTimestamp(item?.activeTime),
      };
    })
  );
  // 选中会话
  const onSelectSelectSession = (roomId: string, roomType: RoomTypeEnum) => {
    globalStore.currentSession.roomId = roomId;
    globalStore.currentSession.type = roomType;
    console.log('切换');
  };

  // 加载更多
  const load = () => {
    chatStore.getSessionList();
  };
</script>

<template>
  <div class="chat-message">
    <div
      v-for="(item, index) in sessionList"
      :key="index"
      :class="[
        'chat-message-item ',
        { active: currentSession.roomId === item.roomId },
      ]"
      @click="onSelectSelectSession(item.roomId, item.type)"
    >
      <el-badge
        :value="item.unreadCount"
        :max="999"
        :hidden="item.unreadCount < 1"
        class="item"
      >
        <AvatarImage shape="circle" :size="38" :avatar="item.avatar" />
      </el-badge>
      <div class="message-info">
        <div style="white-space: nowrap">
          <span class="person">{{ item.name }}</span>
          <span v-if="item.tag" class="tag">{{ item.tag }}</span>
        </div>
        <div class="message-message">{{
          (item.name || '') + '：' + item.lastMsg
        }}</div>
      </div>
      <span class="message-time">{{ item.lastMsgTime }}</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .chat-message {
    display: none;
    padding: 4px;
    margin: 20px 0px;
    overflow-y: auto;
    background-color: var(--color-bg-3);
    border: var(--color-border) 1px solid;
    &-item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 280px;
      height: 60px;
      padding: 12px 10px;
      color: var(--color-text-3);
      cursor: pointer;
      background-color: var(--color-bg-2);
      border-radius: 8px;

      .a-avatar {
        flex: none;
      }

      .message-info {
        padding: 0 10px;
        margin-right: auto;
        width: 13rem;
        .person {
          font-size: 14px;
        }

        .tag {
          display: inline-block;
          padding: 1px 4px;
          margin-left: 4px;
          font-size: 12px;
          font-weight: bold;
          color: var(--gold-1);
          background-color: var(--color-bg-2);
          border-radius: 4px;
          transform: scale(0.8);
        }

        .message-message {
          display: -webkit-box;
          width: 100%;
          overflow: hidden;
          font-size: 12px;
          color: var(--color-text-1);
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          word-break: break-word;
        }
      }

      .message-time {
        font-size: 12px;
        color: var(--color-text-1);
      }

      &:hover {
        background-color: var(--color-secondary-hover);
        transition: 0.3s;
      }

      &:not(:first-child) {
        margin-top: 4px;
      }

      &.active {
        background-color: var(--color-secondary-active);
      }
    }
  }

  @media only screen and (min-width: 1400px) {
    .chat-message {
      display: block;
    }
  }
</style>
