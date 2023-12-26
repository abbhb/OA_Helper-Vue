<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{ padding: '17px 20px 21px 20px' }"
    >
      <template #title>
        {{ $t('workplace.popularContent') }}
      </template>
      <template #extra>
        <a-link v-if="!props.noMore" @click="emit('alertSome')"
        >{{ $t('workplace.viewMore') }}
        </a-link>
      </template>
      <a-space direction="vertical" :size="10" fill>
        <a-radio-group
          v-model:model-value="statuEs.type"
          type="button"
          :default-value="0"
          @change="typeChange as any"
        >
          <a-radio :value="0"> 全部</a-radio>
          <a-radio :value="3">
            {{ $t('workplace.popularContent.important') }}
          </a-radio>
          <a-radio :value="1">
            {{ $t('workplace.popularContent.generally') }}
          </a-radio>
          <a-radio :value="2">
            {{ $t('workplace.popularContent.notUrgent') }}
          </a-radio>
        </a-radio-group>
        <a-table
          :data="tableData"
          :pagination="pagination"
          :show-header="false"
          @row-click="toNoticeContentView"
        >
          <template #columns>
            <div>
              <a-table-column
                :sortable="{ sortDirections: ['ascend', 'descend'] }"
                :width="430"
                data-index="title"
                title="通知标题"
              >
                <template #cell="{ record }">
                  <div
                    style="
                      display: flex;
                      flex-direction: row;
                      align-items: center;
                      cursor: pointer;
                    "
                  >
                    <div style="font-size: 16px; cursor: pointer">
                      {{ record.title }}
                    </div>
                    <div class="notice-tag">
                      <a-tag
                        :color="
                          record.urgency === 2
                            ? 'green'
                            : record.urgency === 3
                            ? 'red'
                            : ''
                        "
                      >
                        {{
                          record.urgency === 2
                            ? '不急'
                            : record.urgency === 3
                              ? '紧急'
                              : '一般'
                        }}
                      </a-tag>
                    </div>
                    <div v-if="record.isAnnex === 1" class="fujiancunzai">
                      <img :src="attachment"/>
                    </div>
                    <div v-if="!record.userRead" class="userweidu">
                      new
                    </div
                    >
                  </div>
                </template>
              </a-table-column>

              <a-table-column
                :sortable="{ sortDirections: ['ascend', 'descend'] }"
                data-index="releaseTime"
                title="发布时间"
              ></a-table-column>
            </div>
          </template>
        </a-table>
      </a-space>
    </a-card>
    <a-modal
      v-model:visible="statuEs.noticeRead"
      :draggable="true"
      :footer="false"
      :fullscreen="false"
      :title="statuEs.noticeReadTitle"
      :unmount-on-close="true"
      :width="1600"
    >
      <NoticeRead :notice-id="statuEs.noticeReadId"/>
    </a-modal>
  </a-spin>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import useLoading from '@/hooks/loading';
import {defineEmits} from 'vue/dist/vue';
import {addNoticeReadLog, getViewNoticeList, NoticeUserResp,} from '@/api/notice';
import attachment from '@/assets/images/attachment.png';
import NoticeRead from '@/components/notice-read/index.vue';

const props = defineProps({
    noMore: {
      type: Boolean,
      default: false,
    },
  });
  const emit = defineEmits(['alertSome']);
const statuEs = ref({
  type: 0,
  searchStatus: false,
  name: '',
  noticeRead: false,
  noticeReadId: '',
  noticeReadTitle: '',
});

const tableData = ref<NoticeUserResp[]>([]);

const getData = async (pagination) => {
  const {data} = await getViewNoticeList(
    statuEs.value.type,
    pagination.value.current,
    pagination.value.pageSize
  );
  tableData.value = data.records;
  pagination.value.total = data.total;
};
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
    getData(pagination);
  },
  onPageSizeChange(pageSize) {
    pagination.value.pageSize = pageSize;
    getData(pagination);
  },
  showTotal: () => `共 ${0} 条`,
});

getData(pagination);

  const { loading, setLoading } = useLoading();

const getDataB = async () => {
  const {data} = await getViewNoticeList(
    statuEs.value.type,
    pagination.value.current,
    pagination.value.pageSize
  );
  tableData.value = data.records;
  pagination.value.total = data.total;
};

const typeChange = (contentType: number) => {
    console.log(contentType);
  pagination.value.current = 1;
  getDataB();
  };

// 前往通知查看页
const toNoticeContentView = async (record) => {
  if (record.type === 2) {
    try {
      await addNoticeReadLog(record.id);
      // 外链
      window.open(record.content);
    } catch (e) {
      console.log(e);
    }
    return;
  }
  // 前往通知查看页
  statuEs.value.noticeReadId = record.id;
  statuEs.value.noticeReadTitle = record.title;
  // 开始加载
  statuEs.value.noticeRead = true;
};

  // fetchData('text');
</script>

<style scoped lang="less">
  .general-card {
    min-height: 395px;
  }
  :deep(.arco-table-tr) {
    height: 44px;
    .arco-typography {
      margin-bottom: 0;
    }
  }
  .increases-cell {
    display: flex;
    align-items: center;
    span {
      margin-right: 4px;
    }
  }

  .notice-tag {
    padding: 0 4px 2px;
    display: inline-block;
    border-radius: 2px;
    color: #fff;
    min-width: 20px;
    line-height: 1;
    margin: 0 0 10px 2px;
  }

  .fujiancunzai {
    padding: 0 4px 2px;
    display: inline-block;
    border-radius: 2px;
    color: #fff;
    min-width: 20px;
    line-height: 1;
    margin: 0 0 10px 2px;
  }

  .notice-item {
    cursor: pointer;
  }

  .userweidu {
    padding: 0 4px 2px;
    display: inline-block;
    border-radius: 2px;
    color: #fff;
    min-width: 20px;
    line-height: 1;
    background-color: #93d36e;
    margin: 0 2px 10px 0;
  }
</style>
