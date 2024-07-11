<script lang="ts" setup>
  import { useI18n } from 'vue-i18n';
  import { computed, reactive, ref, h } from 'vue';
  import { useAppStore } from '@/store';
  import { GroupUserFront } from '@/api/group';
  import { Message } from '@arco-design/web-vue';
  import AvatarImage from '@/components/image/AvatarImage.vue';
  import { deptListTree, DeptManger } from '@/api/dept';
  import { Role, roleTagList } from '@/api/role';
  import {
    exportSigninUserData,
    getDataMangerList,
    getImportTemplate,
    SigninDataResp,
  } from '@/api/signin';
  import Upload from '@/components/upload/index.vue';
  import { getToken } from '@/utils/auth';

  const { t } = useI18n();
  const appStore = useAppStore();

  interface statuEI {
    name?: string;
    searchStatus?: boolean;
    clickLoading: boolean;
    modelstatus: boolean;
    modelType: string;
    modelTitle: string;
    modelData?: GroupUserFront;
    deptId?: string;
    formModel: boolean;
    refreshKey: number;
    jilian: boolean;
  }
  const uploadRef = ref(null);
  const statuEs = ref<statuEI>({
    name: '',
    clickLoading: false,
    modelstatus: false,
    modelType: 'add',
    modelTitle: 'syscenter.user.manger.add.button',
    deptId: '1',
    formModel: false,
    refreshKey: 1,
    jilian: true,
  });

  /*** 用户导入参数 */
  const upload = reactive({
    // 是否禁用上传
    isUploading: false,
    // 是否更新已经存在的用户数据
    updateSupport: 0,
    // 设置上传的请求头部
    headers: { Authorization: 'Bearer ' + getToken() },
    // 上传的地址
    url: import.meta.env.VITE_API_BASE_URL+'/api/signin_user_data/importData',
  });

  const tableData = ref<SigninDataResp[]>([]);
  const deptTreeData = ref([]);
  const needExpend = ref([]);
  const rolesStore = ref<Role[]>([]);

  const initSelect = async () => {
    const { data } = await roleTagList();
    rolesStore.value = data;
  };
  initSelect();
  const findDepartmentsWithNonEmptyChildren = (departments: DeptManger[]) => {
    const result: string[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const department of departments) {
      if (department.children.length > 0) {
        result.push(department.id);
      }
      if (department.children && department.children.length > 0) {
        // 递归查找子部门
        result.push(
          ...findDepartmentsWithNonEmptyChildren(department.children)
        );
      }
    }

    return result;
  };
  const initDeptTree = async () => {
    const { data } = await deptListTree();
    deptTreeData.value = data;
    needExpend.value = findDepartmentsWithNonEmptyChildren(data);
  };
  const submitFileForm = () => {
    uploadRef.value!.submit();
  };
  initDeptTree();
  const getData = async (pagination) => {
    const { data } = await getDataMangerList({
      pageNum: pagination.value.current,
      pageSize: pagination.value.pageSize,
      name: statuEs.value.name,
      cascade: statuEs.value.jilian ? 1 : 0,
      deptId:
        statuEs.value.deptId && statuEs.value.deptId.length >= 1
          ? statuEs.value.deptId[0]
          : undefined,
    });
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
  getData(pagination);

  const getDataB = async () => {
    statuEs.value.refreshKey += 1;
    pagination.value.current = 1;
    statuEs.value.searchStatus = true;
    const { data } = await getDataMangerList({
      pageNum: pagination.value.current,
      pageSize: pagination.value.pageSize,
      name: statuEs.value.name,
      cascade: statuEs.value.jilian ? 1 : 0,
      deptId:
        statuEs.value.deptId && statuEs.value.deptId.length >= 1
          ? statuEs.value.deptId[0]
          : undefined,
    });
    statuEs.value.searchStatus = false;
    tableData.value = data.records;
    pagination.value.total = Number(data.total);
  };

  const refreshData = () => {
    getDataB();
  };

  const changeJiLiHandel = () => {
    pagination.value.current = 1;
    getDataB();
  };

  const exportData = async () => {
    const { data } = await exportSigninUserData();
    window.open(data);
  };
  const importTemplate = async () => {
    const { data } = await getImportTemplate();
    window.open(data);
  };
  const openImport = () => {
    statuEs.value.modelstatus = true;
  };

  /**文件上传中处理 */
  const handleFileUploadProgress = (event, file, fileList) => {
    upload.isUploading = true;
  };

  /** 文件上传成功处理 */
  const handleFileSuccess = (response, file, fileList) => {
    statuEs.value.modelstatus = false;
    upload.isUploading = false;
    console.log(response)
    if (response.data&&response.data!==''){

      window.open(response.data)
      alert('部分导入失败，已下载失败数据！')
    }else {
      Message.info('导入结果:' + response.msg);

    }
    getDataB();
  };
</script>

<template>
  <div class="container">
    <div class="left-side">
      <div
        style="
          padding: 2px 2px 2px 2px;
          margin-bottom: 3px;
          display: flex;
          align-items: center;
        "
      >
        <span>包含下级部门用户</span>
        <a-switch
          v-model:model-value="statuEs.jilian"
          style="margin-left: auto"
          type="round"
          @change="changeJiLiHandel"
        />
      </div>

      <a-tree
        v-model:selected-keys="statuEs.deptId"
        v-model:expanded-keys="needExpend"
        :data="deptTreeData"
        :default-expand-all="true"
        :default-selected-keys="['1']"
        :field-names="{
          key: 'id',
          title: 'deptName',
          children: 'children',
        }"
        :show-line="true"
        block-node
        @select="getDataB"
      />
    </div>
    <div class="right-side">
      <a-card direction="vertical">
        <a-table :data="tableData" :pagination="pagination">
          <template #columns>
            <a-space direction="vertical">
              <a-input-search
                v-model:model-value="statuEs.name"
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
                <template #button-default>
                  {{ $t('syscenter.user.manger.search') }}
                </template>
              </a-input-search>
              <a-space direction="horizontal">
                <a-button
                  :loading="statuEs.clickLoading"
                  type="primary"
                  @click="exportData"
                >
                  导出Excel
                </a-button>
                <a-button type="primary" @click="openImport">
                  从Excel导入
                </a-button>
              </a-space>
              <a-divider class="split-line" style="margin: 3px" />
            </a-space>

            <a-table-column
              :sortable="{ sortDirections: ['ascend', 'descend'] }"
              :title="$t(`syscenter.user.manger.name`)"
              data-index="name"
              :width="100"
            ></a-table-column>
            <!--            <a-table-column-->
            <!--              :sortable="{ sortDirections: ['ascend', 'descend'] }"-->
            <!--              :title="$t(`syscenter.user.manger.username`)"-->
            <!--              data-index="username"-->
            <!--              :width="100"-->
            <!--            ></a-table-column>-->

            <a-table-column
              :sortable="{ sortDirections: ['ascend', 'descend'] }"
              :title="$t(`syscenter.user.manger.avatar`)"
              :width="80"
            >
              <template #cell="{ record }">
                <AvatarImage
                  :key="Number(record.id) + Number(statuEs.refreshKey)"
                  :avatar="record.avatar"
                  :name="record.name"
                />
              </template>
            </a-table-column>
            <a-table-column
              :sortable="{ sortDirections: ['ascend', 'descend'] }"
              :title="$t(`syscenter.user.manger.sex`)"
              data-index="sex"
              :width="80"
            ></a-table-column>
            <a-table-column
              :sortable="{ sortDirections: ['ascend', 'descend'] }"
              :title="$t(`syscenter.user.manger.updateTime`)"
              :width="120"
              data-index="updateTime"
            >
              <template #cell="{ record }">
                <span v-if="record.updateTime">{{ record.updateTime }}</span>
                <span v-else>无此人生物数据记录</span>
              </template>
            </a-table-column>

            <a-table-column
              :sortable="{ sortDirections: ['ascend', 'descend'] }"
              title="人脸数据1"
              :width="80"
            >
              <template #cell="{ record }">
                <el-tag
                  v-if="record.existFace"
                  :type="'primary'"
                  :effect="'plain'"
                  >存在
                </el-tag>
                <el-tag v-else :type="'danger'" :effect="'plain'"
                  >不存在
                </el-tag>
              </template>
            </a-table-column>
            <a-table-column
              :sortable="{ sortDirections: ['ascend', 'descend'] }"
              title="ID卡数据1"
              :width="80"
            >
              <template #cell="{ record }">
                <el-tooltip
                  v-if="record.existCard"
                  class="box-item"
                  effect="dark"
                  :content="'卡号：' + record.cardId"
                  placement="bottom"
                >
                  <el-tag :type="'primary'" :effect="'plain'">存在 </el-tag>
                </el-tooltip>

                <el-tag v-else :type="'danger'" :effect="'plain'"
                  >不存在
                </el-tag>
              </template>
            </a-table-column>
            <a-table-column
              :title="$t(`syscenter.user.manger.control`)"
              :width="220"
            >
              <template #cell="{ record }">
                <a-button @click="editAGroup(record)"
                  >{{ $t('syscenter.user.manger.control.edit') }}
                </a-button>
                <a-button
                  :status="record.status === 1 ? 'danger' : 'success'"
                  @click="IBan(record)"
                >
                  <span v-if="record.status === 1">{{
                    $t('syscenter.user.manger.control.banned')
                  }}</span>
                  <span v-else>{{
                    $t('syscenter.user.manger.control.Nobanned')
                  }}</span>
                </a-button>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-card>
      <a-modal
        v-model:visible="statuEs.modelstatus"
        :draggable="false"
        title="从Excel导入"
        :esc-to-close="false"
        :mask-closable="false"
        :closable="false"
        unmount-on-close

        @cancel="statuEs.modelstatus = false"
        @ok="submitFileForm"
      >
        <div>
          <el-upload
            ref="uploadRef"
            class="upload-demo"
            drag
            :action="upload.url + '?updateSupport=' + upload.updateSupport"
            :headers="upload.headers"
            :auto-upload="false"
            :on-progress="handleFileUploadProgress"
            :on-success="handleFileSuccess"
            :disabled="upload.isUploading"
            :limit="1"
            accept=".xlsx, .xls"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处， <em>或点击上传</em>
            </div>
            <template #tip>
              <div
                class="el-upload__tip"
                style="
                  align-items: center;
                  display: flex;
                  flex-direction: column;
                "
              >
                <el-checkbox v-model:model-value="upload.updateSupport"
                  >是否更新已经存在的用户数据</el-checkbox
                >
                <span>
                  仅允许导入xls、xlsx格式的文件.<span
                    style="color: #1890ff; cursor: pointer"
                    @click="importTemplate"
                    >下载模板</span
                  >
                </span>
              </div>
            </template>
          </el-upload>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .arco-btn-size-medium {
    margin-inline: 2px;
  }

  .left-side {
    width: 280px;
    margin-left: 16px;
    padding: 3px 3px 3px 3px;
    border-radius: 3px;
    border: 1px solid var(--color-border-1);
    background-color: var(--color-bg-1);
  }

  .right-side {
    flex: 1;
    overflow: auto;
  }

  .container {
    background-color: var(--color-fill-2);
    padding: 16px 20px;
    padding-bottom: 0;
    display: flex;
  }
</style>
