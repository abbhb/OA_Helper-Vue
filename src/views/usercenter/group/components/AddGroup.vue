<script lang="ts" setup>
import {reactive, ref} from 'vue';

const formRef = ref();
const form = reactive({
  name: '',
});
const rules = [
  {
    validator: (value, cb) => {
      return new Promise<void>((resolve) => {
        window.setTimeout(() => {
          if (value !== 'admin') {
            cb('name must be admin');
          }
          resolve();
        }, 2000);
      });
    },
  },
];
const handleClick = () => {
  formRef.value.setFields({
    name: {
      status: 'error',
      message: 'async name error',
    },
  });
};
</script>

<template>
  <div>
    <a-scrollbar style="height: 500px; overflow-y: auto">
      <div class="hir">
        <div class="shu">
          <a-form ref="formRef" :model="form" :style="{ width: '600px' }">
            <a-form-item :label="$t('usercenter.group.name')" :rules="rules" field="name">
              <a-input
                v-model="form.name"
                :placeholder="$t('usercenter.group.name.tip')"
              />
            </a-form-item>
            <a-form-item>
              <a-button @click="handleClick">Set Status</a-button>
            </a-form-item>
          </a-form>
        </div>
        <div class="shu"></div>
      </div>
    </a-scrollbar>
  </div>
</template>

<style lang="less" scoped>
.hir {
  display: flex;
  flex-direction: row;
  height: 100%;
}

.shu {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}
</style>
