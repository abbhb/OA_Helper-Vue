<template>
  <div id="first-ele-intro" class="container">
    <div class="left-side">
      <div class="panel">
        <Banner />
        <DataPanel />
      </div>
      <a-grid
        class="notice-pannel"
        :cols="24"
        :col-gap="16"
        :row-gap="16"
        style="margin-top: 16px"
      >
        <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }"
        >
          <PopularContent @alert-some="StatusTh.popularContentStatus = true" />
        </a-grid-item>
        <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }"
        >
          <IndexImage @alert-some="StatusTh.indexImageModelStatus = true" />
        </a-grid-item>
      </a-grid>
    </div>

    <div class="right-side">
      <a-grid :cols="24" :row-gap="16">
        <a-grid-item :span="24">
          <div class="panel moduler-wrap">
            <QuickOperation />
            <RecentlyVisited />
          </div>
        </a-grid-item>
        <a-grid-item class="panel" :span="24">
          <Carousel style="height: 188px" />
        </a-grid-item>
        <a-grid-item class="panel" :span="24">
          <Announcement />
        </a-grid-item>
        <a-grid-item class="panel" :span="24">
          <Docs />
        </a-grid-item>
      </a-grid>
    </div>
    <a-modal
      v-model:visible="StatusTh.indexImageModelStatus"
      :draggable="true"
      :fullscreen="appStore.modelFullscreen"
      title="图片公告"
      unmount-on-close
    >
      <IndexImage no-more />
    </a-modal>
    <a-modal
      v-model:visible="StatusTh.popularContentStatus"
      :draggable="true"
      :fullscreen="appStore.modelFullscreen"
      title="通知文章"
      unmount-on-close
    >
      <PopularContent no-more />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import IndexImage from '@/views/dashboard/workplace/components/index-image.vue';
  import { Message } from '@arco-design/web-vue';
  import { onBeforeMount, onMounted, ref } from 'vue';
  import { useAppStore } from '@/store';
  import { driver } from 'driver.js';
  import { confirmToServer, isConfirm } from '@/api/common';
  import router from '@/router';
  import {
    FIRST_PAGE_HELPER,
    FIRST_SUCCESS_UPDATE_USER_INFO,
  } from '@/utils/my-string';
  import Banner from './components/banner.vue';
  import DataPanel from './components/data-panel.vue';
  import PopularContent from './components/popular-content.vue';
  import RecentlyVisited from './components/recently-visited.vue';
  import QuickOperation from './components/quick-operation.vue';
  import Announcement from './components/announcement.vue';
  import Carousel from './components/carousel.vue';
  import Docs from './components/docs.vue';
  import 'driver.js/dist/driver.css';

  const appStore = useAppStore();
  const selectMenu = (item) => {
    Message.info(item.label);
  };

  interface StatusT {
    indexImageModelStatus: boolean;
    popularContentStatus: boolean;
    needDriver: boolean;
  }

  const StatusTh = ref<StatusT>({
    indexImageModelStatus: false,
    popularContentStatus: false,
    needDriver: false,
  });

  const confirmDriver = async () => {
    await confirmToServer(FIRST_PAGE_HELPER);
  };


  onMounted(async () => {
    // 先判断该用户是不是建议过了！
    const { data:dataas } = await isConfirm(FIRST_SUCCESS_UPDATE_USER_INFO);
    if (!dataas) {
      // 需要跳转更新信息界面
      router.push({
        name: 'profile',
        params: {
          type: 'updateUserInfo',
        },
      });
      return;
    }

    const { data } = await isConfirm(FIRST_PAGE_HELPER);
    StatusTh.value.needDriver = !data;
    if (StatusTh.value.needDriver) {
      // 只有用户仍然是登录态才进引导，先获取该用户是否需要弹出本次引导
      const driverObj = driver({
        showProgress: true,
        steps: [
          {
            element: '.menu-wrapper',
            popover: {
              title: '这是菜单栏',
              description: '可以快速选择不同的功能页面',
            },
          },
          {
            element: '.panel',
            popover: {
              title: '数据面板',
              description: '这里展示平台的一些数据',
            },
          },
          {
            element: '.notice-pannel',
            popover: {
              title: '通知板块',
              description: '此处为本平台一些通知内容',
            },
          },
          {
            element: '.right-side',
            popover: {
              title: '顶部公共配置区',
              description: '此区域主要控制公共配置',
            },
          },
        ],
        prevBtnText: '上一步',
        nextBtnText: '下一步',
        doneBtnText: '我都已知晓',
        onDestroyStarted: () => {
          // eslint-disable-next-line no-restricted-globals
          if (!driverObj.hasNextStep() || confirm('你确定不要引导吗？')) {
            driverObj.destroy();
            confirmDriver();
          }
        },
      });
      driverObj.drive();
    }
  });
</script>

<script lang="ts">
  export default {
    name: 'Dashboard', // If you want the include property of keep-alive to take effect, you must name the component
  };
</script>

<style lang="less" scoped>
  .container {
    background-color: var(--color-fill-2);
    padding: 16px 20px;
    padding-bottom: 0;
    display: flex;
  }

  .left-side {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
  }

  .right-side {
    width: 280px;
    margin-left: 16px;
  }

  .panel {
    background-color: var(--color-bg-2);
    border-radius: 4px;
    overflow: auto;
  }
  :deep(.panel-border) {
    margin-bottom: 0;
    border-bottom: 1px solid rgb(var(--gray-2));
  }
  .moduler-wrap {
    border-radius: 4px;
    background-color: var(--color-bg-2);
    :deep(.text) {
      font-size: 12px;
      text-align: center;
      color: rgb(var(--gray-8));
    }

    :deep(.wrapper) {
      margin-bottom: 8px;
      text-align: center;
      cursor: pointer;

      &:last-child {
        .text {
          margin-bottom: 0;
        }
      }
      &:hover {
        .icon {
          color: rgb(var(--arcoblue-6));
          background-color: #e8f3ff;
        }
        .text {
          color: rgb(var(--arcoblue-6));
        }
      }
    }

    :deep(.icon) {
      display: inline-block;
      width: 32px;
      height: 32px;
      margin-bottom: 4px;
      color: rgb(var(--dark-gray-1));
      line-height: 32px;
      font-size: 16px;
      text-align: center;
      background-color: rgb(var(--gray-1));
      border-radius: 4px;
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  .mobile {
    .container {
      display: block;
    }
    .right-side {
      // display: none;
      width: 100%;
      margin-left: 0;
      margin-top: 16px;
    }
  }
</style>
