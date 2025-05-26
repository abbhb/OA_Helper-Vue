<template>
  <a-spin style="display: block" >
    <a-tabs v-model:activeKey="messageType" type="line" destroy-on-hide>
      <a-tab-pane key="message">
        <template #title>
          <span>
            系统通知{{
              SystemUnreadCount > 0 ? '(未读:' + SystemUnreadCount + ')' : ''
            }}
          </span>
        </template>
        <a-result v-if="!renderList.length" status="404">
          <template #subtitle> {{ $t('messageBox.noContent') }} </template>
        </a-result>
        <a-spin :loading="loading">
          <!--          <List-->
          <!--            :render-list="renderList"-->
          <!--            :unread-count="unreadCount"-->
          <!--            @item-click="handleItemClick"-->
          <!--            @remove="handleRemove"-->
          <!--            @all-read="handleAllRead"-->
          <!--            @read-more="readMore"-->

          <!--          />-->
          <a-table
            v-if="renderList.length > 0"
            :data="renderList"
            :span-method="spanMethod"
            :scroll="{
              y: 500,
            }"
          >
            <template #columns>
              <a-table-column title="通知人" data-index="username" :width="80">
                <template #cell="{ record }">
                  <AvatarImage
                    :class="record?.read?'warning-row':''"
                    :key="record.avatar + 'reas1' + record.username"
                    :avatar="record.avatar"
                    :name="record.username"
                  />
                </template>
              </a-table-column>
              <a-table-column :width="120">
                <template #cell="{ record }">
                  <div :class="record?.read?'warning-row':''"
                  >
                    {{ record.username }}
                  </div>

                </template>
              </a-table-column>
              <a-table-column
                title="通知时间"
                :width="150"
              >
                <template #cell="{ record }">
                  <div :class="record?.read?'warning-row':''"
                  >
                    {{ record.createTime }}
                  </div>

                </template>
              </a-table-column>
              <a-table-column title="内容" data-index="message" :width="500">
                <template #cell="{ record }">
                  <RenderMessage
                    :class="record?.read?'warning-row':''"
                    :message="record.message"
                    :ext-type="''"
                  />
                </template>
              </a-table-column>
              <a-table-column title="操作" data-index="createTime" :width="160">
                <template #cell="{ record }">
                  <a-button
                    v-if="!record.read"
                    :disabled="record.read"
                    :type="'text'"
                    @click="handleItemClick(record)"
                  >
                    已读
                  </a-button>
                  <a-button
                    :type="'text'"
                    :status="'danger'"
                    @click="handleRemove(record)"
                  >
                    删除
                  </a-button>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </a-spin>
      </a-tab-pane>
      <a-tab-pane key="version">
        <template #title>
          <span> 版本发布 </span>
        </template>

        <a-spin :loading="loading">
          <!--          <List-->
          <!--            :render-list="renderList"-->
          <!--            :unread-count="unreadCount"-->
          <!--            @item-click="handleItemClick"-->
          <!--            @remove="handleRemove"-->
          <!--            @all-read="handleAllRead"-->
          <!--            @read-more="readMore"-->

          <!--          />-->
          <a-table
            :data="versionData"
            :scroll="{
              y: 500,
            }"
            row-key="version"
            :expandable="versionExpandable"
          >
            <template #columns>
              <a-table-column title="版本图标" data-index="icon" :width="350">
                <template #cell="{ record }">
                  <img
                    width="40"
                    :style="{ marginRight: '16px', marginBottom: '12px' }"
                    :src="record.icon"
                  />
                </template>
              </a-table-column>
              <a-table-column title="版本号" data-index="version" :width="380">
                <template #cell="{ record }">
                  {{ record.version }}
                </template>
              </a-table-column>
              <a-table-column title="发布时间" data-index="time" :width="380">
                <template #cell="{ record }">
                  {{ record.time }}
                </template>
              </a-table-column>
            </template>
          </a-table>
        </a-spin>
      </a-tab-pane>
      <template #extra>
        <a-button type="text" @click="handleAllRead">
          一键已读
        </a-button> <a-button :status="'danger'" type="text" @click="emptyList">
          {{ $t('messageBox.tab.button') }}
        </a-button>
      </template>
    </a-tabs>
  </a-spin>
</template>

<script lang="ts" setup>
  import {
    ref,
    reactive,
    toRefs,
    computed,
    VNodeChild,
    createVNode,
  } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { MessageRecord } from '@/api/message';
  import { useSystemMessageStore } from '@/store/modules/app/systemMessage';
  import {
    readPost,
    readPostBatch,
    SystemMessageResp,
  } from '@/api/system-message';
  import { Message } from '@arco-design/web-vue';
  import router from '@/router';
  import AvatarImage from '@/components/image/AvatarImage.vue';
  import RenderMessage from '@/views/chat/chat-index/components/RenderMessage/index.vue';
  import version from '@/config/version.json';

  interface TabItem {
    key: string;
    title: string;
    avatar?: string;
  }
  const pagination = ref({
    current: 1,
    defaultPageSize: 10,
    total: 0,
    pageSize: 5,
    pageSizeOptions: [5, 10, 20, 50],
    showPageSize: true,
    showJumper: true,
    onChange(page) {
      pagination.value.current = page;
      // getData(pagination);
    },
    onPageSizeChange(pageSize) {
      pagination.value.pageSize = pageSize;
      // getData(pagination);
    },
    showTotal: () => `共 ${11} 条`,
  });
  const spanMethod = ({ rowIndex, columnIndex }) => {
    if (rowIndex === 0 && columnIndex === 1) {
      return {
        rowspan: 1,
        colspan: 1,
      };
    }
  };
  const parseItems = (
    items: Array<{ title: string; content: string }>
  ): VNodeChild[] => {
    return items
      .map((item, index) => {
        return [
          createVNode('div', null, `【${item.title}】`),
          createVNode('div', null, item.content),
        ];
      })
      .flat(); // 使用 flat 将二维数组转换为一维数组
  };
  const versionData = version;
  const versionExpandable = reactive({
    title: '',
    width: 0,
    defaultExpandAllRows: true,
    expandedRowRender: (record) => {
      // 改成data渲染
      if (record?.info?.length > 0) {
        return parseItems(record.info);
      }
    },
  });

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

  const renderClass = (row, rowIndex) => {
    console.log(row);
    if (row.read) {
      console.log(rowIndex);
      return 'warning-row';
    }
    return '';
  };
  const handleItemClick = async (item: SystemMessageResp) => {
    if (renderList.value.length && !item.read) {
      // 标记并打开
      await readPost(item.id, 1);
      await systemMessageStore.getSystemMessageList();
    }
  };
  const handleRemove = async (item: SystemMessageResp) => {
    if (renderList.value.length) {
      // 标记并打开
      await readPost(item.id, 2);
      await systemMessageStore.getSystemMessageList();
    }
  };
  const readMore = () => {
    router.push({
      name: 'Chat-Index',
      query: {
        toSystem: 'to',
      },
    });
  };
  const handleAllRead = async () => {
    const ids = [];
    const temp = systemMessageStore.systemMessageList;
    for (let i = 0; i < temp.length; i += 1) {
      ids.push(temp[i].id);
    }
    const res = await readPostBatch(ids, 1);
    // @ts-ignore
    if (res.code === 1) {
      // @ts-ignore
      Message.success(res.msg);
      await systemMessageStore.getSystemMessageList();
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
      await systemMessageStore.getSystemMessageList();
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
  ::v-deep .warning-row {
    opacity: 0.5 !important;
  }
</style>
