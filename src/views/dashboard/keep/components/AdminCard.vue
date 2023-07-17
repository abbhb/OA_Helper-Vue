<script lang="ts" setup>
import {ref} from 'vue';
import {useAppStore} from '@/store';
import ViewData from '@/views/dashboard/keep/components/ViewData.vue';

interface ModelData {
  title?: string;
  type: string;
}

interface Link {
  text: string;
  icon: string;
  type: string;
}

const links = ref<Link[]>([
  {
    text: 'keep.admin.viewData',
    icon: 'icon-drag-dot',
    type: 'viewData',
  },
]);
const modelVisible = ref(false);
const appState = useAppStore();
const modelData = ref<ModelData>({title: '', type: ''});
const openModel = (link: Link) => {
  // 打开对应模态窗
  modelVisible.value = true;
  modelData.value.title = link.text;
  modelData.value.type = link.type;
};
</script>

<template>
  <div>
    <a-card
      :body-style="{ paddingTop: '26px' }"
      :header-style="{ paddingBottom: '0' }"
      :title="$t('keep.admin.card')"
      class="general-card"
    >
      <div style="margin-bottom: -1rem">
        <a-row :gutter="8">
          <a-col
            v-for="link in links"
            :key="link.text"
            :span="8"
            class="wrapper"
            @click="openModel(link)"
          >
            <div class="icon">
              <component :is="link.icon"/>
            </div>
            <a-typography-paragraph class="text">
              {{ $t(link.text) }}
            </a-typography-paragraph>
          </a-col>
        </a-row>
      </div>
    </a-card>
    <a-modal
      v-model:visible="modelVisible"
      :draggable="true"
      :footer="false"
      :fullscreen="appState.modelFullscreen"
      :unmount-on-close=true

    >
      <template #title>
        {{ $t(modelData.title) }}
      </template>
      <ViewData v-if="modelData.type === 'viewData'"/>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
.wrapper {
  border: aliceblue 1px solid;
  border-radius: 5px;
  margin-right: 2px;
  padding: 2px 0px 2px 0;

  .icon {
    font-size: 18px;
  }
}

.wrapper:hover {
  background-color: #e8f3ff;
  cursor: pointer;
}
</style>
