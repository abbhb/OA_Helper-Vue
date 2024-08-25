<script setup lang="ts" name="ContactSide">
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

  import { useContactStore } from '@/store/modules/chat/contacts';
  import { useGlobalStore } from '@/store/modules/chat/global';

  import VirtualList from '@/views/chat/chat-index/components/VirtualList';
  import { random } from 'lodash';
  import eventBus from '@/utils/eventBus';
  import { ContactItemW } from '@/types/chat';
  import ContactItem from './ContactItem.vue';

  const blocks = computed(() => contactStore.contactsList);

  const contactStore = useContactStore();
  const globalStore = useGlobalStore();

  const active = ref('1');
  const onFrozen = ref(true);

  //
  // const onNewFriendLoad = () => {
  //   contactStore.getRequestFriendsList();
  // };
  // const onContactsLoad = () => {
  //   contactStore.getContactList();
  // };
  const onChange = () => {
    onFrozen.value = true;
    setTimeout(() => {
      onFrozen.value = false;
    }, 500);
  };
  const onCreateGroup = () => {
    globalStore.createGroupModalInfo.show = true;
  };

  const flattenedBlocks = computed(() => {
    return blocks.value.flatMap((block) => {
      const headerItem = { ...block, isHeader: true, isLastInBlock: false };
      const infoItems = block.info.map((info, idx) => ({
        ...info,
        key: block.key,
        id: info?.id ? info?.id : block.key + String(random(1000)),
        isHeader: idx === 0,
        idx: idx,
        isLastInBlock: idx === block.info.length - 1,
      }));
      return [headerItem, ...infoItems];
    });
  });

  const getKey = (item: any) => {
    return item.id;
  };

  const changeContactSelect = ({ item }: { item: ContactItemW }) => {
    console.log(item)
    globalStore.currentSelectedContact = item;
  };
  onMounted(() => {
    eventBus.on('changeContactSelect', changeContactSelect);
  });
  onBeforeUnmount(() => {
    eventBus.off('changeContactSelect', changeContactSelect);
  });
</script>

<template>
  <div class="side">
    <ElButton
      class="add-group"
      type="primary"
      size="small"
      @click="onCreateGroup"
      >创建群聊</ElButton
    >
    <div>
      <!--    <el-collapse-->
      <!--      v-model="active"-->
      <!--      class="side-collapse"-->
      <!--      accordion-->
      <!--      @change="onChange"-->
      <!--    >-->
      <!--      <el-collapse-item title="新的朋友" name="1">-->
      <!--        <ul-->
      <!--          v-infinite-scroll="onNewFriendLoad"-->
      <!--          :infinite-scroll-disabled="onFrozen"-->
      <!--          class="read-unread-list"-->
      <!--        >-->
      <!--          <NewFriendItem-->
      <!--            v-for="item in contactStore.requestFriendsList"-->
      <!--            :key="item.uid"-->
      <!--            :item="item"-->
      <!--            @click="onNodeClick(item)"-->
      <!--          />-->
      <!--          <li-->
      <!--            v-if="contactStore.requestFriendsList?.length === 0"-->
      <!--            class="read-unread-no-data"-->
      <!--          >-->
      <!--            暂无数据~-->
      <!--          </li>-->
      <!--        </ul>-->
      <!--      </el-collapse-item>-->
      <!--      <el-collapse-item title="联系人" name="2">-->
      <!--        <ul-->
      <!--          v-infinite-scroll="onContactsLoad"-->
      <!--          :infinite-scroll-disabled="onFrozen"-->
      <!--          class="read-unread-list"-->
      <!--        >-->
      <!--          <ContactItem-->
      <!--            v-for="item in contactStore.contactsList"-->
      <!--            :key="item.uid"-->
      <!--            :item="item"-->
      <!--            @click="onNodeClick(item)"-->
      <!--          />-->
      <!--          <li-->
      <!--            v-if="contactStore.contactsList?.length === 0"-->
      <!--            class="read-unread-no-data"-->
      <!--          >-->
      <!--            暂无数据~-->
      <!--          </li>-->
      <!--        </ul>-->
      <!--      </el-collapse-item>-->
      <!--    </el-collapse>-->
    </div>

    <VirtualList
      v-if="flattenedBlocks?.length"
      ref="virtualListRef"
      class="virtual-list scroll-hover"
      data-prop-name="item"
      :data="flattenedBlocks"
      :data-key="getKey"
      :item="ContactItem"
      :size="20"
    />
  </div>
</template>

<style lang="scss" src="./styles.scss" scoped />

<style lang="scss">
  .contact-tree-item .el-tree-node__content {
    width: 100%;
    height: 60px;
  }
</style>

<style lang="scss" scoped>
  .virtual-list {
    position: relative;
    width: 100%;
    height: 99%;

    overflow-y: auto;
  }

  .block-header {
    font-weight: bold;
    margin-bottom: 5px;
  }

  hr {
    border: none;
    border-top: 1px solid #ccc;
    margin: 10px 0;
  }
</style>
