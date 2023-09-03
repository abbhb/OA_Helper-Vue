<script lang="ts" setup>
import {reactive, ref} from 'vue';
import {addGroup, Duplicate, getCanBeAdd, GroupUser, isDuplicate,} from '@/api/group';
import {reject} from 'lodash';
import {Message} from '@arco-design/web-vue';

const formRef = ref();
  const transferDataS = ref([]);
  const treeData = ref([]);
  const selectUser = ref([]);
  const form = reactive({
    name: '',
    id: '',
  });
  const emit = defineEmits(['close']);
  const rules = [
    {
      validator: (value, cb) => {
        return new Promise<Duplicate>((resolve) => {
          if (!value) {
            cb('name must not be null');
          }
          isDuplicate(value)
            .then((data) => {
              if (data.data.isDuplicate) {
                resolve(data.data);
              } else {
                cb(data.data.why);
                resolve(data.data);
              }
            })
            .catch((e) => {
              reject(e);
            });
        });
      },
    },
  ];
  const getTransferData = (treeDataa = [], transferDataSource = []) => {
    treeDataa.forEach((item) => {
      if (item.children) getTransferData(item.children, transferDataSource);
      else transferDataSource.push({ label: item.title, value: item.key });
    });
    return transferDataSource;
  };

  const getTreeData = (data = []) => {
    const values = data.map((item) => item.value);
    const travel = (_treeData = []) => {
      const treeDataSource = [];
      _treeData.forEach((item) => {
        if (item.children || values.includes(item.key)) {
          treeDataSource.push({
            title: item.title,
            key: item.key,
            children: travel(item.children),
          });
        }
      });
      return treeDataSource;
    };
    return travel(treeData.value);
  };
  const value = [];

  const initData = async () => {
    const { data } = await getCanBeAdd();
    treeData.value = data;
    transferDataS.value = getTransferData(data);
  };
  initData();

  // 更新或者新建都是此按钮
  const handleClick = async () => {
    // 调试代码
    // formRef.value.setFields({
    //   name: {
    //     status: 'error',
    //     message: 'async name error',
    //   },
    // });
    if (form.name === '') {
      formRef.value.setFields({
        name: {
          status: 'error',
          message: '不能为空',
        },
      });
      return;
    }
    const auserList = ref<GroupUser[]>([]);
    selectUser.value.forEach((item) => {
      const auser = ref<GroupUser>({ userId: '' });
      auser.value.userId = item;
      auserList.value.push(auser.value);
    });
    const data = await addGroup({
      name: form.name,
      groupUserList: auserList.value,
    });
    Message.success(data.msg);
    emit('close');
  };

  const styleHeader = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '8px',
  };
</script>

<template>
  <div>
    <a-scrollbar style="height: 500px; overflow-y: auto">
      <div class="hir">
        <div class="shu">
          <a-form ref="formRef" :model="form" :style="{ width: '600px' }">
            <a-form-item
              :label="$t('syscenter.group.name')"
              :rules="rules"
              field="name"
            >
              <a-input
                v-model="form.name"
                :placeholder="$t('syscenter.group.name.tip')"
              />
            </a-form-item>
            <a-form-item>
              <a-button @click="handleClick"
              >{{ $t('syscenter.group.add.button') }}
              </a-button>
            </a-form-item>
          </a-form>
        </div>
        <div class="shu">
          <a-transfer
            v-model:model-value="selectUser"
            :data="transferDataS"
            :default-value="value"
            show-search
          >
            <template
              #source-title="{
                countTotal,
                countSelected,
                checked,
                indeterminate,
                onSelectAllChange,
              }"
            >
              <div :style="styleHeader">
                待添加 {{ countSelected }}-{{ countTotal }}
                <a-checkbox
                  :indeterminate="indeterminate"
                  :model-value="checked"
                  @change="onSelectAllChange"
                />
              </div>
            </template>
            <template #source="{ data, selectedKeys, onSelect }">
              <a-tree
                :checkable="true"
                :checked-keys="selectedKeys"
                :data="getTreeData(data)"
                checked-strategy="child"
                @check="onSelect"
              />
            </template>
            <template
              #target-title="{
                countTotal,
                countSelected,
                checked,
                indeterminate,
                onSelectAllChange,
              }"
            >
              <div :style="styleHeader">
                已添加 {{ countSelected }}-{{ countTotal }}
                <a-checkbox
                  :indeterminate="indeterminate"
                  :model-value="checked"
                  @change="onSelectAllChange"
                />
              </div>
            </template>
          </a-transfer>
        </div>
      </div>
    </a-scrollbar>
  </div>
</template>

<style lang="less" scoped>
  .hir {
    display: flex;
    flex-direction: row;
    height: 100%;
  }

  .shu {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
  }

  .arco-transfer-view {
    height: 400px;
  }
</style>
