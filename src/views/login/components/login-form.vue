<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">{{ $t('login.form.title') }}</div>
    <div class="login-form-sub-title">{{ $t('login.form.title') }}</div>
    <div class="login-form-error-msg">{{ errorMessage }}</div>
    <a-form
      v-if="!loginConfig.useSSO"
      ref="loginForm"
      :model="userInfo"
      class="login-form"
      layout="vertical"
      @submit="handleSubmit"
    >
      <a-form-item
        field="username"
        :rules="[{ required: true, message: $t('login.form.userName.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input
          v-model="userInfo.username"
          :placeholder="$t('login.form.userName.placeholder')"
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="password"
        :rules="[{ required: true, message: $t('login.form.password.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input-password
          v-model="userInfo.password"
          :placeholder="$t('login.form.password.placeholder')"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <div class="login-form-password-actions">
          <a-checkbox v-model="userInfo.week" checked="week">
            {{ $t('login.form.weekNoLogin') }}
          </a-checkbox>
          <a-link>{{ $t('login.form.forgetPassword') }}</a-link>
        </div>
        <a-button type="primary" html-type="submit" long :loading="loading">
          {{ $t('login.form.login') }}
        </a-button>
        <a-button
          type="text"
          long
          class="login-form-register-btn"
          @click="gotoOAuth2"
        >
          {{ $t('login.form.oauth2') }}
        </a-button>
      </a-space>
    </a-form>
    <div v-else-if="loginConfig.useSSO" class="login-2">
      <a-button size="large" type="primary" long @click="gotoOAuth2">{{
        $t('login.form.oauth2')
      }}</a-button>
      <a-button
        size="large"
        style="margin-top: 10px"
        type="outline"
        long
        @click="changeLoginConfig(false)"
        >{{ $t('login.form.traditionLogin') }}</a-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useI18n } from 'vue-i18n';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import type { LoginData } from '@/api/user';
  import { useWsLoginStore } from '@/store/modules/chat/ws';
  import { getToken } from '@/utils/auth';

  const router = useRouter();
  const { t } = useI18n();
  const errorMessage = ref('');
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();
  const wsLoginStore = useWsLoginStore();
  const loginConfig = ref({
    useSSO: true,
  });
  const userInfo = ref({
    username: '',
    password: '',
    week: false,
  });

  const loginSuccess = () => {
    const { redirect, ...othersQuery } = router.currentRoute.value.query;
    router.push({
      name: (redirect as string) || 'Workplace',
      query: {
        ...othersQuery,
      },
    });
    wsLoginStore.loginSuccess(getToken());
    Message.success(t('login.form.login.success'));
  };
  const gotoOAuth2 = () => {
    window.location.href =
      'http://10.15.247.254:55554/?response_type=code&client_id=891d832ff2204a858ad4d0f0dc0d203f';
  };
  const changeLoginConfig = (config) => {
    loginConfig.value.useSSO = config;
  };
  const loginByToken = async () => {
    try {
      await userStore.loginByToken();
      loginSuccess();
    } catch (err) {
      errorMessage.value = (err as Error).message;
    }
  };

  const handleSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (loading.value) return;
    if (!errors) {
      setLoading(true);
      try {
        console.log(values);
        await userStore.login(values as LoginData);
        loginSuccess();
      } catch (err) {
        errorMessage.value = (err as Error).message;
      } finally {
        setLoading(false);
      }
    }
  };
  loginByToken();
</script>

<style lang="less" scoped>
  .login-form {
    &-wrapper {
      width: 320px;
    }

    &-title {
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
    }

    &-sub-title {
      color: var(--color-text-3);
      font-size: 16px;
      line-height: 24px;
    }

    &-error-msg {
      height: 32px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    &-password-actions {
      display: flex;
      justify-content: space-between;
    }

    &-register-btn {
      color: var(--color-text-3) !important;
    }
  }
</style>
