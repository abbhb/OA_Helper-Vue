<script setup lang="ts">
import {useUserStore} from '@/store';
import {ref} from 'vue';
import {agree, agreeLogin, getClientName} from '@/api/oauth';
import {setToken} from '@/utils/auth';
import router from '@/router';

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
  if (winDatas.value.which === '') {
    // 展示未知错误页面
    yemian.value = 0;
  } else if (winDatas.value.which === 'auth') {
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

  const quanxuanhuofanquanxuan = (value: boolean) => {
    if (value) {
      // 全选
      // eslint-disable-next-line no-plusplus
      for (let j = 0; j < quanbushouquanlist.value.length; j++) {
        // eslint-disable-next-line no-unused-expressions
        if (!quanbushouquanlist.value[j].select) {
          quanbushouquanlist.value[j].select = true;
        }
      }
    } else {
      // eslint-disable-next-line no-plusplus
      for (let j = 0; j < quanbushouquanlist.value.length; j++) {
        // eslint-disable-next-line no-unused-expressions
        if (
          quanbushouquanlist.value[j].select &&
          !quanbushouquanlist.value[j].isMust
        ) {
          quanbushouquanlist.value[j].select = false;
        }
      }
    }
  };
  const registerHandel = () => {
    router.push({
      name: 'register',
      query: router.currentRoute.value.query,
    });
  };
  const shouquanHandel = async () => {
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
      }
      return;
    }

    // 已经登录走下面的逻辑
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
        <div class="lay_top_inner" style="width: 688px">
          <h1 class="logo text_hide">Oauth2授权登录</h1>
          <!--          <div class="lat_top_other">-->
          <!--            <a href="#/show" target="_blank" title="什么是Oauth2授权登录"-->
          <!--              ><i class="icon_help_white"></i>Oauth2授权登录</a-->
          <!--            >-->
          <!--            <span class="line">|</span>-->
          <!--            <a-->
          <!--              id="auth_manager_link"-->
          <!--              href="#/show"-->
          <!--              target="_blank"-->
          <!--              title="登录授权管理"-->
          <!--              >授权管理</a-->
          <!--            >-->
          <!--            <span class="line">|</span>-->
          <!--            <a href="#/show" target="_blank" title="申请接入">申请接入</a>-->
          <!--          </div>-->
        </div>
      </div>
      <div class="lay_body">
        <div class="login">
          <div
            style="
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              font-size: 38px;
              padding: 10px 32px 10px 2px;
            "
          >
            安全登录
          </div>
          <div v-if="userStore.id && userStore.id !== ''">
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 13px 3px 13px 3px;
              "
            >
              <a-avatar
                :size="98"
                :style="{ marginRight: '8px' }"
                style="border: 1px solid #e5e6eb"
              >
                <img alt="avatar" :src="userStore.avatar" />
              </a-avatar>
              <div>
                <span>{{ userStore.name }}</span>
              </div>
            </div>
          </div>
          <div
            v-else
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
          <div
            style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            "
          >
            <a-button
              :size="'large'"
              type="primary"
              long
              @click="shouquanHandel"
              >授权访问</a-button
            >
            <a-button
              v-if="!userStore.id || userStore.id === ''"
              :size="'large'"
              style="margin-top: 10px"
              long
              @click="registerHandel"
            >注册账号
            </a-button
            >
          </div>
        </div>
        <div class="shouquan">
          <div class="shouquan-item">
            <a-checkbox @change="quanxuanhuofanquanxuan"
              ><span class="shouquan-item-font"
                >全选
                <span style="color: #2299dd">{{ winDatas.client_name }}</span>
                将获取以下权限：</span
              ></a-checkbox
            >
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
          <div class="shouquan-item">
            <span class="shouquan-item-font"
              >授权即同意服务协议和隐私保护协议</span
            >
          </div>
        </div>
      </div>
    </div>
    <div v-else class="error">
      <div class="error_card">
        <div style="font-size: 48px">Oauth登录出现了异常</div>
        <div>
          <span style="font-size: 36px"> 异常原因: </span>
          <span v-if="yemian === 2">
            {{ winDatas.msg }}
          </span>
          <span v-if="yemian === 0"> 传参异常 </span>
        </div>
        <div style="font-size: 48px">请联系管理员解决</div>
        <div style="font-size: 48px">QQ:1057117849</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
  .oauth2 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .error {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .shouquan-item {
    padding: 3px 1px 1px 3px;
    display: flex;
    flex-direction: row;
  }
  .shouquan-item-font {
    color: rgba(16, 16, 16, 0.88);
    font-size: 14px;
  }
  .error_card {
    width: 36rem;
    height: 18rem;
    background-color: #25b63e;
    border-radius: 3px;
    padding: 3px 3px 3px 3px;
    margin-top: 10rem;
  }
  .lay_body {
    display: flex;
    flex-direction: row;
  }
  .login {
    display: flex;
    flex-direction: column;
    margin-top: 3rem;
    width: 22rem;
  }
  .shouquan {
    margin-top: 3rem;
    border-left: 1px solid #e1e1e1;
    padding-left: 2rem;
    display: flex;
    flex-direction: column;
    width: 22rem;
  }
</style>
