<script lang="ts" setup>
import {reactive, ref} from 'vue';
import {addSigninDevice, signinCanBindDeviceList} from '@/api/signin';
import {Message} from "@arco-design/web-vue";

const deviceFrom = reactive({
  name: '',
  deviceId: '',
  secret: '',
  support: '',
  remark: '',
});

const selectDevice = ref();
const selectDeviceSupport = ref([]);
const xuanze = ref([]);
const selectDeviceList = ref([]);
const initData = async () => {
  const {data} = await signinCanBindDeviceList();
  selectDeviceList.value = data;
};
initData();
const addDevice = async () => {
  const data = await addSigninDevice(deviceFrom);
  Message.success(data.data);
  initData();
};

const setSelectDevice = () => {
  deviceFrom.deviceId = selectDevice.value?.deviceId;
  deviceFrom.name = selectDevice.value?.name;
  if (selectDevice.value?.support === '') {
    selectDeviceSupport.value = [];
    deviceFrom.support = '';
  } else {
    selectDeviceSupport.value = selectDevice.value?.support.split(',');
    const templist = [];
    for (let i = 0; i < selectDeviceSupport.value.length; i+=1) {
      if (selectDeviceSupport.value[i]){
        templist.push(selectDeviceSupport.value[i])
      }
    }
    selectDeviceSupport.value = templist;
    deviceFrom.support = selectDeviceSupport.value.join(',');
  }

  xuanze.value = selectDeviceSupport.value;
};
const updateDeviceWay = (value: any) => {
  deviceFrom.support = xuanze.value.join(',');
};
</script>

<template>
  <a-card class="add-bc">
    <div class="title-info">
      <!--      <a-tag>-->
      <!--        请注意，班次的上下班时间必须顺着时间轴，上一班的下班时间必须早于本班的上班时间。每个班次内的上下班时间也必须满足顺序，否则会导致打卡失败!-->
      <!--      </a-tag>-->
    </div>
    <div class="box-card">
      <div>
        <a-form
          :model="deviceFrom"
          autocomplete="off"
          class="login-form"
          layout="vertical"
        >
          <div style="display: flex">
            <div style="display: flex">
              <div style="width: 300px">
                <a-form-item label="设备选择">
                  <a-select
                    v-model="selectDevice"
                    autocomplete="off"
                    @change="setSelectDevice"
                  >
                    <a-option
                      v-for="(item, index) in selectDeviceList"
                      :key="index"
                      :value="item"
                    >{{ item.deviceId }}
                    </a-option
                    >
                    <template #empty>
                      <a-empty>
                        当前无未绑定的在线设备，请刷新页面重试
                      </a-empty>
                    </template>
                  </a-select>
                </a-form-item>
                <a-form-item label="设备密钥">
                  <a-input
                    v-model="deviceFrom.secret"
                    autocomplete="off"
                  ></a-input>
                </a-form-item>
                <a-form-item label="设备备注">
                  <a-input
                    v-model="deviceFrom.remark"
                    autocomplete="off"
                  ></a-input>
                </a-form-item>
              </div>
            </div>
            <div style="padding-left: 10px">
              <div>
                设备名称
                <div>

                  <a-input v-model:model-value="deviceFrom.name"></a-input>
                </div>
              </div>
              <div>
                设备方式
                <div>
                  <a-checkbox-group
                    v-model:model-value="xuanze"
                    @change="(value) => updateDeviceWay(value)"
                  >
                    <a-checkbox
                      v-for="way in selectDeviceSupport"
                      :key="way"
                      :value="way"
                    >{{ way }}
                    </a-checkbox>
                  </a-checkbox-group>
                  <a-empty v-if="selectDeviceSupport.length===0">暂未选择</a-empty>
                </div>
              </div>
            </div>
          </div>
        </a-form>
      </div>
      <div class="button_group">
        <a-button @click="addDevice">添加</a-button>
      </div>
    </div>
    <div></div>
  </a-card>
</template>

<style scoped>
.add-bc {
  padding: 10px 10px 10px 10px;
  border: 1px #f0f0f0 solid;
  background-color: #ffffff;
}

.box-card {
  display: flex;
  flex-direction: column;
}

.title {
  border-bottom: #f0f0f0 1px solid;
  font-size: 20px;
}

.button_group {
}

.time-card {
  width: 400px;
  border: 1px #0085f1 solid;
  padding: 3px 3px 3px 3px;
  margin-left: 10px;
}
</style>
