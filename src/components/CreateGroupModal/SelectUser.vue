<script setup lang="ts" name="CreateGroupModal">
  import { ref, watch, computed } from 'vue';
  import { useContactStore } from '@/store/modules/chat/contacts';
  import { useGlobalStore } from '@/store/modules/chat/global';
  import type {
    renderContent,
    // TransferKey,
    // TransferDirection,
  } from 'element-plus/es/components/transfer';
  import { useUserInfo } from '@/hooks/chat/useCached';
  import Avatar from '@/components/image/AvatarImage.vue';

  const globalStore = useGlobalStore();
  const contactStore = useContactStore();
  const data = ref<
    {
      label: string;
      key: string;
      initial: string;
      disabled: boolean;
    }[]
  >([]);

  // const data = computed(() =>
  //   contactStore.contactsList.map((item) => ({
  //     label: item.uid,
  //     key: item.uid,
  //     initial: item.uid,
  //   })),
  // )
  const contactsList = computed(() => contactStore.contactsList);
  const contactsListOnlyUser = computed(()=>{
    return contactsList.value
      .filter(item => item.type === 3) // 首先过滤出type为3的项
      .reduce((accumulator, item) => accumulator.concat(item.info), []); // 然后合并它们的info数组
  })
  console.log("选择")
  console.log(contactsListOnlyUser.value)
  const selectedUid = computed(
    () => globalStore.createGroupModalInfo.selectedUid
  );
  watch(
    contactsListOnlyUser,
    (val) => {
      data.value = val.map((item) => ({
        label: item?.remarkName ? item.remarkName:item.name,
        key: item.id,
        initial: item.id,
        disabled: false,
      }));
    },
    { immediate: true, deep: true }
  );
  watch(
    selectedUid,
    (val) => {
      val.forEach((item) => {
        const dataItem = data.value.find((i) => i.key === item);
        if (dataItem) {
          dataItem.disabled = true;
        }
      });
    },
    { immediate: true }
  );
  // const defaultChecked = computed(() => globalStore.createGroupModalInfo.selectedUid)
  const selected = ref([]);

  const emit = defineEmits(['checked']);

  const renderFunc: renderContent = (h, option) => {
    const user = useUserInfo(option.key);
    return h('div', { style: 'display:flex;align-items:center;gap:6px' }, [
      h(Avatar, { avatar: user.value.avatar, name: option.label ,size: 20, class: 'avatar' }),
      h('div', { class: 'tem-info-name' }, option.label),
    ]);
  };
  // const handleChange = (
  //   value: TransferKey[],
  //   direction: TransferDirection,
  //   movedKeys: TransferKey[],
  // ) => {
  const handleChange = () => {
    emit('checked', Object.values(selected.value));
  };
</script>

<template>
  <el-transfer
    v-model="selected"
    style="display: inline-block; text-align: left;"
    :render-content="renderFunc"
    :titles="['Source', 'Target']"
    :format="{
      noChecked: '${total}',
      hasChecked: '${checked}/${total}',
    }"

    :data="data"
    @change="handleChange"
  >
  </el-transfer>
</template>
<style lang="scss" scoped>
.el-transfer-panel__item {
  height: 60px;
}
</style>
<style lang="scss" src="./styles.scss" scoped />
