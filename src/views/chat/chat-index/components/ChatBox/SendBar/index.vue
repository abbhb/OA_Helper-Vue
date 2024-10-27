<script setup lang="ts" name="SendBar">
  import {
    computed,
    onBeforeUnmount,
    onMounted,
    provide,
    reactive,
    ref,
    watch,
  } from 'vue';
  import { emojis } from '@/views/chat/chat-index/components/ChatBox/constant';
  import { insertInputText } from '@/views/chat/chat-index/components/ChatBox/MsgInput/utils';
  import throttle from 'lodash/throttle';

  import { judgeClient } from '@/utils/chat/detectDevice';
  import { useChatStore } from '@/store/modules/chat/chat';
  import { IMention } from '@/views/chat/chat-index/components/ChatBox/MsgInput/types';
  import { ChatMsgEnum, RoleEnum, RoomTypeEnum } from '@/types/enums/chat';
  import { Message } from '@arco-design/web-vue';
  import { sendMsg } from '@/api/chat';
  import { generateBody } from '@/utils/chat';
  import { useMockMessage } from '@/hooks/chat/useMockMessage';
  import { useRecording } from '@/hooks/chat/useRecording';
  import { useEmojiUpload } from '@/hooks/chat/useEmojiUpload';
  import { useUpload } from '@/hooks/chat/useUpload';
  import { useFileDialog } from '@vueuse/core';
  import { useUserInfo } from '@/hooks/chat/useCached';
  import { useEmojiStore } from '@/store/modules/chat/emoji';
  import { useUserStore } from '@/store';
  import { useGlobalStore } from '@/store/modules/chat/global';
  import eventBus from '@/utils/eventBus';
  import setting from '@/config/setting';
  import renderReplyContent from '@/utils/chat/renderReplyContent';
  import { useGroupStore } from '@/store/modules/chat/group';
  import MsgInput from '@/views/chat/chat-index/components/ChatBox/MsgInput/index.vue';

  const client = judgeClient();

  const chatStore = useChatStore();
  const globalStore = useGlobalStore();
  const isSending = ref(false);
  const inputMsg = ref('');
  const mentionRef = ref();
  const mentionList = ref<IMention[]>([]);
  const isAudio = ref(false);
  const isHovered = ref(false);
  const tempMessageId = ref('0');
  const showEmoji = ref(false);
  const nowMsgType = ref<ChatMsgEnum>(ChatMsgEnum.FILE);
  const panelIndex = ref(0);
  const isUpEmoji = ref(false);
  const tempEmojiId = ref('-1');
  const emojiSize = ref<number>(setting.chatEmojiSize);

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

  const onSelectPerson = ({
    uid,
    ignoreCheck,
  }: {
    uid: string;
    ignoreCheck?: boolean;
  }) => {
    console.log(uid);
    mentionRef.value?.onSelectPerson?.(uid, ignoreCheck);
    isAudio.value = false;
  };
  onMounted(() => {
    eventBus.on('onSelectPerson', onSelectPerson);
    eventBus.on('focusMsgInput', focusMsgInput);
  });
  onBeforeUnmount(() => {
    eventBus.off('onSelectPerson', onSelectPerson);
    eventBus.off('focusMsgInput', focusMsgInput);
  });

  // 发送消息
  const send = async (msgType: ChatMsgEnum, body: any) => {
    try {
      const { data } = await sendMsg({
        roomId: globalStore.currentSession.roomId,
        msgType,
        body,
      });
      if (data.message.type === ChatMsgEnum.TEXT) {
        // chatStore.pushMsg(data); // 消息列表新增一条消息,发送消息没必要再push了，收到ws的消息就能push
      } else {
        // 更新上传状态下的消息
        // chatStore.updateMsg(tempMessageId.value, data);
      }
    } catch (e) {
      // Message.error(e.message);
      console.log(e);
    } finally {
      inputMsg.value = ''; // 清空输入列表
      // eslint-disable-next-line no-use-before-define
      onClearReply(); // 置空回复的消息
      isSending.value = false;
      focusMsgInput(); // 输入框重新获取焦点
      chatStore.chatListToBottomAction?.(); // 滚动到消息列表底部
    }
  };

  const sendMsgHandler = () => {
    // 空消息或正在发送时禁止发送
    if (!inputMsg.value?.trim().length || isSending.value) {
      return;
    }

    isSending.value = true;
    send(ChatMsgEnum.TEXT, {
      content: inputMsg.value,
      // eslint-disable-next-line no-use-before-define
      replyMsgId: currentMsgReply.value.message?.id,
      atUidList: mentionList.value.map((item) => item.uid),
    });
  };

  const userStore = useUserStore(); // 是否已登录
  const emojiStore = useEmojiStore();
  const groupStore = useGroupStore();

  // 是否被提出群聊
  const isRemoved = computed(
    () =>
      globalStore.currentSession.type === RoomTypeEnum.Group &&
      groupStore.countInfo.role === RoleEnum.REMOVED
  );

  const isSign = computed(() => userStore.isSign);

  const currentMsgReply = computed(
    () => (userStore.isSign && chatStore.currentMsgReply) || {}
  );
  const currentReplUid = computed(
    () => currentMsgReply?.value.fromUser?.uid as string
  );
  const currentReplyUser = useUserInfo(currentReplUid);
  const emojiList = computed(() => emojiStore.emojiList);

  // // 是否被提出群聊
  // const isRemoved = computed(
  //   () => groupStore.countInfo.role === RoleEnum.REMOVED
  // );

  // 计算展示的回复消息的内容
  const showReplyContent = () => {
    const name = currentReplyUser?.value.name;
    const type = currentMsgReply?.value.message?.type;
    return renderReplyContent(
      name,
      type,
      currentMsgReply?.value.message?.body?.content
    );
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

  const { open, reset, files } = useFileDialog(options);
  const {
    isUploading,
    fileInfo,
    uploadFile,
    progress,
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

  watch(files, () => {
    selectAndUploadFile(files.value);
  });
  onStart(() => {
    if (!fileInfo.value) return;

    // 如果文件是视频就把消息类型改为视频
    if (fileInfo.value.type.includes('video')) {
      nowMsgType.value = ChatMsgEnum.VIDEO;
    }

    // const { type, body } = generateBody(fileInfo.value, nowMsgType.value, true);
    // const res = mockMessage(type, body);
    // res.uploading = true;
    // tempMessageId.value = res.message.id; // 记录下上传状态下的消息id
    // chatStore.pushMsg(res); // 消息列表新增一条消息
    // chatStore.chatListToBottomAction?.(); // 滚动到消息列表底部
  });

  useUploadChange((status) => {
    if (status === 'success') {
      if (!fileInfo.value) return;
      const { body, type } = generateBody(fileInfo.value, nowMsgType.value);
      send(type, body);
    }
    reset();
  });
  watch(isUploading, (newc) => {
    isSending.value = newc;
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
  <div class="chat-edit">
    <div v-show="Object.keys(currentMsgReply).length" class="reply-msg-wrapper">
      <span> {{ showReplyContent() }} </span>
      <icon-close-circle :style="{ fontSize: 16 }" @click="onClearReply" />
    </div>
    <div class="msg-input">
      <div
        :class="['action', { disabled: isUploading }]"
        @click="isAudio = !isAudio"
      >
        <icon-voice v-show="!isAudio" />
        <icon-pen-fill v-show="isAudio" />
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
          isSign
            ? isSending
              ? '消息发送中' + (progress ? '(' + progress + ')%' : '')
              : '来聊点什么吧~'
            : ''
        "
        :max-length="10000"
        :mentions="mentionList"
        @change="onInputChange"
        @send="sendMsgHandler"
      />
      <a-popover
        v-model:popup-visible="showEmoji"
        title=""
        content-class="emoji-warpper"
        :style="client === 'PC' ? 'width: 385px;' : '95%'"
        trigger="click"
      >
        <icon-face-smile-fill
          :class="['action', { disabled: isUploading }]"
          :size="emojiSize"
        />
        <template #content>
          <div
            class="action"
            @mouseover="isHovered = true"
            @mouseleave="isHovered = false"
          >
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
                  <a-image :width="50" :src="emoji.expressionUrl" />
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
                  <icon-loading spin :size="emojiSize" />
                </div>
              </div>
              <div class="footer">
                <div
                  :class="[
                    'cursor-pointer',
                    'footer-act',
                    { active: panelIndex === 0 },
                  ]"
                  :size="emojiSize"
                  @click="panelIndex = 0"
                  >emoji</div
                >
                <icon-heart-fill
                  :class="[
                    'cursor-pointer',
                    'footer-act',
                    { active: panelIndex === 1 },
                  ]"
                  :size="emojiSize"
                  @click="panelIndex = 1"
                />
              </div>
            </div>
          </div>
        </template>
      </a-popover>
      <icon-at
        :class="['action', { disabled: isUploading }]"
        :size="emojiSize"
        colorful
        @click="insertInputText({ content: '@', ...mentionRef?.range })"
      />
      <icon-file-image
        :class="['action', { disabled: isUploading }]"
        :size="emojiSize"
        colorful
        @click="openFileSelect('img')"
      />
      <icon-file
        :class="['action', { disabled: isUploading }]"
        :size="emojiSize"
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
    <span v-if="isSign && isRemoved" class="tips">
      您已被踢出群聊，无法再发送消息
    </span>
  </div>
</template>

<style lang="scss" src="./styles.scss" scoped />

<style lang="scss">
  .emoji-warpper {
    padding: 4px !important;
    padding-top: 8px !important;
    color: var(--color-text-1);
    background-color: var(--color-bg-1);
    border: none !important;
  }
</style>
