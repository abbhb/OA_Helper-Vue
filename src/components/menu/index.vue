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
    props: {
      top: {
        type:Boolean,
        default: false,
      },
    },
    emit: ['collapse', 'setCollapse'],
    setup(props) {
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

      const topMenu = computed(() => props.top);
      // 真顶部菜单控制
      const appTopMenu = computed(() => appStore.topMenu);
      const openKeys = ref<string[]>([]);
      const selectedKey = ref<string[]>([]);

      /**
       * 给定任意菜单 `name`，找到它最上层的菜单 `name`
       * @param tree 菜单数据
       * @param targetName 要查找的菜单 `name`
       * @returns 顶级菜单的 `name`，如果没有找到，返回 null
       */
      function findTopLevelMenuName(tree: RouteRecordRaw[], targetName: string): string | null {
        /**
         * 递归查找目标节点所属的顶级菜单
         * @param nodes 当前节点列表
         * @param target 当前目标节点名
         * @param parent 当前顶级菜单（路径上的第一级 parent）
         */
        function findTopLevel(nodes: RouteRecordRaw[], target: string, parent: RouteRecordRaw | null = null): string | null {
          for (const node of nodes) {
            // 如果当前节点的名字等于目标名字，返回顶级菜单（即 `parent` 的 name）
            if (node.name === target) {
              // @ts-ignore
              return parent?.name || node.name;
            }

            // 如果有子节点，递归处理子节点
            if (node.children && node.children.length > 0) {
              const result = findTopLevel(node.children, target, parent || node);
              if (result) {
                return result;
              }
            }
          }
          return null; // 没有找到
        }

        // 调用递归函数，从整个树的顶层开始
        return findTopLevel(tree, targetName);
      }


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
        if (props.top){
          // 顶级菜单开启后selectedKey 设置为顶级菜单的key
          const resp = findTopLevelMenuName(menuTree.value,newRoute.name as string)
          console.log("顶级")
          console.log(resp)
          if (resp) {
            selectedKey.value = [resp as string];
          }
          return
        }
        // 侧边菜单逻辑
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
          console.log("selectKey:")
          console.log(selectedKey.value)
          selectedKey.value = [
            activeMenu || menuOpenKeys[menuOpenKeys.length - 1],
          ];
          console.log("selectKey-NEW:")

          console.log(selectedKey.value)

        }
      }, true);
      const setCollapse = (val: boolean) => {
        // emit('setCollapse',val)
        // 对应修改高亮项
      };

      const renderSubMenu = () => {

        /**
         * 查找目标节点所属的顶级菜单，并返回该顶级菜单下的所有子菜单
         * @param tree 整棵树
         * @param targetName 目标节点的 name
         * @returns 属于目标节点的顶级菜单的所有子菜单，或 null 未找到时
         */
        function findTopLevelMenuWithChildren(tree: RouteRecordRaw[], targetName: string): RouteRecordRaw[] | null {
          /**
           * 递归在树中查找目标节点，返回其路径
           */
          function findNodePath(
            nodes: RouteRecordRaw[],
            target: string,
            path: RouteRecordRaw[] = []
          ): RouteRecordRaw[] | null {
            for (const node of nodes) {
              // 追加当前节点到路径
              const currentPath = path.concat(node);

              // 如果当前节点是目标节点
              if (node.name === target) {
                return currentPath;
              }

              // 递归处理子节点
              if (node.children) {
                const result = findNodePath(node.children, target, currentPath);
                if (result) {
                  return result;
                }
              }
            }
            return null;
          }

          // 递归查找targetName的路径
          const path = findNodePath(tree, targetName);

          // 确保找到并确认顶级菜单（parentId = 0）
          if (path) {
            for (let i = path.length - 1; i > 0; i--) {
              // @ts-ignore
              if (path[i]?.parentId === 0) {
                return path[i].children || [];
              }
            }

            // 不存在显式parentId的话，假定第一路径的初始节点作为顶级菜单
            return path[0].children || [];
          }
          return null;
        }

        function travel(_route: RouteRecordRaw[], nodes = []) {
          console.log("生成---2-2")
          console.log(_route)
          if (_route) {
            console.log("生成菜单----------------------1")
            console.log(_route)
            console.log("生成菜单----------------------2")

            _route.forEach((element) => {
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
        function travelTop(_route: RouteRecordRaw[], nodes = []) {
          if (_route) {
            _route.forEach((element) => {
              // For type C, show as normal menu item
              if (element?.meta?.type === 'C') {
                nodes.push(
                  <a-menu-item
                    key={element?.name ? element?.name : element?.path}
                    onClick={() => goto(element)}
                  >
                    {t(element?.meta?.locale || '')}
                  </a-menu-item>
                );
              }
              // For type M with children, find first type C child to link to
              else if (element?.children?.length) {
                const findFirstCType = (children) => {
                  for (const child of children) {
                    if (child?.meta?.type === 'C') {
                      return child;
                    }
                    if (child?.children?.length) {
                      const found = findFirstCType(child.children);
                      if (found) return found;
                    }
                  }
                  return null;
                };
                
                const firstCTypeChild = findFirstCType(element.children);
                if (firstCTypeChild) {
                  nodes.push(
                    <a-menu-item
                      key={element?.name}
                      onClick={() => goto(firstCTypeChild)}
                    >
                      {t(element?.meta?.locale || '')}
                    </a-menu-item>
                  );
                }
              }
            });
          }
          return nodes;
        }

        let tempMenuTree = menuTree.value
        if (appTopMenu.value){
          // 真的开启了顶部菜单栏，左侧菜单栏有区别 仅展示二级及以上菜单
          const t2 = findTopLevelMenuWithChildren(tempMenuTree, selectedKey.value[0]);
          if (t2){
            // 同级菜单
            tempMenuTree = t2
          }
        }
        return props.top ? travelTop(menuTree.value) : travel(tempMenuTree);
      };

      return () => (
        <a-menu
          mode={topMenu.value ? 'horizontal' : 'vertical'}
          v-model:collapsed={collapsed.value}
          v-model:open-keys={openKeys.value}
          default-selected-keys={selectedKey.value}
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
