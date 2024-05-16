<script lang="ts" setup>
import {computed, reactive} from 'vue';
import {updateSigninDevice,} from '@/api/signin';
import {Message} from '@arco-design/web-vue';

const props = defineProps({
  device: null,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits(['success']);

if (props?.device === null) {
  Message.error('参数异常');
}

const deviceFrom = reactive({
  name: '',
  deviceId: '',
  secret: '',
  support: '',
  remark: '',
});
const device = computed(() => {
  return props.device;
});
deviceFrom.name = device.value.name;
deviceFrom.deviceId = device.value.deviceId;
deviceFrom.secret = device.value.secret;
deviceFrom.support = device.value.support;
deviceFrom.remark = device.value.remark;

const updateDevice = async () => {
  const data = await updateSigninDevice(deviceFrom);
  Message.success(data.data);
  emit('success');
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
                  <a-tag>{{
                      deviceFrom.name ? deviceFrom.name : '暂未选择'
                    }}
                  </a-tag>
                </div>
              </div>
              <div>
                设备方式
                <div v-if="deviceFrom.support !== ''">
                  <a-tag
                    v-for="item in deviceFrom.support.split(',')"
                    :key="item"
                  >{{ item }}
                  </a-tag
                  >
                </div>
                <a-empty v-else/>
              </div>
            </div>
          </div>
        </a-form>
      </div>
      <div class="button_group">
        <a-button @click="updateDevice">更新</a-button>
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
