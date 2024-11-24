<script setup lang="ts">
  import { ComponentSize, ElAvatar, ElTooltip } from 'element-plus';
  import {PropType, computed, ref} from 'vue';
  import AvatarImage from "@/components/image/AvatarImage.vue";
  import UserItem from "@/components/MsgReadModal/UserItem.vue";
  import { AvatarItem } from './types';

  const count = ref(5)
  const props = defineProps({
    size: {
      type: [String, Number] as PropType<ComponentSize | number>,
      default: '',
    },
    max: {
      type: Number,
      default: 5,
    },
    drec: {
      type: String,
      default: "更多列表",
    },
    data: {
      type: Array as PropType<AvatarItem[]>,
      default: () => [],
    },
    showTooltip: {
      type: Boolean,
      default: true,
    },
  });

  const load = () => {
    if (count.value + 4 < props.data?.length) {
      count.value += 4;
    } else {
      // eslint-disable-next-line no-unsafe-optional-chaining
      count.value += (props.data?.length-count.value);
    }
  }

  const avatarListDialog = ref(false);
  const filterData = computed(() => props.data.slice(0, props.max));

  const openDiag = () => {
    avatarListDialog.value = true;
  }
</script>

<template>
  <div class="a-avatars" style="display: flex;align-items: center">
    <template v-for="item in filterData" :key="item.url">
      <template v-if="showTooltip && item.name">
        <a-tooltip :content="item.name" placement="top">
          <AvatarImage
            :size="size"
            :avatar="item.url"
            :name="item.name"
            class="relative"
            :style="{
              zIndex: filterData.indexOf(item),
            }"
          />
        </a-tooltip>
      </template>
      <template v-else>
        <AvatarImage
          :size="size"
          :avatar="item.url"
          :name="item.name"
          class="relative"
          :style="{
            zIndex: filterData.indexOf(item),
          }"
        />
      </template>
    </template>

    <ElAvatar
      v-if="data.length > max"
      :style="{
        zIndex: data.length,
      }"
      @click="openDiag"
    >
      <span>+{{ data.length - max }}</span>
    </ElAvatar>
  </div>

  <ElDialog
    v-model="avatarListDialog"
    class="msg-read-modal"
    :width="350"
    :title="drec"
    :close-on-click-modal="false"
    center
  >
    <ul
      v-infinite-scroll="load"
      class="read-unread-list"
      style="overflow: auto;height: 400px;"
    >
      <li v-if="data?.length === 0" class="read-unread-no-data"
      >暂无数据~</li
      >
      <li v-for="i in count" :key="'ttts'+i">
        <div style="display: flex;">
          <AvatarImage :avatar="data[i].url" :name="data[i].name" :key="'tesx1'+data[i].name+data[i].url"/>
          <div>
            {{data[i].name}}
          </div>
        </div>
      </li>
    </ul>
    <span>总计:{{data.length}}</span>
  </ElDialog>

</template>

<style scoped lang="less">
  .a-avatars {
    .avatar {
      margin-left: -15px;
    }
  }
</style>
