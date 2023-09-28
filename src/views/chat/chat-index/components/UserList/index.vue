<script setup lang="ts">
  import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';

  import { useGroupStore } from '@/store/modules/chat/group';
  import { useGlobalStore } from '@/store/modules/chat/global';
  import { useCachedStore } from '@/store/modules/chat/cached';
  import UserItem from './UserItem/index.vue';

  const globalStore = useGlobalStore();
  const cachedStore = useCachedStore();

  const groupListLastElRef = ref<HTMLDivElement>();
  const groupStore = useGroupStore();
  const groupUserList = computed(() => groupStore.userList);
  const statistic = computed(() => groupStore.countInfo);

  onMounted(() => {
    let observer: IntersectionObserver;
    nextTick(() => {
      observer = new IntersectionObserver(async (entries) => {
        if (entries?.[0]?.isIntersecting) {
          // 加载更多
          await groupStore.loadMore();
          // 停止观察该元素
          // eslint-disable-next-line no-unused-expressions
          groupListLastElRef.value &&
            observer.unobserve(groupListLastElRef.value);
          // 延迟500毫秒后，重新观察  groupListLastElRef 元素
          setTimeout(() => {
            // eslint-disable-next-line no-unused-expressions
            groupListLastElRef.value &&
              observer.observe(groupListLastElRef.value);
          }, 500);
        }
      });
      // 元素可见性监听
      // eslint-disable-next-line no-unused-expressions
      groupListLastElRef.value && observer.observe(groupListLastElRef.value);
    });
    onUnmounted(() => {
      // eslint-disable-next-line no-unused-expressions
      groupListLastElRef.value && observer.unobserve(groupListLastElRef.value);
    });
  });

  // eslint-disable-next-line no-return-assign
  const hiddenGroupListShow = () => (groupStore.showGroupList = false);
  const onAddGroupMember = () => {
    globalStore.createGroupModalInfo.show = true;
    globalStore.createGroupModalInfo.isInvite = true;
    // 禁用已经邀请的人
    globalStore.createGroupModalInfo.selectedUid =
      cachedStore.currentAtUsersList.map((item) => item.uid);
  };
</script>

<template>
  <div class="user-list-box">
    <div
      class="user-list-mask"
      :class="groupStore.showGroupList ? 'show' : ''"
      @click="hiddenGroupListShow"
    />
    <div
      class="user-list-wrapper"
      :class="groupStore.showGroupList ? 'show' : ''"
    >
      <div class="user-list-header"
        >在线人数：{{ statistic.onlineNum || 0 }}</div
      >
      <a-button
        type="primary"
        :shape="'circle'"
        size="small"
        style="font-size: 14px; font-weight: 900"
        @click="onAddGroupMember"
        >+</a-button
      >
      <TransitionGroup
        v-show="groupUserList?.length"
        tag="ul"
        name="fade"
        class="user-list"
      >
        <UserItem v-for="user in groupUserList" :key="user.uid" :user="user" />
        <li key="visible_el" ref="groupListLastElRef">&nbsp;</li>
      </TransitionGroup>
      <template v-if="groupUserList?.length === 0">
        <div class="list-no-data">暂无成员~</div>
      </template>
      <!-- </ul> -->
    </div>
  </div>
</template>

<style lang="less" scoped>
  .user-list {
    display: flex;
    flex: 1;
    flex-direction: column;
    row-gap: 2px;
    align-items: flex-start;
    padding: 0;
    margin: 0;
    margin-top: 8px;
    overflow: hidden;
    overflow-y: auto;

    // 取消滚动链接
    overscroll-behavior-y: contain;
    list-style-type: none;

    :deep(.el-loading-mask) {
      background-color: var(--color-bg-5);
    }

    &-box {
      position: relative;
    }

    &-mask {
      transition: background-color 0.3s ease;

      &.show {
        position: fixed;
        inset: 66px 0 0;
        background-color: var(--color-bg-3);
      }
    }

    .list-no-data {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      font-size: 14px;
      color: var(--color-text-1);
    }

    &-wrapper {
      position: absolute;
      top: 0;
      right: -16px;
      bottom: 16px;
      display: flex;
      flex-direction: column;
      width: 200px;
      height: 100%;
      padding: 8px 12px;
      background-color: var(--color-secondary);
      border-radius: 8px;
      transition: transform 0.3s ease;
      transform: translateX(100%);

      &.show {
        transform: translateX(-16px);
      }
    }

    &-header {
      padding-bottom: 8px;
    }
  }

  @media only screen and (min-width: 640px) {
    .user-list-wrapper {
      position: relative;
      top: 0;
      right: 0;

      // right: -200px;
      transform: translateX(0);

      &.show {
        transform: translateX(0);
      }
    }

    .user-list-mask.show {
      position: relative;
      top: initial;
      right: initial;
      bottom: initial;
      left: initial;
      background-color: transparent;
    }
  }
</style>

<style>
  /* 1. 声明过渡效果 */
  .fade-move,
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  }

  /* 2. 声明进入和离开的状态 */
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: scaleY(0.01) translate(30px, 0);
  }

  /* 3. 确保离开的项目被移除出了布局流
      以便正确地计算移动时的动画效果。 */
  .fade-leave-active {
    position: absolute;
  }
</style>
