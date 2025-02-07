<script setup lang="ts">
  import { ChatMsgEnum } from '@/types/enums/chat';
  import { MessageType, MsgType } from '@/types/chat';
  import { UploadTask } from '@/hooks/chat/useUploadN';
  import { computed } from 'vue';
  import Image from './image.vue';
  import Voice from './voice.vue';
  import File from './file.vue';
  import Video from './video.vue';
  import Text from './text.vue';
  import Emoji from './emoji.vue';
  import Chatgpt from './chatgpt.vue';

  const props = defineProps<{
    message: MessageType | UploadTask;
    extType: 'chatgpt' | '';
  }>();

  const componentMap = {
    [ChatMsgEnum.UNKNOWN]: '',
    [ChatMsgEnum.TEXT]: Text,
    [ChatMsgEnum.RECALL]: '',
    [ChatMsgEnum.IMAGE]: Image,
    [ChatMsgEnum.VOICE]: Voice,
    [ChatMsgEnum.FILE]: File,
    [ChatMsgEnum.VIDEO]: Video,
    [ChatMsgEnum.EMOJI]: Emoji,
    [ChatMsgEnum.EMOJI]: Emoji,
    chatgpt: Chatgpt,
  };

  const SendErr = computed(() => {
    // @ts-ignore
    return props.message?.extInfo?.state === 4;
  });
  const messageOriginErr = computed(() => {
    // @ts-ignore
    return props.message?.extInfo?.err;
  });

  const getComponent = (extType, message: MessageType | UploadTask) => {
    console.log('正常的消息');
    console.log(message);
    if (extType === '') {
      try {
        return componentMap[message.message.type];
      } catch (e) {
        console.log('异常的消息解析');
        console.log(message);
      }
    }
    return componentMap[extType];
  };
  const retrySend = (msg:UploadTask) => {
    msg.start()
  }
</script>

<template>
  <div style="display: flex;align-items: center">
    <a-popover v-if="SendErr" title="错误原因">
      <IconExclamationCircle style="color: red" :size="22" @click="retrySend(message)" />
      <template #content>
        <p>{{ messageOriginErr }}</p>
      </template>
    </a-popover>
    <component
      :is="getComponent(extType, message)"
      v-if="message.message?.id"
      :key="message.message.id"
      :body="message.message.body"
      :origin="message"
    />
  </div>
</template>
