import {ref} from 'vue';
import {defineStore} from 'pinia';
import * as Api from '@/api/chat';
import {useUserStore} from '@/store';
import {EmojiItem} from '@/types/chat';
import {Message} from "@arco-design/web-vue";

export const useEmojiStore = defineStore('emoji', () => {
  const isLoading = ref(false); // 是否正在加载
  const userStore = useUserStore();
  const emojiList = ref<EmojiItem[]>([]);

  /**
   * 获取我的全部表情
   */
  const getEmojiList = async () => {
    isLoading.value = true;
    const { data } = await Api.getEmoji({ uid: userStore.userInfo.id! });
    isLoading.value = false;
    if (!data) return;
    emojiList.value = data;
  };

  /**
   * 添加表情
   */
  const addEmoji = async (emojiUrl: string) => {
    const { id } = userStore.userInfo;
    if (!id || !emojiUrl) return;
    await Api.addEmoji({ uid:id, expressionUrl: emojiUrl });
    Message.success('添加成功');
    await getEmojiList();
  };

  /**
   * 删除表情
   */
  const deleteEmoji = async (id: string) => {
    if (!id) return;
    await Api.deleteEmoji({ id });
    await getEmojiList();
  };

  getEmojiList();

  return {
    emojiList,
    addEmoji,
    getEmojiList,
    deleteEmoji,
  };
});

export default {useEmojiStore}