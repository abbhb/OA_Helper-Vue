<template>
<!--  <div class="container">-->
<!--    <div class="left-side">-->
<!--      <a-card class="panel" :title="$t('基础信息')">-->
<!--        <UpdateUserInfo v-if="type === 'updateUserInfo' || !type" />-->
<!--      </a-card>-->

<!--      <a-card class="panel" :title="$t('实名认证')" style="margin-top: 16px">-->
<!--        <UserVerification />-->
<!--      </a-card>-->

<!--      <a-card class="panel" :title="$t('安全设置')" style="margin-top: 16px">-->
<!--        <SecuritySettings />-->
<!--      </a-card>-->
<!--    </div>-->
<!--    <div class="right-side">-->
<!--      <QuickOperation />-->
<!--    </div>-->
<!--    -->
<!--  </div>-->
  <div class="container">
    <Breadcrumb :items="['menu.user', 'menu.user.setting']" />
    <a-row style="margin-bottom: 16px">
      <a-col :span="24">
        <UserPanel />
      </a-col>
    </a-row>
    <a-row class="wrapper">
      <a-col :span="24">
        <a-tabs default-active-key="1" type="rounded">
          <a-tab-pane key="1" :title="$t('基础信息')">
            <UpdateUserInfo />
          </a-tab-pane>
          <a-tab-pane key="2" :title="$t('安全设置')">
            <SecuritySettings />
          </a-tab-pane>
          <a-tab-pane key="3" :title="$t('实名认证')">
            <UserVerification />
          </a-tab-pane>
          <a-tab-pane key="4" :title="$t('Passkey')">
            <PasskeyManger />
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import UpdateUserInfo from '@/views/usercenter/usercenter/components/update-userinfo.vue';
  import { useRouter } from 'vue-router';
  import SecuritySettings from '@/views/usercenter/usercenter/components/security-settings.vue';
  import UserVerification from '@/views/usercenter/usercenter/components/user-verification.vue';
  import UserPanel from "@/views/usercenter/usercenter/components/user-panel.vue";
  import PasskeyManger from "@/views/usercenter/usercenter/components/passkey-manger.vue";

  const router = useRouter();
  const { type } = router.currentRoute.value.query;
</script>

<!--<style lang="less" scoped>-->
<!--  .container {-->
<!--    background-color: var(&#45;&#45;color-fill-2);-->
<!--    padding: 16px 20px;-->
<!--    display: flex;-->
<!--    gap: 16px;-->
<!--  }-->

<!--  .left-side {-->
<!--    flex: 1;-->

<!--    .panel {-->
<!--      background-color: var(&#45;&#45;color-bg-2);-->
<!--      border-radius: 4px;-->
<!--    }-->
<!--  }-->

<!--  .right-side {-->
<!--    width: 280px;-->
<!--  }-->

<!--  .panel {-->
<!--    background-color: var(&#45;&#45;color-bg-2);-->
<!--    border-radius: 4px;-->
<!--    overflow: auto;-->
<!--  }-->
<!--  :deep(.panel-border) {-->
<!--    margin-bottom: 0;-->
<!--    border-bottom: 1px solid rgb(var(&#45;&#45;gray-2));-->
<!--  }-->
<!--  .moduler-wrap {-->
<!--    border-radius: 4px;-->
<!--    background-color: var(&#45;&#45;color-bg-2);-->
<!--    :deep(.text) {-->
<!--      font-size: 12px;-->
<!--      text-align: center;-->
<!--      color: rgb(var(&#45;&#45;gray-8));-->
<!--    }-->

<!--    :deep(.wrapper) {-->
<!--      margin-bottom: 8px;-->
<!--      text-align: center;-->
<!--      cursor: pointer;-->

<!--      &:last-child {-->
<!--        .text {-->
<!--          margin-bottom: 0;-->
<!--        }-->
<!--      }-->
<!--      &:hover {-->
<!--        .icon {-->
<!--          color: rgb(var(&#45;&#45;arcoblue-6));-->
<!--          background-color: #e8f3ff;-->
<!--        }-->
<!--        .text {-->
<!--          color: rgb(var(&#45;&#45;arcoblue-6));-->
<!--        }-->
<!--      }-->
<!--    }-->

<!--    :deep(.icon) {-->
<!--      display: inline-block;-->
<!--      width: 32px;-->
<!--      height: 32px;-->
<!--      margin-bottom: 4px;-->
<!--      color: rgb(var(&#45;&#45;dark-gray-1));-->
<!--      line-height: 32px;-->
<!--      font-size: 16px;-->
<!--      text-align: center;-->
<!--      background-color: rgb(var(&#45;&#45;gray-1));-->
<!--      border-radius: 4px;-->
<!--    }-->
<!--  }-->
<!--</style>-->

<!--<style lang="less" scoped>-->
<!--  // responsive-->
<!--  .mobile {-->
<!--    .container {-->
<!--      display: block;-->
<!--    }-->
<!--    .right-side {-->
<!--      // display: none;-->
<!--      width: 100%;-->
<!--      margin-left: 0;-->
<!--      margin-top: 16px;-->
<!--    }-->
<!--  }-->
<!--</style>-->
<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}

.wrapper {
  padding: 20px 0 0 20px;
  min-height: 580px;
  background-color: var(--color-bg-2);
  border-radius: 4px;
}

:deep(.section-title) {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 14px;
}
</style>
