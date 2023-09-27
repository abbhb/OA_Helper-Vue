<script setup lang="ts">
import {computed, ref} from 'vue';
import {useChatStore} from '@/store/modules/chat/chat';
import {useUserInfo} from '@/hooks/chat/useCached';
import {formatTimestamp} from '@/utils/chat/computedTime';
import AvatarImage from "@/components/image/AvatarImage.vue";

// 选中的聊天对话
  const activeChat = ref('1');
  const chatStore = useChatStore();

  // 计算最后一条消息
  const lastMassage = computed(
    // eslint-disable-next-line no-unsafe-optional-chaining
    () => chatStore.chatMessageList?.[chatStore.chatMessageList?.length - 1]
  );
  const lastUid = computed(() => lastMassage.value?.fromUser.uid);
  const lastUserInfo = useUserInfo(lastUid);

  // mock数据等后端接口完成后变动0
  const mockData = computed(() => {
    const message = lastMassage.value?.message;
    return [
      {
        id: '1',
        msgName: 'MallChat 用户群',
        name: lastUserInfo.value.name,
        avatar: '',
        tag: '官方',
        // TODO 接收到艾特的时候，当前聊天没有被选中的时候，显示红色文本
        lastMsg:
          message?.type === 2
            ? '撤回了一条消息'
            : message?.body?.content || '欢迎使用AI-Chat',
        lastMsgTime: formatTimestamp(message?.sendTime),
      },
      {
        id: '2',
        msgName: '通知',
        name: '机器人',
        avatar: '',
        tag: '机器人',
        lastMsg: '欢迎使用AI-Chat',
        lastMsgTime: '13:54',
      },
    ];
  });
</script>

<template>
  <div class="chat-message">
    <div
      v-for="(item, index) in mockData"
      :key="index"
      :class="['chat-message-item ', { active: activeChat === item.id }]"
      @click="activeChat = item.id"
    >
      <AvatarImage shape="circle" :size="38" :avatar="item.avatar" />
      <div class="message-info">
        <div style="white-space: nowrap">
          <span class="person">{{ item.msgName }}</span>
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
  margin: 20px 10px;
  overflow-y: auto;

  &-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 280px;
    height: 60px;
    padding: 12px 10px;
    color: var(--color-light-3);
    cursor: pointer;
    background-color: var(--background-secondary);
    border-radius: 8px;

    .el-avatar {
      flex: none;
    }

    .message-info {
      padding: 0 10px;
      margin-right: auto;

      .person {
        font-size: 14px;
      }

      .tag {
        display: inline-block;
        padding: 1px 4px;
        margin-left: 4px;
        font-size: 12px;
        font-weight: bold;
        color: var(--color-gold);
        background-color: var(--background-4);
        border-radius: 4px;
        transform: scale(0.8);
      }

      .message-message {
        display: -webkit-box;
        width: 100%;
        overflow: hidden;
        font-size: 12px;
        color: var(--font-light);
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        word-break: break-word;
      }
    }

    .message-time {
      font-size: 12px;
      color: var(--font-light);
    }

    &:hover {
      background-color: var(--hover-bg-1);
      transition: 0.3s;
    }

    &:not(:first-child) {
      margin-top: 4px;
    }

    &.active {
      background-color: var(--background-indigo);
    }
  }
}

@media only screen and (min-width: 1400px) {
  .chat-message {
    display: block;
  }
}

</style>
