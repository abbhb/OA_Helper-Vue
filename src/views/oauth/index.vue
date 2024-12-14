<script setup lang="ts">
  import { useUserStore } from '@/store';
  import { ref, computed } from 'vue';
  import { agree, agreeLogin, agreementGet, getClientName } from '@/api/oauth';
  import { setToken } from '@/utils/auth';
  import router from '@/router';
  import useUser from "@/hooks/user";

  const loading = ref(false);

  const agreementDialog = ref({
    status: false,
    data: '',
    title: '',
    loading: false
  });

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
  const quanbushouquanlist = ref([
    {
      scopeKey: 'get_user_info',
      scopeName: '使用你的头像、昵称等信息',
      isMust: false,
      select: false,
    },
  ]);
  const userStore = useUserStore();
  userStore.info();
  // eslint-disable-next-line consistent-return
  const getQuanXianSHouQuan = (key) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const quanbushouquanlistElement of quanbushouquanlist.value) {
      if (quanbushouquanlistElement.scopeKey === key) {
        // eslint-disable-next-line no-undef
        return quanbushouquanlistElement.scopeName;
      }
    }
  };
  const yemian = ref(1);
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
    if (winDatas.value.scope !== '') {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < winDatas.value.scope.split(',').length; i++) {
        // eslint-disable-next-line no-plusplus
        for (let j = 0; j < quanbushouquanlist.value.length; j++) {
          // eslint-disable-next-line no-unused-expressions
          if (
            quanbushouquanlist.value[j].scopeKey ===
            winDatas.value.scope.split(',')[i]
          ) {
            quanbushouquanlist.value[j].isMust = true;
            quanbushouquanlist.value[j].select = true;
          }
        }
      }
    }
  } catch (e) {
    yemian.value = 0;
    console.log(e);
  }

  const getClientNames = async () => {
    const { data } = await getClientName(winDatas.value.client_id);
    winDatas.value.client_name = data;
  };
  const getagreement = async (type: number) => {
    // 立即显示弹窗和加载状态
    agreementDialog.value.status = true;
    agreementDialog.value.loading = true;
    agreementDialog.value.data = '';
    agreementDialog.value.title = type === 1 ? '服务协议' : '隐私保护协议';
    
    try {
      const { data } = await agreementGet("cid", winDatas.value.client_id, type);
      agreementDialog.value.data = data;
    } catch (e) {
      console.error(e);
      // 可以在这里添加错误提示
    } finally {
      agreementDialog.value.loading = false;
    }
  };
  if (winDatas.value.which === '') {
    // 展示未知错误页面
    yemian.value = 0;
  } else if (
    winDatas.value.which === 'auth' &&
    winDatas.value.client_id &&
    winDatas.value.response_type
  ) {
    yemian.value = 1;
    // 获取授权对象的名字
    getClientNames();
  } else {
    yemian.value = 2;
  }

  const userInfo = ref({
    username: '',
    password: '',
  });

  const isAllSelected = computed(() => {
    return quanbushouquanlist.value.every(item => item.select);
  });

  const quanxuanhuofanquanxuan = (value: boolean) => {
    // eslint-disable-next-line no-plusplus
    for (let j = 0; j < quanbushouquanlist.value.length; j++) {
      if (!quanbushouquanlist.value[j].isMust) {
        quanbushouquanlist.value[j].select = value;
      }
    }
  };
  const registerHandel = () => {
    router.push({
      name: 'register',
      query: router.currentRoute.value.query,
    });
  };

  const { logout } = useUser();

  /**
   * 切换账号
   */
  const qhzhHandel = () => {
    logout();
  };
  const shouquanHandel = async () => {
    if (loading.value) return;
    loading.value = true;
    
    let myscope = '';

    // eslint-disable-next-line no-plusplus
    for (let j = 0; j < quanbushouquanlist.value.length; j++) {
      // eslint-disable-next-line no-unused-expressions
      if (quanbushouquanlist.value[j].select) {
        if (myscope.length > 0) {
          myscope += ',';
        }
        myscope += quanbushouquanlist.value[j].scopeKey;
      }
    }
    // 授权按钮
    if (userStore.id && userStore.id !== '') {
      try {
        const { data } = await agree({
          responseType: winDatas.value.response_type,
          clientId: winDatas.value.client_id,
          redirectUri: winDatas.value.redirect_uri,
          state: winDatas.value.state,
          scope: myscope,
        });
        window.location.href = `${data.redirectUri}${
          data.redirectUri.includes('?') ? '&code=' : '?code='
        }${data.code}${data.state ? `&state=${data.state}` : ''}`;
      } catch (e) {
        console.log(e);
        loading.value = false;
      }
      return;
    }

    // 未登录时的逻辑
    try {
      const { data } = await agreeLogin({
        username: userInfo.value.username,
        password: userInfo.value.password,
        responseType: winDatas.value.response_type,
        clientId: winDatas.value.client_id,
        redirectUri: winDatas.value.redirect_uri,
        state: winDatas.value.state,
        scope: myscope,
      });
      setToken(data.token);
      window.location.href = `${data.redirectUri}${
        data.redirectUri.includes('?') ? '&code=' : '?code='
      }${data.code}${data.state ? `&state=${data.state}` : ''}`;
    } catch (e) {
      console.log(e);
      loading.value = false;
    }
  };

  if (!userStore.id || userStore.id === '') {
    // 直接先登录
    const currentRoute = router.currentRoute.value;

    router.push({
      name: 'login',
      query: {
        ...router.currentRoute.value.query,
        redirect: currentRoute.name as string,
      },
    });
  }
</script>

<template>
  <div>
    <div v-if="yemian === 1" class="oauth2">
      <div id="lay_top" class="lay_top">
        <div class="lay_top_inner">
          <h1 class="logo">
            <span class="logo-brand">EasyOA</span>
            <span class="logo-divider">|</span>
            <span class="logo-title">OAuth2授权登录</span>
          </h1>
        </div>
      </div>
      <div class="lay_body">
        <div class="login">
          <h2 class="login-title">安全登录</h2>
          <div v-if="userStore.id && userStore.id !== ''" class="user-avatar-container" style="display: flex; flex-direction: column; align-items: center; padding: 13px 3px 13px 3px;">
            <a-avatar
              :size="98"
              :style="{ marginRight: '8px' }"
              style="border: 1px solid #e5e6eb"
            >
              <img alt="avatar" :src="userStore.avatar" />
            </a-avatar>
            <div>
              <span>{{ userStore.name }}</span>
              <span>({{ userStore.username }})</span>
            </div>
          </div>
          <div
            v-else
            class="login-form-container"
            style="
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 13px 3px 3px 3px;
              margin-right: 30px;
            "
          >
            <a-form
              ref="loginForm"
              :model="userInfo"
              class="login-form"
              layout="vertical"
            >
              <a-form-item
                field="username"
                :rules="[
                  { required: true, message: $t('login.form.userName.errMsg') },
                ]"
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
                :rules="[
                  { required: true, message: $t('login.form.password.errMsg') },
                ]"
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
            </a-form>
          </div>
        </div>
        <div class="shouquan">
          <div class="shouquan-item">
            <span style="color: #2299dd; font-size: 16px; font-weight: 800">{{
              winDatas.client_name
            }}</span>
            将获取以下权限：
          </div>
          <div class="shouquan-item">
            <a-checkbox 
              :model-value="isAllSelected"
              @change="quanxuanhuofanquanxuan"
            >
              <span class="shouquan-item-font">全选 </span>
            </a-checkbox>
          </div>
          <div
            v-for="(sqit, key) in quanbushouquanlist"
            :key="key"
            class="shouquan-item"
          >
            <a-checkbox
              v-model:model-value="quanbushouquanlist[key].select"
              :value="true"
              :disabled="sqit.isMust"
              class="shouquan-item-font"
              ><span class="shouquan-item-font">{{
                getQuanXianSHouQuan(sqit.scopeKey)
              }}</span></a-checkbox
            >
          </div>
          <div class="shouquan-item" style="margin-top: 20px">
            <span class="shouquan-item-font"
              >授权即同意<a-button
                :type="'text'"
                :shape="'round'"
                @click="getagreement(1)"
                >服务协议</a-button
              >和<a-button
                :type="'text'"
                :shape="'round'"
                @click="getagreement(2)"
                >隐私保护协议</a-button
              ></span
            >
          </div>
        </div>
      </div>
      <div
        class="action-buttons-container"
        style="
          width: 20rem;
          margin-top: 50px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
        "
      >
        <a-button
          v-if="userStore.id"
          :size="'large'"
          style="margin-right: 20px"
          long
          :loading="loading"
          :disabled="loading"
          @click="qhzhHandel"
        >
          {{ loading ? '切换中...' : '切换账号' }}
        </a-button>
        <a-button
          :size="'large'"
          type="primary"
          long
          :loading="loading"
          :disabled="loading"
          @click="shouquanHandel"
        >
          {{ loading ? '授权中...' : '授权访问' }}
        </a-button>

        <a-button
          v-if="!userStore.id || userStore.id === ''"
          :size="'large'"
          style="margin-top: 10px"
          long
          :loading="loading"
          :disabled="loading"
          @click="registerHandel"
        >
          {{ loading ? '跳转中...' : '注册账号' }}
        </a-button>
      </div>
    </div>
    <div v-else class="error">
      <div class="error_card">
        <div class="error-icon">
          <icon-exclamation-circle-fill />
        </div>
        <h2 class="error-title">OAuth 授权异常</h2>
        <div class="error-desc">
          <template v-if="yemian === 2">{{ winDatas.msg }}</template>
          <template v-else>传参异常</template>
        </div>
        <div class="error-help">
          <p>请联系管理员解决</p>
          <a href="tencent://message/?uin=1057117849" class="contact-link">
            <icon-qq /> QQ: 1057117849
          </a>
        </div>
      </div>
    </div>
    <a-modal
      v-model:visible="agreementDialog.status"
      :draggable="true"
      :title="agreementDialog.title"
      :width="700"
      unmount-on-close
    >
      <div v-if="agreementDialog.loading" class="loading-container">
        <a-spin dot size="large" />
      </div>
      <div v-else v-html="agreementDialog.data"></div>
    </a-modal>
  </div>
</template>

<style scoped>
.oauth2 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
  padding-top: 84px; /* 为固定定位的头部留出空间 */
}

.lay_top {
  width: 100%;
  background: white;
  //box-shadow: 0 2px 12px rgba(0, 21, 41, 0.08);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}

.lay_top_inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 24px;
  width: 100%;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 40px;
}

.logo-brand {
  color: #165DFF;
  font-size: 24px;
  font-weight: 600;
}

.logo-divider {
  color: #86909c;
  font-weight: normal;
}

.logo-title {
  color: #1d2129;
  font-size: 20px;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .lay_top_inner {
    padding: 16px;
  }

  .logo {
    padding: 0;
    margin: 0;
  }

  .oauth2 {
    padding: 12px;
    padding: 0;
    min-height: 100vh;
  }

  .lay_body {
    margin: 0;
    padding: 0;
    //height: calc(100vh - 140px);
    overflow: auto;
    flex-direction: column;
    gap: 20px;
    border-radius: 0;
    box-shadow: none;
    background: transparent;
  }

  .login {
    padding: 12px;
    max-width: 100%;
    width: 100%;
    box-shadow: none;
    background: white;
    margin-top: 56px; /* 头部高度 */
  }

  .shouquan {
    padding-left: 0;
    padding-top: 12px;
    border-left: none;
    width: 100%;
    flex: none;
    background: white;
    margin-top: 12px;
    padding: 12px;
  }

  .shouquan-item {
    padding: 8px 0;
    font-size: 14px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f2f3f5;
  }

  .shouquan-item:last-child {
    border-bottom: none;
  }

  /* 调整按钮区域 */
  .action-buttons-container {
    width: 100% !important;
    margin-top: 16px;
    padding: 0 12px;
    position: fixed;
    bottom: 16px;
    left: 0;
    background: transparent;
    display: flex;
    flex-direction: column;
  }

  /* 调整按钮样式 */
  .action-buttons-container .arco-btn {
    height: 36px !important;
    margin: 6px 0 !important;
    width: 100%;
  }

  /* 移除右边距 */
  .login-form-container {
    padding: 8px !important;
    width: 100%;
  }

  .login-form :deep(.arco-input-wrapper) {
    height: 36px;
  }

  /* 调整协议弹窗 */
  :deep(.arco-modal) {
    width: 90% !important;
    margin: 0 16px;
    max-height: 80vh;
  }

  .login-title {
    font-size: 20px;
    margin-bottom: 16px;
  }
}

/* 添加一个新的断点，针对特别小的屏幕 */
@media screen and (max-width: 360px) {
  .lay_body {
    padding: 12px;
    gap: 12px;
  }

  .login-header {
    font-size: 18px !important;
  }

  .shouquan-item {
    padding: 6px 0;
  }

  .shouquan-item-font {
    font-size: 12px;
  }
}

.lay_body {
  background: white;
  border-radius: 8px;
  //box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 40px;
  display: flex;
  gap: 60px;
  max-width: 1000px;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.login {
  flex: 1;
  max-width: 360px;
  padding: 24px;
  border-radius: 4px;
  background: #ffffff;
  position: relative;
}

.login-title {
  font-size: 24px;
  color: #1d2129;
  margin-bottom: 24px;
  font-weight: 500;
  text-align: center;
}

.user-info {
  text-align: center;
  padding: 24px 0;
}

.user-info .username {
  margin-top: 16px;
  font-size: 18px;
  font-weight: 500;
  color: #1d2129;
}

.user-info .user-id {
  color: #86909c;
  font-size: 14px;
  margin-top: 4px;
}

.shouquan {
  flex: 1;
  padding-left: 40px;
  border-left: 1px solid rgba(22, 93, 255, 0.1);
  position: relative;
}

.shouquan-item {
  padding: 16px 0;
  border-bottom: 1px solid rgba(22, 93, 255, 0.05);
}

.shouquan-item:last-child {
  border-bottom: none;
}

.shouquan-item-font {
  color: #4e5969;
  font-size: 14px;
}

.client-name {
  color: #165DFF;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 0 0 8px rgba(22, 93, 255, 0.2);
}

.action-buttons {
  margin-top: 40px;
  display: flex;
  gap: 16px;
  justify-content: center;
}

.error {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  padding: 20px;
}

.error_card {
  background: white;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  max-width: 480px;
  width: 100%;
}

.error-icon {
  font-size: 64px;
  color: #f53f3f;
  margin-bottom: 24px;
}

.error-title {
  font-size: 24px;
  color: #1d2129;
  margin-bottom: 16px;
  font-weight: 500;
}

.error-desc {
  font-size: 16px;
  color: #4e5969;
  margin-bottom: 32px;
  line-height: 1.5;
}

.error-help {
  color: #86909c;
  font-size: 14px;
  
  p {
    margin-bottom: 8px;
  }
}

.contact-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #165DFF;
  text-decoration: none;
  transition: color 0.2s;
  
  &:hover {
    color: #0e42ff;
  }
  
  .icon-qq {
    font-size: 16px;
  }
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .error_card {
    margin: 20px;
    padding: 32px 24px;
  }

  .error-icon {
    font-size: 48px;
    margin-bottom: 20px;
  }

  .error-title {
    font-size: 20px;
    margin-bottom: 12px;
  }

  .error-desc {
    font-size: 14px;
    margin-bottom: 24px;
  }
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

/* 添加科技感动画效果 */
@keyframes glow {
  0% {
    box-shadow: 0 0 20px rgba(22, 93, 255, 0.1),
                0 0 2px rgba(22, 93, 255, 0.2);
  }
  50% {
    box-shadow: 0 0 25px rgba(22, 93, 255, 0.15),
                0 0 4px rgba(22, 93, 255, 0.3);
  }
  100% {
    box-shadow: 0 0 20px rgba(22, 93, 255, 0.1),
                0 0 2px rgba(22, 93, 255, 0.2);
  }
}

.lay_body {
  animation: glow 3s infinite;
}
</style>
