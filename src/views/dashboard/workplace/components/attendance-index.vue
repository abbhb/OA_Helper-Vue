<script setup lang="ts">
  import { defineEmits, reactive, ref, toRef, watch } from 'vue';
  import { CalendarDateType, CalendarInstance } from 'element-plus';
  import { Message } from '@arco-design/web-vue';
  import { Holidays, listHolidays } from '@/api/signin';
  import { getlastMonth, getNowdate, getNowFormatDate } from '@/utils/utils';
  import {
    index_page_data_withuser,
    SigninLogForSelfResp,
  } from '@/api/attendance';

  const props = defineProps({
    noMore: {
      type: Boolean,
      default: false,
    },
    groupId: {
      type: String,
    },
  });
  const jiaqing = reactive<Map<string, SigninLogForSelfResp>>(new Map());

  const loading = ref(false);
  const range = ref<Date>(new Date());
  const holidayData = ref<Holidays[]>();
  const req = reactive({
    pageNum: 1,
    pageSize: 100,
    state: null,
    start: null,
    end: null,
  });
  // eslint-disable-next-line vue/no-setup-props-destructure
  const {groupId} = props;

  const dates = ref(new Date());
  const currentMonth = ref(new Date().getMonth());
  const calendar = ref<CalendarInstance>();
  watch(dates, (newValue, oldValue) => {
    console.log(oldValue);
    console.log(newValue);
    range.value = newValue;
    initData();
  });
  const emit = defineEmits(['alertSome']);
  const selectDate = (val: CalendarDateType) => {
    if (!calendar.value) return;
    calendar.value.selectDate(val);
  };

  const initSigninData = async () => {
    req.start = getlastMonth(range.value);
    req.end = getNowdate(range.value);
    try {
      const { data } = await index_page_data_withuser(req);
      for (let i = 0; i < data?.records?.length; i += 1) {
        jiaqing.set(data.records[i].currentDate, data.records[i]);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const initData = async (first = false) => {
    if (!groupId) {
      Message.error('无groupId');
      return;
    }
    if (!range.value) {
      return;
    }
    if (!first && range.value.getMonth() === currentMonth.value) {
      return;
    }
    loading.value = true;
    console.log('请求');
    try {
      currentMonth.value = range.value.getMonth();
      const { data } = await listHolidays(
        groupId,
        getlastMonth(range.value),
        getNowdate(range.value)
      );
      await initSigninData();

      holidayData.value = data;
    } catch (e) {
      console.log(e);
    }

    loading.value = false;
  };

  initData(true);

  const getHoliDayItem = (date: Date) => {
    if (!holidayData.value || holidayData?.value?.length === 0) {
      return undefined;
    }
    for (const i of holidayData.value) {
      if (i.dateD === getNowFormatDate(date)) {
        return i;
      }
    }

    return undefined;
  };

  const getStateName = (state: number) => {
    if (state === 0) {
      return '出勤';
    }
    if (state === 4) {
      return '请假';
    }
    if (state === 3) {
      return '缺勤';
    }
    console.log(state);
    return '异常';
  };
  const getStateType = (state: number) => {
    if (state === 0) {
      return 'info';
    }
    if (state === 4) {
      return 'warn';
    }
    if (state === 3) {
      return 'error';
    }

    return 'error';
  };

  const formatDateString = (inputStr) => {
    const date = new Date(inputStr);

    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string');
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  };
</script>

<template>
  <a-card
    class="general-card"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ padding: '17px 20px 21px 20px' }"
  >
    <template #title> 我的假勤 </template>
    <template #extra>
      <a-link v-if="!props.noMore" @click="emit('alertSome')"
        >{{ $t('workplace.viewMore') }}
      </a-link>
    </template>
    <el-calendar ref="calendar" v-model:model-value="dates" v-loading="loading">
      <template #header="{ date }">
        <span>{{ date }}</span>
        <el-button-group>
          <el-button size="small" @click="selectDate('prev-year')">
            前一年
          </el-button>
          <el-button size="small" @click="selectDate('prev-month')">
            前一月
          </el-button>
          <el-button size="small" @click="selectDate('today')">今天</el-button>
          <el-button size="small" @click="selectDate('next-month')">
            后一月
          </el-button>
          <el-button size="small" @click="selectDate('next-year')">
            后一年
          </el-button>
        </el-button-group>
      </template>
      <template #date-cell="{ data }">
        <div>
          <div class="date-first">
            <span class="left">{{ data.date.getDate() }}</span>
            <span>
              <span
                v-if="
                  getHoliDayItem(data.date)"
                style="font-size: 10px"
              >
                {{ getHoliDayItem(data.date).name }}
              </span>

            </span>
            <span
              v-if="
                getHoliDayItem(data.date) &&
                getHoliDayItem(data.date)?.workingDay === 1
              "
              class="right ban"
              >班</span
            >
            <span v-else-if="getHoliDayItem(data.date)" class="right xiu"
              >休</span
            >
          </div>
        </div>
        <div class="date-content">
          <el-tooltip
            v-if="jiaqing.get(formatDateString(data.date))&&jiaqing.get(formatDateString(data.date))?.state !== 0"
            :content="jiaqing.get(formatDateString(data.date))?.errMsg"
          >
            <el-tag
              v-if="jiaqing.get(formatDateString(data.date))"
              :type="
                getStateType(jiaqing.get(formatDateString(data.date))?.state)
              "
            >
              {{
                getStateName(jiaqing.get(formatDateString(data.date))?.state)
              }}</el-tag
            >
          </el-tooltip>
          <el-tag
            v-else-if="jiaqing.get(formatDateString(data.date))"
            :type="
              getStateType(jiaqing.get(formatDateString(data.date))?.state)
            "
          >
            {{
              getStateName(jiaqing.get(formatDateString(data.date))?.state)
            }}</el-tag
          >
        </div>
      </template>
    </el-calendar>
  </a-card>
</template>

<style scoped>
  .general-card {
    min-height: 395px;
  }
  :deep(.arco-table-tr) {
    height: 44px;
    .arco-typography {
      margin-bottom: 0;
    }
  }
  .increases-cell {
    display: flex;
    align-items: center;
    span {
      margin-right: 4px;
    }
  }

  .date-first {
    display: flex;
    justify-content: space-between;
  }
  .left {
    margin-right: auto; /* 推到左边 */
  }

  .right {
    margin-left: auto; /* 推到右边 */
  }
  .xiu {
    color: #00ad0e;
  }
  .ban {
    color: #ff0000;
  }
  .date-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-family: 黑体;
  }
</style>
