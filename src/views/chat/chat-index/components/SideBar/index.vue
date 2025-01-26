<script setup lang="ts">
  import { computed, onBeforeMount, ref } from 'vue';
  import { useChatStore } from '@/store/modules/chat/chat';
  import { useUserInfo } from '@/hooks/chat/useCached';
  import { formatTimestamp } from '@/utils/chat/computedTime';
  import AvatarImage from '@/components/image/AvatarImage.vue';
  import { ChatMsgEnum, RoomTypeEnum } from '@/types/enums/chat';
  import { IsAllUserEnum, SessionItem } from '@/types/chat';
  import { useGlobalStore } from '@/store/modules/chat/global';
  import renderReplyContent from '@/utils/chat/renderReplyContent';
  import { isLogin } from '@/utils/auth';
  import ContextMenu from './ContextMenu/index.vue';

  // 选中的聊天对话
  const chatStore = useChatStore();
  const userStore = useChatStore();
  const globalStore = useGlobalStore();
  const isShowMenu = ref(false); // 是否显示菜单
  onBeforeMount(() => {
    // 请求回话列表
    chatStore.getSessionList();
  });

  const rightSession = ref<SessionItem>(null);
  // 选中的聊天对话
  const currentSession = computed(() => globalStore.currentSession);
  // 弹出定位
  const menuOptions = ref({
    x: 0,
    y: 0,
  });
  // FIXME 未登录到登录这些监听没有变化。需处理
  const isCurrentUser = computed(() => isLogin());
  /** 右键菜单 */
  const handleRightClick = (e: MouseEvent, item: SessionItem) => {
    // perf: 未登录时，禁用右键菜单功能
    if (!isCurrentUser.value) {
      return;
    }
    rightSession.value = item;
    // TODO：看它源码里提供了一个transformMenuPosition函数可以控制在容器范围内弹窗 我试验了一下报错
    // https://github.com/imengyu/vue3-context-menu/blob/f91a4140b4a425fa2770449a8be3570836cdfc23/examples/views/ChangeContainer.vue#LL242C5-L242C5
    const { x, y } = e;
    menuOptions.value.x = x;
    menuOptions.value.y = y;
    isShowMenu.value = true;
  };

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
    if (roomId) {
      globalStore.currentSession.roomId = roomId;
      globalStore.currentSession.type = roomType;
      console.log('切换');
    }
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
      @contextmenu.prevent.stop="handleRightClick($event, item)"
    >
      <el-badge
        :value="item.unreadCount"
        :max="999"
        :hidden="item.unreadCount < 1"
        class="item"
      >
        <AvatarImage
          :key="item.roomId + 'key2' + item.name"
          shape="circle"
          :size="38"
          :avatar="item.avatar"
          :name="item.name"
        />
      </el-badge>
      <div class="message-info">
        <div style="white-space: nowrap">
          <span class="person">{{ item.name }}</span>
          <span v-if="item.tag" class="tag">{{ item.tag }}</span>
        </div>
        <div class="message-message">{{ item.lastMsg }}</div>
      </div>
      <span class="message-time">{{ item.lastMsgTime }}</span>
    </div>
    <ContextMenu
      v-model:show="isShowMenu"
      :options="menuOptions"
      :session="rightSession"
    />
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
          color: #c59512;
          background-color: #efe2bb;
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
