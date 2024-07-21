<template>
  <div class="navbar">
    <div class="left-side">
      <a-space>
        <!--        <img-->
        <!--          alt="logo"-->
        <!--          src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/dfdba5317c0c20ce20e64fac803d52bc.svg~tplv-49unhts6dw-image.image"-->
        <!--        />-->
        <a-typography-title
          :style="{ margin: 0, fontSize: '18px' }"
          :heading="5"
          class="title-eoa"
        >
          Easy_OA
        </a-typography-title>
        <a-badge
          style="cursor: pointer"
          dot
          :count="appStore.versionRead !== currentVersion ? 1 : 0"
          :dot-style="{ width: '10px', height: '10px' }"
          @click="readVersion"
        >
          <a-tag>{{ currentVersion }}</a-tag>
        </a-badge>
        <icon-menu-fold
          v-if="!topMenu && appStore.device === 'mobile'"
          style="font-size: 22px; cursor: pointer"
          @click="toggleDrawerMenu"
        />
      </a-space>
    </div>
    <div class="center-side">
      <Menu v-if="topMenu" />
    </div>
    <ul class="right-side">
      <!--      <li>-->
      <!--        <a-tooltip :content="$t('settings.search')">-->
      <!--          <a-button class="nav-btn" type="outline" :shape="'circle'">-->
      <!--            <template #icon>-->
      <!--              <icon-search />-->
      <!--            </template>-->
      <!--          </a-button>-->
      <!--        </a-tooltip>-->
      <!--      </li>-->
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

      <!--     // todo:消息模块单独做，需要添加到此处的消息直接添加至表即可，每次点开此处都请求 -->
      <li>
        <a-tooltip :content="$t('settings.navbar.alerts')">
          <div class="message-box-trigger">
            <a-badge :count="NoRead" :dot="true">
              <a-button
                class="nav-btn"
                type="outline"
                :shape="'circle'"
                @click="setPopoverVisible"
              >
                <icon-notification />
              </a-button>
            </a-badge>
          </div>
        </a-tooltip>
        <a-popover
          trigger="click"
          :arrow-style="{ display: 'none' }"
          :content-style="{ padding: 0, minWidth: '400px' }"
          content-class="message-popover"
        >
          <div ref="refBtn" class="ref-btn"></div>
          <template #content>
            <MessageBox />
          </template>
        </a-popover>
      </li>
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
            <!--            <a-doption>-->
            <!--              <a-space @click="gotoCASUserCenter()">-->
            <!--                <icon-settings />-->
            <!--                <span>-->
            <!--                  {{ $t('messageBox.casCenter') }}-->
            <!--                </span>-->
            <!--              </a-space>-->
            <!--            </a-doption>-->
            <a-doption>
              <a-space @click="Message.info('此功能在2023年底前上线')">
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
  import { computed, inject, ref } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { useDark, useFullscreen, useToggle } from '@vueuse/core';
  import { useAppStore, useUserStore } from '@/store';
  import { LOCALE_OPTIONS } from '@/locale';
  import useLocale from '@/hooks/locale';
  import useUser from '@/hooks/user';
  import Menu from '@/components/menu/index.vue';
  import router from '@/router';
  import MessageBox from '@/components/message-box/index.vue';
  import version from '@/config/version.json';
  import {useSystemMessageStore} from "@/store/modules/app/systemMessage";

  const appStore = useAppStore();
  const userStore = useUserStore();
  const { logout } = useUser();
  const { changeLocale, currentLocale } = useLocale();
  const { isFullscreen, toggle: toggleFullScreen } = useFullscreen();
  const locales = [...LOCALE_OPTIONS];
  const systemMessageStore = useSystemMessageStore();
  const avatar = computed(() => {
    return userStore.avatar;
  });
  const theme = computed(() => {
    return appStore.theme;
  });
  const NoRead = computed(() => {
    return systemMessageStore.noReadCount.noread;
  });
  const topMenu = computed(() => appStore.topMenu && appStore.menu);
  const currentVersion = version[version.length - 1].version;
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

  const readVersion = () => {
    appStore.updateSettings({ versionRead: currentVersion });
    router.push({ name: 'VersionIndex' });
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

  @media screen and (max-width: 599px) {
    .title-eoa {
      display: none;
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
