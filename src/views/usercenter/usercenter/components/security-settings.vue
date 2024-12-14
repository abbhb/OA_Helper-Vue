<template>
  <div class="security-settings">
    <!-- 登录密码设置项 -->
    <div class="security-item">
      <div class="item-info">
        <div class="title">登录密码</div>
        <div class="description">用于保护账号信息安全</div>
      </div>
      <a-button type="text" @click="handlePasswordEdit">修改</a-button>
    </div>

    <!-- 安全邮箱设置项 -->
    <div class="security-item">
      <div class="item-info">
        <div class="title">安全邮箱</div>
        <div class="description">已绑定邮箱：{{ userEmail }}</div>
      </div>
      <a-button type="text" @click="handleEmailEdit">修改</a-button>
    </div>

    <!-- 修改密码弹窗 -->
    <a-modal
      v-model:visible="showPasswordDialog"
      :title="$t('修改登录密码')"
      :footer="false"
      @cancel="showPasswordDialog = false"
    >
      <SettingPassword />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { useUserStore } from '@/store';
  import { Message } from '@arco-design/web-vue';
  import SettingPassword from './setting-password.vue';

  const userStore = useUserStore();
  const showPasswordDialog = ref(false);
  const userEmail = computed(() => {
    return userStore.email;
  });

  const handlePasswordEdit = () => {
    showPasswordDialog.value = true;
  };

  const handleEmailEdit = () => {
    // 处理邮箱修改逻辑
    Message.error('暂不支持个人修改，请联系管理员修改!');
  };
</script>

<style lang="less" scoped>
  .security-settings {
    .security-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid var(--color-border);

      &:last-child {
        border-bottom: none;
      }

      .item-info {
        .title {
          font-weight: 500;
          margin-bottom: 4px;
          color: var(--color-text-1);

        }
        .description {
          color: rgb(var(--gray-6));
          font-size: 13px;
        }
      }
    }
  }
</style>
