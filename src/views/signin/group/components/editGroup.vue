<script lang="ts" setup>
import {ref} from 'vue';
import {listBcRule, signinDeviceList, updateGroupRule,} from '@/api/signin';
import WeekSelector from '@/views/signin/group/components/weekSelect.vue';
import AddUser from '@/views/signin/group/components/addUser.vue';
import AddDevice from '@/views/signin/group/components/addDevice.vue';
import {Message} from '@arco-design/web-vue';

const emit = defineEmits(['success']);
const props = defineProps({
  signin: {
    default: {},
  },
});

const kqsjNumbei = ref(1);
const selectUserState = ref(false);
const selectSigninWayState = ref(false);
const selectDevice = ref([]);
const allDeviceList = ref([]);
const groupRule = ref({
  signinGroup: {
    name: '',
    id: '',
    rev: '',
  },
  signinGroupRule: {
    rulesInfo: {
      userIds: [],
      signinType: 0,
      signinWays: [],
      kqsj: [
        {
          xq: '',
          bcId: '',
        },
      ],
    },
  },
  onlyBasic: false,
});
if (props.signin) {
  // eslint-disable-next-line vue/no-setup-props-destructure
  const signinGroupCopy = props.signin?.signinGroup;
  groupRule.value.signinGroup = signinGroupCopy;
  // eslint-disable-next-line vue/no-setup-props-destructure
  const signinGroupRuleCopy = props.signin?.signinGroupRule;
  const asda3ewq = JSON.parse(JSON.stringify(signinGroupRuleCopy));
  groupRule.value.signinGroupRule = asda3ewq;
  // eslint-disable-next-line vue/no-setup-props-destructure
  for (
      let i = 0;
      i < props.signin?.signinGroupRule.rulesInfo.signinWays.length;
      i++
  ) {
    selectDevice.value.push(
        String(props.signin?.signinGroupRule.rulesInfo.signinWays[i].deviceId)
    );
  }
}
const bcList = ref([]);
const initBc = async () => {
  const {data} = await listBcRule();
  bcList.value = data;
};
initBc();

const everyDayChange = (newC, OldC) => {
  const needCount = newC;

  const newList = [];
  for (let i = 1; i <= needCount; i += 1) {
    const moban = {
      xq: '',
      bcId: '',
    };
    newList.push(moban);
  }
  groupRule.value.signinGroupRule.rulesInfo.kqsj = newList;
};
const initDevice = async () => {
  const {data} = await signinDeviceList();
  allDeviceList.value = data;
};
initDevice();
// const addBC = async () => {
//   const data = await addBc(bcForm);
//   Message.success(data.msg);
// };
const shareChuli = (item, index) => {
  console.log(item);
  console.log(index);
  const wukongge = [];
  let wukonggeS = '';
  for (let i = 0; i < item.length; i++) {
    if (item[i] !== '') {
      wukongge.push(String(item[i]).trim());
      wukonggeS += String(item[i]) + ',';
    }
  }
  if (wukonggeS.endsWith(',')) {
    groupRule.value.signinGroupRule.rulesInfo.kqsj[index].xq =
        wukonggeS.slice(0, wukonggeS.length - 1);
  } else {
    groupRule.value.signinGroupRule.rulesInfo.kqsj[index].xq = wukonggeS;
  }

  // 去除其余选择该星期的
  for (
      let i = 0;
      i < groupRule.value.signinGroupRule.rulesInfo.kqsj.length;
      i++
  ) {
    if (i === index) {
      // eslint-disable-next-line no-continue
      continue;
    }
    const asfaa =
        groupRule.value.signinGroupRule.rulesInfo.kqsj[i].xq.split(',');
    const newsax = [];
    if (asfaa.some((item) => wukongge.includes(item))) {
      for (let j = 0; j < asfaa.length; j++) {
        if (!wukongge.includes(asfaa[j])) {
          newsax.push(asfaa[j].trim());
        }
      }
      groupRule.value.signinGroupRule.rulesInfo.kqsj[i].xq = newsax.join(',');
    }
  }
};

const selectUser = () => {
  selectUserState.value = true;
};
const selectSigninWay = () => {
  selectSigninWayState.value = true;
};
const updateSigninGroup = async () => {
  if (groupRule.value.signinGroupRule.rulesInfo.signinWays.length === 0) {
    Message.info('请保证最少绑定一个设备且至少绑定一种方式!');
    return;
  }
  if (groupRule.value.signinGroup.name === '') {
    Message.info('请提供考勤组名称');
    return;
  }
  if (groupRule.value.signinGroup.id === '') {
    Message.info('请提供考勤组id');
    return;
  }
  if (groupRule.value.signinGroupRule.rulesInfo.kqsj.length < 1) {
    Message.info('请至少选择一个时间考勤');
    return;
  }
  for (
      let j = 0;
      j < groupRule.value.signinGroupRule.rulesInfo.kqsj.length;
      j += 1
  ) {
    if (
        groupRule.value.signinGroupRule.rulesInfo.kqsj[j].xq === '' ||
        groupRule.value.signinGroupRule.rulesInfo.kqsj[j].bcId === ''
    ) {
      Message.info('请保证排版班次不能为空');
      return;
    }
  }
  const data = await updateGroupRule(groupRule.value);
  Message.success(data.msg);
  emit('success');
};
const userSelectSuccess = (userList) => {
  groupRule.value.signinGroupRule.rulesInfo.userIds = userList;
  selectUserState.value = false;
};
const waySelectSuccess = (wayObject) => {
  // 需要传出type和deviceId
  // groupRule.signinGroupRule.rulesInfo.userIds = userList;
  selectDevice.value.push(wayObject);
  selectSigninWayState.value = false;
};
const updateDeviceWay = (value, deviceId) => {
  let zhaodao = 0;
  if (value.length > 0) {
    for (
        let i = 0;
        i < groupRule.value.signinGroupRule.rulesInfo.signinWays.length;
        i += 1
    ) {
      if (
          groupRule.value.signinGroupRule.rulesInfo.signinWays[i].deviceId ===
          deviceId
      ) {
        zhaodao = 1;
        groupRule.value.signinGroupRule.rulesInfo.signinWays[i].type =
            value.join(',');
        break;
      }
    }
    if (zhaodao === 0) {
      // 没找到
      groupRule.value.signinGroupRule.rulesInfo.signinWays.push({
        deviceId: deviceId,
        type: value.join(','),
      });
    }
  } else {
    const copyDeviceList = [];
    for (
        let i = 0;
        i < groupRule.value.signinGroupRule.rulesInfo.signinWays.length;
        i += 1
    ) {
      if (
          groupRule.value.signinGroupRule.rulesInfo.signinWays[i].deviceId ===
          deviceId
      ) {
        zhaodao = 1;
      } else {
        copyDeviceList.push(
            groupRule.value.signinGroupRule.rulesInfo.signinWays[i]
        );
      }
    }
    if (zhaodao === 1) {
      groupRule.value.signinGroupRule.rulesInfo.signinWays = copyDeviceList;
    }
  }
};
</script>

<template>
  <a-card class="add-bc">
    <div class="title-info">
      <a-tag>请注意</a-tag>
    </div>
    <div class="box-card">
      <div>
        <a-form
            ref="loginForm"
            :model="groupRule"
            autocomplete="off"
            class="login-form"
            layout="vertical"
        >
          <div style="display: flex">
            <div style="width: 300px">
              <a-form-item
                  :rules="[{ required: true, message: '考勤组名称必填' }]"
                  label="考勤组名称[不可重复]"
              >
                <a-input
                    v-model="groupRule.signinGroup.name"
                    autocomplete="off"
                >
                </a-input>
              </a-form-item>
              <a-form-item
                  :rules="[{ required: true, message: '考勤时间规则条数' }]"
                  label="考勤时间规则条数"
              >
                <a-input-number
                    v-model="kqsjNumbei"
                    :max="3"
                    :min="1"
                    autocomplete="off"
                    @change="everyDayChange"
                >
                </a-input-number>
              </a-form-item>
              <a-form-item
                  :rules="[{ required: true, message: '考勤用户' }]"
                  label="考勤用户"
              >
                <div style="display: flex; flex-direction: column">
                  <a-tag :color="'green'"
                  >已选择{{
                      groupRule.signinGroupRule.rulesInfo.userIds.length
                    }}位用户
                  </a-tag>
                  <a-button @click="selectUser">选择用户</a-button>
                </div>
              </a-form-item>
              <a-form-item
                  :rules="[{ required: true, message: '打卡方式' }]"
                  label="打卡方式"
              >
                <div style="display: flex; flex-direction: column">
                  自定义一个组件，点击按钮打开添加，添加里面能看到所有设备，选定设备，下面多选方式解析出来，可以多选，确定添加，每次只能添加一个设备
                  <ul>
                    <li v-for="deviceId in selectDevice" :key="deviceId"
                    >{{
                        allDeviceList.map((ata) => {
                          if (ata.deviceId === deviceId) {
                            return ata.name;
                          }
                        })[0]
                      }}[方式:
                      <a-checkbox-group
                          :default-value="
                          groupRule.signinGroupRule.rulesInfo.signinWays.map(
                            (way) => {
                              if (way.deviceId === deviceId) {
                                return way.type;
                              }
                            }
                          )
                        "
                          @change="(value) => updateDeviceWay(value, deviceId)"
                      >
                        <a-checkbox
                            v-for="way in allDeviceList.map((ata) => {
                            if (ata.deviceId === deviceId) {
                              return ata.support.split(',');
                            }
                          })[0]"
                            :key="way"
                            :value="way"
                        >{{ way }}
                        </a-checkbox>
                      </a-checkbox-group>
                      ]
                    </li>
                  </ul>
                  <a-button @click="selectSigninWay">选择打卡方式</a-button>
                </div>
              </a-form-item>
            </div>

            <div style="display: flex; flex-direction: column">
              <div> 考勤时间</div>
              <div style="display: flex">
                <div
                    v-for="(item, key) in groupRule.signinGroupRule.rulesInfo
                    .kqsj"
                    :key="key"
                    class="time-card"
                >
                  <div> 规则{{ key + 1 }}</div>
                  <a-form-item
                      :rules="[{ required: true, message: '请设置星期' }]"
                      :validate-trigger="['change', 'blur']"
                      label="星期"
                  >
                    <week-selector
                        :index="key"
                        :value="
                        groupRule.signinGroupRule.rulesInfo.kqsj[key].xq
                          ? groupRule.signinGroupRule.rulesInfo.kqsj[
                              key
                            ].xq.split(',')
                          : []
                      "
                        @input="shareChuli"
                    />
                  </a-form-item>
                  <a-form-item
                      :rules="[{ required: true, message: '' }]"
                      :validate-trigger="['change', 'blur']"
                      label="排班"
                  >
                    <a-select
                        v-model="
                        groupRule.signinGroupRule.rulesInfo.kqsj[key].bcId
                      "
                    >
                      <a-option v-for="bc in bcList" :key="bc.id" :value="bc.id"
                      >{{ bc.name }}(每天{{ bc.everyDay }}班)
                      </a-option>
                    </a-select>
                  </a-form-item>
                </div>
              </div>
            </div>
          </div>
        </a-form>
      </div>
      <div class="button_group">
        <a-button @click="updateSigninGroup">更新</a-button>
      </div>
    </div>
    <div>
      <a-modal
          v-model:visible="selectUserState"
          :esc-to-close="false"
          :footer="false"
          :mask-closable="false"
          :width="1300"
          title="选择用户"
      >
        <add-user @commit-user="userSelectSuccess"/>
      </a-modal>
      <a-modal
          v-model:visible="selectSigninWayState"
          :esc-to-close="false"
          :footer="false"
          :mask-closable="false"
          :width="1300"
          title="添加打卡方式"
      >
        <add-device :added="selectDevice" @commit-way="waySelectSuccess"/>
      </a-modal>
    </div>
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
