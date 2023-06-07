<template>
  <a-space direction="vertical" :size="10" fill>
    <a-radio-group v-model="type" type="button" @change="typeChange as any">
      <a-radio v-for="label in labelList" :key="label" :value="label">
        {{ label }}
      </a-radio>
    </a-radio-group>
    <a-table :columns="columns" :data="tableData" :pagination="pagination">
      <template #columns>
        <a-table-column
          :title="$t(`printer.one.HistoryRecord.name`)"
          data-index="name"
        ></a-table-column>
        <a-table-column
          :title="$t(`printer.one.HistoryRecord.createTime`)"
          data-index="createTime"
        ></a-table-column>
        <a-table-column
          :title="$t(`printer.one.HistoryRecord.createUser`)"
          data-index="createUser"
        ></a-table-column>
        <a-table-column :title="$t('printer.one.HistoryRecord.operate')">
          <template #cell="{ record }">
            <a-button @click="button(record.url)">{{
              $t('printer.one.HistoryRecord.download')
            }}</a-button>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </a-space>
</template>

<script lang="ts">
  import { reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { queryAllPrinterList, querySelfPrinterList } from '@/api/printer';
  import { useUserStore } from '@/store';

  export default {
    name: 'HistoryContent',
    setup() {
      const { t } = useI18n();
      const type = ref('个人');
      const labelList = ref<string[]>();
      const columns = [
        {
          title: t(`printer.one.HistoryRecord.name`),
          dataIndex: 'name',
          sortable: {
            sortDirections: ['ascend'],
          },
        },
        {
          title: t(`printer.one.HistoryRecord.createTime`),
          dataIndex: 'createTime',
          sortable: {
            sortDirections: ['ascend'],
          },
        },
        {
          title: t(`printer.one.HistoryRecord.createUser`),
          dataIndex: 'createUser',
        },
        {
          title: t(`printer.one.HistoryRecord.download`),
          dataIndex: 'url',
          slotName: 'download',
        },
      ];
      const tableData = ref([
        {
          id: '1',
          name: 'Jane Doe',
          createTime: '2003',
          createUser: 'Admin',
          url: 'jane.doe@example.com',
        },
      ]);
      // 分页返回参数区
      const tabelRDataTotal = ref(0);
      const fetchSelfData = async (current, pageSize) => {
        try {
          if (type.value === '个人') {
            const { data } = await querySelfPrinterList({
              page_num: current,
              page_size: pageSize,
            });
            tableData.value = data.records;
            tabelRDataTotal.value = data.total;
          } else {
            const { data } = await queryAllPrinterList({
              page_num: current,
              page_size: pageSize,
            });
            tableData.value = data.records;
            tabelRDataTotal.value = data.total;
          }
        } catch (err) {
          // you can report use errorHandler or other
        }
      };
      const pagination = ref({
        current: 1,
        defaultPageSize: 10,
        total: reactive(tabelRDataTotal),
        pageSize: 5,
        pageSizeOptions: [5, 10, 20, 50],
        showPageSize: true,
        showJumper: true,
        onChange(page) {
          pagination.value.current = page;
          fetchSelfData(pagination.value.current, pagination.value.pageSize);
        },
        onPageSizeChange(pageSize) {
          pagination.value.pageSize = pageSize;
          fetchSelfData(pagination.value.current, pagination.value.pageSize);
        },
        showTotal: () => `共 ${11} 条`,
      });
      const userStore = useUserStore();
      if (
        userStore.userInfo.permission === 1 ||
        userStore.userInfo.permission === 10
      ) {
        labelList.value = ['个人', '全部'];
      } else {
        labelList.value = ['个人'];
      }

      const typeChange = (contentType: string) => {
        fetchSelfData(pagination.value.current, pagination.value.pageSize);
      };
      const button = (url: string) => {
        // fetchDate1(contentType);
        window.open(url);
      };
      fetchSelfData(1, 5);

      return {
        type,
        labelList,
        columns,
        pagination,
        tableData,
        typeChange,
        button,
      };
    },
  };
</script>

<style scoped></style>
