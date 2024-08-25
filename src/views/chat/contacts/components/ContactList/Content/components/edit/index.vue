<template>
  <div class="editable-remark">
    <input
      v-model="currentValue"
      type="text"
      :class="{ 'edit-mode': isEditing }"
      @focus="isEditing = true"
      @blur="handleBlur"
      @change="handleChange"
    />
    <i
      v-if="!isEditing && currentValue"
      class="edit-icon"
      @click="editMode"
      >✎</i
    >
  </div>
</template>

<script setup>
  import { ref, watch, onMounted, defineProps, defineEmits } from 'vue';

  const props = defineProps({
    modelValue: String, // 绑定的值，即remarkName
    onEdit: Function, // 编辑完成后调用的方法
  });

  const emit = defineEmits(['update:modelValue']); // 定义事件以更新modelValue

  const isEditing = ref(false); // 控制是否处于编辑模式
  const currentValue = ref(props.modelValue); // 用于v-model的当前值

  // 激活编辑模式
  const editMode = () => {
    isEditing.value = true;
  };

  // 处理失去焦点事件
  const handleBlur = () => {
    isEditing.value = false;
    if (currentValue.value !== props.modelValue) {
      emit('update:modelValue', currentValue.value); // 触发更新
      if (props.onEdit) {
        props.onEdit(currentValue.value); // 调用自定义编辑方法
      }
    }
  };

  // 处理输入变化事件
  const handleChange = () => {
    // 可以在这里添加额外的逻辑，例如实时验证等
  };

  // 确保当前值与外部传入的值保持一致
  watch(
    () => props.modelValue,
    (newValue) => {
      currentValue.value = newValue;
    }
  );
</script>

<style scoped>
  .editable-remark input.edit-mode {
    /* 编辑模式下的样式 */
  }
  .edit-icon {
    cursor: pointer;
    /* 其他样式 */
  }
</style>
