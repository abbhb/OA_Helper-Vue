<script setup lang="ts">
import {ChatMsgEnum} from '@/types/enums/chat';
import {MsgType} from '@/types/chat';
import Image from './image.vue';
import Voice from './voice.vue';
import File from './file.vue';
import Video from './video.vue';
import Text from './text.vue';
import Emoji from './emoji.vue';

const componentMap = {
    [ChatMsgEnum.UNKNOWN]: '',
    [ChatMsgEnum.TEXT]: Text,
    [ChatMsgEnum.RECALL]: '',
    [ChatMsgEnum.IMAGE]: Image,
    [ChatMsgEnum.VOICE]: Voice,
    [ChatMsgEnum.FILE]: File,
    [ChatMsgEnum.VIDEO]: Video,
    [ChatMsgEnum.EMOJI]: Emoji,
  };

  defineProps<{ message: MsgType }>();
</script>

<template>
  <component :is="componentMap[message.type]" :body="message.body" />
</template>
