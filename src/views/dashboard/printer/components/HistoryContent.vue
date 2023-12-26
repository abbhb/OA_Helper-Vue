<template>
  <a-space direction="vertical" :size="10" fill>
    <div style="display: flex; align-items: center">
      <a-radio-group
        v-model="config.type"
        v-permission="'sys:print:alldata'"
        type="button"
        @change="typeChange as any"
      >
        <a-radio value="个人"> 个人 </a-radio>
        <a-radio value="全部"> 全部 </a-radio>
      </a-radio-group>

      <div class="item-b left-margin">
        只显示已打印<a-switch
          v-model="config.onlyPrinted"
          :checked-value="1"
          :unchecked-value="0"
          @change="typeChange as any"
        />
      </div>
      <div v-if="config.type === '全部'" class="left-margin">
        <label>筛选用户</label>
        <a-select
          v-model:model-value="config.onlyReadUserList"
          :allow-clear="true"
          :filter-option="false"
          :loading="config.onlyUserListLoading"
          :style="{ width: '220px' }"
          multiple
          placeholder="请选择用户"
          value-key="id"
          @clear="typeChange as any"
          @search="onlyUserReadHandleSearch"
          @press-enter="typeChange as any"
        >
          <template #empty>
            请输入用户的昵称进行搜索！默认不展示用户列表
          </template>
          <a-option
            v-for="(item, key) in onlyUserReadOptions"
            :key="key"
            :value="item"
          >{{ item.name }}
          </a-option
          >
        </a-select>
      </div>

      <div class="left-margin">
        <label>文件名</label>
        <a-input-search
          v-model:model-value="config.name"
          :allow-clear="true"
          :style="{ width: '220px' }"
          placeholder="文件名查找"
          @search="typeChange as any"
          @press-enter="typeChange as any"
          @clear="typeChange as any"
        />
      </div>
      <div class="left-margin">
        日期筛选
        <a-range-picker
          style="width: 320px"
          show-time
          :time-picker-props="{ defaultValue: ['00:00:00', '09:09:06'] }"
          format="YYYY-MM-DD HH:mm"
          @clear="cleanTime"
          @ok="onOk"
        />
      </div>
      <a-button :type="'primary'" @click="clearTiaoJian">重置</a-button>
    </div>

    <a-table :columns="columns" :data="tableData" :pagination="pagination">
      <template #columns>
        <a-table-column
          :title="$t(`printer.one.HistoryRecord.name`)"
          data-index="name"
          :sortable="{ sortDirections: ['ascend', 'descend'] }"
        ></a-table-column>
        <a-table-column
          :title="$t(`printer.one.HistoryRecord.createTime`)"
          data-index="createTime"
          :sortable="{ sortDirections: ['ascend', 'descend'] }"
        ></a-table-column>
        <a-table-column
          :title="$t(`printer.one.HistoryRecord.createUser`)"
          data-index="createUser"
          :sortable="{ sortDirections: ['ascend', 'descend'] }"
        ></a-table-column>
        <a-table-column :title="$t('printer.one.HistoryRecord.operate')">
          <template #cell="{ record }">
            <a-button class="button_item" @click="button(record.url)">{{
              $t('printer.one.HistoryRecord.download')
            }}</a-button>
            <a-button
              class="button_item"
              @click="onePrint(record.url, record.name)"
              >一键打印</a-button
            >
            <a-button class="button_item" @click="buttonDelete(record.url)">{{
              $t('printer.one.HistoryRecord.delete')
            }}</a-button>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </a-space>
</template>

<script lang="ts" setup>
import {h, reactive, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {queryAllPrinterList, querySelfPrinterList} from '@/api/printer';
import {IconFaceSmileFill} from '@arco-design/web-vue/es/icon';
import {Message} from '@arco-design/web-vue';
import printEventHub from '@/utils/print/printEventBus';
import {userSelectList} from '@/api/user';

const { t } = useI18n();
  const config = ref({
    type: '个人',
    onlyPrinted: 1,
    name: '',
    startTime: '',
    endTime: '',
    onlyReadUserList: [], // 不为空时就只筛选这些用户
    onlyUserListLoading: false,
  });
  const onlyUserReadOptions = ref([]);

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
  const tabelRDataTotal = ref<string>('0');
  const fetchSelfData = async (current, pageSize) => {
    try {
      if (config.value.type === '个人') {
        const { data } = await querySelfPrinterList({
          page_num: current,
          page_size: pageSize,
          onlyPrinted: config.value.onlyPrinted,
          name: config.value.name,
          startDate: config.value.startTime,
          endDate: config.value.endTime,
        });
        tableData.value = data.records;
        tabelRDataTotal.value = data.total;
      } else {
        const onlyUserTempList: string[] = [];
        for (let i = 0; i < config.value.onlyReadUserList.length; i += 1) {
          onlyUserTempList.push(config.value.onlyReadUserList[i].id);
        }
        const { data } = await queryAllPrinterList({
          page_num: current,
          page_size: pageSize,
          onlyPrinted: config.value.onlyPrinted,
          name: config.value.name,
          startDate: config.value.startTime,
          endDate: config.value.endTime,
          onlyUser: onlyUserTempList,
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

  const typeChange = (contentType?: string) => {
    fetchSelfData(pagination.value.current, pagination.value.pageSize);
  };
  const button = (url: string) => {
    // fetchDate1(contentType);
    window.open(url);
  };
  const onePrint = (url: string, name?: string) => {
    printEventHub.emit('onOneClickPrinting', {fileUrl: url, fileName: name});
  };
  const buttonDelete = (url: string) => {
    Message.info({
      content: () => t('printer.one.HistoryRecord.noDelete'),
      icon: () => h(IconFaceSmileFill),
    });
  };
  fetchSelfData(1, 5);

  const onOk = (dateString) => {
    // eslint-disable-next-line prefer-destructuring
    config.value.startTime = dateString[0];

    // eslint-disable-next-line prefer-destructuring
    config.value.endTime = dateString[1];
    typeChange();
  };
  const cleanTime = () => {
    // eslint-disable-next-line prefer-destructuring
    config.value.startTime = '';

    // eslint-disable-next-line prefer-destructuring
    config.value.endTime = '';
    typeChange();
  };

  const onlyUserReadHandleSearch = async (value) => {
    if (value) {
      config.value.onlyUserListLoading = true;
      // 服务器端搜索
      try {
        const {data} = await userSelectList(value);
        onlyUserReadOptions.value = data.options;
      } catch (e) {
        console.log(e);
        onlyUserReadOptions.value = [];
      }
    } else {
      onlyUserReadOptions.value = [];
    }
    config.value.onlyUserListLoading = false;
  };
  const clearTiaoJian = () => {
    config.value.onlyReadUserList = [];
    config.value.onlyUserListLoading = false;
    config.value.name = '';
    config.value.startTime = '';
    config.value.endTime = '';
    config.value.onlyPrinted = 1;
    typeChange();
  }
</script>

<style scoped>
  .button_item {
    margin-left: 3px;
  }
  .demo-basic {
    padding: 10px;
    width: 200px;
    background-color: var(--color-bg-popup);
    border-radius: 4px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  }
  .item-b {
    border: var(--color-border) dashed 1px;
    padding: 3px 3px 3px 3px;
  }
  .left-margin {
    margin-left: 10px;
  }
</style>
