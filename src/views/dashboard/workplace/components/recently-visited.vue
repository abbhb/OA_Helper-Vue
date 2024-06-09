<template>
  <a-card
    class="general-card"
    :title="$t('workplace.recently.visited')"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ paddingTop: '26px' }"
  >
    <template #extra>
      <a-popconfirm @ok="clearRecentlyVisited" content="这个操作会删除存在服务器的历史记录,确认继续嘛?">
        <a-link>清空</a-link>
      </a-popconfirm>
    </template>
    <div style="margin-bottom: -1rem">
      <a-row v-if="links.length>0" :gutter="8">
        <a-col v-for="link in links" :key="link.path" :span="8" class="wrapper" @click="router.push({name:link.name})">
          <div class="icon">
            <functional-icons
              :icon="link.meta.icon?link.meta.icon:'icon-loading'"
              size="28"
            ></functional-icons>
          </div>
          <a-typography-paragraph class="text">
            <!--标红但不影响-->
            {{ $t(link.meta.locale ? link.meta.locale : link.name) }}
          </a-typography-paragraph>
        </a-col>
      </a-row>
      <a-typography-paragraph v-else class="text">
        <a-empty/>
      </a-typography-paragraph>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/store';
  import { RecentlyRouter } from '@/store/modules/app/types';
  import {ref} from "vue";
  import FunctionalIcons from "@/components/icon/FunctionalIcons/index.vue";
  import router from "@/router";

  const appStore = useAppStore();
  // console.log()
  const links = ref<RecentlyRouter[]>(appStore.getRecentlyRouter());

  const clearRecentlyVisited = () => {
    // 清空最近访问
    appStore.clearLocalRecentlyVisited();
    links.value = [];
  }
</script>

<style lang="less" scoped>
  :deep(.arco-card-header-title) {
    line-height: inherit;
  }
</style>
