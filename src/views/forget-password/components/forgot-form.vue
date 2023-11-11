<template>
  <div v-if="!status.forgetSuccess" class="login-form-wrapper">
    <div class="login-form-title">重设密码</div>

    <div class="login-2">
      <a-form
        ref="loginForm"
        :model="userInfoForForget"
        class="login-form"
        layout="vertical"
        autocomplete="off"
      >
        <a-form-item
          field="email"
          :rules="[{ required: true, message: $t('login.form.email.errMsg') }]"
          :validate-trigger="['change', 'blur']"
          hide-label
        >
          <a-input
            v-model="userInfoForForget.email"
            :placeholder="$t('login.form.email.placeholder')"
            autocomplete="off"
          >
            <template #prefix>
              <icon-email />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          field="emailCode"
          :rules="[
            { required: true, message: $t('login.form.emailCode.errMsg') },
          ]"
          :validate-trigger="['change', 'blur']"
          hide-label
        >
          <a-input
            v-model="userInfoForForget.emailCode"
            :placeholder="$t('login.form.emailCode.placeholder')"
            autocomplete="emailCode"
            :max-length="6"
            allow-clear
          >
            <template #prefix>
              <icon-code />
            </template>
            <template #append>
              <a-link
                :disabled="status.timerS != null"
                :loading="status.emailCodeLoading"
                @click="getEmailCodeHandel"
                >{{ status.buttonText }}{{ status.timerTime }}</a-link
              >
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          field="password"
          :rules="[
            { required: true, message: $t('login.form.password.errMsg') },
            { minLength: 6, message: '密码最少6位' },
            { maxLength: 30, message: '密码最长30位' },
          ]"
          :validate-trigger="['change', 'blur']"
          hide-label
        >
          <a-input-password
            v-model="userInfoForForget.password"
            placeholder="重设密码"
            allow-clear
            autocomplete="new-password"
          >
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>
      </a-form>
      <a-button size="large" type="primary" long @click="changePasswordHandel">重设密码</a-button>
      <a-button
        size="large"
        style="margin-top: 10px"
        type="outline"
        long
        @click="changeLoginConfig()"
        >想起来了，直接登录</a-button
      >
    </div>
    <a-modal
      v-model:visible="status.vailModel"
      :mask-closable="true"
      :hide-cancel="true"
      :unmount-on-close="true"
      :mask="true"
      :closable="false"
      :footer="false"
      :width="375"
      @cancel="vailCancel"
    >
      <CaptchaC v-if="status.vailModel" @success="vailSuccess" />
    </a-modal>
  </div>
  <div v-else class="login-form-wrapper">
    <div class="login-form-title">重设密码成功!请牢记你的登录账号和密码</div>
    <div style="display: flex; align-items: center">
      <h2>用户名：</h2>
      <span>{{ userInfoForForget.email }}</span>
    </div>
    <div style="display: flex; align-items: center">
      <h2>密码：</h2>
      <a-input-password
        v-model="userInfoForForget.password"
        style="width: 200px"
        :readonly="true"
        autocomplete="new-password"
      >
      </a-input-password>
    </div>
    <div>
      <a-button type="primary" @click="confirmHandel"
        >我已牢记，登录吧!</a-button
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
  import { getToken, setToken } from '@/utils/auth';
  import CaptchaC from '@/components/captcha/index.vue';
  import {forgetPasswordEmail, getEmailCode, registerByEmail} from '@/api/email';

  const router = useRouter();
  const { t } = useI18n();
  const errorMessage = ref('');
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();
  const wsLoginStore = useWsLoginStore();

  const userInfoForForget = ref({
    email: '',
    password: '',
    emailCode: '',
    vailCode: '',
  });

  const status = ref({
    emailCodeLoading: false,
    timerTime: '',
    timerTimeNumber: 0,
    timerS: null,
    buttonText: '获取验证码',
    vailModel: false,
    forgetSuccess: false,
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
  const changePasswordHandel = () => {
    if (!userInfoForForget.value.email.includes('@')) {
      Message.error('邮箱不合法');
      return;
    }
    if (userInfoForForget.value.password.indexOf(' ') !== -1) {
      Message.error('密码不应该包含空格');
      return;
    }
    const passwordreg = /(?=.*[a-zA-Z])(?=.*[0-9]).{6,30}/;

    if (!passwordreg.test(userInfoForForget.value.password)) {
      Message.error('密码必须由数字、字母组合,请输入6-30位');
      return;
    }
    if (!userInfoForForget.value.emailCode) {
      Message.error('防呆不防傻，你还没输验证码呢');
      return;
    }
    forgetPasswordEmail({
      email: userInfoForForget.value.email,
      emailCode: userInfoForForget.value.emailCode,
      password: userInfoForForget.value.password,
    }).then((res) => {
      setToken(res.data.token);
      // 找回成功
      status.value.forgetSuccess = true;
    });
  };

  const changeLoginConfig = () => {
    // 跳转登录页
    router.push({ name: 'login' });
  };

  const loginByToken = async () => {
    try {
      await userStore.loginByToken();
      loginSuccess();
    } catch (err) {
      errorMessage.value = (err as Error).message;
    }
  };
  const confirmHandel = () => {
    loginSuccess();
  };

  // const handleSubmit = async ({
  //   errors,
  //   values,
  // }: {
  //   errors: Record<string, ValidatedError> | undefined;
  //   values: Record<string, any>;
  // }) => {
  //   if (loading.value) return;
  //   if (!errors) {
  //
  //     setLoading(true);
  //     try {
  //       console.log(values);
  //       await userStore.login(values as LoginData);
  //       loginSuccess();
  //     } catch (err) {
  //       errorMessage.value = (err as Error).message;
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };
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
    userInfoForForget.value.vailCode = code;
    status.value.vailModel = false;
    status.value.emailCodeLoading = true;

    // 获取
    getEmailCode({
      email: userInfoForForget.value.email,
      vail_code:
        userInfoForForget.value.vailCode === ''
          ? undefined
          : userInfoForForget.value.vailCode,
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
  // const getVailCodeImage = async () => {
  //   // 取后端默认值
  //   getCodeImg({}).then((res)=>{
  //     console.log(res.data);
  //     codeImage.value.nonce_str = res.data.nonce_str;
  //
  //
  //   })
  //
  // }

  const getEmailCodeHandel = () => {
    status.value.emailCodeLoading = true;
    // 获取
    // getVailCodeImage();
    status.value.vailModel = true;
  };
  // loginByToken();
</script>

<style lang="less" scoped>
  .login-form-wrapper {
    background: #ffffff;
    padding: 5rem 5rem 5rem 5rem;
    border-radius: 5px;
  }
  .login-form {
    &-wrapper {
      width: 450px;
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
