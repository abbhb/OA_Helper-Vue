<script setup lang="ts">
import {computed, provide, reactive, ref} from 'vue';

import throttle from 'lodash/throttle';

import {judgeClient} from '@/utils/chat/detectDevice';
import {useChatStore} from '@/store/modules/chat/chat';
import {IMention} from '@/views/chat/chat-index/components/ChatBox/MsgInput/types';
import {ChatMsgEnum} from '@/types/enums/chat';
import {Input, Message} from '@arco-design/web-vue';
import {sendMsg} from '@/api/chat';
import {generateBody} from '@/utils/chat';
import {emojis} from '@/views/chat/chat-index/components/ChatBox/constant';
import {useMockMessage} from '@/hooks/chat/useMockMessage';
import {useRecording} from '@/hooks/chat/useRecording';
import {useEmojiUpload} from '@/hooks/chat/useEmojiUpload';
import {useUpload} from '@/hooks/chat/useUpload';
import {useFileDialog} from '@vueuse/core';
import {useUserInfo} from '@/hooks/chat/useCached';
import {useEmojiStore} from '@/store/modules/chat/emoji';
import {useUserStore} from '@/store';
import {insertInputText} from '@/views/chat/chat-index/components/ChatBox/MsgInput/utils';
import UserList from '../UserList/index.vue';
import ChatList from '../ChatList/index.vue';
import MsgInput from './MsgInput/index.vue';

const client = judgeClient();

  const chatStore = useChatStore();
  const isSelect = ref(false);
  const isSending = ref(false);
  const inputMsg = ref('');
  const mentionRef = ref<typeof Input>();
  const mentionList = ref<IMention[]>([]);
  const isAudio = ref(false);
  const isHovered = ref(false);
  const tempMessageId = ref('0');
  const showEmoji = ref(false);
  const nowMsgType = ref<ChatMsgEnum>(ChatMsgEnum.FILE);
  const panelIndex = ref(0);
  const isUpEmoji = ref(false);
  const tempEmojiId = ref('-1');

  const userStore = useUserStore(); // 是否已登录
  const emojiStore = useEmojiStore();

  const focusMsgInput = () => {
    setTimeout(() => {
      if (!mentionRef.value) return;
      mentionRef.value?.focus?.();
      const selection = mentionRef.value?.range?.selection as Selection;
      selection?.selectAllChildren(mentionRef.value.input);
      selection?.collapseToEnd();
    });
  };
  // 艾特
  const onSelectPerson = (uid: number, ignoreCheck?: boolean) => {
    mentionRef.value?.onSelectPerson?.(uid, ignoreCheck);
    isAudio.value = false;
  };

  provide('focusMsgInput', focusMsgInput);
  provide('onSelectPerson', onSelectPerson);

  // 发送消息
  const send = async (msgType: ChatMsgEnum, body: any, roomId = '1') => {
    const { data } = await sendMsg({ roomId, msgType, body });
    if (data.message.type === ChatMsgEnum.TEXT) {
      chatStore.pushMsg(data); // 消息列表新增一条消息
    } else {
      // 更新上传状态下的消息
      chatStore.updateMsg(tempMessageId.value, data);
    }
    inputMsg.value = ''; // 清空输入列表
    // eslint-disable-next-line no-use-before-define
    onClearReply(); // 置空回复的消息
    isSending.value = false;
    focusMsgInput(); // 输入框重新获取焦点
    chatStore.chatListToBottomAction?.(); // 滚动到消息列表底部
  };

  const currentMsgReply = computed(
    () => (userStore.isSign && chatStore.currentMsgReply) || {}
  );

  const sendMsgHandler = () => {
    // 空消息或正在发送时禁止发送
    if (!inputMsg.value?.trim().length || isSending.value) {
      return;
    }

    isSending.value = true;
    send(1, {
      content: inputMsg.value,
      replyMsgId: currentMsgReply.value.message?.id,
      atUidList: mentionList.value.map((item) => item.uid),
    });
  };

  const isSign = computed(() => userStore.isSign);

  const currentReplUid = computed(
    () => currentMsgReply?.value.fromUser?.uid as string
  );
  const currentReplyUser = useUserInfo(currentReplUid);
  const emojiList = computed(() => emojiStore.emojiList);

  // 计算展示的回复消息的内容
  const showReplyContent = () => {
    const name = currentReplyUser?.value.name;
    const type = currentMsgReply?.value.message?.type;
    if (type === ChatMsgEnum.TEXT) {
      return `${name}: ${currentMsgReply?.value.message?.body?.content}`;
    }
    if (type === ChatMsgEnum.IMAGE) {
      return `${name}: [图片]`;
    }
    if (type === ChatMsgEnum.FILE) {
      return `${name}: [文件]`;
    }
    if (type === ChatMsgEnum.VOICE) {
      return `${name}: [语音]`;
    }
    if (type === ChatMsgEnum.VIDEO) {
      return `${name}: [视频]`;
    }
    return '';
  };

  // 置空回复的消息
  // eslint-disable-next-line no-return-assign
  const onClearReply = () => (chatStore.currentMsgReply = {});
  // 插入表情
  const insertEmoji = (emoji: string) => {
    const input = mentionRef.value?.input;
    const editRange = mentionRef.value?.range as {
      range: Range;
      selection: Selection;
    };
    if (!input || !editRange) return;
    insertInputText({ content: emoji, ...editRange });
    // 需要更新以触发 onChang
    inputMsg.value = input.innerText;
    // 关闭表情弹窗，一次只选一个表情
    showEmoji.value = false;
    // 临时让获取焦点
    focusMsgInput();
  };

  const onInputChange = (val: string, mentions: IMention[]) => {
    mentionList.value = mentions;
  };
  const options = reactive({ multiple: false, accept: '.jpg,.png' });

  const { open, reset } = useFileDialog(options);
  const {
    isUploading,
    fileInfo,
    uploadFile,
    onStart,
    onChange: useUploadChange,
  } = useUpload();
  const { uploadEmoji, isEmojiUp } = useEmojiUpload();
  const { isRecording, start, stop, onEnd, second } = useRecording();
  const { mockMessage } = useMockMessage();

  const openFileSelect = (fileType: string, isEmoji = false) => {
    if (fileType === 'img') {
      nowMsgType.value = ChatMsgEnum.IMAGE;
      options.accept = '.jpg,.png,.gif,.jpeg,.webp';
    }
    if (fileType === 'file') {
      nowMsgType.value = ChatMsgEnum.FILE;
      options.accept = '*'; // 任意文件
    }
    isUpEmoji.value = isEmoji;
    open();
  };

  const selectAndUploadFile = async (files?: FileList | null) => {
    if (!files?.length) return;
    const file = files[0];
    if (nowMsgType.value === ChatMsgEnum.IMAGE) {
      if (!file.type.includes('image')) {
        Message.error('请选择图片文件');
        return;
      }
    }
    if (isUpEmoji.value) {
      await uploadEmoji(file);
    } else {
      await uploadFile(file);
    }
  };

  // 选中文件上传并发送消息
  provide('onChangeFile', selectAndUploadFile);
  // 设置消息类型
  provide('onChangeMsgType', (msgType: ChatMsgEnum) => {
    nowMsgType.value = msgType;
  });

  // onChange(selectAndUploadFile);

  onStart(() => {
    if (!fileInfo.value) return;

    // 如果文件是视频就把消息类型改为视频
    if (fileInfo.value.type.includes('video')) {
      nowMsgType.value = ChatMsgEnum.VIDEO;
    }

    const { type, body } = generateBody(fileInfo.value, nowMsgType.value, true);
    const res = mockMessage(type, body);
    tempMessageId.value = res.message.id; // 记录下上传状态下的消息id
    chatStore.pushMsg(res); // 消息列表新增一条消息
    chatStore.chatListToBottomAction?.(); // 滚动到消息列表底部
  });

  useUploadChange((status) => {
    if (status === 'success') {
      if (!fileInfo.value) return;
      const { body, type } = generateBody(fileInfo.value, nowMsgType.value);
      send(type, body);
    }
    reset();
  });

  onEnd((audioFile: any) => uploadFile(audioFile));

  const onStartRecord = () => {
    nowMsgType.value = ChatMsgEnum.VOICE;
    start();
  };

  const handleRightClick = (event: Event, id: string) => {
    event.preventDefault();
    tempEmojiId.value = tempEmojiId.value === id ? '-1' : id;
  };

  const sendEmoji = throttle((url: string) => {
    send(ChatMsgEnum.EMOJI, { url });
    showEmoji.value = false;
  }, 1000);
</script>

<template>
  <div class="chat-box">
    <div class="chat-wrapper">
      <template v-if="isSelect">
        <!--        此处可能出问题-->
        <icon-reply
          color="var(--font-light)"
          :style="{ fontSize: '160px' }"
          @click="onClearReply"
        />
      </template>
      <div v-else class="chat">
        <ChatList />
        <div class="chat-edit">
          <div
            v-show="Object.keys(currentMsgReply).length"
            class="reply-msg-wrapper"
          >
            <span> {{ showReplyContent() }} </span>
            <icon-reply :style="{ fontSize: '14px' }" @click="onClearReply" />
          </div>
          <div class="msg-input">
            <div class="action" @click="isAudio = !isAudio">
              <icon-reply v-show="!isAudio" icon="voice" class="audio" />
              <icon-reply v-show="isAudio" icon="jianpan" />
            </div>
            <div
              v-show="isAudio"
              class="recorded"
              @mousedown="onStartRecord()"
              @mouseup="stop()"
              @touchstart.passive="onStartRecord()"
              @touchend.passive="stop()"
            >
              <div class="recorded-tips">{{
                isRecording ? `录制中 ${second}s` : '按住说话'
              }}</div>
            </div>
            <MsgInput
              v-show="!isAudio"
              ref="mentionRef"
              v-model="inputMsg"
              class="m-input"
              autofocus
              :tabindex="!isSign || isSending"
              :disabled="!isSign || isSending"
              :placeholder="
                isSign ? (isSending ? '消息发送中' : '来聊点什么吧~') : ''
              "
              :mentions="mentionList"
              @change="onInputChange"
              @send="sendMsgHandler"
            />
            <a-popover
              v-model:popup-visible="showEmoji"
              title=""
              content-class="emoji-warpper"
              :width="client === 'PC' ? 385 : '95%'"
              trigger="click"
            >
              <a-button>Hover</a-button>
              <template #content>
                <div
                  class="action"
                  @mouseover="isHovered = true"
                  @mouseleave="isHovered = false"
                >
                  <icon-reply
                    v-if="isHovered"
                    icon="shocked"
                    :size="18"
                    colorful
                  />
                  <icon-reply v-else icon="happy1" :size="18" colorful />
                </div>
              </template>
              <div class="emoji-panel">
                <div v-show="panelIndex === 0" class="emoji-panel-content">
                  <ul class="emoji-list">
                    <li
                      v-for="(emoji, $index) of emojis"
                      :key="$index"
                      v-is-auth="true"
                      class="emoji-item"
                      @click="insertEmoji(emoji)"
                    >
                      {{ emoji }}
                    </li>
                  </ul>
                </div>
                <div v-show="panelIndex === 1" class="emoji-panel-content">
                  <div
                    v-for="emoji in emojiList"
                    :key="emoji.id"
                    class="item"
                    @click="sendEmoji(emoji.expressionUrl)"
                    @contextmenu="handleRightClick($event, emoji.id)"
                  >
                    <a-image :src="emoji.expressionUrl" />
                    <icon-folder-add
                      v-if="emoji.id === tempEmojiId"
                      icon="guanbi1"
                      class="del"
                      @click.stop="emojiStore.deleteEmoji(emoji.id)"
                    />
                  </div>
                  <icon-folder-add
                    v-if="emojiList.length < 50 && !isEmojiUp"
                    class="cursor-pointer item-add"
                    :size="30"
                    @click="openFileSelect('img', true)"
                  />
                  <div v-else class="item-add">
                    <icon-loading spin :size="30" />
                  </div>
                </div>
                <div class="footer">
                  <div
                    :class="[
                      'cursor-pointer',
                      'footer-act',
                      { active: panelIndex === 0 },
                    ]"
                    :size="18"
                    @click="panelIndex = 0"
                    >表情</div
                  >
                  <icon-reply
                    :class="[
                      'cursor-pointer',
                      'footer-act',
                      { active: panelIndex === 1 },
                    ]"
                    icon="aixin"
                    :size="18"
                    @click="panelIndex = 1"
                  />
                </div>
              </div>
            </a-popover>
            <icon-at
              class="action"
              :size="20"
              colorful
              @click="insertInputText({ content: '@', ...mentionRef?.range })"
            />
            <icon-file-image
              :class="['action', { disabled: isUploading }]"
              :size="18"
              colorful
              @click="openFileSelect('img')"
            />
            <icon-file
              class="action"
              :size="20"
              colorful
              @click="openFileSelect('file')"
            />
            <div class="divider" />
            <div
              :class="[
                'action',
                { 'is-edit': inputMsg.length, 'disabled': !inputMsg.length },
              ]"
              @click="sendMsgHandler"
            >
              <icon-send class="send" :size="20" />
            </div>
          </div>
          <span v-if="!isSign" class="tips"> 请登录之后再发言~ </span>
        </div>
      </div>
    </div>
    <UserList />
  </div>
</template>

<style lang="less" scoped>
  .chat-box {
    display: flex;
    flex: 1;
    align-items: stretch;
    padding: 20px 20px 20px 0;
    overflow: hidden;
  }

  .chat-wrapper {
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
  }

  .chat {
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100%;
    padding-bottom: 16px;
    background-color: var(--background-secondary);
    border-radius: 8px;
  }

  .chat-edit {
    position: relative;
    padding: 0 16px;
    word-break: break-all;

    .m-input {
      padding: 0 4px;
      margin: 0 4px;
      background-color: transparent;
    }

    .msg-input {
      display: flex;
      align-items: center;
      width: 100%;
      min-height: 40px;
      padding: 2px 6px;
      font-size: 14px;
      color: var(--font-main);
      background-color: var(--background-3);
      border-radius: 12px;

      .action {
        display: flex;
        align-items: center;
        padding: 4px;
        line-height: 1;
        cursor: pointer;
        background-color: var(--background-3);
        border-radius: 4px;
      }

      .action:hover {
        background-color: var(--hover-bg-2);
      }

      .send {
        transition: all 0.3s ease;
      }

      .is-edit {
        background-color: var(--background-2);
      }

      .is-edit .send {
        transform: rotate(45deg);
      }

      .disabled {
        color: var(--font-light);
        pointer-events: none;
      }

      .divider {
        position: relative;
        display: inline-block;
        width: 1px;
        height: 1.2em;
        margin: 0 4px;
        vertical-align: middle;
        border-left: 1px solid var(--background-2);
      }

      :deep(.el-textarea__inner) {
        padding: 0;
        font-size: 14px;
        color: var(--font-main);
        resize: none;
        background-color: var(--background-3);
        border: none;
        box-shadow: none;
        transition: 0.2s;
      }

      .recorded {
        position: relative;
        z-index: 20;
        display: inline-flex;
        justify-content: center;
        width: 100%;
        cursor: pointer;
        user-select: none;
        border-radius: 12px;

        &-tips {
          animation: scale-in-center 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)
            both;

          @keyframes scale-in-center {
            0% {
              opacity: 1;
              transform: scale(0);
            }

            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        }

        &:active {
          margin: 0 10px;
          font-weight: bolder;
          line-height: 2em;
          color: #ffb357;
          box-shadow: 0 0 12px 10px var(--background-2);
          transition: all 0.2s ease;
          transform: scaleY(1.1);
        }
      }
    }

    .reply-msg-wrapper {
      display: flex;
      column-gap: 12px;
      align-items: center;
      padding: 4px 12px;
      margin-bottom: 4px;
      font-size: 12px;
      color: var(--font-light);
      word-wrap: break-all;
      white-space: pre-wrap;
      background-color: var(--background-3);
      border-radius: 12px;
    }

    .reply-msg-content {
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .reply-msg-icon {
      margin-left: auto;
      cursor: pointer;
      border-radius: 4px;

      &:hover {
        background-color: var(--background-secondary);
      }
    }

    .tips {
      position: absolute;
      top: 0;
      left: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      font-size: 14px;
      cursor: pointer;
      backdrop-filter: saturate(90%) blur(2px);
    }

    .tips-text {
      margin-right: 2px;
      margin-left: 2px;
      color: var(--color-primary);
    }
  }

  .emoji-panel {
    display: flex;
    flex-direction: column;

    .footer {
      display: flex;
      align-items: center;
      padding: 4px 6px 0;
      margin-top: 4px;
      border-top: 1px solid var(--background-2);

      &-act {
        padding: 4px;
        margin-right: 8px;
        line-height: 18px;
        border-radius: 6px;
      }

      .active {
        background-color: var(--background-3);
      }
    }

    &-content {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      height: 220px;
      overflow-y: auto;

      .item {
        position: relative;
        width: 60px;
        height: 60px;
        margin: 7px;
        cursor: pointer;
        border-radius: 6px;

        .del {
          position: absolute;
          top: 0;
          right: 2px;
          font-weight: 500;
          color: #f54e4e;
          cursor: pointer;
        }

        img {
          width: 100%;
          height: 100%;
          vertical-align: bottom;
          border-radius: 2px;
        }

        &:hover {
          box-shadow: var(--el-box-shadow-light);
        }
      }

      .item-add {
        width: 60px;
        height: 60px;
        margin: 7px;
        line-height: 58px;
        text-align: center;
        border: 1px solid #fff;
        border-radius: 6px;
      }
    }
  }

  .emoji-list {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
    word-wrap: break-word;
    list-style-type: none;
  }

  .emoji-item {
    width: 28px;
    height: 28px;
    padding-top: 3px;
    padding-left: 2px;
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
    border-radius: 4px;

    &:hover {
      background-color: var(--background-3);
    }
  }

  .icon-lock {
    margin-right: 4px;
  }

  @keyframes audio-wave {
    0% {
      transform: scaleY(1);
    }

    50% {
      transform: scaleY(0.8);
    }

    100% {
      transform: scaleY(1);
    }
  }

  .audio {
    animation: audio-wave 1s infinite;
  }

  @media only screen and (max-width: 640px) {
    .chat-box {
      padding: 8px 0 0;
    }

    .chat-wrapper {
      margin-right: 0;
    }
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .emoji-warpper {
    padding: 4px !important;
    padding-top: 8px !important;
    color: var(--font-main) !important;
    background-color: var(--background-wrapper) !important;
    border: none !important;
  }
</style>
