<script setup lang="ts">
  import { defineProps, reactive, ref } from 'vue';
  import {
    downloadSigninFaceData,
    get_signin_face_data,
    SigninUserFaceDataResp,
    uploadSigninFaceData,
  } from '@/api/signin';
  import SyncImage from '@/assets/images/4c0fc521c71f1b4c0122d3271a3bf657.gif';
  import { Message } from '@arco-design/web-vue';

  const props = defineProps({
    support: {
      type: String,
      required: true,
      default: '',
    },
    deviceId: {
      type: String,
      required: true,
      default: '',
    },
  });

  // 上传数据模式
  const models = ref<'Upload' | 'Download'>('Upload');

  const form = reactive({
    deviceId: props.deviceId,
    modelType: 'ADD', //默认是仅增量且覆盖【对选中的数据同步至本地状态】,或者全新同步模式【不保留该设备内的旧数据，以本次选择的为准】
  });

  // 表格实例
  const tableRef = ref();
  // 表格选择的数据
  const tableSelectionList = ref<any[]>([]);

  // eslint-disable-next-line vue/no-dupe-keys
  const list = ref<any[]>([]);
  // 列表是否加载
  const loading = ref(true);

  /**
   * 选择table数据
   * @param selectData 选择的数据
   */
  const handleSelectionChange = (selectData: any[]) => {
    tableSelectionList.value = selectData;
  };

  /**
   * 查询列表
   */
  const getList = async () => {
    loading.value = true;
    const { data } = await get_signin_face_data(props.deviceId);
    list.value = data;
    loading.value = false;
  };

  const syncUpload = async () => {
    const data_datas: SigninUserFaceDataResp[] = [];
    for (let i = 0; i < tableSelectionList.value.length; i += 1) {
      data_datas.push({
        userId: tableSelectionList.value[i].userId,
        studentId: tableSelectionList.value[i].studentId,
        name: tableSelectionList.value[i].name,
        username: tableSelectionList.value[i].username,
        localExist: tableSelectionList.value[i].localExist,
        deviceExist: tableSelectionList.value[i].deviceExist,
      });
    }
    const data = {
      syncModel: form.modelType,
      deviceId: form.deviceId,
      data: data_datas,
    };
    const rep = await uploadSigninFaceData(data);
    Message.success(rep.msg);
  };
  const syncDownload = async () => {
    const data_datas: SigninUserFaceDataResp[] = [];
    for (let i = 0; i < tableSelectionList.value.length; i += 1) {
      data_datas.push({
        userId: tableSelectionList.value[i].userId,
        studentId: tableSelectionList.value[i].studentId,
        name: tableSelectionList.value[i].name,
        username: tableSelectionList.value[i].username,
        localExist: tableSelectionList.value[i].localExist,
        deviceExist: tableSelectionList.value[i].deviceExist,
      });
    }
    const data = {
      syncModel: form.modelType,
      deviceId: form.deviceId,
      data: data_datas,
    };
    const rep = await downloadSigninFaceData(data);
    Message.success(rep.msg);
  };
  const cleanData = () => {
    form.modelType = 'ADD';
    tableSelectionList.value = [];
  };
  const changeModel = () => {
    cleanData();
    getList();
    if (models.value === 'Upload') {
      models.value = 'Download';
    } else {
      models.value = 'Upload';
    }
  };

  getList();
</script>

<template>
  <div>
    <div style="padding-bottom: 5px">
      <el-tag
        >{{ models === 'Upload' ? '向设备上传' : '从设备下载' }}状态</el-tag
      >
      <el-button style="margin-left: 3px" :type="'success'" @click="changeModel"
        >切换模式</el-button
      >
    </div>
    <div v-if="models === 'Upload'" class="model">
      <div>
        <div> 已经选择{{ tableSelectionList.length }}人 </div>
        <el-table
          ref="tableRef"
          v-loading="loading"
          :data="list"
          :height="500"
          :max-height="500"
          style="margin-bottom: 10px"
          @select="handleSelectionChange"
          @select-all="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column
            label="账号昵称"
            align="center"
            prop="name"
            width="100"
          />
          <el-table-column
            label="用户名"
            align="center"
            prop="username"
            width="100"
          />
          <el-table-column
            label="部门"
            align="center"
            prop="deptName"
            width="200"
          />
          <el-table-column label="本地人脸" align="center" prop="localExist">
            <template #default="scope">
              <el-tag :type="scope.row.localExist ? 'success' : 'danger'">{{
                scope.row.localExist ? '存在' : '不存在'
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="考勤机人脸" align="center" prop="deviceExist">
            <template #default="scope">
              <el-tag :type="scope.row.deviceExist ? 'success' : 'danger'">{{
                scope.row.deviceExist ? '存在' : '不存在'
              }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="display: flex; flex-direction: column">
        <h2>操作区</h2>
        <div
          style="
            border: 1px rgba(40, 151, 173, 0.77) dashed;
            padding: 0 3vw 0 3vw;
          "
        >
          <span style="font-size: 18px">本地人脸</span>
          <a-image width="130" :src="SyncImage" />
          <span style="font-size: 18px">打卡机数据库</span>
        </div>
        <a-form style="margin-top: 1vw">
          <a-form-item label="同步模式">
            <a-select v-model:model-value="form.modelType">
              <a-option value="ADD"
                ><el-tag>增量且覆盖选中</el-tag
                ><span class="option">[选中数据同步状态]</span></a-option
              >
              <a-option value="NEW"
                ><el-tag>全新模式</el-tag
                ><span class="option">[在设备端只保留选中数据]</span></a-option
              >
            </a-select>
          </a-form-item>
          <a-button :type="'primary'" @click="syncUpload">一键同步</a-button>
        </a-form>
      </div>
    </div>
    <div v-if="models === 'Download'" class="model">
      <div>
        <div> 已经选择{{ tableSelectionList.length }}人 </div>
        <el-table
          ref="tableRef"
          v-loading="loading"
          :data="list"
          :height="500"
          :max-height="500"
          style="margin-bottom: 10px"
          @select="handleSelectionChange"
          @select-all="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column
            label="账号昵称"
            align="center"
            prop="name"
            width="100"
          />
          <el-table-column
            label="用户名"
            align="center"
            prop="username"
            width="100"
          />
          <el-table-column
            label="部门"
            align="center"
            prop="deptName"
            width="200"
          />
          <el-table-column label="考勤机人脸" align="center" prop="deviceExist">
            <template #default="scope">
              <el-tag :type="scope.row.deviceExist ? 'success' : 'danger'">{{
                scope.row.deviceExist ? '存在' : '不存在'
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="本地人脸" align="center" prop="localExist">
            <template #default="scope">
              <el-tag :type="scope.row.localExist ? 'success' : 'danger'">{{
                scope.row.localExist ? '存在' : '不存在'
              }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="display: flex; flex-direction: column">
        <h2>操作区</h2>
        <div
          style="
            border: 1px rgba(40, 151, 173, 0.77) dashed;
            padding: 0 1vw 0 2vw;
          "
        >
          <span style="font-size: 18px">打卡机数据库</span>
          <a-image width="130" :src="SyncImage" />
          <span style="font-size: 18px">本地人脸</span>
        </div>
        <a-form style="margin-top: 1vw">
          <a-form-item label="同步模式">
            <a-select v-model:model-value="form.modelType">
              <a-option value="ADD"
                ><el-tag>增量且覆盖选中</el-tag
                ><span class="option">[选中数据同步状态]</span></a-option
              >
            </a-select>
          </a-form-item>
          <el-tag :type="'danger'">谨慎操作</el-tag>
          <a-button :type="'primary'" @click="syncDownload">一键导入</a-button>
        </a-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .model {
    display: flex;
  }
  .option {
    font-weight: 100;
    color: #6b6b6b;
    font-size: 12px;
    padding-left: 10px;
  }
</style>
