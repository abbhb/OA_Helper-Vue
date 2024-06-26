<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { useAppStore } from '@/store';
  import {
    deleteSigninDevice,
    SigninDeviceDto,
    signinDeviceList,
  } from '@/api/signin';
  import AddDevice from '@/views/signin/device/components/addDevice.vue';
  import EditDevice from '@/views/signin/device/components/editDevice.vue';
  import SyncXData from "@/views/signin/device/components/sync/SyncXData.vue";

  const appStore = useAppStore();

  interface statuEI {
    clickLoading: boolean;
    model?: boolean;
    syncModel?: boolean;
    syncModelDeviceId?: string;
    modelTitle?: string;
    syncModelTitle?: string;
    syncModelSupport?: string;
    modelType?: string;
    modelContent?: SigninDeviceDto;
  }

  const statuEs = ref<statuEI>({
    clickLoading: false,
    modelContent: null,
    syncModelTitle:'',
    syncModelDeviceId:'',
    syncModelSupport:'',
    syncModel:false,
    model: false,
    modelTitle: '通知',
    modelType: 'add',
  });
  const tableData = ref([]);
  // 初始化可添加设备列表
  const initDevice = async () => {
    statuEs.value.clickLoading = true;

    const { data } = await signinDeviceList();
    tableData.value = data;
    statuEs.value.clickLoading = false;
  };
  initDevice();
  const form = reactive({
    id: '',
    label: '',
    image: '',
    sort: 1,
    extra: '',
  });

  const addHandel = (record) => {
    statuEs.value.modelTitle = '注册考勤设备';
    statuEs.value.modelType = 'add';
    statuEs.value.model = true;
  };

  const editHandel = (record) => {
    statuEs.value.modelTitle = '编辑';
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
    const data = await deleteSigninDevice(record.deviceId);
    Message.success(data.data);
    initDevice();
  };

  const handleCancel = () => {
    cleanForm();
  };

  const updateSuccess = () => {
    statuEs.value.model = false;
    initDevice();
    cleanForm();
  };
  const supportToTitle = (support: string) => {
    if (support === 'face') {
      return '人脸';
    }
    if (support === 'card') {
      return 'ID卡';
    }
    return support;
  }
  const syncNameComputed = computed(() => (support: string) => {
    return supportToTitle(support);
  });
  const openSyncHandel = (record, support: string) => {
    statuEs.value.syncModelTitle = supportToTitle('同步' + support);
    statuEs.value.syncModelSupport = support;
    statuEs.value.syncModelDeviceId = record.deviceId;
    statuEs.value.syncModel = true;

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
            <ul>
              <li
                >此页面不会动态刷新状态，如果长时间停留可能造成设备状态更新不及时!
              </li>
            </ul>
            <a-space direction="vertical">
              <a-button
                :loading="statuEs.clickLoading"
                type="primary"
                @click="addHandel"
              >
                注册考勤设备
              </a-button>
            </a-space>
            <a-divider class="split-line" style="margin: 3px" />
          </a-space>

          <a-table-column :width="200" title="设备ID">
            <template #cell="{ record }">
              {{ record.deviceId }}
            </template>
          </a-table-column>
          <a-table-column :width="200" title="设备名称">
            <template #cell="{ record }">
              {{ record.name }}
            </template>
          </a-table-column>
          <a-table-column :width="200" title="设备备注">
            <template #cell="{ record }">
              {{ record.remark }}
            </template>
          </a-table-column>
          <a-table-column :width="200" title="在线状态">
            <template #cell="{ record }">
              <el-tag v-if="record.online" :type="'success'">在线</el-tag>
              <el-tag v-else>离线</el-tag>
            </template>
          </a-table-column>
          <a-table-column :width="200" title="设备支持">
            <template #cell="{ record }">
              <el-tag
                v-for="item in record.support.trim().split(',')"
                :key="record.deviceId + item"
                >{{ item }}
              </el-tag>
            </template>
          </a-table-column>

          <a-table-column title="操作">
            <template #cell="{ record }">
              <a-button class="button" @click="editHandel(record)"
                >编辑</a-button
              >
              <a-popconfirm
                content="危险！将会删除该且不可恢复，确认删除?"
                @ok="delHandel(record)"
              >
                <a-button                 class="button"
                >删除</a-button>
              </a-popconfirm>
              <div v-if="record.online">
                <el-button
                  :type="'primary'"
                  v-for="item in record.support.trim().split(',')"
                  :key="record.deviceId + item"
                  class="button"
                  @click="openSyncHandel(record, item)"
                >同步{{ syncNameComputed(item) }}</el-button
                >
              </div>

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
      :width="600"
      unmount-on-close
    >
      <add-device v-if="statuEs.modelType === 'add'" />
      <edit-device
        v-else
        :device="statuEs.modelContent"
        @success="updateSuccess"
      />
    </a-modal>
    <a-modal
      v-model:visible="statuEs.syncModel"
      :draggable="true"
      :footer="false"
      :fullscreen="appStore.modelFullscreen"
      :hide-title="false"
      :title="statuEs.syncModelTitle"
      :esc-to-close="false"
      :mask-closable="false"
      :title-align="'start'"
      :width="1200"
      unmount-on-close
    >
      <SyncXData v-if="statuEs.syncModel" :device-id="statuEs.syncModelDeviceId" :support="statuEs.syncModelSupport"/>
    </a-modal>
  </a-card>
</template>

<style lang="less" scoped>
.button {
  margin-left: 3px;
}
</style>
