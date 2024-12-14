<template>
  <a-layout class="layout" :class="{ mobile: appStore.hideMenu }">
    <div v-if="navbar" class="layout-navbar">
      <NavBar />
    </div>
    <a-layout>
      <a-layout>
        <a-layout-sider
          v-if="renderMenu"
          v-show="!hideMenu"
          class="layout-sider"
          breakpoint="xl"
          :collapsed="collapsed"
          :collapsible="true"
          :width="menuWidth"
          :style="{ paddingTop: navbar ? '60px' : '' }"
          :hide-trigger="true"
          @mousemove="caidanzhankai(true)"
          @mouseleave="caidanzhankai(false)"
          @collapse="setCollapsed"
        >
          <el-scrollbar class="elscrollbar-max">
            <div class="menu-wrapper">
              <Menu
                @collapse="setCollapsed"
              />
            </div>
          </el-scrollbar>
          <div v-if="appStore.device !== 'mobile'" class="zhedie">
            <div class="fixbox" @click="setCollapsed(!collapsed)"
              ><div class="fixbox-wrapper" style=""
                ><span class="fixbox-fixbtn" :style="collapsed?'':'display:block;'">
                  <a-tooltip :content="!collapsed&&!byHover?'取消固定':'固定'">
                     <IconPushpin />
                  </a-tooltip>

            </span></div
            ></div>
          </div>
        </a-layout-sider>
        <a-drawer
          v-if="hideMenu"
          :visible="drawerVisible"
          placement="left"
          :footer="false"
          mask-closable
          :closable="false"
          @cancel="drawerCancel"
        >
          <Menu />
        </a-drawer>
        <a-layout class="layout-content" :style="paddingStyle">
          <TabBar v-if="appStore.tabBar" />
          <a-layout-content>
            <PageLayout />
          </a-layout-content>
          <FooterView v-if="footer" />
        </a-layout>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
  import { computed, onMounted, provide, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useAppStore, useUserStore } from '@/store';
  import NavBar from '@/components/navbar/index.vue';
  import Menu from '@/components/menu/index.vue';
  import TabBar from '@/components/tab-bar/index.vue';
  import usePermission from '@/hooks/permission';
  import useResponsive from '@/hooks/responsive';
  import FooterView from '@/components/footer/index.vue';
  import PageLayout from './page-layout.vue';

  const isInit = ref(false);
  const byHover = ref(false);
  const appStore = useAppStore();
  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();
  const permission = usePermission();
  useResponsive(true);
  const navbarHeight = `60px`;
  const navbar = computed(() => appStore.navbar);
  const renderMenu = computed(() => appStore.menu && !appStore.topMenu);
  const hideMenu = computed(() => appStore.hideMenu);
  const footer = computed(() => appStore.footer);
  const menuWidth = computed(() => {
    return appStore.menuCollapse ? 48 : appStore.menuWidth;
  });
  const collapsed = computed(() => {
    return appStore.menuCollapse;
  });
  const paddingStyle = computed(() => {
    // 只需要在hover时用不hover时的宽度去预留left，并且执行展开菜单操作，离开hover就还原，曲线实现，右下角展开该层固定，一旦固定就真实走目前的逻辑
    if (byHover.value && !appStore.menuCollapse) {
      const paddingLeft =
        renderMenu.value && !hideMenu.value
          ? { paddingLeft: `${48 - 10}px` }
          : {};
      const paddingTop = navbar.value ? { paddingTop: navbarHeight } : {};
      return { ...paddingLeft, ...paddingTop };
    }
    const paddingLeft =
      renderMenu.value && !hideMenu.value
        ? { paddingLeft: `${menuWidth.value - 10}px` }
        : {};
    const paddingTop = navbar.value ? { paddingTop: navbarHeight } : {};
    return { ...paddingLeft, ...paddingTop };
  });

  const caidanzhankai = (zhankai: boolean) => {
    if (!appStore.menuCollapse && !byHover.value) {
      return;
    }
    appStore.updateSettings({ menuCollapse: !zhankai }, true);
    byHover.value = zhankai;
  };
  const setCollapsed = (val: boolean) => {
    if (!isInit.value) return; // for page initialization menu state problem
    if (byHover.value && val) {
      byHover.value = false;
      appStore.updateSettings({ menuCollapse: false });
      return;
    }
    appStore.updateSettings({ menuCollapse: val });
  };
  watch(
    () => userStore.roles,
    (roleValue) => {
      if (roleValue && !permission.accessRouter(route))
        router.push({ name: 'notFound' });
    }
  );
  const drawerVisible = ref(false);
  const drawerCancel = () => {
    drawerVisible.value = false;
  };
  provide('toggleDrawerMenu', () => {
    drawerVisible.value = !drawerVisible.value;
  });
  onMounted(() => {
    isInit.value = true;
  });
</script>

<style scoped lang="less">
  @nav-size-height: 60px;
  @layout-max-width: 1100px;

  .layout {
    width: 100%;
    height: 100%;
  }

  .layout-navbar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: @nav-size-height;
  }

  .layout-sider {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    height: 100%;
    transition: all 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
    &::after {
      position: absolute;
      top: 0;
      right: -1px;
      display: block;
      width: 1px;
      height: 100%;
      background-color: var(--color-border);
      content: '';
    }

    > :deep(.arco-layout-sider-children) {
      overflow-y: hidden;
    }
  }

  .elscrollbar-max {
    max-height: calc(100% - 60px);
  }
  .menu-wrapper {
    height: 100%;

    :deep(.arco-menu-inner) {
      overflow-y: hidden;
      overflow-x: hidden;
      //overflow: -moz-scrollbars-none;  /* Firefox */
      //-ms-overflow-style: none;        /* Internet Explorer 10+ */
      ::-webkit-scrollbar {
        display: none;
      }
      ::-webkit-scrollbar:hover {
        display: block;
      }
      ::-webkit-scrollbar-thumb {
        border: 4px solid transparent;
        background-clip: padding-box;
        border-radius: 7px;
        background-color: var(--color-text-4);
      }

      ::-webkit-scrollbar-thumb:hover {
        background-color: var(--color-text-3);
      }
    }
  }

  .layout-content {
    min-height: 100vh;
    overflow-y: hidden;
    background-color: var(--color-fill-2);
    transition: padding 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
  }
  .zhedie {
    height: 60px;

  }
  .fixbox {
    margin: 0;
    position: relative;
    bottom: 0;
    height: 60px;
    width: 100%;
  }

  .fixbox-fixbtn {
    display: inline-block;
    width: 18px;
    height: 18px;
    position: absolute;
    right: 0;
    bottom: 0;
    top: 0;
    left: 0;
    margin: auto;
    display: none;
    overflow: hidden;
  }
  .fixbox-wrapper {
    width: 24px;
    height: 24px;
    display: inline-block;
    cursor: pointer;
    position: absolute;
    right: 12px;
    bottom: 18px;
    color: #bfc3c7;
    color: RGB(var(--convoy-theme-M5));
  }

  .fixbox .bottomLine,
  .LeftSidebar
    .convoy-page-sidebar-wrapper.nodataclass
    .fixbox
    .fixbox-wrapper {
    display: none;
  }

  .fixbox .online-service {
    margin-left: 0;
    width: 40px;
  }
  .container {
    padding: 16px 20px;
    border-radius: 5px;
  }
  .fixbox .online-service-wrapper {
    margin-left: 8px;
    width: 32px;
    height: 32px;
    background-color: #fff;
    background-color: RGB(var(--convoy-theme-M9));
    box-shadow: 0 8px 15px 0 rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    border-radius: var(--skin-css-var-Ra3, 8px);
  }

  .fixbox .online-service-wrapper:hover {
    background-color: #146aff;
    background-color: RGB(var(--convoy-theme-S3));
    box-shadow: 0 10px 10px 0 rgba(20, 106, 255, 0.3);
    box-shadow: 0 10px 10px 0 RGBA(var(--convoy-theme-S3), 0.3);
  }

  .fixbox .online-service-wrapper:hover .online-service-logo {
    color: #fff;
    color: RGB(var(--convoy-theme-M9));
  }

  .fixbox .online-service-title {
    display: none;
  }
</style>
