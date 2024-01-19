<script lang="ts" setup>
import {computed, h, reactive, ref} from 'vue';
import {getColor} from '@/utils/color-index';

import {setChildrenUndefined} from '@/utils/utils';
import {useAppStore} from '@/store';
import {IconSearch} from '@arco-design/web-vue/es/icon';
import {Message} from '@arco-design/web-vue';
import {addOauth, deleteOauth, listOauth, SysOauth, updateOauth,} from '@/api/oauth';
import ImageUpload from '@/components/image/ImageUpload.vue';
import AvatarImage from '@/components/image/AvatarImage.vue';
import {copyToClip} from "@/utils/chat/copy";

interface statuEI {
    clickLoading: boolean;
    model?: boolean;
    modelTitle?: string;
    modelType?: string;
  }

  const statuEs = ref<statuEI>({
    clickLoading: false,
    model: false,
    modelTitle: 'Oauth2',
    modelType: 'add',
  });
  const form = reactive({
    id: '',
    clientId: '',
    clientName: '',
    clientSecret: '',
    redirectUri: '',
    domainName: '',
    noSertRedirect: 1,
    force_configuration_redirect: 0,
    grantType: '',
    createTime: '',
    updateTime: '',
    status: 1,
    clientImage: null,
  });

  const iconList = ref<string[]>([
    'icon-apps',
    'icon-check-circle',
    'icon-clock-circle',
    'icon-info',
    'icon-question-circle',
    'icon-heart-fill',
  ]);
  const appStore = useAppStore();
  const tableData = ref<SysOauth[]>([]);
  const treeData = ref([{ key: '0', title: '根节点' }]);

  /**
   *  :fieldNames="{
   *       key: 'value',
   *       title: 'label',
   *       children: 'items'
   *     }"
   *     官方虽然有api来指定字段，但还是需要添加根节点，不如手写
   * @param table
   */
  const tableDataToTreeData = (table: any) => {
    const newas = [];
    console.log(table);
    table.forEach((item) => {
      if (item.parentId === '0') {
        const thischild = [];
        if (item.children) {
          item.children.forEach((asd) => {
            if (asd.parentId === item.id) {
              if (asd.children) {
                const thisssachild = [];
                asd.children.forEach((asdd) => {
                  thisssachild.push({ key: asdd.id, title: asdd.locale });
                });
                thischild.push({
                  key: asd.id,
                  title: asd.locale,
                  children: thisssachild,
                });
              } else {
                thischild.push({ key: asd.id, title: asd.locale });
              }
            }
          });
          newas.push({ key: item.id, title: item.locale, children: thischild });
        } else {
          newas.push({ key: item.id, title: item.locale });
        }
      }
    });
    const tree = [{ key: '0', title: '根节点', children: newas }];
    treeData.value = tree;
  };
  const initData = async () => {
    statuEs.value.clickLoading = true;
    const { data } = await listOauth();
    setChildrenUndefined(data);
    tableData.value = data;
    tableDataToTreeData(data);
    statuEs.value.clickLoading = false;
  };
  initData();

  const stateChange = computed(() => (status: any) => {
    return status === 1 || status === '1' ? '正常' : '停用';
  });
  const cleanForm = () => {
    form.id = '';
    form.clientId = '';
    form.clientName = '';
    form.clientSecret = '';
    form.redirectUri = '';
    form.domainName = '';
    form.noSertRedirect = 1;
    form.grantType = '';
    form.grantType = 'code';
    form.createTime = '';
    form.updateTime = '';
    form.status = 1;
    form.clientImage = null;
  };
  const getTypeNext = (formobject) => {
    if (formobject.type === 'M') {
      return 'C';
    }
    if (formobject.type === 'C') {
      return 'F';
    }
    if (formobject.id === 0 || formobject.id === '0') {
      return 'M';
    }
    return 'M';
  };
  const editHandel = (record) => {
    statuEs.value.modelTitle = '编辑Oauth2';
    statuEs.value.modelType = 'edit';
    form.id = record.id;
    form.clientId = record.client_id;
    form.clientName = record.client_name;
    form.clientSecret = record.client_secret;
    form.redirectUri = record.redirect_uri;
    form.domainName = record.domain_name;
    form.noSertRedirect = record.no_sert_redirect;
    form.grantType = record.grant_type;
    form.status = record.status;
    form.clientImage = record.client_image ? record.client_image : null;
    statuEs.value.model = true;
  };
  const readMore = (record) => {
    statuEs.value.modelTitle = `${record.client_name}-详细信息`;
    statuEs.value.modelType = 'read';
    form.id = record.id;
    form.clientId = record.client_id;
    form.clientName = record.client_name;
    form.clientSecret = record.client_secret;
    form.redirectUri = record.redirect_uri;
    form.domainName = record.domain_name;
    form.noSertRedirect = record.no_sert_redirect;
    form.grantType = record.grant_type;
    form.status = record.status;
    form.clientImage = record.client_image ? record.client_image : null;
    statuEs.value.model = true;
  };
  const addHandel = () => {
    statuEs.value.modelTitle = '添加Oauth2';
    statuEs.value.modelType = 'add';
    statuEs.value.model = true;
  };
  const delHandel = async (record) => {
    const { data } = await deleteOauth(record.id);
    Message.success(data);
    initData();
  };
  const handleCancel = () => {
    cleanForm();
  };
  const update = async (done) => {
    const forms = ref<SysOauth>({
      id: form.id,
      client_id: form.clientId,
      client_name: form.clientName,
      client_secret: form.clientSecret,
      redirect_uri: form.redirectUri,
      force_configuration_redirect: form.force_configuration_redirect,
      domain_name: form.domainName,
      no_sert_redirect: form.noSertRedirect,
      grant_type: form.grantType,
      status: form.status,
      client_image: form.clientImage,
    });
    try {
      const { data } = await updateOauth(forms.value);
      Message.success(data);
      done(true);
      initData();
    } catch (e) {
      done(false);
    }
  };
  const add = async (done) => {
    const forms = ref<SysOauth>({
      client_name: form.clientName,
      redirect_uri: form.redirectUri,
      domain_name: form.domainName,
      no_sert_redirect: form.noSertRedirect,
      force_configuration_redirect: form.force_configuration_redirect,
      grant_type: form.grantType,
      status: form.status,
      client_image: form.clientImage,
    });
    try {
      const { data } = await addOauth(forms.value);
      Message.success(data);
      done(true);
      initData();
    } catch (e) {
      done(false);
    }
  };
  const handelOk = (done) => {
    // todo:前端条件校验

    // 根据form加上statuEs判断
    if (statuEs.value.modelType === 'add') {
      add(done);
    } else if (statuEs.value.modelType === 'edit') {
      update(done);
    } else {
      done(true);
      // 只能查看
    }
  };
  const imageHandleSuccess = (data) => {
    // r为data
    if (data.indexOf('http') !== -1) {
      // eslint-disable-next-line prefer-destructuring
      form.clientImage = data.split('aistudio/')[1];
    } else {
      form.clientImage = data;
    }
    Message.success('上传成功!');
  };

  const onclickTOCopy = (data: any) => {
    if (statuEs.value.modelType !== 'read') {
      return;
    }
    copyToClip(data);
    Message.success('已经复制到剪贴板');
  }
</script>

<template>
  <a-card>
    <a-space>
      <a-table
        :bordered="false"
        :data="tableData"
        :expandable="{
          defaultExpandAllRows: true,
        }"
        :loading="statuEs.clickLoading"
        :pagination="false"
        :size="'medium'"
        row-key="id"
      >
        <template
          #locale-filter="{
            filterValue,
            setFilterValue,
            handleFilterConfirm,
            handleFilterReset,
          }"
        >
          <div class="custom-filter">
            <a-space direction="vertical">
              <a-input
                :model-value="filterValue[0]"
                @input="(value) => setFilterValue([value])"
              />
              <div class="custom-filter-footer">
                <a-button @click="handleFilterConfirm">Confirm</a-button>
                <a-button @click="handleFilterReset">Reset</a-button>
              </div>
            </a-space>
          </div>
        </template>
        <template #columns>
          <a-space direction="vertical">
            <a-space direction="vertical">
              <a-button
                :loading="statuEs.clickLoading"
                type="primary"
                @click="addHandel"
              >
                新增Oauth2
              </a-button>
            </a-space>
            <a-divider class="split-line" style="margin: 3px" />
          </a-space>

          <a-table-column
            :filterable="{
              filter: (value, record) => record.client_name.includes(value),
              slotName: 'locale-filter',
              icon: () => h(IconSearch),
            }"
            :width="110"
            :title="$t(`syscenter.oauth2-manger.oauth2.client_name`)"
          >
            <template #cell="{ record }">
              {{ record.client_name }}
            </template>
          </a-table-column>
          <a-table-column
            :width="110"
            :title="$t(`syscenter.oauth2-manger.oauth2.client_image`)"
          >
            <template #cell="{ record }">
              <AvatarImage
                :avatar="record.client_image"
                :name="record.client_name"
              />
            </template>
          </a-table-column>
          <!--          <a-table-column-->
          <!--            :title="$t(`syscenter.oauth2-manger.oauth2.redirect_uri`)"-->
          <!--            :width="100"-->
          <!--          >-->
          <!--            <template #cell="{ record }">-->
          <!--              {{ record.redirect_uri }}-->
          <!--            </template>-->
          <!--          </a-table-column>-->
          <!--          <a-table-column-->
          <!--            :sortable="{-->
          <!--              sortDirections: ['ascend', 'descend'],-->
          <!--            }"-->
          <!--            :title="$t(`syscenter.oauth2-manger.oauth2.domain_name`)"-->
          <!--            :width="120"-->
          <!--            data-index="domain_name"-->
          <!--          ></a-table-column>-->
          <a-table-column
            :title="$t(`syscenter.oauth2-manger.oauth2.no_sert_redirect`)"
            data-index="no_sert_redirect"
            :width="109"
          >
            <template #cell="{ record }">
              <a-tag :color="record.no_sert_redirect !== 0 ? 'green' : 'red'">
                {{ record.no_sert_redirect ? '不允许' : '允许' }}</a-tag
              >
            </template>
          </a-table-column>
          <a-table-column
            :width="110"
            data-index="force_configuration_redirect"
            title="强制使用配置回调"
          >
            <template #cell="{ record }">
              <a-tag :color="record.force_configuration_redirect !== 1 ? 'green' : 'red'">
                {{ record.force_configuration_redirect ? '静态回调' : '动态回调' }}
              </a-tag
              >
            </template>
          </a-table-column>
          <a-table-column
            :ellipsis="true"
            :title="$t(`syscenter.oauth2-manger.oauth2.grant_type`)"
            :tooltip="{ position: 'top' }"
            :width="100"
            data-index="grant_type"
          ></a-table-column>
          <a-table-column
            :title="$t(`syscenter.oauth2-manger.oauth2.status`)"
            :width="100"
          >
            <template #cell="{ record }">
              <a-tag :color="getColor(record.status)">
                {{ stateChange(record.status) }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column
            :title="$t(`syscenter.oauth2-manger.oauth2.create_time`)"
            :width="130"
            data-index="create_time"
          >
          </a-table-column>
          <a-table-column
            :title="$t(`syscenter.oauth2-manger.oauth2.update_time`)"
            :width="130"
            data-index="update_time"
          >
          </a-table-column>
          <a-table-column :title="$t(`syscenter.oauth2-manger.oauth2.control`)">
            <template #cell="{ record }">
              <a-button class="button-item" @click="readMore(record)"
                >{{ $t('syscenter.oauth2-manger.oauth2.control.readinfo') }}
              </a-button>
              <a-button class="button-item" @click="editHandel(record)"
                >{{ $t('syscenter.oauth2-manger.oauth2.control.edit') }}
              </a-button>
              <a-popconfirm
                class="button-item"
                content="危险！会导致应用无法登录，确认删除?"
                @ok="delHandel(record)"
              >
                <a-button :status="'danger'"
                  >{{ $t('syscenter.oauth2-manger.oauth2.control.delete') }}
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
        <a-row :gutter="24">
          <a-col :span="9">
            <a-form-item
              :label="$t('syscenter.oauth2-manger.oauth2.form.grantType')"
              :width="130"
              field="grantType"
              label-col-flex="80px"
            >
              <a-radio-group v-model:model-value="form.grantType" :disabled="statuEs.modelType === 'read'">
                <a-radio value="code"
                  >{{
                    $t('syscenter.oauth2-manger.oauth2.form.grantType.code')
                  }}
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="15">
            <a-form-item
              field="force_configuration_redirect"
              label=""
              label-col-flex="80px"
            >
              <a-radio-group v-model:model-value="form.force_configuration_redirect"
                             :disabled="statuEs.modelType === 'read'" size="large" type="button">
                <a-radio :value="0">使用动态回调</a-radio>
                <a-radio :value="1">静态回调地址</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item
          :label="$t('syscenter.oauth2-manger.oauth2.form.clientId')"
          :tooltip="$t('syscenter.oauth2-manger.oauth2.form.clientId.tip')"
          field="locale"
          label-col-flex="100px"
        >
          <a-input
            v-if="statuEs.modelType !== 'add'"
            v-model="form.clientId"
            :placeholder="
                  $t('syscenter.oauth2-manger.oauth2.form.tip.clientId')
                "
            :readonly="statuEs.modelType === 'read'"
            v-on:click="onclickTOCopy(form.clientId)"
          />
          <a-tag v-else
          >此项为系统自动生成，成功添加后查看更多即可获得!
          </a-tag
          >
        </a-form-item>
        <a-form-item
          :label="$t('syscenter.oauth2-manger.oauth2.form.clientName')"
          field="clientName"
          label-col-flex="80px"
        >
          <a-input
            v-model="form.clientName"
            :placeholder="
                  $t('syscenter.oauth2-manger.oauth2.form.tip.clientName')
                "
            :readonly="statuEs.modelType === 'read'"
          />
        </a-form-item>
        <a-form-item
          :label="$t('syscenter.oauth2-manger.oauth2.form.clientSecret')"
          field="clientSecret"
          label-col-flex="100px"
        >
          <a-input
            v-if="statuEs.modelType !== 'add'"
            v-model="form.clientSecret"
            :placeholder="
                  $t('syscenter.oauth2-manger.oauth2.form.tip.clientSecret')
                "
            :readonly="statuEs.modelType === 'read'"

            v-on:click="onclickTOCopy(form.clientSecret)"
          />
          <a-tag v-else
          >此项为系统自动生成，成功添加后查看更多即可获得!
          </a-tag
          >
        </a-form-item>
        <a-form-item
          :label="$t('syscenter.oauth2-manger.oauth2.form.redirect_uri')"
          :width="130"
          field="redirectUri"
          label-col-flex="80px"
        >
          <a-input
            v-model="form.redirectUri"
            :placeholder="
                  $t('syscenter.oauth2-manger.oauth2.form.tip.redirect_uri')
                "
            :readonly="statuEs.modelType === 'read'"
          />
        </a-form-item>
        <a-form-item
          :label="$t('syscenter.oauth2-manger.oauth2.form.domain_name')"
          field="domainName"
          label-col-flex="100px"
        >
          <a-input
            v-model="form.domainName"

            :placeholder="
                  $t('syscenter.oauth2-manger.oauth2.form.tip.domain_name')
                "
            :readonly="statuEs.modelType === 'read'"
          />
        </a-form-item>
        <a-row :gutter="20">
          <a-col :span="6">
            <a-form-item
              :label="$t('syscenter.oauth2-manger.oauth2.form.client_image')"
              field="clientImage"
              :disabled="statuEs.modelType === 'read'"
              label-col-flex="50px"
            >
              <ImageUpload
                :draggable="true"
                :image="form.clientImage"
                url="./api/common/uploadimage"
                @on-success="imageHandleSuccess"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              :label="$t('syscenter.oauth2-manger.oauth2.form.noSertRedirect')"
              field="type"
              :disabled="statuEs.modelType === 'read'"
              label-col-flex="50px"

            >
              <a-radio-group v-model:model-value="form.noSertRedirect">
                <a-radio :value="1"
                  >{{
                    $t('syscenter.oauth2-manger.oauth2.form.noSertRedirect.1')
                  }}
                </a-radio>
                <a-radio :value="0"
                  >{{
                    $t('syscenter.oauth2-manger.oauth2.form.noSertRedirect.0')
                  }}
                </a-radio>
              </a-radio-group>
            </a-form-item>

          </a-col>
          <a-col :span="8">
            <a-form-item
              :label="$t('syscenter.oauth2-manger.oauth2.form.status')"
              field="status"
              :disabled="statuEs.modelType === 'read'"
              label-col-flex="60px"

            >
              <a-radio-group v-model:model-value="form.status">
                <a-radio :value="1"
                >{{ $t('syscenter.oauth2-manger.oauth2.form.status.1') }}
                </a-radio>
                <a-radio :value="0"
                >{{ $t('syscenter.oauth2-manger.oauth2.form.status.0') }}
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </a-card>
</template>

<style lang="less" scoped>
  .button-item {
    margin-inline-end: 3px;
  }
</style>
