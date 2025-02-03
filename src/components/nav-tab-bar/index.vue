<template>
  <div class="navbar">
    <div class="left-side">
      <a-space>
        <!--        向左返回-->
        <a-trigger
          position="bottom"
          auto-fit-position
          :unmount-on-close="false"
        >
          <a-button
            type="primary"
            shape="circle"
            @click="router.back()"
          >
            <icon-left />
          </a-button>
          <template #content>
            <div class="demo-basic"> 返回上一级 </div>
          </template>
        </a-trigger>
        <a-trigger
          position="bottom"
          auto-fit-position
          :unmount-on-close="false"
        >
          <a-button
            type="primary"
            shape="circle"
            @click="router.push({ name: 'Workplace' })"
          >
            <icon-home />
          </a-button>
          <template #content>
            <div class="demo-basic"> 返回工作台 </div>
          </template>
        </a-trigger>
        <a-breadcrumb
          :max-count="3"
          :routes="routers as BreadcrumbRoute[]"
          :droplist="[]"
        >
          <template #item-render="{ route, paths }">
            <a-link
              :disabled="!routesPlus.isCanGo(route)"
              @click="router.push({ name: route.name })"
            >
              {{ $t(route.meta.locale) }}
            </a-link>
            <span style="display: none">{{ paths }}</span>
          </template>
        </a-breadcrumb>
        <!--        <TabBar v-if="appStore.tabBar" />-->
      </a-space>
    </div>
    <div class="center-side">
      <Menu v-if="topMenu" key="topMenu" :top="true"/>
    </div>
    <ul class="right-side">
      <li>
        <a-tooltip :content="$t('settings.language')">
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="setDropDownVisible"
          >
            <template #icon>
              <icon-language />
            </template>
          </a-button>
        </a-tooltip>
        <a-dropdown trigger="click" @select="changeLocale as any">
          <div ref="triggerBtn" class="trigger-btn"></div>
          <template #content>
            <a-doption
              v-for="item in locales"
              :key="item.value"
              :value="item.value"
            >
              <template #icon>
                <icon-check v-show="item.value === currentLocale" />
              </template>
              {{ item.label }}
            </a-doption>
          </template>
        </a-dropdown>
      </li>
      <li>
        <a-tooltip
          :content="
            theme === 'light'
              ? $t('settings.navbar.theme.toDark')
              : $t('settings.navbar.theme.toLight')
          "
        >
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="handleToggleTheme"
          >
            <template #icon>
              <icon-moon-fill v-if="theme === 'dark'" />
              <icon-sun-fill v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <!--      <li>-->
      <!--        <a-tooltip :content="$t('settings.navbar.alerts')">-->
      <!--          <div class="message-box-trigger">-->
      <!--            <a-badge :count="9" dot>-->
      <!--              <a-button-->
      <!--                class="nav-btn"-->
      <!--                type="outline"-->
      <!--                :shape="'circle'"-->
      <!--                @click="setPopoverVisible"-->
      <!--              >-->
      <!--                <icon-notification />-->
      <!--              </a-button>-->
      <!--            </a-badge>-->
      <!--          </div>-->
      <!--        </a-tooltip>-->
      <!--        <a-popover-->
      <!--          trigger="click"-->
      <!--          :arrow-style="{ display: 'none' }"-->
      <!--          :content-style="{ padding: 0, minWidth: '400px' }"-->
      <!--          content-class="message-popover"-->
      <!--        >-->
      <!--          <div ref="refBtn" class="ref-btn"></div>-->
      <!--          <template #content>-->
      <!--            <message-box />-->
      <!--          </template>-->
      <!--        </a-popover>-->
      <!--      </li>-->
      <li>
        <a-tooltip
          :content="
            isFullscreen
              ? $t('settings.navbar.screen.toExit')
              : $t('settings.navbar.screen.toFull')
          "
        >
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="toggleFullScreen"
          >
            <template #icon>
              <icon-fullscreen-exit v-if="isFullscreen" />
              <icon-fullscreen v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-tooltip :content="$t('settings.title')">
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="setVisible"
          >
            <template #icon>
              <icon-settings />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-dropdown trigger="click">
          <a-avatar
            :size="32"
            :style="{ marginRight: '8px', cursor: 'pointer' }"
          >
            <img alt="avatar" :src="avatar" />
          </a-avatar>
          <template #content>
            <!--            <a-doption>-->
            <!--              <a-space @click="switchRoles">-->
            <!--                <icon-tag />-->
            <!--                <span>-->
            <!--                  {{ $t('messageBox.switchRoles') }}-->
            <!--                </span>-->
            <!--              </a-space>-->
            <!--            </a-doption>-->
            <a-doption>
              <a-space
                v-is-auth="true"
                @click="$router.push({ name: 'profile' })"
              >
                <icon-user />
                <span>
                  {{ userStore.name }}
                </span>
              </a-space>
            </a-doption>
            <a-doption>
              <a-space @click="gotoCASUserCenter()">
                <icon-settings />
                <span>
                  {{ $t('messageBox.casCenter') }}
                </span>
              </a-space>
            </a-doption>
            <a-doption>
              <a-space @click="alert('此功能在2023年底前上线')">
                <icon-export />
                <span>
                  {{ $t('messageBox.switchUser') }}
                </span>
              </a-space>
            </a-doption>
            <a-doption>
              <a-space @click="handleLogout">
                <icon-export />
                <span>
                  {{ $t('messageBox.logout') }}
                </span>
              </a-space>
            </a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { computed, inject, reactive, ref } from 'vue';
  import { BreadcrumbRoute, Message } from '@arco-design/web-vue';
  import { useDark, useFullscreen, useToggle } from '@vueuse/core';
  import { useAppStore, useUserStore } from '@/store';
  import { LOCALE_OPTIONS } from '@/locale';
  import useLocale from '@/hooks/locale';
  import useUser from '@/hooks/user';
  import Menu from '@/components/menu/index.vue';
  import TabBar from '@/components/tab-bar/index.vue';
  import {
    RouteLocationMatched,
    RouteRecord,
    RouteRecordRaw,
    useRoute,
  } from 'vue-router';
  import router from '@/router';
  import useRouterPlus from '@/hooks/router';

  const route = useRoute();
  const routesPlus = useRouterPlus();
  const appStore = useAppStore();
  const userStore = useUserStore();
  const { logout } = useUser();
  const { changeLocale, currentLocale } = useLocale();
  const { isFullscreen, toggle: toggleFullScreen } = useFullscreen();
  const locales = [...LOCALE_OPTIONS];
  const avatar = computed(() => {
    return userStore.avatar;
  });
  const theme = computed(() => {
    return appStore.theme;
  });
  const routers = computed((): BreadcrumbRoute[] => {
    const aone = [
      {
        path: 'workplace',
        name: 'Workplace',
        meta: {
          locale: 'menu.dashboard.workplace',
        },
      },
    ];
    const copy: (
      | {
          path: string;
          name: string;
          meta: { locale: string };
          children?: RouteRecordRaw[];
        }
      | RouteRecord
      | any
    )[] = [...aone, ...route.matched];
    for (let i = 0; i < copy.length; i += 1) {
      copy[i].children = undefined;
      console.log(`isccan:${routesPlus.isCanGo(copy[i])}`);
    }
    return copy;
  });

  const topMenu = computed(() => appStore.topMenu && appStore.menu);
  const isDark = useDark({
    selector: 'body',
    attribute: 'arco-theme',
    valueDark: 'dark',
    valueLight: 'light',
    storageKey: 'arco-theme',
    onChanged(dark: boolean) {
      // overridden default behavior
      appStore.toggleTheme(dark);
    },
  });

  const toggleTheme = useToggle(isDark);
  const handleToggleTheme = () => {
    toggleTheme();
  };
  const setVisible = () => {
    appStore.updateSettings({ globalSettings: true });
  };
  const refBtn = ref();
  const triggerBtn = ref();
  const setPopoverVisible = () => {
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    refBtn.value.dispatchEvent(event);
  };
  const handleLogout = () => {
    logout();
  };
  const setDropDownVisible = () => {
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    triggerBtn.value.dispatchEvent(event);
  };
  const switchRoles = async () => {
    const res = await userStore.switchPermission();
    Message.success(res as string);
  };
  const toggleDrawerMenu = inject('toggleDrawerMenu') as () => void;
  const gotoCASUserCenter = () => {
    window.location.href = 'http://10.15.247.254:55554';
  };
</script>

<style scoped lang="less">
  .navbar {
    display: flex;
    justify-content: space-between;
    height: 100%;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);
  }

  .left-side {
    display: flex;
    align-items: center;
    padding-left: 20px;
  }

  .center-side {
    flex: 1;
  }

  .right-side {
    display: flex;
    padding-right: 20px;
    list-style: none;
    :deep(.locale-select) {
      border-radius: 20px;
    }
    li {
      display: flex;
      align-items: center;
      padding: 0 10px;
    }

    a {
      color: var(--color-text-1);
      text-decoration: none;
    }
    .nav-btn {
      border-color: rgb(var(--gray-2));
      color: rgb(var(--gray-8));
      font-size: 16px;
    }
    .trigger-btn,
    .ref-btn {
      position: absolute;
      bottom: 14px;
    }
    .trigger-btn {
      margin-left: 14px;
    }
  }
</style>

<style lang="less">
  .message-popover {
    .arco-popover-content {
      margin-top: 0;
    }
  }
</style>
