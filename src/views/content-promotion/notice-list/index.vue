<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      :body-style="{ padding: '17px 20px 21px 20px' }"
      :header-style="{ paddingBottom: '0' }"
      class="general-card"
    >
      <template #title>
        {{ $t('workplace.popularContent') }}
      </template>
      <a-space :size="10" direction="vertical" fill>
        <div style="display: flex; flex-wrap: wrap">
          <a-tag>部门【包含子级部门】</a-tag>
          <tag-ellipse
            v-for="(dept, index) in deptData"
            :key="index"
            :is-select="
              seletcDeptData === dept.id ||
              shouldSelectDeptDataList.find((item) => {
                if (String(item.id) === dept.id) {
                  return item;
                }
              })
            "
            :tag="dept.deptName"
            @click="selectDept(dept)"
          >
          </tag-ellipse>
        </div>
        <div style="display: flex">
          <tag-ellipse :is-select="true" tag="全部Tag" />
        </div>
        <a-radio-group
          v-model:model-value="statuEs.type"
          :default-value="0"
          type="button"
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
          :row-class="rowClass"
          @row-click="toNoticeContentView"
        >
          <template #columns>
            <div>
              <a-table-column
                :sortable="{ sortDirections: ['ascend', 'descend'] }"
                data-index="title"
                title="通知标题"
              >
                <template #cell="{ record }">
                  <div style="display: flex; flex-direction: column">
                    <div
                      style="
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        cursor: pointer;
                      "
                    >
                      <div v-if="!record.userRead" class="userweidu"> new</div>
                      <div v-if="record.isAnnex === 1" class="fujiancunzai">
                        <img :src="attachment" />
                      </div>
                      <div style="font-size: 16px; cursor: pointer">
                        {{ record.title }}
                      </div>
                      <div style="display: flex">
                        <TagEllipse
                          v-for="(item, key) in record.tag.split(',')"
                          :key="key"
                          :tag="item"
                        />
                      </div>
                    </div>
                    <div v-if="record.type === 1">
                      {{ record.title }}{{ getIntroContent(record.content) }}
                    </div>
                    <div v-else style="color: #adadad">
                      此通知会跳转第三方url，注意鉴别！
                    </div>
                  </div>
                </template>
              </a-table-column>

              <a-table-column
                :sortable="{ sortDirections: ['ascend', 'descend'] }"
                :width="150"
                data-index="releaseDeptName"
                title="发布部门"
              >
                <template #cell="{ record }">
                  <div class="notice-item">
                    {{ record.releaseDeptName }}
                  </div>
                </template>
              </a-table-column>
              <a-table-column :width="50" title="标签">
                <template #cell="{ record }">
                  <a-tag
                    :color="
                      record.urgency === 2
                        ? 'green'
                        : record.urgency === 3
                        ? 'red'
                        : ''
                    "
                    class="notice-item"
                  >
                    {{
                      record.urgency === 2
                        ? '不急'
                        : record.urgency === 3
                        ? '紧急'
                        : '一般'
                    }}
                  </a-tag>
                </template>
              </a-table-column>

              <a-table-column
                :sortable="{ sortDirections: ['ascend', 'descend'] }"
                :width="185"
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
      <NoticeRead :notice-id="statuEs.noticeReadId" />
    </a-modal>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import {
    addNoticeReadLog,
    getViewNoticeList,
    NoticeUserReadResp,
    NoticeUserResp,
  } from '@/api/notice';
  import attachment from '@/assets/images/attachment.png';
  import { TableData } from '@arco-design/web-vue';
  import TagEllipse from '@/components/tag-ellipse/index.vue';
  import NoticeRead from '@/components/notice-read/index.vue';
  import { deptListTree } from '@/api/dept';
  import _ from 'lodash';

  const statuEs = ref({
    type: 0,
    searchStatus: false,
    name: '',
    noticeRead: false,
    noticeReadId: '',
    noticeReadTitle: '',
  });
  const noticeReadData = ref<NoticeUserReadResp>(null);

  const tableData = ref<NoticeUserResp[]>([]);
  const deptData = ref([]);
  const seletcDeptData = ref('');
  const shouldSelectDeptDataList = ref([]);
  function flattenDepartments(departments) {
    const flatList = [];

    function flatten(dept) {
      flatList.push(dept); // 将当前部门添加到列表
      if (dept.children && dept.children.length > 0) {
        dept.children.forEach(flatten); // 递归处理子部门
      }
    }
    departments.forEach(flatten); // 从顶层部门开始递归
    return flatList;
  }

  const selectDept = (dept,refresh=true) => {
    seletcDeptData.value = dept.id;
    const tempList = [];
    tempList.push(dept);
    const deptDatas = _.cloneDeep(deptData.value);
    while (deptDatas.length) {
      const items = deptDatas.shift();
      if (
        tempList.find((el) => {
          if (el.id === items.parentId) {
            return el;
          }
        })
      ) {
        tempList.push(items);
      }
    }

    shouldSelectDeptDataList.value = tempList;
    if (refresh){
      // 重新请求数据
      getDataB();
    }
  };


  const initDeptData = async () => {
    const { data } = await deptListTree();
    deptData.value = flattenDepartments(data);
    selectDept(deptData.value[0],false)

  };
  initDeptData();
  const getData = async (pagination) => {
    const { data } = await getViewNoticeList(
      statuEs.value.type,
      pagination.value.current,
      pagination.value.pageSize,
      seletcDeptData.value

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
    const { data } = await getViewNoticeList(
      statuEs.value.type,
      pagination.value.current,
      pagination.value.pageSize,
      seletcDeptData.value
    );
    tableData.value = data.records;
    pagination.value.total = data.total;
  };

  const typeChange = (contentType: number) => {
    console.log(contentType);
    pagination.value.current = 1;
    getDataB();
  };

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

  // eslint-disable-next-line consistent-return
  const rowClass = (record: TableData, rowIndex: number) => {
    if (record.userRead) {
      return 'not-read';
    }
    return '';
  };
  // fetchData('text');

  const getIntroContent = (content) => {
    let jieguo = content.replace(/&nbsp;/g, '').replace(/<.*?>/g, '');
    if (jieguo.length > 30) {
      jieguo = jieguo.substring(0, 30);
    }
    return jieguo;
  };
</script>

<style lang="less" scoped>
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

  .notice-item {
    cursor: pointer;
  }

  /deep/ .not-read {
    background-color: #e5e6eb;
  }
</style>

<style lang="css">
  .not-read {
    background-color: #e5e6eb;
  }
</style>
