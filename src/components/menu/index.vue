<script lang="tsx">
  import { compile, computed, defineComponent, h, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type { RouteMeta } from 'vue-router';
  import {
    RouteLocationNormalized,
    RouteRecordRaw,
    useRoute,
    useRouter,
  } from 'vue-router';
  import { useAppStore } from '@/store';
  import { listenerRouteChange } from '@/utils/route-listener';
  import { openWindow, regexUrl } from '@/utils';
  import { Message } from '@arco-design/web-vue';
  import useMenuTree from './use-menu-tree';

  export default defineComponent({
    emit: ['collapse', 'setCollapse'],
    setup() {
      const { t } = useI18n();
      const appStore = useAppStore();
      const router = useRouter();
      const route = useRoute();
      const { menuTree } = useMenuTree();

      const collapsed = computed({
        get() {
          if (appStore.device === 'desktop') return appStore.menuCollapse;
          return false;
        },
        set(value: boolean) {
          appStore.updateSettings({ menuCollapse: value });
        },
      });

      const topMenu = computed(() => appStore.topMenu);
      const openKeys = ref<string[]>([]);
      const selectedKey = ref<string[]>([]);

      listenerRouteChange((route: RouteLocationNormalized) => {
        selectedKey.value = [route.name as string];
      }, true);

      const goto = (item: RouteRecordRaw) => {
        // 此item里的meta直接取决与后端返回
        // Open external link
        if (regexUrl.test(item.path)) {
          if (item.meta.frame) {
            console.log('外联');
            console.log(item);
            selectedKey.value = [item.name as string];
            if (item?.meta?.frame) {
              selectedKey.value = [
                (item.name ? item.name : item.path) as string,
              ];
            }
            openWindow(item.path);
            return;
          }
          Message.error('越权！该菜单禁止外链');
        }
        // Eliminate external link side effects
        const { show, activeMenu } = item.meta as RouteMeta;
        if (route.name === item.name && show && !activeMenu) {
          return;
        }

        // Trigger router change
        router.push({
          name: item.name,
        });
      };
      const findMenuOpenKeys = (target: string) => {
        const result: string[] = [];
        let isFind = false;
        const backtrack = (item: RouteRecordRaw, keys: string[]) => {
          if (item.name === target) {
            isFind = true;
            result.push(...keys);
            return;
          }
          if (item.children?.length) {
            item.children.forEach((el) => {
              backtrack(el, [...keys, el.name as string]);
            });
          }
        };
        menuTree.value.forEach((el: RouteRecordRaw) => {
          if (isFind) return; // Performance optimization
          backtrack(el, [el.name as string]);
        });
        return result;
      };
      listenerRouteChange((newRoute) => {
        const { requiresAuth, activeMenu, show } = newRoute.meta;
        console.log('三联');
        console.log(requiresAuth);
        console.log(activeMenu);
        console.log(show);
        if (requiresAuth) {
          const menuOpenKeys = findMenuOpenKeys(
            (activeMenu || newRoute.name) as string
          );
          console.log(menuOpenKeys);

          const keySet = new Set([...menuOpenKeys, ...openKeys.value]);
          openKeys.value = [...keySet];

          selectedKey.value = [
            activeMenu || menuOpenKeys[menuOpenKeys.length - 1],
          ];
        }
      }, true);
      const setCollapse = (val: boolean) => {
        // emit('setCollapse',val)
        // 对应修改高亮项
      };

      const renderSubMenu = () => {
        function travel(_route: RouteRecordRaw[], nodes = []) {
          if (_route) {
            _route.forEach((element) => {
              // This is demo, modify nodes as needed
              const icon = element?.meta?.icon
                ? () => h(compile(`<${element?.meta?.icon}/>`))
                : null;
              const node =
                // eslint-disable-next-line no-nested-ternary
                element?.meta?.type === 'C' ? (
                  <a-menu-item
                    key={element?.name ? element?.name : element?.path}
                    v-slots={{ icon }}
                    onClick={() => goto(element)}
                  >
                    {t(element?.meta?.locale || '')}
                  </a-menu-item>
                ) : element?.children && element?.children.length !== 0 ? (
                  <a-sub-menu
                    key={element?.name}
                    v-slots={{
                      icon,
                      title: () => h(compile(t(element?.meta?.locale || ''))),
                    }}
                  >
                    {travel(element?.children)}
                  </a-sub-menu>
                ) : (
                  <a-menu-item
                    key={element?.name}
                    v-slots={{ icon }}
                    onClick={() => goto(element)}
                  >
                    {t(element?.meta?.locale || '')}
                  </a-menu-item>
                );
              nodes.push(node as never);
            });
          }
          return nodes;
        }
        return travel(menuTree.value);
      };

      return () => (
        <a-menu
          mode={topMenu.value ? 'horizontal' : 'vertical'}
          v-model:collapsed={collapsed.value}
          v-model:open-keys={openKeys.value}
          show-collapse-button={false}
          auto-open={true}
          auto-scroll-into-view={true}
          accordion={true}
          selected-keys={selectedKey.value}
          auto-open-selected={true}
          level-indent={34}
          style="height: 100%;width:100%;"
          onCollapse={setCollapse}
        >
          {renderSubMenu()}
        </a-menu>
      );
    },
  });
</script>

<style lang="less">
  @import '@/assets/style/menu.less';
</style>

<style lang="less" scoped>
  :deep(.arco-menu-inner) {
    .arco-menu-inline-header {
      display: flex;
      align-items: center;
      .arco-menu-selected .arco-menu-icon {
        color: var(--color-text-3);
      }
    }
    .arco-icon {
      &:not(.arco-icon-down) {
        font-size: 18px;
      }
    }
  }
</style>
