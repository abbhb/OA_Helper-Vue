<script lang="ts" setup>
import {ref} from 'vue';
import {useI18n} from 'vue-i18n';
import SearchQueryComponent, {SearchQuery} from "@/views/dashboard/keep/components/SearchQueryComponent.vue";

const {t} = useI18n();

const tableData = ref([
  {
    name: '测试数据',
    studentId: '202115040212',
    date: '2021-02-12',
    firstTime: '2021-02-12 20:12:23',
    oldTime: 410.1,
    isStandard: false,
    why: '学习时长不足||签到过晚',
  },
]);
const getDayData = (pagination) => {
  // 获取日数据 pagination.value.current pagination.value.pageSize
  console.log('假装请求了')
  console.log(pagination)
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
    getDayData(pagination);
  },
  onPageSizeChange(pageSize) {
    pagination.value.pageSize = pageSize;
    getDayData(pagination);
  },
  showTotal: () => `共 ${11} 条`,
});
const searchQuery = (searchQuerys:SearchQuery) => {
  console.log(searchQuerys)
}
</script>

<template>
  <a-space direction="vertical">
    <SearchQueryComponent @re-query="searchQuery"/>
    <a-table :data="tableData" :pagination="pagination">
      <template #columns>
        <a-table-column
          :sortable="{ sortDirections: ['ascend', 'descend'] }"
          :title="$t(`keep.admin.viewData.name`)"
          data-index="name"
        ></a-table-column>
        <a-table-column
          :sortable="{ sortDirections: ['ascend', 'descend'] }"
          :title="$t(`keep.admin.viewData.studentId`)"
          data-index="studentId"
        ></a-table-column>
        <a-table-column
          :sortable="{ sortDirections: ['ascend', 'descend'] }"
          :title="$t(`keep.admin.viewData.date`)"
          data-index="date"
        ></a-table-column>
        <a-table-column
          :sortable="{ sortDirections: ['ascend', 'descend'] }"
          :title="$t(`keep.admin.viewData.daySignInTime`)"
          data-index="firstTime"
        ></a-table-column>
        <a-table-column
          :sortable="{ sortDirections: ['ascend', 'descend'] }"
          :title="$t(`keep.admin.viewData.dayStudyTime`)"
          data-index="oldTime"
        >
          <template #cell="{ record }">
            {{ record.oldTime }}分钟
          </template>
        </a-table-column>
        <a-table-column
          :title="$t(`keep.admin.viewData.isStandard`)"
        >
          <template #cell="{ record }">
            <a-tag v-if="record.isStandard" bordered color="green">完成</a-tag>
            <a-tag v-else bordered color="magenta">未完成</a-tag>
          </template>
        </a-table-column>
        <a-table-column
          :sortable="{ sortDirections: ['ascend', 'descend'] }"
          :title="$t(`keep.admin.viewData.why`)"
          data-index="why"
        ></a-table-column>
      </template>
    </a-table>
  </a-space>

</template>

<style lang="less" scoped></style>
