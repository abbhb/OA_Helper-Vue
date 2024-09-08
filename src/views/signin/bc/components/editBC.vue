<script lang="ts" setup>
  import { computed, reactive } from 'vue';
  import { editBc } from '@/api/signin';
  import { Message } from '@arco-design/web-vue';
  import Timeline from "@/views/signin/bc/components/Timeline.vue";

  const props = defineProps({
    signin: null,
  });
  const emit = defineEmits(['success']);

  if (props?.signin === null) {
    Message.error('参数异常');
  }

  const bcForm = reactive({
    id: '',
    name: '',
    everyDay: 1,
    rules: [
      {
        count: 1,
        sbTime: '',
        sbStartTime: 30,
        sbEndTime: 0,
        xbTime: '',
        xbStartTime: 30,
        xbEndTime: 60,
        ciRi: 0,
        lianban: false,
      },
    ],
  });
  const signin = computed(() => {
    return props.signin;
  });
  bcForm.id = signin.value.id;
  bcForm.name = signin.value.name;
  bcForm.everyDay = signin.value.everyDay;
  bcForm.rules = signin.value.rules;

  const bcRulesR = ()=>{
    for (let i = 0; i < bcForm.rules.length; i++) {
      if (!bcForm.rules[i].lianban){
        bcForm.rules[i].lianban = false;
      }
    }
  }
  bcRulesR();
  const everyDayChange = (newC, OldC) => {
    const needCount = newC;

    const newList = [];
    for (let i = 1; i <= needCount; i += 1) {
      const moban = {
        count: i,
        sbTime: '',
        sbStartTime: 30,
        sbEndTime: 0,
        xbTime: '',
        xbStartTime: 30,
        xbEndTime: 60,
        ciRi: 0,
        lianban: false,
      };
      newList.push(moban);
    }
    bcForm.rules = newList;
    console.log(bcForm);
  };

  const updateBC = async () => {
    const data = await editBc(bcForm);
    Message.success(data.msg);
    emit('success');
  };

  const chanjiLianban = (count:number) => {
    if (bcForm.rules[count - 1].lianban){
      // 开
      bcForm.rules[count].sbStartTime = 0
      bcForm.rules[count].sbEndTime = 1
    }else {
      // 关
    }
  }
</script>

<template>
  <a-card class="add-bc">
    <div class="title-info">
      <a-tag
        >请注意，班次的上下班时间必须顺着时间轴，上一班的下班时间必须早于本班的上班时间。每个班次内的上下班时间也必须满足顺序，否则会导致打卡失败!
      </a-tag>
      <a-tag
        color="blue"
      >左闭右开，例如刚好18：00签到，第二班在这个点结束，第三班最早这个点开始，只算第三班哦~
      </a-tag>
    </div>
    <div class="box-card">
      <div>
        <Timeline :rules="bcForm.rules" />


        <a-form
          ref="loginForm"
          :model="bcForm"
          autocomplete="off"
          class="login-form"
          layout="vertical"
        >
          <div style="display: flex">
            <div style="width: 300px">
              <a-form-item
                :rules="[{ required: true, message: '班次名称必填' }]"
                :validate-trigger="['change', 'blur']"
                field="name"
                label="班次名称[不可重复]"
              >
                <a-input v-model="bcForm.name" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item
                :rules="[{ required: true, message: '一天几次上下班' }]"
                :validate-trigger="['change', 'blur']"
                field="everyDay"
                label="一天几次上下班"
              >
                <a-input-number
                  v-model="bcForm.everyDay"
                  :max="3"
                  :min="1"
                  autocomplete="off"
                  @change="everyDayChange"
                >
                </a-input-number>
              </a-form-item>
            </div>

            <div
              v-for="item in bcForm.rules"
              :key="item.count"
              class="time-card"
            >
              <div> 第{{ item.count }}班</div>

                <div>
                  <a-tag color="red" v-if="item.count!==1&&bcForm.rules[item.count - 2].lianban">
                  此班次的上班与上一班次的下班进行连班!
                  </a-tag>
                  <a-tag color="red" v-if="item.count!==1&&bcForm.rules[item.count - 2].lianban">

                  意思为在上个班次下班期间一次打卡即可完成本个班次上班，无需重复打卡!（早退不算哦，只算下班时间到下班后允许打卡时间）
                  </a-tag>
                </div>

              <a-form-item
                :rules="[{ required: true, message: '请设置上班时间' }]"
                :validate-trigger="['change', 'blur']"
                label="上班时间"
              >

                <a-time-picker
                  v-model="bcForm.rules[item.count - 1].sbTime"
                  :disabled-seconds="
                    () => [
                      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                      18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
                      32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45,
                      46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
                      60,
                    ]
                  "
                  style="width: 194px; margin: 0 24px 24px 0"
                />
              </a-form-item>
              <a-form-item
                :rules="[{ required: true, message: '必填,不允许就填0' }]"
                :validate-trigger="['change', 'blur']"
                label="上班前多少分钟允许打卡"
                :disabled="item.count!==1&&bcForm.rules[item.count - 2].lianban"

              >
                <a-input-number
                  v-model="bcForm.rules[item.count - 1].sbStartTime"
                  :max="360"
                  :min="0"
                  autocomplete="off"
                >
                </a-input-number>
              </a-form-item>
              <a-form-item
                :rules="[
                  { required: true, message: '上班后允不允许迟到，不允许填0' },
                ]"
                :validate-trigger="['change', 'blur']"
                label="上班后多少分钟允许打卡[算迟到，不算旷]"
                :disabled="item.count!==1&&bcForm.rules[item.count - 2].lianban"

              >
                <a-input-number
                  v-model="bcForm.rules[item.count - 1].sbEndTime"
                  :max="360"
                  :min="0"
                  autocomplete="off"
                >
                </a-input-number>
              </a-form-item>
              <!--暂不支持-->
              <!--              <a-form-item-->
              <!--                v-if="item.count === bcForm.rules.length"-->
              <!--                :rules="[{ required: true, message: '必选' }]"-->
              <!--                label="是否次日下班"-->
              <!--              >-->
              <!--                <a-switch-->
              <!--                  v-model="bcForm.rules[item.count - 1].ciRi"-->
              <!--                  :checked-value="1"-->
              <!--                  :unchecked-value="0"-->
              <!--                />-->
              <!--              </a-form-item>-->
              <a-form-item
                :rules="[{ required: true, message: '一天几次上下班' }]"
                :validate-trigger="['change', 'blur']"
                label="下班时间"
              >
                <a-time-picker
                  v-model="bcForm.rules[item.count - 1].xbTime"
                  :disabled-seconds="
                    () => [
                      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                      18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
                      32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45,
                      46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
                      60,
                    ]
                  "
                  style="width: 194px; margin: 0 24px 24px 0"
                />
              </a-form-item>

              <a-form-item
                :rules="[
                  {
                    required: true,
                    message: '下班前多少分钟允许打卡[记录早退但不记录旷班]',
                  },
                ]"
                :validate-trigger="['change', 'blur']"
                label="下班前多少分钟允许打卡[允许早退就非0]"
              >
                <a-input-number
                  v-model="bcForm.rules[item.count - 1].xbStartTime"
                  :max="360"
                  :min="0"
                  autocomplete="off"
                >
                </a-input-number>
              </a-form-item>
              <a-form-item
                :rules="[
                  {
                    required: true,
                    message: '必须给个范围，从下班开始截止到什么时候截止下班',
                  },
                ]"
                :validate-trigger="['change', 'blur']"
                label="下班后多少分钟内允许打卡[没下班算旷]"
              >
                <a-input-number
                  v-model="bcForm.rules[item.count - 1].xbEndTime"
                  :max="360"
                  :min="0"
                  autocomplete="off"
                >
                </a-input-number>
              </a-form-item>
              <a-form-item
                v-if="item.count !== bcForm.rules.length"
                label="连班"
              >
                <a-switch
                  v-model="bcForm.rules[item.count - 1].lianban"
                  :checked-value="true"
                  @change="chanjiLianban(item.count)"
                  :unchecked-value="false"
                />
              </a-form-item>
            </div>
          </div>
        </a-form>
      </div>
      <div class="button_group">
        <a-button @click="updateBC" :type="'primary'">更新</a-button>
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
