<script setup lang="ts">
  import { ChatMsgEnum } from '@/types/enums/chat';
  import { MsgType } from '@/types/chat';
  import Image from './image.vue';
  import Voice from './voice.vue';
  import File from './file.vue';
  import Video from './video.vue';
  import Text from './text.vue';
  import Emoji from './emoji.vue';
  import Chatgpt from './chatgpt.vue';

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

  const getComponent = (extType, message) => {
    if (extType === '') {
      return componentMap[message.type];
    }
    return componentMap[extType];
  };

  defineProps<{ message: MsgType; extType: 'chatgpt' | '' }>();
</script>

<template>
  <component
    :is="getComponent(extType, message)"
    :key="message.id"
    :body="message.body"
  />
</template>
