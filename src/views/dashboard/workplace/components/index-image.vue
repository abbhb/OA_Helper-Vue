<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card :header-style="{ paddingBottom: '0' }" class="general-card">
      <template #title>
        {{ $t('workplace.indexImage') }}
      </template>
      <template #extra>
        <a-link v-if="!props.noMore" @click="emit('alertSome')"
          >{{ $t('workplace.viewMore') }}
        </a-link>
      </template>
      <a-space direction="vertical" :size="10" fill>
        <a-radio-group
          v-model:model-value="type"
          type="button"
          @change="typeChange as any"
        >
          <a-radio v-for="label in labelList" :key="label" :value="label">
            {{ label }}
          </a-radio>
        </a-radio-group>
        <Carousel
          :image-src="imageList"
          :style="props.noMore ? 'height: 362px' : 'height: 362px'"
        />
      </a-space>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { defineEmits, ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import {
    IndexImage,
    queryIndexImageLabel,
    queryLabelIndexImage,
  } from '@/api/index-image';
  import Carousel from '@/views/dashboard/workplace/components/carousel.vue';

  const props = defineProps({
    noMore: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['alertSome']);
  const type = ref('text');
  const { loading, setLoading } = useLoading();
  const labelList = ref<string[]>();
  const imageList = ref<IndexImage>({});
  const fetchDate1 = async (label: string) => {
    try {
      setLoading(true);
      const { data } = await queryLabelIndexImage({ label });
      imageList.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  const fetchData = async () => {
    try {
      const { data } = await queryIndexImageLabel();
      labelList.value = data;
      if (labelList.value.length > 0) {
        fetchDate1(data[0]);
      }
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
  fetchData();

  const typeChange = (contentType: string) => {
    fetchDate1(contentType);
    console.log(contentType);
  };
</script>

<style scoped lang="less">
  .general-card {
    min-height: 395px;
  }
  :deep(.arco-table-tr) {
    height: 44px;
    .arco-typography {
      margin-bottom: 0;
    }
  }
  .increases-cell {
    display: flex;
    align-items: center;
    span {
      margin-right: 4px;
    }
  }
</style>
