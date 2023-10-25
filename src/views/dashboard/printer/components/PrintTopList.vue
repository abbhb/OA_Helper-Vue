<template>
  <div id="printtop" :style="{ height: '700px', width: '600px' }">
    <!--    <div v-for="item in topData" :key="item.id">-->
    <!--      <AvatarImage :avatar="item.avatar" :name="item.name"/>-->
    <!--    </div>-->
  </div>
</template>

<script lang="ts" setup>
  import * as echarts from 'echarts/core';
  import { GridComponent, LegendComponent } from 'echarts/components';
  import { BarChart } from 'echarts/charts';
  import { CanvasRenderer } from 'echarts/renderers';
  import { CountTop10VO, getCountTop10VO } from '@/api/printer';
  import { onMounted, onUnmounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useAppStore } from '@/store';

  const topData = ref<CountTop10VO[]>();

  echarts.use([GridComponent, LegendComponent, BarChart, CanvasRenderer]);

  const { t } = useI18n();

  // type EChartsOption = echarts.EChartsOption;

  const mychart = ref();
  const legendData = ref([]);
  const seriesData = ref([]);
  const appState = useAppStore();

  const initChart = () => {
    mychart.value = echarts.init(
      document.getElementById('printtop'),
      appState.theme
    );
    mychart.value.setOption({
      xAxis: {
        max: 'dataMax',
        interval: 0, // 使x轴文字显示全
        show: true,
      },
      yAxis: {
        type: 'category',
        data: legendData.value,
        inverse: true,
        max: 9, // only the largest 3 bars will be displayed
        interval: 0,
        nameTextStyle: {
          padding: [0, 160, 0, 0],
        },
      },
      series: [
        {
          realtimeSort: true,
          name: 'X',
          type: 'bar',
          data: seriesData.value,
          label: {
            show: true,
            position: 'right',
            valueAnimation: true,
          },
        },
      ],
      legend: {
        show: true,
      },
    });
    window.onresize = function () {
      // 自适应大小
      mychart.value.resize();
    };
  };
  const initData = async () => {
    const { data } = await getCountTop10VO({ type: 1 });
    topData.value = data;
    for (let i = 0; i < data.length; i += 1) {
      legendData.value.push(data[i].name);
      seriesData.value.push(data[i].total);
    }
    initChart();
  };
  onMounted(() => {
    initData();
  });
  onUnmounted(() => {
    mychart.value.dispose();
  });
</script>

<style lang="less" scoped></style>
