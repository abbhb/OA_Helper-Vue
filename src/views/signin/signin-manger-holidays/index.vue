<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import {reactive, ref, watch} from 'vue';
  import type { CalendarDateType, CalendarInstance } from 'element-plus';
  import {deleteHolidays, Holidays, listHolidays, updateHolidays} from '@/api/signin';
  import { Message } from '@arco-design/web-vue';
  import {
    getNowdate,
    getlastMonth,
    getNowFormatDate,
  } from '@/utils/utils';
  import eventBus from "@/utils/eventBus";

  const groupId = ref();
  const range = ref<Date>(new Date());
  // 绑定值
  const dates = ref(new Date());
  const currentMonth = ref(new Date().getMonth());
  const route = useRoute();
  const holidayData = ref<Holidays[]>();
  const editMode = ref(false);
  const form = reactive<Holidays>({
    id:'',
    signinGroupId:'',
    dateD:'',
    name:'',
    workingDay:0,
  })
  groupId.value = route.query.groupId;
  // const selectDate = () => {
  //   initData();
  // };

  const calendar = ref<CalendarInstance>();
  const selectDate = (val: CalendarDateType) => {
    if (!calendar.value) return;
    calendar.value.selectDate(val);
  };
  const cleanForm = () => {
    form.id = ''
    form.signinGroupId = ''
    form.dateD = ''
    form.name = ''
    form.workingDay = 0

  }
  const initData = async (first=false) => {

    if (!groupId.value) {
      Message.error('无groupId');
      return;
    }
    if (!range.value) {
      return;
    }
    if (!first&&range.value.getMonth() === currentMonth.value) {
      return;
    }
    eventBus.emit("addLoading", {tip: "加载中~"});

    console.log('请求');
    currentMonth.value = range.value.getMonth();
    const { data } = await listHolidays(
      groupId.value,
      getlastMonth(range.value),
      getNowdate(range.value)
    );
    holidayData.value = data;
    eventBus.emit('removeLoading');

  };

  watch(dates, (newValue, oldValue) => {
    console.log(oldValue);
    console.log(newValue);
    range.value = newValue;
    initData();
  });
  initData(true);
  const getHoliDayItem = (date: Date) => {
    if (!holidayData.value|| holidayData.value.length===0){
      return undefined;
    }
    for (const i of holidayData.value) {
      if (i.dateD === getNowFormatDate(date)){
        return i;
      }
    }

    return undefined;
  };
  const deleteJiejia = async (id) => {
    eventBus.emit("addLoading", {tip: "删除中~"});
    try {
      await deleteHolidays(groupId.value, id)
    }catch (e) {
      console.error(e)
    }
    eventBus.emit('removeLoading');
    await initData(true);

  }
  const updateJiejia = async () => {
    editMode.value = false;
    eventBus.emit("addLoading", {tip: "更新中~"});
    await updateHolidays(groupId.value, {
      id:form.id?form.id:undefined,
      name:form.name,
      signinGroupId:groupId.value,
      dateD:form.dateD,
      workingDay:form.workingDay,
    })
    cleanForm();
    eventBus.emit('removeLoading');
    await initData(true);


  }
  const caozuoTongyi = async (type: string) => {
    if (type === 'delete') {
      await deleteJiejia(getHoliDayItem(dates.value).id);
    }
    if (type === 'update') {
      const items = getHoliDayItem(dates.value);

      form.id = items&&items.id?items.id:undefined
      form.name = items&&items.name?items.name:undefined
      form.workingDay = items&&items.workingDay?items.workingDay:undefined
      form.signinGroupId = groupId.value
      form.dateD = getNowFormatDate(dates.value)
      editMode.value = true;
    }

  }
</script>

<template>
  <div>
    <el-calendar ref="calendar" v-model:model-value="dates">
      <template #header="{ date }">
        <span>节假日管理</span>
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
            <span
              v-if="
                getHoliDayItem(data.date) &&
                getHoliDayItem(data.date).workingDay === 1
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
          <el-tag v-if="getHoliDayItem(data.date)" :type="'info'">
            {{ getHoliDayItem(data.date).name }}
          </el-tag>
        </div>
      </template>
    </el-calendar>
    <el-card v-if="dates">
      <template #header>
        操作区
      </template>
      <div>

        <el-button :type="'primary'" v-if="getHoliDayItem(dates)" @click="caozuoTongyi('update')">编辑节假日</el-button>
        <el-button :type="'primary'" v-else @click="caozuoTongyi('update')">添加节假日</el-button>
        <el-button :type="'danger'" v-if="getHoliDayItem(dates)"  @click="caozuoTongyi('delete')">删除节假日</el-button>
      </div>
    </el-card>
  </div>
  <a-modal
    v-model:visible="editMode"
    :hide-cancel="true"
    :footer="false"
    @close="editMode = false"
    :width="700"
    unmount-on-close
    >

    <a-form :model="form">
      <div>
        <a-form-item
          field="name"
          label="节假日名称"
          label-col-flex="80px"
        >
          <a-input
            v-model="form.name"
          ></a-input>
        </a-form-item>
      </div>
      <div>
        <a-form-item
          field="workingDay"
          label="设为工作日"
          label-col-flex="80px"
        >
          <a-switch v-model:model-value="form.workingDay" :checked-value="1" :unchecked-value="0"/>
        </a-form-item>
      </div>
    </a-form>
    <a-button :type="'primary'" @click="updateJiejia">
      提交
    </a-button>

  </a-modal>

</template>

<style scoped>
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
    align-items: center;
    height: 100%;
    font-family: 黑体;
  }
</style>
