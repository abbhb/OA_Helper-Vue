<template>
  <div>
    <a-card :title="$t('printer.one.HistoryRecord.title')" :bordered="false">
      <template #extra>
        <a-link @click="More()">{{ $t('card.more') }}</a-link>
      </template>
      <HistoryContent />
    </a-card>
    <a-modal
      v-model:visible="visible"
      :fullscreen="fullscreen"
      :footer="false"
      :draggable="true"
    >
      <template #title>
        {{ $t('printer.one.HistoryRecord.title') }}
      </template>
      <HistoryContent/>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import HistoryContent from '@/views/dashboard/printer/components/HistoryContent.vue';
  import { useAppStore } from '@/store';

  export default {
    name: 'HistoryRecord',
    components: { HistoryContent },
    setup() {
      const { t } = useI18n();
        const appStore = useAppStore();
        const fullscreen = ref(false);
        fullscreen.value = appStore.modelFullscreen
      // dialog属性
      const visible = ref(false);
      const More = () => {
        // 打开dialog
        visible.value = true;
      };
      return {
          visible,
          fullscreen,
          More
      };
    },
  };
</script>

<style scoped></style>
