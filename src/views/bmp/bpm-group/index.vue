<script lang="ts" setup>
import {reactive, ref} from 'vue';
import {Message} from '@arco-design/web-vue';
import {useAppStore} from '@/store';

import {setChildrenUndefined} from '@/utils/utils';
import {addDeployGroup, deleteDeployGroup, listDeployGroup, updateDeployGroup} from "@/api/bpmn";


const appStore = useAppStore();

interface statuEI {
  clickLoading: boolean;
  model?: boolean;
  modelTitle?: string;
  modelType?: string;
}

const statuEs = ref<statuEI>({
  clickLoading: false,
  model: false,
  modelTitle: '流程组通知',
  modelType: 'add',
});
const tableData = ref([]);

const form = reactive({
  id: '',
  name: '',
  sort: 1,
});

const initData = async () => {
  statuEs.value.clickLoading = true;
  const {data} = await listDeployGroup();
  setChildrenUndefined(data);
  tableData.value = data;
  statuEs.value.clickLoading = false;
};
initData();
const addHandel = (record) => {
  statuEs.value.modelTitle = '添加流程组';
  statuEs.value.modelType = 'add';
  statuEs.value.model = true;
};

const editHandel = (record) => {
  statuEs.value.modelTitle = '编辑流程组';
  statuEs.value.modelType = 'edit';
  form.id = record.id;
  form.name = record.name;
  form.sort = record.sort;
  statuEs.value.model = true;
};

const cleanForm = () => {
  form.id = '';
  form.sort = 1;
  form.name = '';

};
const delHandel = async (record) => {
  const {data} = await deleteDeployGroup(record.id);
  Message.success(data);
  initData();
};

const update = async (done) => {
  const forms = ref({
    id: form.id,
    sort: Number(form.sort),
    name: form.name,
  });
  try {
    const {data} = await updateDeployGroup(forms.value);
    Message.success(data);
    done(true);
    initData();
  } catch (e) {
    done(false);
  }
};
const add = async (done) => {
  const forms = ref({
    sort: Number(form.sort),
    name: form.name,
  });
  try {
    const {data} = await addDeployGroup(forms.value);
    Message.success(data);
    done(true);
    initData();
  } catch (e) {
    done(false);
  }
};

const handelOk = (done) => {
  // 根据form加上statuEs判断
  if (statuEs.value.modelType !== 'add') {
    update(done);
  } else {
    add(done);
  }
};

const handleCancel = () => {
  cleanForm();
};
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
            <a-space direction="vertical">
              <a-button
                :loading="statuEs.clickLoading"
                type="primary"
                @click="addHandel"
              >
                添加流程组
              </a-button>
            </a-space>
            <a-divider class="split-line" style="margin: 3px"/>
          </a-space>

          <a-table-column
            :width="200"
            title="名称"
          >
            <template #cell="{ record }">
              {{ $t(record.name) }}
            </template>
          </a-table-column>
          <a-table-column
            :sortable="{
              sortDirections: ['ascend', 'descend'],
            }"
            :title="$t(`syscenter.index-image.sort`)"
            :width="100"
          >
            <template #cell="{ record }">
              {{ record.sort }}
            </template>
          </a-table-column>
          <a-table-column :title="$t(`syscenter.index-image.control`)">
            <template #cell="{ record }">
              <a-button @click="editHandel(record)"
              >修改
              </a-button>
              <a-popconfirm
                content="危险！将会删除该流程组且不可恢复，确认删除?"
                @ok="delHandel(record)"
              >
                <a-button
                >删除
                </a-button>
              </a-popconfirm>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-space>
    <a-modal
      v-model:visible="statuEs.model"
      :draggable="false"
      :fullscreen="appStore.modelFullscreen"
      :hide-cancel="false"
      :title="statuEs.modelTitle"
      :title-align="'start'"
      :width="700"
      unmount-on-close
      @close="handleCancel()"
      @before-ok="handelOk"
    >
      <a-form :model="form">
        <div>
          <div>
            <a-form-item
              field="name"
              label="流程组名称"
              label-col-flex="80px"
            >
              <a-input
                v-model="form.name"
              ></a-input>
            </a-form-item>
          </div>
        </div>
        <div>
          <div>
            <a-form-item
              field="sort"
              label="排序"
              label-col-flex="80px"
            >
              <a-input-number
                v-model="form.sort"
                :max="100"
                :min="1"
              ></a-input-number>
            </a-form-item>
          </div>
        </div>
      </a-form>
    </a-modal>
  </a-card>
</template>

<style lang="less" scoped></style>
