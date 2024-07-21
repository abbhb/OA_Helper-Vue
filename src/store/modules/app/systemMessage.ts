import { computed, reactive, ref } from 'vue';
import { defineStore } from 'pinia';
import {
  getUnReadCount,
  listSystemMessage,
  SystemMessageResp,
} from '@/api/system-message';

export const useSystemMessageStore = defineStore('systemMessage', () => {
  const systemMessageList = ref<SystemMessageResp[]>([]);

  const isLoading = ref(false); // 是否正在加载
  const noReadCount = reactive<{
    noread: number;
  }>({
    noread: 0,
  });

  const getCountNoRead = async () => {
    const { data } = await getUnReadCount();
    noReadCount.noread = data;
  };
  const getSystemMessageList = async () => {
    isLoading.value = true;
    await getCountNoRead();
    const { data } = await listSystemMessage();

    systemMessageList.value = data;
    isLoading.value = false;
  };
  getSystemMessageList();
  return {
      isLoading,
      systemMessageList,
      noReadCount,
    getSystemMessageList,
      getCountNoRead
  };
});

export default { useSystemMessageStore };
