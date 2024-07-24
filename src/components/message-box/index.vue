<template>
  <a-spin style="display: block" :loading="loading">
    <a-tabs v-model:activeKey="messageType" type="rounded" destroy-on-hide>
      <a-tab-pane key="message">
        <template #title>
          <span> 系统通知{{ SystemUnreadCount }} </span>
        </template>
        <a-result v-if="!renderList.length" status="404">
          <template #subtitle> {{ $t('messageBox.noContent') }} </template>
        </a-result>
        <a-spin :loading="loading">
          <List
            :render-list="renderList"
            :unread-count="unreadCount"
            @item-click="handleItemClick"
            @remove="handleRemove"
            @all-read="handleAllRead"
            @read-more="readMore"

          />
        </a-spin>
      </a-tab-pane>
      <template #extra>
        <a-button type="text" @click="emptyList">
          {{ $t('messageBox.tab.button') }}
        </a-button>
      </template>
    </a-tabs>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref, reactive, toRefs, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import {
    queryMessageList,
    setMessageStatus,
    MessageRecord,
    MessageListType,
  } from '@/api/message';
  import useLoading from '@/hooks/loading';
  import { useSystemMessageStore } from '@/store/modules/app/systemMessage';
  import {
    readPost,
    readPostBatch,
    SystemMessageResp,
  } from '@/api/system-message';
  import { Message } from '@arco-design/web-vue';
  import router from "@/router";
  import List from './list.vue';

  interface TabItem {
    key: string;
    title: string;
    avatar?: string;
  }
  const messageType = ref('message');
  const { t } = useI18n();
  const messageData = reactive<{
    renderList: MessageRecord[];
    messageList: MessageRecord[];
  }>({
    renderList: [],
    messageList: [],
  });
  toRefs(messageData);

  const systemMessageStore = useSystemMessageStore();

  systemMessageStore.getSystemMessageList();

  const renderList = computed(() => {
    return systemMessageStore.systemMessageList;
  });
  const unreadCount = computed(() => {
    return systemMessageStore.noReadCount.noread;
  });
  const SystemUnreadCount = computed(() => {
    return unreadCount;
  });
  const loading = computed(() => {
    return systemMessageStore.isLoading;
  });

  const handleItemClick = async (items: SystemMessageResp) => {
    if (renderList.value.length && !items.read) {
      // 标记并打开
      await readPost(items.id, 1);
      await systemMessageStore.getSystemMessageList();
    }
  };
  const handleRemove = async (id: string) => {
    if (renderList.value.length) {
      // 标记并打开
      await readPost(id, 2);
      await systemMessageStore.getSystemMessageList();
    }
  };
  const readMore = () => {
    router.push({name:'Chat-Index',query:{
        toSystem:'to'
      }})
  }
  const handleAllRead = async () => {
    const ids = [];
    const temp = systemMessageStore.systemMessageList;
    for (let i = 0; i < temp.length; i += 1) {
      ids.push(temp[i].id);
    }
    const res = await readPostBatch(ids, 2);
    // @ts-ignore
    if (res.code === 1) {
      // @ts-ignore
      Message.success(res.msg);
    }
  };
  const emptyList = async () => {
    const ids = [];
    const temp = systemMessageStore.systemMessageList;
    for (let i = 0; i < temp.length; i += 1) {
      ids.push(temp[i].id);
    }
    const res = await readPostBatch(ids, 2);
    // @ts-ignore
    if (res.code === 1) {
      // @ts-ignore
      Message.success(res.msg);
    }
  };
</script>

<style scoped lang="less">
  :deep(.arco-popover-popup-content) {
    padding: 0;
  }

  :deep(.arco-list-item-meta) {
    align-items: flex-start;
  }
  :deep(.arco-tabs-nav) {
    padding: 14px 0 12px 16px;
    border-bottom: 1px solid var(--color-neutral-3);
  }
  :deep(.arco-tabs-content) {
    padding-top: 0;
    .arco-result-subtitle {
      color: rgb(var(--gray-6));
    }
  }
</style>
