<script lang="ts" setup>
import {defineProps, ref} from 'vue';
import {getAllImageUrl} from '@/api/common';

const image = ref('');

const props = defineProps({
  img: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    required: false,
    defalse: -1
  }
});
const types = ref(false);
const text = ref<string>('');

const getavatar = async () => {
  if (!props.img) {
    return;
  }
  if (props.img.includes('data:image')) {
    // 直接解析
    image.value = props.img;
    return;
  }
  if (props.img.includes('http')) {
    image.value = props.img;
    return;
  }
  if (!props.img) {
    image.value = '';
    return;
  }
  const {data} = await getAllImageUrl({key: props.img});
  if (!data) {
    types.value = true;
    text.value = props.img.charAt(0);
    return;
  }
  image.value = data;
};

getavatar();
</script>

<template>
  <a-image :key="image" :src="image" :width="width !== -1 ? width : undefined"/>
</template>

<style lang="less" scoped></style>
