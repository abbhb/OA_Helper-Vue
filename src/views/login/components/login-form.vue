<template>
  <div v-if="loginStatus.failed" class="login-failed-wrapper">
    <div class="login-failed-content">
      <icon-face-frown-fill :size="64" />
      <h2>登录失败</h2>
      <p>{{ errorMessage }}</p>
      <div class="login-failed-actions">
        <a-button
          v-if="hasToken"
          type="primary"
          :loading="loading"
          @click="retryLogin"
        >
          重试登录
        </a-button>
        <a-button @click="backToLogin">返回登录</a-button>
      </div>
    </div>
  </div>

  <div v-else-if="loginStatus.loading" class="login-loading-wrapper">
    <div class="login-loading-content">
      <icon-loading
        :size="64"
        class="loading-icon"
        style="color: var(--color-primary-light-4)"
      />
      <h2>登录中</h2>
      <p>正在验证您的身份...</p>
    </div>
  </div>

  <div v-else-if="loginStatus.success" class="login-success-wrapper">
    <div class="login-success-content">
      <icon-check-circle-fill
        :size="64"
        style="color: var(--color-success-light-4)"
      />
      <h2>登录成功</h2>
      <p>正在为您跳转到系统...</p>
    </div>
  </div>

  <template v-else>
    <div v-loading="loading" class="login-form-wrapper">
      <div class="login-form-title">{{ $t('login.form.title') }}</div>
      <div class="login-form-sub-title">{{ $t('login.form.title') }}</div>
      <div class="login-form-error-msg">{{ errorMessage }}</div>
      <a-tabs :default-active-key="defaultActiveTab">
        <a-tab-pane v-if="isWebAuthnAvailable" key="webauthn" title="Passkey">
          <div class="passkey-login-content">
            <icon-key :size="64" style="color: var(--color-primary-light-4)" />
            <h3>Passkey</h3>
            <p>通行密钥，不用记繁多的密码</p>
            <a-button
              type="primary"
              long
              :loading="passkeyLoading"
              @click="handlePasskeyLogin"
            >
              {{ passkeyLoading ? 'Passkey验证中' : '点击验证' }}
            </a-button>
          </div>
        </a-tab-pane>

        <a-tab-pane key="password" title="账密登录">
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
              <a-button
                :loading="loginStatus.loading"
                html-type="submit"
                long
                type="primary"
              >
                {{ loginStatus.loading ? '登录中...' : $t('login.form.login') }}
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

        <a-tab-pane key="email" title="邮箱验证码登录">
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
                  {
                    required: true,
                    message: $t('login.form.emailCode.errMsg'),
                  },
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
    <ThirdLogin v-if="!loading" />
  </template>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted, getCurrentInstance } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message, Notification } from '@arco-design/web-vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useI18n } from 'vue-i18n';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import type { LoginData } from '@/api/user';
  import { loginByEmailCode } from '@/api/user';
  import CaptchaC from '@/components/captcha/index.vue';
  import { getEmailCode } from '@/api/email';
  import { getAPIBase } from '@/utils/env';
  import usePasskey from '@/hooks/passkey';
  import ThirdLogin from './third-login.vue';

  const router = useRouter();
  const { t } = useI18n();
  const errorMessage = ref('');
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();

  // ---------------------------------------------------------------------------确认页面用途👇
  // 页面用途：1为真的登录面板进工作台，也就是默认。0为oauth2向第三方授权
  const yemian = ref(1);
  const winDatas = ref({
    response_type: '',
    client_id: '',
    which: '',
    redirect_uri: '',
    state: '',
    scope: '',
    msg: '未知异常',
    client_name: '11',
  });
  const url = window.location.href; // 获取当前ur
  let csAerr = [];
  try {
    csAerr = url.split('#')[0].split('?')[1].split('&'); // 参数字符串分割为数组
    if (csAerr.length > 0) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < csAerr.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        winDatas.value[csAerr[i].split('=')[0]] = csAerr[i].split('=')[1];
      }
    }
  } catch (e) {
    yemian.value = 1;
  }

  if (winDatas.value.which === 'auth') {
    // 只有这个才是给第三方进行oauth，但是还没有登录的状况
    yemian.value = 0;
  }

  // 当yemian是0的时候，登录成功的处理逻辑是跳转到show路由，来进行oauth授权，当1的时候正常登录即可
  // --------------------------------------------------------------------------------------确认页面用途👆

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

  // 修改登录状态控制
  const loginStatus = ref({
    failed: false,
    loading: false,
    success: false,
  });

  // 修改登录成功处理函数
  const loginSuccessHandel = () => {
    loginStatus.value.loading = false;
    loginStatus.value.success = true;

    // 延迟跳转以显示成功动画
    setTimeout(() => {
      if (yemian.value === 0) {
        router.push({ name: 'oauthShow' });
      } else {
        const { redirect, ...othersQuery } = router.currentRoute.value.query;
        router.push({
          name: (redirect as string) || 'Workplace',
          query: { ...othersQuery },
        });
      }
    }, 5);
  };

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
    // 正常给网页组件登录
    await userStore.loginSuccess(data.token);
    loginSuccessHandel();
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
  const loginAttempts = ref(0);

  const loginByToken = async () => {
    try {
      setLoading(true);
      await userStore.loginByToken();
      loginSuccessHandel();
    } catch (err) {
      if (loginAttempts.value === 0) {
        // 首次失败时直接显示登录表单
        loginStatus.value.failed = false;
        errorMessage.value = '';
      } else {
        // 后续失败才显示失败状态
        errorMessage.value = (err as Error).message;
        loginStatus.value.failed = true;
      }
      loginAttempts.value++;
    } finally {
      setLoading(false);
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
    if (loginStatus.value.loading) return;
    if (!errors) {
      loginStatus.value.loading = true;
      try {
        await userStore.login(values as LoginData);
        // 添加延迟以展示动画效果
        setTimeout(() => {
          loginSuccessHandel();
        }, 300);
      } catch (err) {
        loginStatus.value.loading = false;
        Notification.info({
          title: '登录失败',
          content: (err as Error).message,
        })
        errorMessage.value = (err as Error).message;
      }
    }
  };
  loginByToken();

  const thirdCallbackLoginSuccess = async (token: string) => {
    await userStore.loginSuccess(token);
    loginSuccessHandel();
  };

  // ----------------------------------监听是否有第三方登录callback的消息👇--------------------------

  // 此块应该再login相关的请求加载完毕的情况下，所以放最底下
  // 创建 BroadcastChannel 实例
  const channelCallback = new BroadcastChannel('third-oauth-callback-login');
  // 监听广播通道的消息
  channelCallback.onmessage = function (event) {
    if (typeof event.data === 'object') {
      if (event.data.type === 1) {
        // 1:发送的为token
        // 关闭标签页
        channelCallback.postMessage({ type: 2 });
        // 继续进行登录逻辑
        thirdCallbackLoginSuccess(event.data.token);
      }
    }
  };
  // ----------------------------------------------监听是否有第三方登录callback的消息👆

  const hasToken = computed(() => {
    return !!localStorage.getItem('token');
  });

  // 添加重试和返回方法
  const retryLogin = async () => {
    loginStatus.value.failed = false;
    await loginByToken();
  };

  const backToLogin = () => {
    loginStatus.value.failed = false;
    errorMessage.value = '';
  };

  // 在组件setup的开始处重置登录尝试次数
  loginAttempts.value = 0;

  // WebAuthn 相关状态
  const { isSupported, validatePasskeyCredential } = usePasskey();
  const isWebAuthnAvailable = ref(false);
  const hasPasskey = ref(false);
  const passkeyLoading = ref(false);
  const defaultActiveTab = ref('password');

  // 检查浏览器是否支持 WebAuthn
  const checkWebAuthnSupport = async () => {
    isWebAuthnAvailable.value = await isSupported();
  };

  // 检查是否存在已注册的通行密钥
  const checkExistingPasskey = async () => {
    try {
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          rpId: window.location.hostname,
          allowCredentials: [],
          userVerification: 'preferred',
        },
      });
      return !!credential;
    } catch (error) {
      console.error('Failed to check existing passkey:', error);
      return false;
    }
  };

  // 处理通行密钥登录
  const handlePasskeyLogin = async () => {
    if (passkeyLoading.value) return;

    passkeyLoading.value = true;
    try {
      // 使用 hook 进行通行密钥验证
      const token = await validatePasskeyCredential();
      await userStore.loginSuccess(token);
      loginSuccessHandel();
    } catch (err) {
      // errorMessage.value = (err as Error).message;
      Notification.error((err as Error).message);
    } finally {
      passkeyLoading.value = false;
    }
  };

  // 初始化检查
  onMounted(async () => {
    await checkWebAuthnSupport();

    if (isWebAuthnAvailable.value) {
      // 检查是否存在已注册的通行密钥
      // hasPasskey.value = await checkExistingPasskey();

      // 如果都满足条件，设置默认选项为通行密钥
      if (hasPasskey.value) {
        defaultActiveTab.value = 'webauthn';
      }
    }
  });
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

  .login-failed {
    &-wrapper {
      width: 320px;
      padding: 40px 20px;
      text-align: center;
    }

    &-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;

      h2 {
        margin: 0;
        color: var(--color-text-1);
        font-size: 24px;
      }

      p {
        margin: 0;
        color: var(--color-text-3);
      }
    }

    &-actions {
      margin-top: 24px;
      display: flex;
      gap: 16px;
    }
  }

  .login-success {
    &-wrapper {
      width: 320px;
      padding: 40px 20px;
      text-align: center;
    }

    &-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      animation: fadeIn 0.3s ease-in-out;

      h2 {
        margin: 0;
        color: var(--color-text-1);
        font-size: 24px;
      }

      p {
        margin: 0;
        color: var(--color-text-3);
      }
    }

    &-loading {
      margin-top: 16px;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .login-loading {
    &-wrapper {
      width: 320px;
      padding: 40px 20px;
      text-align: center;
    }

    &-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      animation: fadeIn 0.3s ease-in-out;

      h2 {
        margin: 0;
        color: var(--color-text-1);
        font-size: 24px;
      }

      p {
        margin: 0;
        color: var(--color-text-3);
      }

      .loading-icon {
        animation: rotate 1.2s linear infinite;
      }
    }
  }

  .login-success-content {
    // 添加过渡动画
    transition: all 0.3s ease-in-out;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  // 添加状态切换动画
  .login-loading-wrapper,
  .login-success-wrapper {
    transition: opacity 0.3s ease-in-out;
  }

  // 统一状态图标样式
  .login-loading-content,
  .login-success-content,
  .login-failed-content {
    :deep(.arco-icon) {
      margin-bottom: 8px;
      // 添加图标阴影效果使其更突出
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
    }
  }

  .passkey-login-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px 0;
    text-align: center;

    h3 {
      margin: 16px 0 8px;
      color: var(--color-text-1);
      font-size: 20px;
    }

    p {
      margin: 0 0 24px;
      color: var(--color-text-3);
      font-size: 14px;
    }

    .arco-icon {
      margin-bottom: 16px;
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
    }
  }
</style>
