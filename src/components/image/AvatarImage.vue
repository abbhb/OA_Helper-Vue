<script lang="ts" setup>
  import { defineProps, ref } from 'vue';
  import { getAllImageUrl } from '@/api/common';

  const props = defineProps({
    avatar: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    online: {
      type: Boolean,
      required: false,
      default: true,
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
      return;
    }
    if (props.avatar.includes('http')) {
      image.value = props.avatar;
      return;
    }
    if (!props.avatar) {
      image.value = '';
      return;
    }
    const { data } = await getAllImageUrl({ key: props.avatar });
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
  <div :class="['avatar', { downline: !online }]">
    <a-avatar v-if="!types" :image-url="image" @error="error"
      >{{ text }}
    </a-avatar>
    <a-avatar
      v-else
      :style="{
        verticalAlign: 'middle',
        backgroundColor: '#14a9f8',
      }"
      >{{ text }}
    </a-avatar>
  </div>
</template>

<style lang="less" scoped></style>

<style lang="scss" scoped>
  .avatar {
    position: relative;
    box-sizing: border-box;
    line-height: 1;
    white-space: nowrap;
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    -webkit-user-drag: none;

    .status {
      position: absolute;
      right: 0;
      bottom: 0;
      z-index: 1;
      width: 30%;
      height: 30%;
      background-color: var(--color-online);
      border-radius: 50%;
    }

    img {
      width: 100%;
      height: 100%;
      -webkit-user-drag: none;
    }
  }

  .downline {
    filter: grayscale(1);
  }

  .avatar-circle {
    border-radius: 50%;

    img {
      border-radius: 50%;
    }
  }

  .avatar-square {
    border-radius: 8px;

    img {
      overflow: hidden;
      border-radius: 8px;
    }
  }
</style>
