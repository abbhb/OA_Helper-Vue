<script setup lang="ts">
  import {
    computed,
    inject,
    nextTick,
    onMounted,
    type PropType,
    reactive,
    ref,
    type Ref,
    toRefs,
    watch,
  } from 'vue';

  import { MessageType, MsgType } from '@/types/chat';
  import { useUserStore } from '@/store';
  import { pageSize, useChatStore } from '@/store/modules/chat/chat';
  import { useUserInfo } from '@/hooks/chat/useCached';
  import { ChatMsgEnum } from '@/types/enums/chat';
  import { useLikeToggle } from '@/hooks/chat/useLikeToggle';
  import { formatTimestamp } from '@/utils/chat/computedTime';
  import RenderMessage from '@/views/chat/chat-index/components/RenderMessage/index.vue';
  import AvatarImage from '@/components/image/AvatarImage.vue';
  import ContextMenu from '@/views/chat/chat-index/components/ChatList/ContextMenu/index.vue';
  import UserContextMenu from '@/views/chat/chat-index/components/ChatList/UserContextMenu/index.vue';
  import { useElementVisibility } from '@vueuse/core';
  import eventBus from '@/utils/eventBus';
  import { useGlobalStore } from '@/store/modules/chat/global';
  import setting from "@/config/setting";
  import MsgOption from '../MsgOption/index.vue';

  const props = defineProps({
    // 消息体
    msg: {
      type: Object as PropType<MessageType>,
      required: true,
    },
    // 是否显示时间
    isShowTime: {
      type: Boolean,
      default: true,
    },
    // 是否显示时间段
    isShowTimeBlock: {
      type: Boolean,
      default: true,
    },
    // 消息气泡模式：左右分布-spread、左对齐-left、右对齐-right
    bubbleMode: {
      type: String,
      default: 'spread',
    },
    // 消息气泡操作触发方式
    tooltipTrigger: {
      // type: [String, Array] as PropType<
      //   TooltipTriggerType | TooltipTriggerType[]
      // >,
      default: 'hover',
    },
  });

  // 多根元素的时候，不加这个透传属性会报 warning
  // eslint-disable-next-line no-undef
  defineOptions({ inheritAttrs: false });

  // 只能对一级 props 进行 toRefs 结构，否则会丢失响应
  const message = computed(() => props.msg.message)
  const fromUser = computed(() => props.msg.fromUser)
  const isVisible = ref(false);

  const handleVisibilityChange = (visible) => {
    isVisible.value = visible;
  };


  const userStore = useUserStore();
  const chatStore = useChatStore();
  const globalStore = useGlobalStore();
  const userInfo = useUserInfo(fromUser.value.uid);
  const isCurrentUser = computed(
    () => props.msg?.fromUser.uid === userStore?.userInfo.id
  );
  const chatCls = computed(() => ({
    'chat-item': true,
    'is-me': isCurrentUser.value,
    'right':
      (isCurrentUser.value && props.bubbleMode === 'spread') ||
      props.bubbleMode === 'right',
  }));

  const onAtUser =
    inject<(uid: string, ignore: boolean) => void>('onSelectPerson');
  const renderMsgRef = ref<HTMLElement | null>(null);
  const boxRef = ref<HTMLElement | null>(null);
  const tooltipPlacement = ref();
  const readCount = reactive<{ read: number; unread: number | null }>({
    read: 0,
    unread: null,
  });
  const virtualListRef = inject<Ref>('virtualListRef');
  const isShowMenu = ref(false); // 是否显示菜单
  const isShowUserMenu = ref(false); // 是否显示用户名及头像右键菜单

  // 弹出定位
  const menuOptions = ref({
    x: 0,
    y: 0,
  });
  const { isLike, isDisLike, likeCount, dislikeCount, onLike, onDisLike } =
    useLikeToggle(props.msg.message);
  const isRecall = computed(() =>
    [ChatMsgEnum.RECALL, ChatMsgEnum.SYSTEM].includes(message.value.type)
  );

  // 滚动到消息
  const scrollToMsg = async (msg: MsgType) => {
    const { id } = msg;
    const { reply } = msg.body;
    // 不允许跳转不跳转，目前是 100 条(后端配置)以内允许跳转
    if (!reply || !reply.canCallback) return;
    // 如果消息已经加载过了，就直接跳转
    const index = chatStore.getMsgIndex(reply.id);
    if (index > -1) {
      virtualListRef?.value?.scrollToIndex(index, true, 12);
    } else {
      // 如果没有加载过，就先加载，然后跳转
      const curMsgIndex = chatStore.getMsgIndex(id);
      // +1 是在 reply.gapCount - curMsgIndex 刚好是 pageSize 倍数的时候，跳转到的是第一条消息，会触发加载更多，样式会乱掉
      const needLoadPageSize =
        Math.ceil((reply.gapCount - curMsgIndex + 1) / pageSize) * pageSize;
      // 加载数据
      await chatStore.loadMore(needLoadPageSize);
      // 跳转
      // FIXME 这时候新加载消息了，所以会有滚动冲突，故不加动画效果，否则会很怪异。
      setTimeout(
        virtualListRef?.value?.scrollToIndex(
          chatStore.getMsgIndex(reply.id),
          false,
          12
        ),
        0
      );
      // TODO 跳转到的消息 高亮一下
    }
  };

  /** 右键菜单 */
  const handleRightClick = (e: MouseEvent) => {
    // perf: 未登录时，禁用右键菜单功能
    if (!userStore.isSign) {
      return;
    }

    // TODO：看它源码里提供了一个transformMenuPosition函数可以控制在容器范围内弹窗 我试验了一下报错
    // https://github.com/imengyu/vue3-context-menu/blob/f91a4140b4a425fa2770449a8be3570836cdfc23/examples/views/ChangeContainer.vue#LL242C5-L242C5
    const { x, y } = e;
    menuOptions.value.x = x;
    menuOptions.value.y = y;
    isShowMenu.value = true;
  };

  /** 右键菜单 */
  const handleUserRightClick = (e: MouseEvent) => {
    // perf: 未登录时，禁用右键菜单功能
    if (!userStore.isSign || isCurrentUser.value) {
      return;
    }
    // TODO：看它源码里提供了一个transformMenuPosition函数可以控制在容器范围内弹窗 我试验了一下报错
    // https://github.com/imengyu/vue3-context-menu/blob/f91a4140b4a425fa2770449a8be3570836cdfc23/examples/views/ChangeContainer.vue#LL242C5-L242C5
    const { x, y } = e;
    menuOptions.value.x = x;
    menuOptions.value.y = y;
    isShowUserMenu.value = true;
  };

  const msgVisibleEl = ref(null);

  onMounted(() => {
    nextTick(() => {
      if (renderMsgRef.value && boxRef.value) {
        const renderMsgWidth = renderMsgRef.value.clientWidth
        const boxWidth = boxRef.value.clientWidth
        if (renderMsgWidth + 150 <= boxWidth) {
          tooltipPlacement.value = 'right-start'
        } else if (props.msg.message.body.reply) {
          tooltipPlacement.value = 'top-end'
        } else {
          tooltipPlacement.value = 'bottom-end'
        }
      }
      const targetIsVisible = useElementVisibility(msgVisibleEl);
      const msg = props.msg.message;
      // 自己的消息, 且不是撤回/系统消息，才监听未读数计算
      if (
        isCurrentUser.value &&
        msgVisibleEl &&
        ![ChatMsgEnum.RECALL, ChatMsgEnum.SYSTEM].includes(msg.type)
      ) {
        // 做元素进入退出视口监听，在视口内的自己的消息就做
        // ~~5分钟内每10s中查询一次已读数~~
        watch(isVisible, (visible) => {
          if (visible) {
            console.log("消息进入视口")
            eventBus.emit('onAddReadCountTask', {
              msgId: props.msg.message.id,
            });
          } else {
            console.log("消息离开视口")

            eventBus.emit('onRemoveReadCountTask', {
              msgId: props.msg.message.id,
            });
          }
        });
      }
    });
  });

  // 已读数
  eventBus.on('onGetReadCount', (res) => {
    const currentMsgCount = res.get(props.msg.message.id)
    if (currentMsgCount) {
      readCount.read = currentMsgCount.readCount
      readCount.unread = currentMsgCount.unReadCount
    }
  })

  const currentReadList = (msgId: string) => {
    // 全部已读禁止打开弹窗。
    if (readCount.unread === 0) return;
    globalStore.currentReadUnreadList.msgId = msgId;
    globalStore.currentReadUnreadList.show = true;
  };
</script>

<template>
  <span v-if="isShowTimeBlock && msg.timeBlock" class="send-time-block">{{
    msg.timeBlock
  }}</span>
  <span v-if="isRecall" class="send-time-block">{{ message.body }}</span>
  <div ref="msgVisibleEl" v-visible="handleVisibilityChange"
  >
    <transition name="remove">
      <div v-if="!isRecall" :class="chatCls">
        <!-- 用户头像 -->
        <AvatarImage
          :avatar="userInfo.avatar"
          :name="userInfo.name"
          @contextmenu.prevent.stop="handleUserRightClick($event)"
        />
        <div ref="boxRef" class="chat-item-box">
          <div class="chat-item-user-info">

            <!-- 用户名 -->
            <span
              class="user-name"
              @contextmenu.prevent.stop="handleUserRightClick($event)"
            >
              {{ userInfo.name }}
            </span>
            <!-- 消息归属地 -->
            <span class="user-ip">({{ userInfo.locPlace || '未知' }})</span>
            <!-- 消息发送时间 -->
            <span v-if="isShowTime" class="send-time">
              {{ formatTimestamp(msg.message.sendTime) }}
            </span>
          </div>
          <el-tooltip
            effect="light"
            popper-class="option-tooltip"
            :trigger="tooltipTrigger"
            :placement="tooltipPlacement || 'bottom-end'"
            :offset="2"
            :show-arrow="false"
            :teleported="false"
          >
            <!-- 消息的操作，点赞回复那些 -->
            <template #content>
              <MsgOption :msg="msg" />
            </template>
            <div
              ref="renderMsgRef"
              :class="['chat-item-content', { uploading: msg?.loading }]"
              @contextmenu.prevent.stop="handleRightClick($event)"
            >
              <!-- 这里是未读数计算 -->
              <div
                v-if="isCurrentUser"
                class="chat-item-read-count"
                :class="{
                  'is-gray': readCount.unread === 0,
                }"
                @click="currentReadList(msg.message.id)"
              >
                <span
                  v-if="readCount.unread !== 0"
                  class="chat-item-read-count-text"
                >
                  {{ readCount.read }}
                </span>
                <el-icon v-else><IconCheckCircle /></el-icon>
              </div>
              <!-- 消息加载中 -->
              <Icon v-if="msg?.loading" icon="loading" :size="20" spin />
              <!-- 渲染消息内容体 -->
              {{fromUser.username}}
              <RenderMessage :message="message" :ext-type="fromUser.uid===setting.chatgptUserInfo.uid?'chatgpt':''"/>
            </div>
          </el-tooltip>
          <!-- 消息回复部分 -->
          <div
            v-if="message.body?.reply"
            class="chat-item-reply"
            :class="{ pointer: message.body.reply.canCallback }"
            @click="scrollToMsg(message)"
          >
            <icon-to-top v-if="message.body.reply.canCallback" :size="12" />
            <span class="ellipsis">
              {{ message.body.reply.username }}: {{ message.body.reply.body }}
            </span>
          </div>
          <!-- 点赞数量和倒赞数量及动画 -->
          <div v-if="likeCount + dislikeCount > 0" class="extra">
            <transition name="fade">
              <span
                v-if="likeCount > 0"
                v-login="onLike"
                :class="['extra-item like', { active: isLike }]"
              >
                <icon-thumb-up-fill />
                <transition name="count-up" mode="out-in">
                  <span :key="likeCount" class="count">{{ likeCount }}</span>
                </transition>
              </span>
            </transition>
            <transition name="fade">
              <span
                v-if="dislikeCount > 0"
                v-login="onDisLike"
                :class="['extra-item dlike', { active: isDisLike }]"
              >
                <icon-thumb-down-fill :size="17" />
                <transition name="count-up" mode="out-in">
                  <span :key="dislikeCount" class="count">{{
                    dislikeCount
                  }}</span>
                </transition>
              </span>
            </transition>
          </div>
        </div>
      </div>
    </transition>
  </div>
  <ContextMenu v-model:show="isShowMenu" :options="menuOptions" :msg="msg" />
  <UserContextMenu
    v-model:show="isShowUserMenu"
    :options="menuOptions"
    :uid="msg.fromUser.uid"
  />
</template>

<style lang="less">
  .option-tooltip {
    z-index: 3;
    padding: 0;
    line-height: 12px;
    color: var(--font-main);
    background-color: var(--color-bg-2) !important;
    border: none !important;
  }
  .chat-item {
    position: relative;
    display: flex;
    width: 100%;
    padding-bottom: 20px;

    &-box {
      flex: 1;
      padding: 0 12px;
    }

    &-user-info {
      display: flex;
      column-gap: 4px;
      align-items: center;
      margin-bottom: 8px;
      //消息字号
      font-size: 14px;
      color: var(--color-text-1);
      white-space: nowrap;

      .user-name:hover {
        color: var(--color-text-1);
        cursor: pointer;
      }

      .user-badge {
        width: 18px;
        height: 18px;
        cursor: pointer;
        user-select: none;
      }

      .user-ip {
        user-select: none;
      }

      .send-time {
        display: inline-block;
        user-select: none;
        opacity: 0;
      }
    }

    &-content {
      position: relative;
      width: fit-content;

      .text {
        min-height: 1em;
        padding: 8px 12px;
        font-size: 15px;
        line-height: 22px;
        color: var(--color-text-1);
        word-break: break-word;
        background-color: var(--color-bg-2);
        border-radius: 2px 18px 18px;

        &-card {
          display: inline-flex;
          column-gap: 8px;
          width: 100%;
          padding: 6px 12px;
          margin: 4px 0;
          cursor: pointer;
          user-select: none;
          background-color: var(--background-1);
          border-radius: 4px;
          box-shadow: var(--el-box-shadow-light);

          &-link {
            margin-bottom: 6px;
            font-size: 12px;
            color: var(--color-text-1);

            &-content {
              display: inline-flex;
              flex-direction: column;
            }
          }

          &-image {
            width: 60px;
            height: 60px;
            margin-top: 6px;
            overflow: hidden;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
          }

          &-title {
            font-size: 14px;
            color: var(--color-text-1);
          }

          &-desc {
            font-size: 12px;
            color: var(--color-text-1);
          }

          &:hover {
            box-shadow: var(--color-secondary-hover);
            opacity: 0.85;
          }
        }

        &-mention {
          font-weight: 500;
          color: var(--color-text-1);
          cursor: pointer;
          border-radius: 4px;

          &:empty::before {
            content: '';
          }

          &:hover {
            opacity: 0.9;
          }
        }
      }

      .image {
        position: relative;
        width: auto;
        border-radius: 4px;

        img {
          width: 100%;
          height: 100%;
          border-radius: 4px;
        }

        &-slot {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-width: 70px;
          height: 100%;
          font-size: 12px;
          color: var(--color-text-1);
          vertical-align: middle;
          background: var(--color-bg-2);
        }
      }

      .emoji {
        width: 128px;
        height: 128px;
        user-select: none;
      }

      .file {
        display: flex;
        align-items: center;
        padding: 8px;
        line-height: 1;
        color: var(--font-main);
        cursor: pointer;
        background-color: var(--color-bg-2);
        border-radius: 12px;

        .file-desc {
          display: flex;
          flex-direction: column;
          margin: 0 12px 0 6px;

          .file-name {
            display: -webkit-box;
            max-width: 300px;
            margin-bottom: 2px;
            overflow: hidden;
            font-size: 13px;
            line-height: normal; // 修复文件名截断问题
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .file-size {
            font-size: 12px;
            color: var(--color-text-1);
            user-select: none;
          }
        }

        &:hover {
          box-shadow: var(--color-bg-1);
        }

        .icon-xiazai:hover {
          color: var(--color-text-1) !important;
        }
      }

      .voice {
        display: flex;
        align-items: center;
        min-width: fit-content;
        max-width: 310px;
        padding: 8px 2px 8px 8px;
        line-height: 1;
        color: var(--font-main);
        cursor: pointer;
        user-select: none;
        background-color: var(--color-text-2);
        border-radius: 12px;

        .num {
          min-width: 2em;
        }

        .saying {
          position: relative;
          margin-right: 6px;
        }

        .shelter {
          position: absolute;
          top: 0;
          right: 0;
          z-index: 20;
          width: 0;
          height: 100%;
          background: var(--color-bg-2);
        }

        .play {
          animation: scalein 1s ease-out infinite;
        }

        audio {
          display: none;
        }

        @keyframes scalein {
          0% {
            width: 100%;
          }

          10% {
            width: 65%;
          }

          39% {
            width: 65%;
          }

          40% {
            width: 45%;
          }

          69% {
            width: 45%;
          }

          70% {
            width: 0;
          }

          100% {
            width: 0;
          }
        }
      }

      .video {
        position: relative;
        width: auto;
        background-color: var(--color-bg-2);
        border-radius: 4px;
        margin-bottom: 30px;

        img {
          width: 100%;
          height: 100%;
          border-radius: 4px;
        }

        .icon-bofang {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 10;
          color: var(--color-text-1);
          transform: translate(-50%, -50%);
        }

        &:hover {
          box-shadow: var(--color-text-1);

          .icon-bofang {
            color: var(--color-text-1);
          }
        }
      }

      a {
        color: var(--color-text-1);
      }
    }

    .uploading {
      .file {
        .icon-xiazai {
          display: none !important;
        }
      }
    }

    &-option {
      position: absolute;

      // display: none;
      top: -20px;
      right: 0;
      z-index: 999;
    }

    &-reply {
      display: flex;
      align-items: flex-start;
      width: fit-content;
      padding: 4px 12px;
      margin-top: 4px;
      margin-right: auto;
      overflow: hidden;
      font-size: 12px;
      color: var(--color-text-2);
      word-break: break-all;
      background-color: var(--color-bg-3);
      border-radius: 8px;

      .icon-totop {
        color: var(--color-text-1);
      }

      &.pointer {
        cursor: pointer;
      }

      .ellipsis {
        display: -webkit-inline-box;
        text-overflow: ellipsis;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
      }
    }

    .extra {
      width: fit-content;
      margin-top: 4px;
      user-select: none !important;

      &-item {
        display: inline-flex;
        align-items: center;
        padding: 0 6px;
        cursor: pointer;
        background-color: var(--color-bg-3);
        border: 1px solid var(--color-border);
        border-radius: 8px;

        .mallchat {
          line-height: 1;
          transition: transform 0.2s;
        }

        .count {
          margin: 0 4px 0 2px;
          font-size: 12px;
        }

        &:hover {
          .mallchat {
            transform: scale(1.1);
          }

          &.dlike .mallchat {
            transform: scale(0.9);
          }
        }
      }

      .active {
        &.like {
          color: var(--pinkpurple-1);
          border-color: var(--color-border-4);
        }

        &.dlike {
          color: var(--color-text-1);
          border-color: var(--color-border);
        }
      }
    }
  }

  .right {
    flex-direction: row-reverse;

    .chat-item-user-info {
      justify-content: flex-end;

      .send-time {
        order: 0;
      }

      .user-badge {
        order: 1;
      }

      .user-name {
        order: 2;
      }

      .user-ip {
        order: 3;
      }
    }

    .chat-item-content {
      margin-left: auto;

      .text {
        border-radius: 18px 2px 18px 18px;
      }
    }

    .extra,
    .chat-item-reply {
      margin-right: 0;
      margin-left: auto;
    }
  }

  .chat-item:hover {
    .send-time {
      display: inline-block;
      opacity: 1;
      transition: opacity 0.3s 1s;
    }

    .chat-item-option {
      display: inline-flex;
    }
  }

  .send-time-block {
    display: inline-block;
    width: 100%;
    margin-bottom: 12px;
    font-size: 12px;
    color: var(--color-text-1);
    text-align: center;
    user-select: none;
  }

  .is-me .chat-item-content {
    display: flex;
    align-items: center;

    .icon-loading {
      margin: 0 8px;
    }

    .text {
      background-color: var(--color-primary-light-1);

      &-mention {
        color: #2299dd;
      }
    }

    a {
      color: var(--color-text-1);
    }
  }

  .fade-enter-leave,
  .fade-enter-active {
    animation: fade 0.5s;
  }

  @keyframes fade {
    0% {
      transform: translateY(100%);
    }

    100% {
      transform: translateY(0);
    }
  }

  .count-up-enter-active,
  .count-up-leave-active {
    transition: all 0.25s ease-out;
  }

  .count-up-enter-from {
    opacity: 0;
    transform: translateY(5px);
  }

  .count-up-leave-to {
    opacity: 0;
    transform: translateY(-5px);
  }

  .remove-enter-active,
  .remove-leave-active {
    transition: opacity 0.12s, transform 0.12s, height 0.12s;
  }

  .remove-leave-to {
    height: 14px; // 防抖动的核心，与send-time-block真实高度一致
    opacity: 0;
    transform: scale(0);
  }
  .chat-item-read-count-text {
    display: inline-block;
    padding: 1px 4px;
    font-size: 10px;
    line-height: 1;
    cursor: pointer;
    border: 1px solid currentcolor;
    border-radius: 8px;
    transform: scale(0.8);
  }
</style>
