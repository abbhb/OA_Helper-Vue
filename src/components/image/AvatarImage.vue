<script lang="ts" setup>
import {defineProps, ref} from 'vue';
import {getAllImageUrl} from '@/api/common';

const props = defineProps({
  avatar: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
});
const types = ref(false);
const text = ref<string>('');
const image = ref(
  'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp'
);
const error = () => {
  types.value = true;
  if (props.name) {
    text.value = props.name.charAt(0);
  } else {
    text.value = 'A';
  }
};
const getavatar = async () => {
  if (!props.avatar) {
    error();
    return;
  }
  if (props.avatar.includes('data:image')) {
    // 直接解析
    image.value = props.avatar;
  }
  if (props.avatar.includes('http')) {
    image.value = props.avatar;
  }
  if (!props.avatar) {
    image.value = '';
  }
  const {data} = await getAllImageUrl({key: props.avatar});
  if (!data) {
    types.value = true;
    text.value = props.name.charAt(0);
    return;
  }
  image.value = data;
};

getavatar();
</script>

<template>
  <a-avatar v-if="!types" :image-url="image" @error="error">{{
      text
    }}
  </a-avatar>
  <a-avatar
    v-else
    :style="{
      verticalAlign: 'middle',
      backgroundColor: '#14a9f8',
    }"
  >{{ text }}
  </a-avatar
  >
</template>

<style lang="less" scoped></style>
