<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">{{ $t('login.form.title') }}</div>
    <div class="login-form-sub-title">{{ $t('login.form.title') }}</div>
    <div class="login-form-error-msg">{{ errorMessage }}</div>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" title="账密登录">
        <a-form
          ref="loginForm"
          :model="userInfo"
          autocomplete="off"
          class="login-form"
          layout="vertical"
          @submit="handleSubmit"
        >
          <a-form-item
            :rules="[
              { required: true, message: $t('login.form.userName.errMsg') },
            ]"
            :validate-trigger="['change', 'blur']"
            field="username"
            hide-label
          >
            <a-input
              v-model="userInfo.username"
              :placeholder="$t('login.form.userName.placeholder')"
              name="uname"
            >
              <template #prefix>
                <icon-user />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item
            :rules="[
              { required: true, message: $t('login.form.password.errMsg') },
            ]"
            :validate-trigger="['change', 'blur']"
            field="password"
            hide-label
          >
            <a-input-password
              v-model="userInfo.password"
              :placeholder="$t('login.form.password.placeholder')"
              allow-clear
              name="upass"
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
              <a-link @click="forgetHandel"
                >{{ $t('login.form.forgetPassword') }}
              </a-link>
            </div>
            <a-button :loading="loading" html-type="submit" long type="primary">
              {{ $t('login.form.login') }}
            </a-button>
            <a-button
              class="login-form-register-btn"
              long
              type="text"
              @click="register"
            >
              {{ $t('login.form.register') }}
            </a-button>
          </a-space>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="2" title="邮箱验证码登录">
        <div class="login-2">
          <a-form
            ref="loginForm"
            :model="userInfoForEmailCode"
            autocomplete="off"
            class="login-form"
            layout="vertical"
          >
            <a-form-item
              :rules="[
                { required: true, message: $t('login.form.email.errMsg') },
              ]"
              :validate-trigger="['change', 'blur']"
              field="email"
              hide-label
            >
              <a-input
                v-model="userInfoForEmailCode.email"
                :placeholder="$t('login.form.email.placeholder')"
                autocomplete="email"
              >
                <template #prefix>
                  <icon-email />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item
              :rules="[
                { required: true, message: $t('login.form.emailCode.errMsg') },
              ]"
              :validate-trigger="['blur', 'change']"
              field="code"
              hide-label
            >
              <a-input
                v-model="userInfoForEmailCode.code"
                :max-length="6"
                :placeholder="$t('login.form.emailCode.placeholder')"
                allow-clear
                autocomplete="off"
              >
                <template #prefix>
                  <icon-code />
                </template>
                <template #append>
                  <a-link
                    :disabled="status.timerS != null"
                    :loading="status.emailCodeLoading"
                    @click="getEmailCodeHandel"
                    >{{ status.buttonText }}{{ status.timerTime }}
                  </a-link>
                </template>
              </a-input>
            </a-form-item>
            <div
              class="login-form-password-actions"
              style="padding-bottom: 1rem"
            >
              <a-checkbox v-model="userInfoForEmailCode.week" checked="week">
                {{ $t('login.form.weekNoLogin') }}
              </a-checkbox>
            </div>
          </a-form>
          <a-button
            :disabled="
              userInfoForEmailCode.code === '' ||
              userInfoForEmailCode.email === ''
            "
            long
            size="large"
            type="primary"
            @click="emailLoginHandel"
            >登录
          </a-button>
          <div
            style="
              display: flex;
              flex-direction: column;
              font-size: 14px;
              font-weight: 400;
              color: #c0c4cc;
              line-height: 18px;
              margin-top: 25px;
            "
          >
            <span> 关于Easy OA登录 </span>
            <span>
              若邮箱已被使用，请打开 忘记密码 找回密码 若无法收到验证码，
              可多等一会，可能是网络延迟导致！也可以检查邮箱的垃圾箱
            </span>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>

    <a-modal
      v-model:visible="status.vailModel"
      :closable="false"
      :footer="false"
      :hide-cancel="true"
      :mask="true"
      :mask-closable="true"
      :unmount-on-close="true"
      :width="375"
      @cancel="vailCancel"
    >
      <CaptchaC v-if="status.vailModel" @success="vailSuccess" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {Message} from '@arco-design/web-vue';
import {ValidatedError} from '@arco-design/web-vue/es/form/interface';
import {useI18n} from 'vue-i18n';
import {useUserStore} from '@/store';
import useLoading from '@/hooks/loading';
import type {LoginData} from '@/api/user';
import {loginByEmailCode} from '@/api/user';
import CaptchaC from '@/components/captcha/index.vue';
import {getEmailCode} from '@/api/email';
import {getAPIBase} from "@/utils/env";

const router = useRouter();
  const { t } = useI18n();
  const errorMessage = ref('');
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();

  const userInfo = ref({
    username: '',
    password: '',
    week: false,
  });
  const userInfoForEmailCode = ref({
    email: '',
    veryCode: '',
    code: '',
    week: false,
  });

  const status = ref({
    emailCodeLoading: false,
    timerTime: '',
    timerTimeNumber: 0,
    timerS: null,
    buttonText: '获取验证码',
    vailModel: false,
    registerSuccess: false,
  });

  const emailLoginHandel = async () => {
    // 邮箱验证码一键登录,不存在用户就自动创建
    const { data } = await loginByEmailCode({
      week: userInfoForEmailCode.value.week,
      email: userInfoForEmailCode.value.email,
      emailCode: userInfoForEmailCode.value.code,
    });
    if (data.toSetPassword === 1) {
      let baseUrl = '';
      if (getAPIBase()) {
        baseUrl = getAPIBase();
      }
      // 需要设置密码
      window.open(
        `${baseUrl}/api/ext-thymeleaf/re-new-password?oneTimeCode=${data.oneTimeSetPasswordCode}`,
        'newwindow',
        'height=880, width=670, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no'
      );
    }

    // 正常逻辑
    await userStore.loginSuccess(data.token);
    const { redirect, ...othersQuery } = router.currentRoute.value.query;
    router.push({
      name: (redirect as string) || 'Workplace',
      query: {
        ...othersQuery,
      },
    });
  };
  const register = () => {
    // 跳转注册页
    router.push({
      name: 'register',
      query: router.currentRoute.value.query,
    });
  };
  const vailCancel = () => {
    status.value.emailCodeLoading = false;
    status.value.vailModel = false;
  };
  const stopTimer = () => {
    if (status.value.timerS == null) {
      return;
    }
    clearInterval(status.value.timerS);
    status.value.buttonText = '获取验证码';
    status.value.timerTimeNumber = 60;
    status.value.timerTime = '';
    status.value.timerS = null;
  };
  const startTimer = () => {
    status.value.buttonText = '再次获取等待';
    status.value.timerTimeNumber = 60;
    status.value.timerTime = '60s';
    status.value.timerS = setInterval(() => {
      // eslint-disable-next-line no-plusplus
      status.value.timerTimeNumber -= 1;
      status.value.timerTime = `${status.value.timerTimeNumber}s`;

      // 最多录制60秒
      if (status.value.timerTimeNumber <= 0) {
        stopTimer();
      }
    }, 1000);
  };
  const vailSuccess = (code) => {
    userInfoForEmailCode.value.veryCode = code;
    status.value.vailModel = false;
    status.value.emailCodeLoading = true;

    // 获取
    getEmailCode({
      email: userInfoForEmailCode.value.email,
      vail_code:
        userInfoForEmailCode.value.veryCode === ''
          ? undefined
          : userInfoForEmailCode.value.veryCode,
    })
      .then((res) => {
        Message.success(res.data);
        // 开启倒计时
        startTimer();
        // 获取完成
        status.value.emailCodeLoading = false;
      })
      .catch((e) => {
        // 获取失败
        status.value.emailCodeLoading = false;
      });

    // 倒计时一分钟不让获取，后期获取电话的话需要升级加上验证码
  };
  const getEmailCodeHandel = () => {
    status.value.emailCodeLoading = true;
    // 获取
    // getVailCodeImage();
    status.value.vailModel = true;
  };
  const loginByToken = async () => {
    try {
      await userStore.loginByToken();
      const { redirect, ...othersQuery } = router.currentRoute.value.query;
      router.push({
        name: (redirect as string) || 'Workplace',
        query: {
          ...othersQuery,
        },
      });
    } catch (err) {
      errorMessage.value = (err as Error).message;
    }
  };

  const forgetHandel = () => {
    router.push({
      name: 'forgotPassword',
      query: router.currentRoute.value.query,
    });
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
        const { redirect, ...othersQuery } = router.currentRoute.value.query;
        router.push({
          name: (redirect as string) || 'Workplace',
          query: {
            ...othersQuery,
          },
        });
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
