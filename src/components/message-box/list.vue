<template>
  <a-list :bordered="false" :max-height="380">
    <a-list-item
      v-for="item in renderList"
      :key="item.id"
      action-layout="vertical"
    >
      <div class="item-wrap" @click="onItemClick(item)">
        <a-list-item-meta>
          <template v-if="item.avatar" #avatar>
            <a-avatar :style="{
                opacity: item.read ? 0.5 : 1,
              }" shape="circle">
              <img v-if="item.avatar" :src="item.avatar" />
              <icon-desktop v-else />
            </a-avatar>
          </template>
          <template #title>
            <a-space :size="4">
              <span :style="{
                opacity: item.read ? 0.5 : 1,
              }">{{ item.username }}</span>
              <a-typography-text :style="{ opacity: 1 }" type="secondary">
                <a-button
                  :type="'text'"
                  :shape="'square'"
                  :size="'mini'"
                  @click="shanchu(item)"
                  >x</a-button
                >
              </a-typography-text>
            </a-space>
          </template>
          <template #description>
            <div
              :style="{
                opacity: item.read ? 0.5 : 1,
              }"
            >
              <RenderMessage :message="item.message.message" :ext-type="''" />
              <a-typography-text class="time-text">
                {{ item.message.sendTime }}
              </a-typography-text>
            </div>
          </template>
        </a-list-item-meta>
      </div>
    </a-list-item>
    <template #footer> </template>
    <div
      v-if="renderList.length && renderList.length < 3"
      :style="{ height: (showMax - renderList.length) * 86 + 'px' }"
    ></div>
  </a-list>
  <a-space
    fill
    :size="0"
    :class="{ 'add-border-top': renderList.length < showMax }"
  >
    <div class="footer-wrap">
      <a-link @click="allRead">{{ $t('messageBox.allRead') }}</a-link>
    </div>
    <div class="footer-wrap">
      <a-link @click="readMore">{{ $t('messageBox.viewMore') }}</a-link>
    </div>
  </a-space>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import { SystemMessageResp } from '@/api/system-message';
  import RenderMessage from '@/views/chat/chat-index/components/RenderMessage/index.vue';

  const props = defineProps({
    renderList: {
      type: Array as PropType<SystemMessageResp[]>,
      required: true,
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
  });
  const emit = defineEmits(['itemClick', 'allRead', 'remove', 'readMore']);
  const allRead = () => {
    emit('allRead');
  };
  const readMore = () => {
    emit('readMore');
  };

  const shanchu = (item: SystemMessageResp) => {
    emit('remove', item.id);
  };

  const onItemClick = (item: SystemMessageResp) => {
    if (!item.read) {
      emit('itemClick', item);
    }
  };
  const showMax = 3;
</script>

<style scoped lang="less">
  :deep(.arco-list) {
    .arco-list-item {
      min-height: 86px;
      border-bottom: 1px solid rgb(var(--gray-3));
    }
    .arco-list-item-extra {
      position: absolute;
      right: 20px;
    }
    .arco-list-item-meta-content {
      flex: 1;
    }
    .item-wrap {
      cursor: pointer;
    }
    .time-text {
      font-size: 12px;
      color: var(--color-text-4);
    }
    .arco-empty {
      display: none;
    }
    .arco-list-footer {
      padding: 0;
      height: 50px;
      line-height: 50px;
      border-top: none;
      .arco-space-item {
        width: 100%;
        border-right: 1px solid rgb(var(--gray-3));
        &:last-child {
          border-right: none;
        }
      }
      .add-border-top {
        border-top: 1px solid rgb(var(--gray-3));
      }
    }
    .footer-wrap {
      text-align: center;
    }
    .arco-typography {
      margin-bottom: 0;
    }
    .add-border {
      border-top: 1px solid rgb(var(--gray-3));
    }
  }
</style>
