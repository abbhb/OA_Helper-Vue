<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import {
    NoticeAddReq,
    NoticeMangerListResp,
    publishNoticeList,
  } from '@/api/notice';
  import { getColor } from '@/utils/color-index';
  import { useAppStore } from '@/store';
  import { deptListTree } from '@/api/dept';

  const appStore = useAppStore();
  const deptTreeData = ref([]);
  const deptAllCheckedKeys = ref([]);
  const deptAllExpandedKeys = ref([]);

  const deptSelectedKeys = ref([]);
  const deptExpandedKeys = ref([]);
  interface statuEI {
    type: number;
    search?: string;
    searchType?: number;
    status?: number;
    searchStatus: boolean;
    addLoading: boolean;
    addModelStatus: boolean;
    deptFuziliandong: boolean;
  }

  const statuEs = ref<statuEI>({
    type: 1,
    search: '',
    searchType: 1,
    status: null,
    searchStatus: false,
    addLoading: false,
    addModelStatus: false,
    deptFuziliandong: false,
  });
  const tableData = ref<NoticeMangerListResp[]>([]);

  // 创建D 必要信息就这些
  const form = reactive<NoticeAddReq>({
    notice: {
      id: '',
      title: '',
      tag: '',
      urgency: 1,
      visibility: 1,
    },
    deptIds: [],
  });

  const getData = async (pagination) => {
    const { data } = await publishNoticeList(
      statuEs.value.type,
      pagination.value.current,
      pagination.value.pageSize,
      statuEs.value.status != null ? statuEs.value.status : undefined,
      statuEs.value.search,
      statuEs.value.searchType
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
    showTotal: () => `共 ${11} 条`,
  });

  const getDataB = async () => {
    pagination.value.current = 1;
    statuEs.value.searchStatus = true;
    const { data } = await publishNoticeList(
      statuEs.value.type,
      pagination.value.current,
      pagination.value.pageSize,
      statuEs.value.status != null ? statuEs.value.status : undefined,
      statuEs.value.search,
      statuEs.value.searchType
    );
    statuEs.value.searchStatus = false;
    tableData.value = data.records;
    pagination.value.total = Number(data.total);
  };

  // 单元格合并
  // eslint-disable-next-line consistent-return
  const dataSpanMethod = ({ record, column }) => {
    if (record.status !== 2 && column.dataIndex === 'releasUserName') {
      return {
        colspan: 3,
      };
    }
  };

  const clearNoticeAddForm = () => {
    form.notice.id = '';
    form.notice.title = '';
    form.notice.visibility = 1;
    form.notice.urgency = 1;
    form.deptIds = [];
  }
  const addNoticeButtonHandel = () => {
    // 点击了添加通知
    // 先清除残余信息
    clearNoticeAddForm();
    statuEs.value.addModelStatus = true;
  };
  const getAllId = (yuan) => {
    if (yuan) {
      for (let i = 0; i < yuan.length; i += 1) {
        deptAllExpandedKeys.value.push(yuan[i].id);
        if (yuan[i].children) {
          if (yuan[i].children.length > 0) {
            getAllId(yuan[i].children);
          }
        }
      }
    }
  };
  const toggleChecked = () => {
    form.deptIds = form.deptIds?.length
      ? []
      : deptAllCheckedKeys.value;
  };
  const toggleExpanded = () => {
    deptExpandedKeys.value = deptExpandedKeys?.value.length
      ? []
      : deptAllExpandedKeys.value;
  };
  const initData = async () => {
    await getDataB();
    const { data } = await deptListTree();
    deptTreeData.value = data;
    getAllId(data);
    deptAllCheckedKeys.value = deptAllExpandedKeys.value;
    if (deptExpandedKeys.value?.length === 0) {
      toggleExpanded();
    }
  };

  initData();

  // 添加通知确认
  const addHandleBeforeOk = (done) => {
    console.log(form)
    done(true);
  }
</script>

<template>
  <div class="right-side">
    <a-card direction="vertical">
      <a-table
        :data="tableData"
        :pagination="pagination"
        :span-method="dataSpanMethod"
      >
        <template #columns>
          <a-space direction="vertical">
            <a-input-search
              v-model:model-value="statuEs.search"
              :allow-clear="true"
              :loading="statuEs.searchStatus"
              :placeholder="$t('syscenter.user.manger.search.tip')"
              :style="{ width: '320px' }"
              search-button
              style="margin-bottom: 1rem"
              @clear="getDataB()"
              @search="getDataB()"
              @press-enter="getDataB()"
            >
              <template #button-icon>
                <icon-search />
              </template>
              <template #button-default> 搜索 </template>
            </a-input-search>
            <a-space direction="vertical">
              <a-button
                :loading="statuEs.addLoading"
                type="primary"
                @click="addNoticeButtonHandel"
              >
                创建通知
              </a-button>
            </a-space>
            <a-divider class="split-line" style="margin: 3px" />
          </a-space>

          <a-table-column
            title="通知标题"
            :width="120"
            data-index="title"
          ></a-table-column>
          <a-table-column
            :sortable="{ sortDirections: ['ascend', 'descend'] }"
            title="通知状态"
            data-index="status"
            :width="120"
          ></a-table-column>
          <a-table-column
            :sortable="{ sortDirections: ['ascend', 'descend'] }"
            title="阅读量"
            data-index="amount"
            :width="100"
          ></a-table-column>

          <a-table-column
            :sortable="{ sortDirections: ['ascend', 'descend'] }"
            title="是否包含附件"
            :width="100"
          >
            <template #cell="{ record }">
              <a-tag>{{ record.isAnnex ? '存在附件' : '无' }}</a-tag>
            </template>
          </a-table-column>
          <a-table-column
            :sortable="{ sortDirections: ['ascend', 'descend'] }"
            title="创建时间"
            :width="120"
            data-index="createTime"
          ></a-table-column>
          <a-table-column
            :sortable="{ sortDirections: ['ascend', 'descend'] }"
            title="最后更新时间"
            :width="120"
            data-index="updateTime"
          ></a-table-column>
          <a-table-column
            title="创建人"
            :width="120"
            data-index="createUserName"
          ></a-table-column>
          <a-table-column
            title="更新人"
            :width="120"
            data-index="updateUserName"
          ></a-table-column>
          <a-table-column title="标签" :width="90">
            <template #cell="{ record }">
              <a-tag
                v-for="(item, key) in record.tag.split(',')"
                :key="key"
                :color="getColor(key)"
                bordered
                >{{ item }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="发布信息[若发布]">
            <a-table-column
              title="发布用户"
              :width="120"
              data-index="releasUserName"
            >
              <template #cell="{ record }">
                <div style="display: flex; justify-content: center">
                  <a-tag v-if="record.status !== 2">暂未发布</a-tag>
                  {{ record.releasUserName }}
                </div>
              </template>
            </a-table-column>
            <a-table-column title="发布时间" :width="120">
              <template #cell="{ record }">
                {{ record.releaseTime }}
              </template>
            </a-table-column>
            <a-table-column title="发布部门" :width="120">
              <template #cell="{ record }">
                {{ record.releaseDeptName }}
              </template>
            </a-table-column>
          </a-table-column>
          <a-table-column title="操作" :width="260">
            <template #cell="{ record }">
              <a-button
                :status="'success'"
                class="item"
                @click="editAGroup(record)"
              >
                <span>快速编辑</span>
              </a-button>
              <a-button class="item" @click="IBan(record)">
                <span>编辑</span>
              </a-button>
              <a-button class="item" :status="'danger'" @click="IBan(record)">
                <span>删除</span>
              </a-button>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
    <!--    addModel-->
    <a-modal
      v-model:visible="statuEs.addModelStatus"
      :draggable="false"
      :fullscreen="appStore.modelFullscreen"
      title="添加通知"
      :width="720"
      unmount-on-close
      @before-ok="addHandleBeforeOk"
    >
      <a-form :model="form">
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item
              label="通知标题"
              tooltip="通知的标题，和正文内容无关，显示在通知列表"
              field="title"
              label-col-flex="80px"
            >
              <a-input
                v-model="form.notice.title"
                placeholder="请输入通知的标题"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="通知Tag" field="tag" label-col-flex="80px">
          <a-input
            v-model="form.notice.tag"
            placeholder="请输入通知的tag（回车创建tag）"
          ></a-input>
        </a-form-item>
        <div style="display: flex; flex-direction: row-reverse">
          <a-form-item
            label="可见性"
            tooltip="通知谁可见"
            field="visibility"
            label-col-flex="80px"
          >
            <a-select
              v-model:model-value="form.notice.visibility"
              :scrollbar="true"
              :style="{ width: '140px' }"
              placeholder="请选择可见模式"
            >
              <a-option :value="1"> 全体成员 </a-option>
              <a-option :value="2"> 指定部门可见 </a-option>
            </a-select>
          </a-form-item>
          <a-form-item label="紧要程度" field="urgency" label-col-flex="80px">
            <a-select
              v-model:model-value="form.notice.urgency"
              :style="{ width: '140px' }"
              placeholder="请选紧要程度"
            >
              <template #label="{ data }">
                <a-tag
                  :color="
                    data.value === 2 ? 'green' : data.value === 3 ? 'red' : ''
                  "
                >
                  {{ data.label }}
                </a-tag>
              </template>
              <a-option :value="1">
                <a-tag>一般</a-tag>
              </a-option>
              <a-option :value="2">
                <a-tag color="green">不急</a-tag>
              </a-option>
              <a-option :value="3"><a-tag color="red">紧急</a-tag></a-option>
            </a-select>
          </a-form-item>
        </div>
        <div v-if="form.notice.visibility === 2">
          <a-button-group style="margin-bottom: 20px">
            <a-button type="primary" @click="toggleChecked">
              {{ form.deptIds?.length ? '反全选' : '全选' }}
            </a-button>
            <a-button type="primary" @click="toggleExpanded">
              {{ deptExpandedKeys?.length ? '折叠' : '展开全部' }}
            </a-button>
          </a-button-group>
          <a-tree
            v-model:checked-keys="form.deptIds"
            v-model:expanded-keys="deptExpandedKeys"
            v-model:selected-keys="deptSelectedKeys"
            style="overflow-y: scroll; height: 20rem"
            :check-strictly="!statuEs.deptFuziliandong"
            :checkable="true"
            :data="deptTreeData"
            :field-names="{
              key: 'id',
              title: 'deptName',
              children: 'children',
            }"
          >
          </a-tree>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
  .item {
    margin-right: 5px;
  }
</style>
