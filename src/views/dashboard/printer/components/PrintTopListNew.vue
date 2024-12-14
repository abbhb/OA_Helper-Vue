<script lang="ts" setup>
import {CountTop10VO, getCountTop10VO} from '@/api/printer';
import AvatarImage from '@/components/image/AvatarImage.vue';
import {ref} from 'vue';
import {useI18n} from "vue-i18n";

const topData = ref<CountTop10VO[]>([]);
const legendData = ref([]);
const maxs = ref(0);
const types = ref<number>(2);
const seriesData = ref([]);
const {t} = useI18n();
const initData = async () => {
  const {data} = await getCountTop10VO({type: types.value});
  topData.value = data;
  let max = 0;
  for (let i = 0; i < data.length; i += 1) {
    legendData.value.push(data[i].name);
    if (data[i].total > max) {
      max = data[i].total;
    }
    seriesData.value.push(data[i].total);
  }
  // 最大占比
  max /= 0.76;
  maxs.value = max;
};

initData();
</script>

<template>
  <div style="max-height: 450px;">
    <div class="title">
      <span>
        {{ $t('printer.one.printTopListNew.name') }}
    </span>
      <a-radio-group v-model:model-value="types" size="mini" style="position: absolute;right: 50px;" type="button"
                     @change="initData">
        <a-radio :value="1">总</a-radio>
        <a-radio :value="2">日</a-radio>
      </a-radio-group>
    </div>
    <a-empty v-if="topData.length === 0">
      <template #image>
        <icon-exclamation-circle-fill/>
      </template>
      {{ $t('printer.one.printTopListNew.tip.none') }}
    </a-empty>
    <div
      v-for="(item, key) in topData"
      v-else
      :key="item.id"
      style="display: flex; align-items: center"
    >
      <a-tooltip :content="item.name" mini position="top">
        <AvatarImage :avatar="item.avatar" :key="item.id+'printTop'+item.name"  :name="item.name"/>
      </a-tooltip>
      <div
        :class="
          (key === 0
            ? 'first'
            : key === 1
            ? 'second'
            : key === 2
            ? 'third'
            : 'other') + ' guangyun'
        "
        :style="{ width: (item.total / maxs) * 100 + '%' }"
        style="
          display: flex;
          height: 22px;
          margin-left: 2px;
          border-radius: 3px;
          flex-direction: row-reverse;
          align-items: center;
        "
      >
        <span v-if="item.total / maxs >= 0.3" class="font"
        >{{ item.total }}{{ $t('printer.one.printTopListNew.unit.page') }}
        </span>
      </div>
      <div v-if="item.total / maxs < 0.3">
        <span class="font">{{ item.total }}页</span>
      </div>
    </div>
    <div
      v-if="topData.length !== 0"
      style="display: flex; align-items: center;justify-content: center"
    >
      <span>到底了~最多展示{{ topData.length }}条</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.title {

  padding: 3px 3px 3px 3px;
  color: var(--color-text-1);

  font-size: 16px;
  font-weight: 800;
}

.font {
  color: var(--color-text-1);
}

.first {
  background-color: #fd799c;
  color: #fd799c;
}

.second {
  background-color: #e7bcf3;
  color: #e7bcf3;
}

.third {
  background-color: #8378ea;
  color: #8378ea;
}

.other {
  background-color: #2299dd;
  color: #2299dd;
}

.guangyun {
  transition: box-shadow 0.3s ease; /* 添加过渡效果，使光晕动画平滑 */
}

.guangyun:hover {
  box-shadow: 0 0 1px 3px currentColor; /* 添加光晕效果 */
}
</style>
