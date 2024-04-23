<script lang="ts" setup>
import {h, reactive, ref} from 'vue';
import {IconSearch} from '@arco-design/web-vue/es/icon';
import {Message} from '@arco-design/web-vue';
import {useAppStore} from '@/store';
import {deleteBcRule, listBcRule, SigninBc} from '@/api/signin';
import AddBC from '@/views/signin/bc/components/addBC.vue';
import EditBC from "@/views/signin/bc/components/editBC.vue";

const appStore = useAppStore();

interface statuEI {
  clickLoading: boolean;
  model?: boolean;
  modelTitle?: string;
  modelType?: string;
  modelContent?: SigninBc;
}

const statuEs = ref<statuEI>({
  clickLoading: false,
  modelContent: null,
  model: false,
  modelTitle: '班次通知',
  modelType: 'add',
});
const tableData = ref<SigninBc[]>([]);

const form = reactive({
  id: '',
  label: '',
  image: '',
  sort: 1,
  extra: '',
});

const initData = async () => {
  statuEs.value.clickLoading = true;
  const {data} = await listBcRule();
  tableData.value = data;
  statuEs.value.clickLoading = false;
};
initData();
const addHandel = (record) => {
  statuEs.value.modelTitle = '添加班次';
  statuEs.value.modelType = 'add';
  statuEs.value.model = true;
};

const editHandel = (record) => {
  statuEs.value.modelTitle = '编辑班次';
  statuEs.value.modelType = 'edit';
  statuEs.value.modelContent = record;
  statuEs.value.model = true;
};

const cleanForm = () => {
  form.id = '';
  form.sort = 1;
  form.label = '';
  form.image = '';
  form.extra = '';
};
const delHandel = async (record) => {
  const {data} = await deleteBcRule(record.id);
  Message.success(data);
  initData();
};


const handleCancel = () => {
  cleanForm();
};

const updateSuccess = () => {
  statuEs.value.model = false;
  initData();
  cleanForm();
}
</script>

<template>
  <a-card>
    <a-space>
      <a-table
        :bordered="false"
        :data="tableData"
        :loading="statuEs.clickLoading"
        :pagination="false"
        :size="'medium'"
        row-key="id"
      >
        <template #columns>
          <a-space direction="vertical">
            <ul>
              <li>暂不支持跨日排班</li>
            </ul>
            <a-space direction="vertical">
              <a-button
                :loading="statuEs.clickLoading"
                type="primary"
                @click="addHandel"
              >
                添加班次
              </a-button>
            </a-space>
            <a-divider class="split-line" style="margin: 3px"/>
          </a-space>

          <a-table-column
            :filterable="{
              filter: (value, record) => record.label.includes(value),
              slotName: 'locale-filter',
              icon: () => h(IconSearch),
            }"
            :width="200"
            title="班次名称"
          >
            <template #cell="{ record }">
              {{ record.name }}
            </template>
          </a-table-column>

          <a-table-column
            :filterable="{
              filter: (value, record) => record.label.includes(value),
              slotName: 'locale-filter',
              icon: () => h(IconSearch),
            }"
            :width="100"
            title="每天几班"
          >
            <template #cell="{ record }">
              {{ record.everyDay }}
            </template>
          </a-table-column>

          <a-table-column
            :filterable="{
              filter: (value, record) => record.label.includes(value),
              slotName: 'locale-filter',
              icon: () => h(IconSearch),
            }"
            :width="700"
            title="规则"
          >
            <template #cell="{ record }">
              <div style="display: flex; flex-direction: column">
                <table>
                  <tr>
                    <td>第几班次</td>
                    <td v-for="rule in record.rules" :key="rule.count">{{
                        rule.count
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td>上班时间</td>
                    <td v-for="rule in record.rules" :key="rule.count">{{
                        rule.sbTime
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td>下班时间</td>
                    <td v-for="rule in record.rules" :key="rule.count">{{
                        rule.xbTime
                      }}
                    </td>
                  </tr>
                </table>
              </div>
            </template>
          </a-table-column>

          <a-table-column title="操作">
            <template #cell="{ record }">
              <a-button @click="editHandel(record)">编辑</a-button>
              <a-popconfirm
                content="危险！将会删除该班次且不可恢复，确认删除?"
                @ok="delHandel(record)"
              >
                <a-button>删除</a-button>
              </a-popconfirm>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-space>
    <a-modal
      v-model:visible="statuEs.model"
      :draggable="false"
      :footer="false"
      :fullscreen="appStore.modelFullscreen"
      :hide-title="false"
      :title="statuEs.modelTitle"
      :title-align="'start'"
      :width="1400"
      unmount-on-close
    >
      <add-b-c v-if="statuEs.modelType === 'add'"/>
      <edit-b-c v-else :signin="statuEs.modelContent" @success="updateSuccess"/>
    </a-modal>
  </a-card>
</template>

<style lang="less" scoped></style>
