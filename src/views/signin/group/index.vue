<script lang="ts" setup>
  import GroupList from '@/views/signin/group/components/GroupList.vue';
  import useSigninStore from '@/store/modules/signin';
  import eventBus from '@/utils/eventBus';


  const signinStore = useSigninStore();
  const initDevices = async () => {
    eventBus.emit('addLoading', { tip: '初始化设备信息中~' });
    await signinStore.initDevices();
    eventBus.emit('removeLoading');
  };
  initDevices();
</script>

<template>
  <div>
    <group-list />
  </div>
</template>

<style scoped></style>
