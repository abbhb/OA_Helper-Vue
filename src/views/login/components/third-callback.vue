<script lang="ts" setup>
  import { ref } from 'vue';
  import { getQueryVariable } from '@/utils/utils';
  import { uniCallback, uniFirstLogin } from '@/api/third-login';
  import { Message } from '@arco-design/web-vue';
  import { useUserStore } from '@/store';
  import { getEmailCode } from '@/api/email';
  import ImagePreview from '@/components/image/ImagePreview.vue';
  import CaptchaC from '@/components/captcha/index.vue';
  import {useRouter} from "vue-router";

  const code = getQueryVariable('code');
  const type = getQueryVariable('type');
  const userStore = useUserStore();
  const router = useRouter();

  const status = ref({
    sta: 1, // 1为准备模式，2为返回了token，登录中，3为新用户,0为异常
    errMsg: '',
    // email
    emailCodeLoading: false,
    timerTime: '',
    timerTimeNumber: 0,
    timerS: null,
    buttonText: '获取验证码',
    vailModel: false,
    registerSuccess: false,
    nickname: '',
    avatar: '',
  });
  const userInfoForEmailCode = ref({
    email: '',
    veryCode: '',
    code: '',
    thirdType: '',
    thirdSocialUid: '',
  });

  const oauth2ErrorHandel = () => {
    // 获取当前 URL
    const currentUrl = window.location.href;

    // 移除参数（这里示例移除名为 "param" 的参数）
    const updatedUrl = currentUrl
      .replace(/(\?|&)type=.*?(&|$)/, '$1')
      .replace(/(&|\?)$/, '');
    const updatedUrl2 = updatedUrl
      .replace(/(\?|&)code=.*?(&|$)/, '$1')
      .replace(/(&|\?)$/, '');
    // 重新加载页面
    window.location.href = updatedUrl2;
  };

  if (code === '' || type === '') {
    // 不应该是该模式，返回登录
    oauth2ErrorHandel();
  }

  const startCallback = async () => {
    status.value.errMsg = '';
    if (code === '' || type === '') {
      Message.error('code不存在！');
      return;
    }
    status.value.sta = 1;
    try {
      const { data } = await uniCallback(type, code);
      if (data.canLogin) {
        if (!data.token) {
          status.value.sta = 0;
          status.value.errMsg = '登录失败!';
          return;
        }
        // 直接登录
        status.value.sta = 2;
        if (data.toSetPassword === 1) {
          let baseUrl = '';
          if (import.meta.env.VITE_API_BASE_URL) {
            baseUrl = import.meta.env.VITE_API_BASE_URL;
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
        const {redirect, ...othersQuery} = router.currentRoute.value.query;
        router.push({
          name: (redirect as string) || 'Workplace',
          query: {
            ...othersQuery,
          },
        });
        return;
        // 逻辑结束
      }
      if (!data.newUser){
        Message.error('系统异常!');
        oauth2ErrorHandel();
        return;
      }
      // 新用户,输入邮箱绑定平台用户，无论是以前有无，系统后台自动判断
      status.value.sta = 3;
      status.value.nickname = data.thirdName;
      status.value.avatar = data.thirdAvatar;
      userInfoForEmailCode.value.thirdSocialUid = data.thirdSocialUid;
      userInfoForEmailCode.value.thirdType = type;
    } catch (e) {
      status.value.sta = 0;
      status.value.errMsg = e;
    }
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

  const emailWithOtherIdHandel = async () => {
    // 绑定email
    try {
      const { data } = await uniFirstLogin({
        thirdSocialUid: userInfoForEmailCode.value.thirdSocialUid,
        thirdType: userInfoForEmailCode.value.thirdType,
        email: userInfoForEmailCode.value.email,
        emailCode: userInfoForEmailCode.value.code,
      });
      if (!data.token) {
        status.value.sta = 0;
        status.value.errMsg = '登录异常';
      }
      // 直接登录
      status.value.sta = 2;
      if (data.toSetPassword === 1) {
        let baseUrl = '';
        if (import.meta.env.VITE_API_BASE_URL) {
          baseUrl = import.meta.env.VITE_API_BASE_URL;
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
      const {redirect, ...othersQuery} = router.currentRoute.value.query;
      router.push({
        name: (redirect as string) || 'Workplace',
        query: {
          ...othersQuery,
        },
      });
      return;
    } catch (e) {
      status.value.sta = 0;
      status.value.errMsg = e;
    }
  };
  startCallback();
</script>

<template>
  <div>
    <a-spin v-if="status.sta === 1" tip="第三方回调登录中..." />
    <a-spin v-if="status.sta === 2" tip="登录成功。请稍等！" />
    <a-result v-if="status.sta === 0" status="error" title="第三方登录失败">
      <template #icon>
        <IconFaceFrownFill />
      </template>
      <template #subtitle> 原因</template>

      <template #extra>
        <a-button type="primary" @click="oauth2ErrorHandel">返回登录</a-button>
      </template>
      <a-typography style="background: var(--color-fill-2); padding: 24px">
        <a-typography-paragraph>尝试:</a-typography-paragraph>
        <ul>
          <li> 联系运维</li>
          <li> 连接至实验室WiFi，很多时候都是网络不佳造成的无法登录</li>
          <li> 返回登录，尝试使用邮箱验证码登录</li>
          <li> 稍后重试！</li>
        </ul>
      </a-typography>
    </a-result>
    <div v-if="status.sta === 3">
      <div style="width: 25rem">
        <span style="font-size: 18px"> 欢迎您,{{ status.nickname }}。 </span>
        系统检测到你是第一次使用该种认证方式，需要绑定电子邮箱，如果已经使用过该电子邮箱平台会自动进行数据关联，如果为全新电子邮箱，那么您的数据也是新的开始！
      </div>
      <div style="display: flex; align-items: center">
        <div class="biaoshi-2">
          <ImagePreview
            :img="status.avatar"
            style="width: 126px; height: 126px"
          />
          <div> [{{ status.nickname }}]</div>
        </div>
        <div>
          <svg
            class="icon"
            height="200"
            p-id="2358"
            style="
              width: 56px;
              height: 56px;
              margin-left: 35px;
              margin-right: 35px;
            "
            t="1702191929020"
            version="1.1"
            viewBox="0 0 1024 1024"
            width="200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M573.44 686.08L432.128 582.656l48.128-66.56 108.544 78.848 236.544-324.608-144.384-105.472-94.208 130.048 32.768 23.552-48.128 66.56-66.56-48.128-8.192-57.344L638.976 83.968l57.344-9.216 209.92 152.576 9.216 57.344-284.672 392.192z"
              fill="#437DFF"
              p-id="2359"
            ></path>
            <path
              d="M327.68 949.248L117.76 796.672l-9.216-57.344 284.672-392.192L450.56 337.92l141.312 103.424-48.128 66.56-108.544-78.848-236.544 324.608 144.384 105.472 94.208-130.048-32.768-23.552 48.128-66.56 66.56 48.128 8.192 57.344-142.336 195.584z"
              fill="#63F7DE"
              p-id="2360"
            ></path>
          </svg>
        </div>
        <div class="biaoshi-2">
          <div>
            <svg
              class="icon"
              height="200"
              p-id="5268"
              style="width: 126px; height: 126px"
              t="1702192302444"
              version="1.1"
              viewBox="0 0 1024 1024"
              width="200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M220.629333 788.309333c0 12.544 6.485333 15.061333 16.981334 15.061334v-0.085334h303.914666v0.085334h13.397334a25.002667 25.002667 0 0 1 0 49.962666h-21.248c-0.64 0-1.28 0-1.962667-0.085333H237.610667c-32.853333 0-49.408-16-57.514667-29.44A70.613333 70.613333 0 0 1 170.666667 788.181333V728.32c0-29.013333 30.464-48.469333 48.64-57.429333 12.672-6.272 98.688-46.72 150.869333-70.784a265.728 265.728 0 0 1-47.914667-88.661334c-10.794667-34.048-11.349333-59.562667-11.349333-64.341333V332.458667c0-1.152 0.085333-2.218667 0.213333-3.285334 4.138667-31.146667 14.592-58.581333 31.018667-81.493333A168.448 168.448 0 0 1 396.544 199.68c36.650667-20.650667 76.245333-26.581333 97.066667-28.245333a22.485333 22.485333 0 0 1 5.973333-0.768h5.333333l2.389334 0.085333C508.842667 170.666667 510.208 170.666667 511.274667 170.666667h2.730666c1.749333 0 3.584 0.213333 5.333334 0.597333 20.949333 1.621333 60.970667 7.338667 98.133333 27.818667 22.485333 12.373333 41.045333 28.586667 55.296 47.957333 16.853333 23.04 27.434667 50.688 31.573333 82.133333a23.466667 23.466667 0 0 1 0.213334 3.285334v107.605333h-0.085334v13.184a25.002667 25.002667 0 0 1-49.962666 0v-13.184h-0.085334V334.122667c-13.397333-95.530667-103.893333-110.976-142.208-113.194667a26.709333 26.709333 0 0 1-2.602666-0.298667h-3.114667c-0.938667-0.085333-1.834667-0.085333-2.56-0.085333a16.725333 16.725333 0 0 1-2.773333 0.426667c-37.717333 2.389333-126.933333 18.176-140.373334 113.152v112.853333c0 3.285333 0.810667 79.701333 68.352 143.274667a24.96 24.96 0 0 1-6.912 41.045333c-35.584 15.872-164.778667 76.544-180.693333 84.394667-12.8 6.4-19.072 12.501333-20.906667 14.805333v57.813333z m415.488-233.386666c-9.386667 15.018667-14.08 29.866667-14.08 44.458666 0 7.082667 2.986667 13.653333 8.832 19.669334 5.973333 6.101333 13.269333 9.130667 21.888 9.130666 14.677333 0 24.618667-8.661333 29.866667-26.112 5.546667-16.64 12.330667-29.269333 20.309333-37.802666 8.021333-8.576 20.48-12.842667 37.504-12.842667 14.506667 0 26.368 4.266667 35.498667 12.714667a40.704 40.704 0 0 1 13.781333 31.232 35.968 35.968 0 0 1-4.48 17.578666 67.328 67.328 0 0 1-11.093333 14.72c-4.437333 4.394667-11.52 10.965333-21.461333 19.541334a370.432 370.432 0 0 0-26.794667 25.6c-6.698667 7.168-11.946667 15.530667-16 25.002666a85.674667 85.674667 0 0 0-6.016 33.664c0 10.368 2.730667 18.133333 8.234667 23.381334a28.16 28.16 0 0 0 20.266666 7.850666c15.36 0 24.576-8.021333 27.477334-24.064 1.706667-7.552 2.986667-12.885333 3.84-15.872 0.853333-2.986667 2.048-5.973333 3.541333-8.96 1.621333-3.072 3.882667-6.357333 7.082667-9.984 3.157333-3.584 7.338667-7.765333 12.586666-12.586666 18.986667-16.896 32.128-29.013333 39.466667-36.181334 7.296-7.253333 13.653333-15.658667 18.986667-25.6 5.333333-9.813333 7.978667-21.333333 7.978666-34.389333 0-16.64-4.693333-32.085333-13.994666-46.250667a96.213333 96.213333 0 0 0-39.68-33.664c-17.066667-8.234667-36.906667-12.373333-59.221334-12.373333-24.064 0-45.098667 4.906667-63.146666 14.805333-18.005333 9.813333-31.786667 22.314667-41.173334 37.333334z m74.24 288.853333a36.394667 36.394667 0 0 0 24.576 9.088 35.584 35.584 0 0 0 24.149334-9.301333c6.954667-6.144 10.453333-14.592 10.453333-25.429334a33.28 33.28 0 0 0-9.984-24.533333 33.322667 33.322667 0 0 0-24.533333-9.941333 34.389333 34.389333 0 0 0-25.002667 9.941333 32.938667 32.938667 0 0 0-10.197333 24.533333c0 10.965333 3.498667 19.498667 10.538666 25.6z"
                fill="#000000"
                fill-opacity=".54"
                p-id="5269"
              ></path>
            </svg>
          </div>
          <div> 本平台账号</div>
          <div>
            [{{
              userInfoForEmailCode.email
                ? userInfoForEmailCode.email.length < 10
                  ? userInfoForEmailCode.email
                  : userInfoForEmailCode.email.substring(0, 10) + '...'
                : 'Email'
            }}]
          </div>
        </div>
      </div>
      <div class="login-2" style="width: 25rem">
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
        </a-form>
        <a-button
          :disabled="
            userInfoForEmailCode.code === '' ||
            userInfoForEmailCode.email === ''
          "
          long
          size="large"
          type="primary"
          @click="emailWithOtherIdHandel"
          >绑定
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
    </div>
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

<style lang="less" scoped>
  .biaoshi-2 {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
