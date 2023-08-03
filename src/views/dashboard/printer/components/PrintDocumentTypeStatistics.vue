<template>
  <a-card style="margin-top: 1rem">
    <div id="printdoctypestat" :style="{  height: '300px' }"></div>
  </a-card>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts/core';
import {useI18n} from 'vue-i18n';
import {getPrintDocumentTypeStatistics} from '@/api/printer';
import {onMounted, onUnmounted, ref} from 'vue';
import {useAppStore} from '@/store';
import {LineChart} from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';
import {UniversalTransition} from 'echarts/features';
import {GridComponent, LegendComponent, TitleComponent,} from 'echarts/components';

const {t} = useI18n();

// type EChartsOption = echarts.EChartsOption;

const mychart = ref();
const legendData = ref([]);
const seriesData = ref([]);
const appState = useAppStore();

const initChart = () => {
  mychart.value = echarts.init(
    document.getElementById('printdoctypestat'),
    appState.theme
  );
  mychart.value.setOption({
    title: {
      text: t('printer.one.PrintDocumentTypeStatistics.title'),
      subtext: t('printer.one.PrintDocumentTypeStatistics.tip'),
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 20,
      bottom: 20,
      data: legendData.value,
    },
    series: [
      {
        name: t('printer.one.PrintDocumentTypeStatistics.name'),
        type: 'pie',
        radius: '55%',
        center: ['40%', '50%'],
        data: seriesData.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
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
  const {data} = await getPrintDocumentTypeStatistics();
  for (let i = 0; i < data.length; i += 1) {
    legendData.value.push(data[i].type);
    seriesData.value.push({
      name: data[i].type,
      value: data[i].count,
    });
  }

  initChart();
};
onMounted(() => {
  initData();
});
onUnmounted(() => {
  mychart.value.dispose();
});
echarts.use([
  TitleComponent,
  LegendComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);
</script>

<style lang="less" scoped></style>
