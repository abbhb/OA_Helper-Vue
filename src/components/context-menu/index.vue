<script lang="ts" setup>
import {ref} from 'vue';
import {useContextMenu} from './use-context-menu';

const props = defineProps({
  menu: {
    type: Array,
    default: () => [],
  },
});
const containerRef = ref(null);
const emit = defineEmits(['select']);
const {x, y, showMenu} = useContextMenu(containerRef);
const handleClick = (item) => {
  showMenu.value = false;
  emit('select', item);
};
const handleBeforeEnter = (el) => {
  el.style.height = 0;
};
const handleEnter = (el) => {
  el.style.height = 'auto';
  const h = el.clientHeight;
  el.style.height = 0;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.height = `${h}px`;
      el.style.transaction = '.5s';
    });
  });
};
const handleAfterEnter = (el) => {
  el.style.transition = 'none';
};
</script>

<template>
  <div ref="containerRef">
    <slot></slot>
    <Teleport to="body">
      <Transition
        @afterEnter="handleAfterEnter"
        @beforeEnter="handleBeforeEnter"
        @enter="handleEnter"
      >
        <div
          v-if="showMenu"
          :style="{
            left: x + 'px',
            top: y + 'px',
          }"
          class="context-menu"
        >
          <div v-for="item in menu" :key="item.label" class="menu-item">
            <div class="menu-icon">
              <div class="icon">
                <component :is="item.icon"/>
              </div>
            </div>
            <div class="menu-title">
              {{ item.label }}
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style lang="less" scoped>
.context-menu {
  background: #ffffff;
  position: fixed;
  box-shadow: -2px 2px 2px 1px rgba(218, 218, 218, 0.6);
  border-radius: 5px;
  border: 1px rgba(218, 218, 218, 0.6) solid;
  padding-top: 5px;
  padding-block-end: 5px;
  padding-left: 2px;
  padding-right: 2px;
}

.menu-item {
  padding: 10px 4px 0px 10px;
  width: 140px;
  display: flex;
  flex-direction: row;
  height: 40px;
  align-items: center;
  text-align: center;

}

.menu-icon {
  width: 40px;
  height: 45px;
  display: flex;
  align-items: center;
  padding-bottom: 3px;
}

.menu-title {
  height: 35px;
  line-height: 30px;

}

.menu-item:hover {
  padding: 10px 4px 0px 10px;
  background: rgba(211, 211, 211, 0.34);
  width: 140px;
  display: flex;
  flex-direction: row;
  height: 40px;
  align-items: center;
}

.icon {
  color: rgb(var(--arcoblue-6));
  font-size: 30px;
}
</style>
