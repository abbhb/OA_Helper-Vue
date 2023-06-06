<template>
  <div>
    <a-card :title="$t('printer.one.HistoryRecord.title')" :bordered="false">
      <template #extra>
        <a-link>More</a-link>
      </template>
      <a-space direction="vertical" :size="10" fill>
        <a-radio-group v-model="type" type="button" @change="typeChange as any">
          <a-radio v-for="label in labelList" :key="label" :value="label">
            {{ label }}
          </a-radio>
        </a-radio-group>
        <a-table :columns="columns" :data="data"> </a-table>
      </a-space>
    </a-card>
  </div>
</template>

<script lang="ts">
  import { reactive, ref } from 'vue';
  import {useI18n} from "vue-i18n";

  export default {
    name: 'HistoryRecord',
    setup() {
        const { t } = useI18n();
      const type = ref(1);
      const labelList = ref<string[]>();
      labelList.value = ['个人', '全部'];
      const typeChange = (contentType: string) => {
        // fetchDate1(contentType);
        console.log(contentType);
      };
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
          dataIndex: 'user',
        }, {
              title: t(`printer.one.HistoryRecord.download`),
              dataIndex: 'user',
          },
      ];
      const data = reactive([
        {
          key: '1',
          name: 'Jane Doe',
          salary: 23000,
          address: '32 Park Road, London',
        },
        {
          key: '2',
          name: 'Alisa Ross',
          salary: 25000,
          address: '35 Park Road, London',
        },
        {
          key: '3',
          name: 'Kevin Sandra',
          salary: 22000,
          address: '31 Park Road, London',
        },
        {
          key: '4',
          name: 'Ed Hellen',
          salary: 17000,
          address: '42 Park Road, London',
        },
        {
          key: '5',
          name: 'William Smith',
          salary: 27000,
          address: '62 Park Road, London',
        },
      ]);

      return {
        type,
        labelList,
        columns,
        data,
        typeChange,
      };
    },
  };
</script>

<style scoped></style>
