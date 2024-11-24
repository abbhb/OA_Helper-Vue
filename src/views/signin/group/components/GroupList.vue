<script lang="ts" setup>
  import { computed, h, reactive, ref } from 'vue';
  import { IconSearch } from '@arco-design/web-vue/es/icon';
  import { useAppStore } from '@/store';
  import {
    deleteGroupRule,
    listGroupRule,
    SigninBc,
    SigninGroupDto,
  } from '@/api/signin';
  import AddGroup from '@/views/signin/group/components/addGroup.vue';
  import EditGroup from '@/views/signin/group/components/editGroup.vue';
  import { Message } from '@arco-design/web-vue';
  import router from '@/router';
  import { useCachedStore } from '@/store/modules/chat/cached';
  import { useUserInfo } from '@/hooks/chat/useCached';
  import Avatars from '@/components/Avatars/src/Avatars.vue';
  import { AvatarItem } from '@/components/Avatars';
  import useSigninStore from '@/store/modules/signin';

  const appStore = useAppStore();
  const cacheStore = useCachedStore();
  const signinStore = useSigninStore();

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
    modelTitle: '考勤组通知',
    modelType: 'add',
  });
  const tableData = ref<SigninGroupDto[]>([]);
  const avatarMap = new Map<string, AvatarItem[]>();

  const initAvatarMap = (table: SigninGroupDto[]) => {
    // 添加头像信息
    for (let i = 0; i < table.length; i += 1) {
      const avatars: AvatarItem[] = [];
      if (table[i]?.signinGroupRule?.rulesInfo?.userIds?.length > 0) {
        cacheStore.getBatchUserInfo(
          table[i]?.signinGroupRule?.rulesInfo?.userIds
        );
      }
      for (
        let j = 0;
        j < table[i]?.signinGroupRule?.rulesInfo?.userIds?.length;
        j += 1
      ) {
        if (table[i]?.signinGroupRule?.rulesInfo?.userIds[j]) {
          const itemUser = useUserInfo(
            table[i]?.signinGroupRule?.rulesInfo?.userIds[j]
          );
          const itemAvatar: AvatarItem = {
            url: itemUser.value.avatar,
            name: itemUser.value.name,
          };
          avatars.push(itemAvatar);
        }
      }
      avatarMap.set(String(table[i]?.signinGroup.id), avatars);
    }
  };
  const form = reactive({
    id: '',
    label: '',
    image: '',
    sort: 1,
    extra: '',
  });

  const initData = async () => {
    statuEs.value.clickLoading = true;
    const { data } = await listGroupRule();
    tableData.value = data;
    initAvatarMap(data);
    statuEs.value.clickLoading = false;
  };
  initData();
  const addHandel = (record) => {
    statuEs.value.modelTitle = '添加考勤组';
    statuEs.value.modelType = 'add';
    statuEs.value.model = true;
  };

  const editHandel = (record) => {
    statuEs.value.modelTitle = '编辑考勤组';
    statuEs.value.modelType = 'edit';
    statuEs.value.modelContent = record;
    statuEs.value.model = true;
  };

  const readSigninData = (record) => {
    console.log('查看考勤数据');
    console.log(record);
    router.push({
      name: 'SigninDataRead',
      query: {
        groupId: record.signinGroup.id,
      },
    });
  };

  const mangerHolidays = (record) => {
    console.log('管理节假日');
    console.log(record);
    router.push({
      name: 'MangerHolidays',
      query: {
        groupId: record.signinGroup.id,
      },
    });
  };

  const cleanForm = () => {
    form.id = '';
    form.sort = 1;
    form.label = '';
    form.image = '';
    form.extra = '';
  };
  const delHandel = async (record) => {
    const data = await deleteGroupRule(record.signinGroup.id);
    Message.success(data.msg);
    await initData();
  };

  const handleCancel = () => {
    cleanForm();
  };

  const updateSuccess = () => {
    statuEs.value.model = false;
    initData();
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
            <ul>
              <li> 注意每个用户最多同时只能处于一个考勤组下!!![需完善校验] </li>
              <li> 规则展示可以优化 </li>
            </ul>

            <a-space direction="vertical">
              <a-button
                :loading="statuEs.clickLoading"
                type="primary"
                @click="addHandel"
              >
                添加考勤组
              </a-button>
            </a-space>
            <a-divider class="split-line" style="margin: 3px" />
          </a-space>

          <a-table-column
            :filterable="{
              filter: (value, record) => record.label.includes(value),
              slotName: 'locale-filter',
              icon: () => h(IconSearch),
            }"
            :width="200"
            title="考勤组名"
          >
            <template #cell="{ record }">
              {{ record.signinGroup.name }}
            </template>
          </a-table-column>
          <a-table-column :width="50" title="版本">
            <template #cell="{ record }">
              {{ record.signinGroupRule.rev }}
            </template>
          </a-table-column>
          <a-table-column
            :filterable="{
              filter: (value, record) => record.label.includes(value),
              slotName: 'locale-filter',
              icon: () => h(IconSearch),
            }"
            :width="400"
            title="规则"
          >
            <template #cell="{ record }">
              <ul>
                <li v-for="kq in record?.signinGroupRule?.rulesInfo
              ?.kqsj" :key="'kqsji11'+kq.xq">
                  星期{{kq.xq.split(',')}}班次ID:{{kq.bcId}}
                </li>

              </ul>
            </template>
          </a-table-column>
          <a-table-column :width="150" title="考勤设备">
            <template #cell="{ record }">
              <ul>
                <li
                  v-for="device in record?.signinGroupRule?.rulesInfo
                    ?.signinWays"
                  :key="device.deviceId"
                  >{{ signinStore.getDeviceById(device?.deviceId)?.name }}[方式:
                  <a-checkbox-group
                    :disabled="true"
                    :default-value="
                      record?.signinGroupRule?.rulesInfo?.signinWays?.map(
                        (way) => {
                          if (way.deviceId === device?.deviceId) {
                            return way.type;
                          }
                        }
                      )
                    "
                  >
                    <a-checkbox
                      v-for="way in signinStore
                        .getDeviceById(device?.deviceId)
                        ?.support.split(',')"
                      :key="way"
                      :value="way"
                      >{{ way }}
                    </a-checkbox>
                  </a-checkbox-group>
                  ]
                </li>
              </ul>
            </template>
          </a-table-column>

          <a-table-column :width="150" title="成员">
            <template #cell="{ record }">
              <Avatars
                :data="avatarMap.get(record.signinGroup.id)"
                drec="更多成员"
                :max="10"
              ></Avatars>
            </template>
          </a-table-column>
          <a-table-column title="操作">
            <template #cell="{ record }">
              <el-button
                class="margin_left"
                :type="'primary'"
                @click="readSigninData(record)"
                >查看统计数据</el-button
              >
              <el-button
                class="margin_left"
                :type="'primary'"
                @click="mangerHolidays(record)"
                >节假日管理</el-button
              >
              <a-button class="margin_left" @click="editHandel(record)"
                >编辑</a-button
              >
              <a-popconfirm
                content="危险！将会删除该考勤组且不可恢复，确认删除?"
                @ok="delHandel(record)"
              >
                <a-button class="margin_left">删除</a-button>
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
      <add-group v-if="statuEs.modelType === 'add'" @success="updateSuccess" />
      <edit-group
        v-else
        :signin="statuEs.modelContent"
        @success="updateSuccess"
      />
    </a-modal>
  </a-card>
</template>

<style lang="less" scoped>
  .margin_left {
    margin-left: 3px;
  }
</style>
