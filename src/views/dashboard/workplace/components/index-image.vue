<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{ padding: '17px 20px 21px 20px' }"
    >
      <template #title>
        {{ $t('workplace.indexImage') }}
      </template>
      <template #extra>
        <a-link>{{ $t('workplace.viewMore') }}</a-link>
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
        <Carousel :image-src="imageList" />
      </a-space>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import {queryIndexImageLabel, queryLabelIndexImage, queryPopularList} from '@/api/dashboard';
  import Carousel from '@/views/dashboard/workplace/components/carousel.vue';

  const type = ref('text');
  const { loading, setLoading } = useLoading();
  const labelList = ref<string[]>();
  const imageList = ref([]);
  const fetchDate1 = async (label: string)=>{
      try {
          setLoading(true)
          const { data } = await queryLabelIndexImage({ label });
          imageList.value = data;
      }catch (err) {
          // you can report use errorHandler or other
      } finally {
          setLoading(false);
      }
  }
  const fetchData = async () => {
    try {
      const { data } = await queryIndexImageLabel();
      labelList.value = data;
      fetchDate1(data[0])
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
