<script setup lang="ts">
  import { computed } from 'vue';
  import { TextBody } from '@/types/chat';
  import { useUserInfo } from '../../../../../hooks/chat/useCached';

  // todo: fix多行样式，保留原本的消息样式
  const props = defineProps<{ body: TextBody }>();

  // 获取所有匹配的字符串
  const urlMap = props.body.urlContentMap || {};
  const keys = Object.keys(urlMap);
  // 使用匹配字符串创建动态正则表达式，并将文本拆分为片段数组
  console.log(keys)
  for (let i = 0; i < keys.length; i+=1) {
    if (keys[i]&&keys[i]!==""){
      keys[i] = keys[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
  }
  const fragments = computed(() => {
    let content = props.body.content || '';
    content = content.replace(/&nbsp;/g, '\u00A0');
    const regex = new RegExp(`(@[^@]+○)`, 'g');
    const regex3 = new RegExp(`(${keys.join('|')})`, 'g');
    const regex2 = new RegExp('/```(.*?)```', 'g');
    // const contenes = [];
    const lists = content.split(regex);
    const newList = [];
    for (let i = 0; i < lists.length; i += 1) {
      if (!lists[i] || !lists[i].trim() || lists[i] === '') {
        continue;
      }
      if (lists[i].startsWith('@') && lists[i].trim() !== '@') {
        newList.push(lists[i]);
      } else {
        const temp = lists[i].split(regex3);
        if (temp.length > 0) {
          newList.push(...temp);
        }
      }
    }
    return newList;
  });

  // 打开链接
  const openUrl = (url: string) => {
    if (!url) return;
    // 当没有协议时，自动添加协议
    window.open(url.startsWith('http') ? url : `//${url}`, '_blank');
  };
  const regex = /@([0-9]+)○/;
  const clickUser = (uid: string) => {
    console.log(uid);
    alert('别点' + useUserInfo(uid).value.name + '了，等之后在适配吧');
  };
</script>

<template>
  <div class="text">
    <template v-for="(item, index) in fragments">
      <span
        v-if="
          item &&
          item.startsWith('@') &&
          item.match(regex) &&
          item.match(regex)[1] !== ''
        "
        :key="item"
        class="text-mention"
        @click="clickUser(item.match(regex)[1])"
      >
        @{{
          item.match(regex)?.length > 1 &&
          useUserInfo(item.match(regex)[1]).value.name
        }}
      </span>
      <template v-else-if="keys.includes(item)">
        <a-link :key="item" :href="item">
          {{ item }}
        </a-link>
      </template>
      <template v-else>
        <span :key="item">
          {{ item }}
        </span>
      </template>
      <div
        v-if="keys.includes(item)"
        :key="item + index"
        rel="noopener noreferrer nofollow"
        target="_blank"
        class="text-card"
        @click="openUrl(item.trim())"
      >
        <div
          v-if="urlMap[item].image"
          class="text-card-image"
          :style="{ backgroundImage: `url(${urlMap[item].image})` }"
        />
        <div class="text-card-link-content">
          <span class="text-card-link ellipsis-1"> {{ item.trim() }}</span>
          <span class="text-card-title ellipsis-2">
            {{ urlMap[item].title }}</span
          >
          <span class="text-card-desc ellipsis-1">{{
            urlMap[item].description
          }}</span>
        </div>
      </div>
    </template>
  </div>
</template>
