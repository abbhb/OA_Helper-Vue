import type { Directive } from 'vue';
import { useUserStore } from '@/store';
import { useContactStore } from '@/store/modules/chat/contacts';

const isMyFriend = (uid: string) => {
  const contactStore = useContactStore();
  const userStore = useUserStore();
  const myUid = userStore.userInfo.id;
  // 好友和自己不显示添加好友菜单
  return (
    contactStore.contactsList.some((item) => item.uid === uid) || uid === myUid
  );
};

const vFriends: Directive = {
  mounted(el, binding) {
    if (isMyFriend(binding.value)) {
      el?.remove();
    }
  },
};

export default vFriends;
