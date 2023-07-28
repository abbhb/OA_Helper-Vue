<script lang="ts" setup>
import {ref} from 'vue';
import {Group, queryGroupSelectList} from '@/api/group';

const groupSelectList = ref<Group[]>([]);

export interface SearchQuery {
  group?: Group[];
  name?: string;
  time?: string;
  date?: string;
}

const searchData = ref<SearchQuery>({group: [], name: '', time: '', date: ''});

const emit = defineEmits(['reQuery']);


const initData = async () => {
  const {data} = await queryGroupSelectList();
  groupSelectList.value = data;
};

const dateChange = (dateString, date) => {
  if (!dateString) {
    console.log('onChange: ', dateString, date);
    searchData.value.date = '';
    return;
  }
  if (dateString.length === 2) {
    // 响应数据改变
    searchData.value.date = `${dateString[0]}-${dateString[1]}`;
  }
  emit('reQuery', searchData);
};

const timeChange = (timeString, time) => {
  if (!timeString) {
    searchData.value.time = '';
    return;
  }
  if (timeString.length === 2) {
    // 响应数据改变
    searchData.value.time = `${timeString[0]}-${timeString[1]}`;
  }
  emit('reQuery', searchData);
};

initData();
</script>

<template>
  <div class="search-query-component">
    <div class="line">
      <div class="margin">
        <label>昵称：</label>
        <a-input
          v-model:model-value="searchData.name"
          :placeholder="$t('keep.admin.viewData.name.tip')"
          :style="{ width: '320px' }"
          allow-clear
          @change="emit('reQuery',searchData)"
        >
          <template #prefix>
            <icon-user/>
          </template>
        </a-input>
      </div>

      <div class="margin">
        <label>选择组：</label>
        <a-select
          v-model:model-value="searchData.group"
          :default-value="[]"
          :limit="2"
          :placeholder="$t('keep.admin.viewData.group.tip')"
          :scrollbar="true"
          :style="{ width: '360px' }"
          allow-clear
          multiple
          @change="emit('reQuery',searchData)"
        >
          <a-option
            v-for="item in groupSelectList"
            :key="item"
            :tag-props="{ color: 'red' }"
            :value="item.id"
          >{{ item.name }}
          </a-option
          >
        </a-select>
      </div>
    </div>
    <div class="line">
      <div class="margin">
        <label>日期范围：</label>
        <a-range-picker
          style="width: 254px; marginbottom: 20px"
          @change="dateChange"
        />
      </div>
      <div class="margin">
        <label>时间范围：</label>
        <a-time-picker
          :disable-confirm="false"
          style="width: 252px; margin: 0 24px 24px 0"
          type="time-range"
          @change="timeChange"
        />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.search-query-component {
  display: flex;
  flex-direction: column;
}

.search-query-component .line {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
}

.search-query-component .line .margin {
  margin-inline: 10px;
}
</style>
