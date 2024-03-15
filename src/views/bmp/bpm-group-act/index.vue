<script lang="ts" setup>
import {reactive, ref} from 'vue';
import {Message} from '@arco-design/web-vue';
import {useAppStore} from '@/store';

import {
  addDeployGroup,
  deleteDeployGroup,
  listDeployGroup,
  listDeployGroupAct,
  updateDeployGroup,
  updateDeployGroupAct,
} from '@/api/bpmn';

const appStore = useAppStore();

interface statuEI {
  clickLoading: boolean;
  model?: boolean;
  model_change_group?: boolean;
  modelChangeGroupTitle?: string;
  modelTitle?: string;
  modelType?: string;
}

const statuEs = ref<statuEI>({
  clickLoading: false,
  model: false,
  model_change_group: false,
  modelTitle: '流程关联组',
  modelChangeGroupTitle: '切换分组',
  modelType: 'add',
});
const tableData = ref([]);
const canSelectData = ref([]);
const form = reactive({
  id: '',
  name: '',
  sort: 1,
});
const form_change_group = reactive({
  id: '',
  deployGroupId: '',
});
const initSelect = async () => {
  const {data} = await listDeployGroup();
  canSelectData.value = data;

}
const initData = async () => {
  statuEs.value.clickLoading = true;
  await initSelect()
  const {data} = await listDeployGroupAct();

  tableData.value = data;
  statuEs.value.clickLoading = false;
};
initData();
const addHandel = (record) => {
  statuEs.value.modelTitle = '添加流程关联组';
  statuEs.value.modelType = 'add';
  statuEs.value.model = true;
};


const cleanForm = () => {
  form.id = '';
  form.sort = 1;
  form.name = '';
  form_change_group.deployGroupId = '';
  form_change_group.id = '';
};
const delHandel = async (record) => {
  const {data} = await deleteDeployGroup(record.deployGroupId);
  Message.success(data);
  initData();
};

const changeGroup = async (groupId, record) => {
  form_change_group.id = record.deploymentId;
  form_change_group.deployGroupId = groupId;
  statuEs.value.model_change_group = true;
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
const updateChange = async (done) => {
  const formss = ref({
    deployId: form_change_group.id,
    deployGroupId: form_change_group.deployGroupId,
  });
  try {
    const {data} = await updateDeployGroupAct(formss.value);
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


const handelOkChange = (done) => {
  // 根据form加上statuEs判断
  updateChange(done);
};

const handleCancel = () => {
  cleanForm();
};

const editHandel = (record) => {
  statuEs.value.modelTitle = '编辑流程组';
  statuEs.value.modelType = 'edit';
  form.id = record.deployGroupId;
  form.name = record.deployGroupName;
  form.sort = record.sort;
  statuEs.value.model = true;
};


</script>

<template>
  <a-card>
    <a-space direction="vertical">
      <a-button
        :loading="statuEs.clickLoading"
        type="primary"
        @click="addHandel"
      >
        添加流程组
      </a-button>
      <a-divider class="split-line" style="margin: 3px"/>
      <el-table :border="false" :data="tableData" style="width: 100rem">

        <el-table-column type="expand">
          <template #default="props">
            <div m="4">
              <el-table :border="false" :data="props.row.definitionListVoList">
                <el-table-column label="模型部署id" prop="deploymentId"/>
                <el-table-column label="流程名称" prop="name"/>
                <el-table-column label="流程key" prop="key"/>
                <el-table-column label="版本" prop="version"/>
                <el-table-column label="是否挂起状态" prop="suspended"/>
                <el-table-column label="流程项操作" width="180">
                  <template #default="scope">
                    <el-button @click="changeGroup(props.row.deployGroupId,scope.row)">切换分组</el-button>

                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="流程组名" prop="deployGroupName"/>
        <el-table-column label="流程组操作" width="180">
          <template #default="scope">
            <el-button v-if="scope.row.deployGroupId!=='0'" @click="editHandel(scope.row)">编辑</el-button>
            <a-popconfirm
              content="危险！将会删除该流程组且不可恢复，确认删除?"
              @ok="delHandel(scope.row)"
            >
              <el-button v-if="scope.row.deployGroupId!=='0'"
              >删除
              </el-button>
            </a-popconfirm>

          </template>
        </el-table-column>
      </el-table>
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
              label="流程关联组名称"
              label-col-flex="80px"
            >
              <a-input v-model="form.name"></a-input>
            </a-form-item>
          </div>
        </div>
        <div>
          <div>
            <a-form-item field="sort" label="排序" label-col-flex="80px">
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

    <a-modal
      v-model:visible="statuEs.model_change_group"
      :draggable="false"
      :fullscreen="appStore.modelFullscreen"
      :hide-cancel="false"
      :title="statuEs.modelChangeGroupTitle"
      :title-align="'start'"
      :width="700"
      unmount-on-close
      @close="handleCancel()"
      @before-ok="handelOkChange"
    >
      <a-form :model="form">
        <a-form-item
          label="切换分组"
          label-col-flex="80px"
        >
          <a-select
            v-model:model-value="form_change_group.deployGroupId"
            :style="{ width: '220px' }"
          >
            <a-option
              v-for="(item, key) in canSelectData"
              :key="key"
              :value="item.id"
            >{{ item.name }}
            </a-option
            >
          </a-select>

        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<style lang="less" scoped></style>
