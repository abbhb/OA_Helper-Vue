<script setup lang="ts">
import {CacheUserItem} from '@/types/chat';
import AvatarImage from '@/components/image/AvatarImage.vue';

interface Props {
    item: CacheUserItem;
    activeIndex: number;
    index: number;
    onSelect?: (uid: string) => void;
  }
  const props = defineProps<Props>();

  const onClick = () => {
    props.onSelect?.(props.item.uid);
  };
</script>

<template>
  <div
    class="person-item"
    :class="{ 'person-item--active': activeIndex === index }"
    @click="onClick"
  >
    <AvatarImage class="avatar" :avatar="item.avatar" :name="item.name" :key="item.uid+'person1item'+item.name" :size="26" />
    <div class="person-item__name">
      {{ item.name }}
    </div>
  </div>
</template>

<style lang="less" scoped>
  .input-wrapper {
    box-sizing: border-box;
    display: inline-flex;
    width: 100%;
    max-height: 100px;
    padding: 0 12px;
    color: var(--font-main);
    cursor: text;
    background-color: var(--background-2);
    border: 1px solid transparent;
    border-radius: 6px;
    transition: all 0.1s cubic-bezier(0, 0, 1, 1);

    &:focus-within {
      outline: 1px solid var(--hover-primary);
    }

    .input {
      flex: 1;
      padding: 4px 0;
      overflow: hidden;
      overflow-y: auto;
      font-size: 14px;
      color: inherit;
      white-space: pre-wrap;
      cursor: inherit;
      resize: none;
      background: none;
      border: none;
      border-radius: 0;
      outline: none;

      &:empty::before {
        color: var(--color-text-1);
        pointer-events: none;
        content: attr(placeholder);
      }
    }
  }

  // 选人弹窗样式
  .at-mentions__dialog {
    position: fixed;
    z-index: 10000;
    min-width: 100px;
    padding: 6px;
    font-size: 16px;
    color: var(--color-text-1);
    background: var(--color-bg-3);
    border-radius: 12px;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0);
    transform: translateY(-100%);

    .person-warpper {
      max-height: 250px;
      padding-right: 2px;
      overflow: auto;
    }

    .person-item {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      height: 34px; // 方便计算所以写死
      padding: 4px 6px;
      margin-bottom: 2px;
      cursor: pointer;
      border-radius: 8px;

      .avatar {
        margin-right: 8px;
      }

      &:hover {
        background-color: rgba(13, 132, 255, 10%);
      }

      &--active {
        background-color: rgba(13, 132, 255, 30%);
      }

      &__name {
        font-size: 14px;

        span {
          font-size: 12px;
          color: var(--font-placeholder);
        }
      }
    }
  }
</style>
