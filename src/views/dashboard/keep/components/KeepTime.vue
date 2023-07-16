<script setup lang="ts">
import {ref} from 'vue';
import {addClock30, ClockSelfDTO, getSelfClock} from '@/api/keeptime';
import {Message} from '@arco-design/web-vue';

const studyState = ref(1);
const startStudyState = ref(1);

const nowtimer = ref('00:00:00');
nowtimer.value = '00:00:00';

const timer = ref(null);
const workeras = ref(null);
const second = ref(0);
const minute = ref(0);
const hour = ref(0);
const neiji = ref(0);
const selfData = ref<ClockSelfDTO>({
  isStandard: false,
  isSigned: false,
  why: '',
  monthTime: 0,
  integrityDay: 0,
  minOldTime: 0,
  maxFirstTime: '',
  id: '',
  userId: '',
  date: '',
  firstTime: '',
  oldTime: 0,
});
const complZero = (n) => {
  return n < 10 ? `0${n}` : `${n}`;
};

const init = async () => {
  const data = await getSelfClock();
  if (data.code === 1) {
    selfData.value = data.data;
    if (data.data.isSigned) {
      studyState.value = 2;
    }
  }
};
init();
// 发送0.5加分请求
const sendTime = async () => {
  await addClock30({
    sign: 'b3fgewbcIBBI2143fqWIJ4t-3gewgg34gh435h',
  });
  // if (data.code !== 1) {
  //   Message.error(data.msg);
  // }
};

// worker.postMessage('线程关闭')
// worker.terminate()

//   开始计时
const start = () => {
  workeras.value = new Worker(
    new URL('../../../../worker/index.ts', import.meta.url)
  );
  workeras.value.postMessage('开启');
  workeras.value.onmessage = (e) => {
    console.log(e.data);
    if (e.data !== 'A') {
      nowtimer.value = e.data;
    } else {
      sendTime();
      init();
    }
  };
  // 每30秒向服务器发送一次记录，若失败及时推送消息订阅！
  // timer.value = setInterval(() => {
  //   second.value += 1;
  //   neiji.value += 1;
  //   if (neiji.value === 30) {
  //     neiji.value = 0;
  //     sendTime();
  //   }
  //   if (second.value >= 60) {
  //     second.value = 0;
  //     minute.value += 1;
  //   }
  //
  //   if (minute.value >= 60) {
  //     minute.value = 0;
  //     hour.value += 1;
  //   }
  //   nowtimer.value = `${complZero(hour.value)}:${complZero(
  //     minute.value
  //   )}:${complZero(second.value)}`;
  // }, 1000);
  startStudyState.value = 2;
};
// 停止计时
const reset = () => {
  // clearInterval(timer.value);

  workeras.value.postMessage('线程关闭');
  workeras.value.terminate();
  hour.value = 0;
  minute.value = 0;
  second.value = 0;
  nowtimer.value = '00:00:00';
  startStudyState.value = 1;
  init();
};
</script>

<template>
  <a-space
    direction="vertical"
    size="large"
    :style="{ width: '1300px' }"
    class="keep-root"
  >
    <span class="keep-title">
      {{ $t('keep.one.title') }}
    </span>

    <!--  主功能区-->
    <a-space direction="vertical" size="large">
      <a-space v-if="studyState === 1" direction="horizontal" size="large">
        <span class="item-title--1">今日还未开始学习</span>
      </a-space>
      <a-space v-else-if="studyState === 2" direction="horizontal" size="large">
        <span class="item-title">签到时间</span
        ><span class="item-text">{{ selfData.firstTime }}</span>
        <span class="item-title">今日已学时间</span
        ><span class="item-text">{{ selfData.oldTime }}分钟</span>
      </a-space>
    </a-space>
    <a-space style="float: right">
      <a-alert
        v-for="item in selfData.why.split('||')"
        :key="item"
        :type="selfData.isStandard ? 'success' : 'warning'"
      >
        <template #title>
          {{ selfData.isStandard ? '今日已合格！' : item }}
        </template>
      </a-alert>
    </a-space>
    <div class="timeContainer">
      <span class="item-title">{{ $t('keep.one.nowtime') }}</span>
      {{ nowtimer }}
    </div>
    <!--    开始学习按钮区-->
    <div v-if="startStudyState === 1" class="keep-button-div">
      <div class="start-button--1" @click="start()">
        <span class="text">开始学习</span>
      </div>
    </div>
    <div v-if="startStudyState === 2" class="keep-button-div">
      <div class="start-button--2" @click="reset()">
        <span class="text">停止学习</span>
      </div>
    </div>
  </a-space>
</template>

<style scoped lang="less">
.keep-root {
  background-color: var(--color-bg-2);
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.keep-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--color-text-1);
}

.item-title {
  font-size: 14px;
  font-weight: 500;
  font-weight: bold;
  color: var(--color-text-1);
}

.item-text {
  color: var(--color-text-1);
}

.item-title--1 {
  font-size: 18px;
  font-weight: 500;
  font-weight: bold;
  color: red;
}

.timeContainer {
  font-size: 40px;
  margin-bottom: 10px;
}

.keep-button-div {
  display: flex;
  justify-content: center;
  align-items: center;
}

.start-button--1 {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: rgba(238, 114, 37, 0.98);
  border: 1px solid #d5d5d5;
  display: flex;
  justify-content: center;
  align-items: center;

  .text {
    color: var(--color-text-1);
    font-size: 16px;
    font-weight: bold;
  }
}

.start-button--1:hover {
  box-shadow: 0 0 10px #f00;
  cursor: pointer;
}

.start-button--2 {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: rgba(6, 142, 243, 0.98);
  border: 1px solid #d5d5d5;
  display: flex;
  justify-content: center;
  align-items: center;

  .text {
    color: var(--color-text-1);
    font-size: 16px;
    font-weight: bold;
  }
}

.start-button--2:hover {
  box-shadow: 0 0 10px #5196f6;
  cursor: pointer;
}
</style>
