<script lang="ts" setup>
const props = defineProps({
  tag: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
  isSelect: {
    type: Boolean,
    default: false,
  }
});
// const emit = defineEmits(['on-success', 'on-error', 'on-before']);
</script>

<template>
  <div :class="isSelect ? 'tag-item tag-color-active' : 'tag-item tag-color'">
    {{ tag }}
  </div>
</template>

<style lang="less" scoped>
.tag-item {
  height: 28px;
  padding: 4px 9px;
  background: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 100px;
  margin-top: 6px;
  margin-bottom: 6px;
  margin-left: 5px;
  cursor: pointer;
}

.tag-color {
  border-color: var(--oa-color-primary);
  color: var(--oa-color-primary);
}

.tag-color-active {
  border-color: var(--oa-color-primary);
  color: #ffffff;
  background-color: var(--oa-color-primary);
}
</style>
