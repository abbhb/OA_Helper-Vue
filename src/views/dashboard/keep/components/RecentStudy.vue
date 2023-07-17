<template>
  <div style="margin-top: 1rem">
    <div id="myEcharts" :style="{ width: '1300px', height: '300px' }"></div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts/core';
import {GridComponent, GridComponentOption} from 'echarts/components';
import {LineChart, LineSeriesOption} from 'echarts/charts';
import {UniversalTransition} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';
import {onMounted, onUnmounted, ref} from 'vue';
import {useAppStore} from '@/store';
import {getSelfClockEcharts} from '@/api/keeptime';

const appState = useAppStore();
const xText = ref(['1', '2']);
const xData = ref([1, 2]);

// 声明定义一下echart
const echart = echarts;
const mychart = ref();

const initChart = () => {
  mychart.value = echart.init(
    document.getElementById('myEcharts'),
    appState.theme
  );
  // 把配置和数据放这里
  mychart.value.setOption({
    xAxis: {
      type: 'category',
      data: xText.value,
    },
    tooltip: {
      trigger: 'axis',
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: xData.value,
        type: 'line',
        smooth: true,
        emphasis: {
          label: {
            show: true,

          },
        },
      },
    ],
  });
  window.onresize = function () {
    // 自适应大小
    mychart.value.resize();
  };
};
const initData = async () => {
  const data = await getSelfClockEcharts();
  xText.value = data.data.xtextList;
  xData.value = data.data.xvalueList;
  initChart();
};

onMounted(() => {
  initData();
});
onUnmounted(() => {
  mychart.value.dispose();
});

echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);
</script>

<style lang="less" scoped></style>
