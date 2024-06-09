<template>
  <a-card
    class="general-card"
    :title="$t('workplace.quick.operation')"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ paddingTop: '26px' }"
  >
    <template #extra>
      <a-link @click="openManger">管理</a-link>
    </template>
    <div style="margin-bottom: -1rem">
      <a-row v-if="selectedRoutes.length > 0" :gutter="8">
        <a-col
          v-for="link in selectedRoutes"
          :key="link.path"
          :span="8"
          class="wrapper"
          @click="router.push({ name: link.name })"
        >
          <div class="waibuicon">
            <functional-icons
              -
              :icon="link.meta.icon ? link.meta.icon : 'icon-loading'"
              size="28"
            ></functional-icons>
          </div>
          <a-typography-paragraph class="text">
            <!--标红但不影响-->
            {{ $t(link.meta.locale ? link.meta.locale : link.name) }}
          </a-typography-paragraph>
        </a-col>
      </a-row>
      <a-typography-paragraph v-else class="text">
        <a-empty />
      </a-typography-paragraph>
    </div>
  </a-card>
  <a-modal
    v-model:visible="status.mangerStatus"
    :draggable="false"
    :esc-to-close="false"
    :mask-closable="false"
    :closable="false"
    :fullscreen="appStore.modelFullscreen"
    title="管理快捷操作"
    :width="800"
    unmount-on-close
    @ok="Ok"
    @cancel="cancel"
  >
    <div class="route-manager">
      <div class="sidebar">
        <div>
          <el-button class="add-btn" @click="addAllRoutes"
            >全部添加 +</el-button
          >
        </div>
        <div v-for="route in availableRoutes" :key="route.name">
          <div class="el-card card" @click="addItem(route)">
            <div class="icon">
              <functional-icons
                v-if="route.meta.icon"
                :icon="route.meta.icon ? route.meta.icon : 'icon-loading'"
                size="28"
              ></functional-icons>
            </div>
            <div class="title"
              >{{ $t(route.meta.locale ? route.meta.locale : route.name) }}
            </div>
          </div>
        </div>
      </div>
      <div class="selected-routes">
        <el-tag> 拖动排序 </el-tag>
        <draggable
          v-model="selectedRoutes"
          item-key="name"
          @start="dragStart"
          @end="dragEnd"
        >
          <template #item="{ element }">
            <div class="route-item">
              {{ $t(element.meta.locale ? element.meta.locale : element.name) }}
              <el-icon class="delete-icon" @click="removeRoute(element)"
                >delete</el-icon
              >
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/store';
  import { ref } from 'vue';
  import FunctionalIcons from '@/components/icon/FunctionalIcons/index.vue';
  import router from '@/router';
  import { RouteRecordNormalized } from 'vue-router';
  import draggable from 'vuedraggable';
  import { WHITE_LIST } from '@/router/constants';
  import useMenuStore from '@/store/modules/menu';
  import _ from 'lodash';

  const status = ref({
    mangerStatus: false,
    bakRouter: [],
  });
  const appStore = useAppStore();
  const menuStore = useMenuStore();
  // console.log()
  const selectedRoutes = ref<RouteRecordNormalized[]>(
    appStore.getQuickRouter()
  );
  const availableRoutes = ref<RouteRecordNormalized[]>([
    // 填充所有可用路由的数组
  ]);

  const addItem = (route: RouteRecordNormalized) => {
    selectedRoutes.value.push(route);
    availableRoutes.value.splice(availableRoutes.value.indexOf(route), 1);
  };
  const addAllRoutes = () => {
    selectedRoutes.value = [...availableRoutes.value];
    availableRoutes.value = [];
  };

  const removeRoute = (route) => {
    availableRoutes.value.push(route);
    selectedRoutes.value.splice(selectedRoutes.value.indexOf(route), 1);
  };

  // 拖拽相关方法
  const dragStart = () => {
    // 拖拽开始时的逻辑
  };

  const dragEnd = () => {
    // 拖拽结束时的逻辑
  };

  const openManger = () => {
    status.value.bakRouter = _.cloneDeep(selectedRoutes.value);

    const routerList = router.getRoutes();
    for (let i = 0; i < routerList.length; i += 1) {
      if (WHITE_LIST.find((el) => el.name === routerList[i].name)) {
        // eslint-disable-next-line no-continue
        continue;
      }
      let exist = false;
      let existElement = null;
      const tempServerList = [...menuStore.appAsyncMenus];
      while (tempServerList.length && !exist) {
        const element = tempServerList.shift();
        if (element?.name === routerList[i].name) {
          existElement = element;
          if (!element?.meta?.icon) {
            element.meta.icon = routerList[i].meta.icon;
          }
          exist = true;
        }

        // 目前就2级路由！第三级为按钮权限
        if (element?.children) {
          // 二级菜单大多没icon，继承父级图标
          for (let j = 0; j < element?.children.length; j += 1) {
            if (!element?.children[j]?.meta?.icon) {
              element.children[j].meta.icon = element.meta.icon;
            }
            tempServerList.push(
              element.children[j] as unknown as RouteRecordNormalized
            );
          }
        }
      }
      if (exist) {
        availableRoutes.value.push(existElement);
      }
    }
    status.value.mangerStatus = true;
  };
  const Ok = () => {
    // 持久化更改，并立即上传服务器一次
    appStore.updateQuickRoute(selectedRoutes.value);
  };
  const cancel = () => {
    console.log('close');
    console.log(status.value.bakRouter);
    console.log(selectedRoutes.value);
    // 将显示同步成bak
    selectedRoutes.value = status.value.bakRouter;
  };
</script>

<style lang="less" scoped>
  :deep(.arco-card-header-title) {
    line-height: inherit;
  }
  /* 基本样式 */
  .route-item {
    padding: 10px;
    margin: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f9f9f9;
    transition: box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out;
  }

  /* 鼠标悬停效果 */
  .route-item:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  /* 删除图标样式 */
  .delete-icon {
    cursor: pointer;
    color: #f56c6c;
    transition: color 0.3s ease;
  }

  /* 删除图标悬停效果 */
  .delete-icon:hover {
    color: #e63333;
  }

  /* 拖拽时的阴影效果 */
  .vue-draggable-drag {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    opacity: 0.7;
  }

  /* 拖拽结束的动画效果 */
  .vue-draggable-drag .route-item {
    transition: transform 0.3s ease-out;
  }
  .route-manager {
    display: flex;
  }

  .sidebar {
    width: 200px;
    margin-right: 20px;
    height: 500px;
    overflow-y: auto;
  }

  .route-item {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between; /* 两端对齐 */
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
  }

  .card {
    display: flex;
    align-content: flex-end;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #ccc;
    height: 50px;
  }
  .icon {
    font-size: 24px;
    padding: 10px 10px 10px 10px;
  }

  .title {
    text-align: center;
    padding: 10px 10px 10px 10px;
  }

  .add-btn {
    margin-top: 20px;
  }

  .selected-routes {
    flex: 1;
  }

  .delete-icon {
    cursor: pointer;
    margin-left: auto; /* 放置在Flex容器的末端 */
  }
  .waibuicon {
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
</style>
