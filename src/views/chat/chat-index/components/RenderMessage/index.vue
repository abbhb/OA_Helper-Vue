<script setup lang="ts">
  import { ChatMsgEnum } from '@/types/enums/chat';
  import {MessageType, MsgType} from '@/types/chat';
  import { UploadTask } from '@/hooks/chat/useUploadN';
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

  const getComponent = (extType, message: MessageType | UploadTask) => {
    console.log("正常的消息")
    console.log(message)
    if (extType === '') {
      try {
        return componentMap[message.message.type];
      }catch (e){
        console.log("异常的消息解析")
        console.log(message)
      }

    }
    return componentMap[extType];
  };

  defineProps<{ message: MessageType | UploadTask; extType: 'chatgpt' | '' }>();
</script>

<template>
  <component
    :is="getComponent(extType, message)"
    :key="message.message.id"
    :body="message.message.body"
    :origin="message"
  />
</template>
