<script setup lang="ts" name="ContactItem">
  import { toRefs, computed } from 'vue';
  import { ChatOnlineEnum } from '@/types/enums/chat';
  import { useUserInfo } from '@/hooks/chat/useCached';
  import AvatarImage from '@/components/image/AvatarImage.vue';
  import NewFriend from '@/assets/images/newFriend.png'
  import eventBus from "@/utils/eventBus";

  const props = defineProps<{ item: any }>();

  const { item } = toRefs(props);

  const currentUid = computed(() => item?.value?.id);
  const currentUser = useUserInfo(currentUid.value);


  const onclickItem = (item) => {
    eventBus.emit("changeContactSelect", {item});

  }
</script>

<template>


  <div v-if="item?.isHeader"  class="item-info contact-item" style="color: #999999">

    <div class="item-info-right">
      <span class="item-info-name">  {{item.key}}</span>
    </div>
  </div>
  <div class="item-info contact-item marginend item-hover" @click="onclickItem(item)">
    <img class="avatar" v-if="item.type===1" :src="NewFriend" width="40"/>
    <AvatarImage
      class="avatar"
      v-if="item.type!==1"
      :avatar="currentUser.avatar"
      :name="currentUser.name"
      :size="40"
      show-status
      :online="item?.ext?.activeStatus ? item?.ext?.activeStatus === ChatOnlineEnum.ONLINE:true"
    />
    <div class="item-info-right">
      <span class="item-info-name"> {{ item?.remarkName?item?.remarkName:item.name }}</span>
    </div>
  </div>
  <div v-if="item?.isLastInBlock" style="border-bottom: 1px solid #dfdddb">
  </div>
</template>

<style lang="scss" scoped>
  .marginend {
    margin-bottom: 10px;
  }
  .item-hover {
    transition: background-color 0.3s ease; /* 平滑过渡效果 */
  }
  .item-hover:hover {
    background-color: #fff0b3;
  }
</style>

<style lang="scss" src="./styles.scss" scoped />
