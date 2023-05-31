<template>
    <div class="login-form-wrapper">
        <div class="login-form-title">
            {{ status ? (!code ? $t('callback.one.NoCode') : $t('callback.one.title')) : $t('callback.one.error') }}
        </div>
        <div class="login-form-sub-title">
            {{ status ? (!code ? $t('callback.one.NoCode') : $t('callback.one.title')) : $t('callback.one.error') }}
        </div>
        <div class="login-form-error-msg" v-if="!status">{{ errorMessage }}</div>

    </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n';
import {loginbycode, LoginDataByCode} from "@/api/user";
import {useIntervalFn} from "@vueuse/core";
import {Message} from "@arco-design/web-vue";
import {useUserStore} from "@/store";

const userStore = useUserStore();
const router = useRouter();
const {t} = useI18n();
const errorMessage = ref('');
const status = ref(true);
const {code} = router.currentRoute.value.query;
const login = async () => {
  try {
    await userStore.loginByCode({code} as LoginDataByCode);

  const { redirect } = router.currentRoute.value.query;
  router.push({
      name: (redirect as string) || 'Workplace',
      query: {
      },
  });
  Message.success(t('login.form.login.success'));
  } catch (e) {
    console.log(e);
    status.value = false
    const time = ref(3)
    time.value = 3
    errorMessage.value = `${time.value}s后跳转到登录页面`
      // useIntervalFn(回调函数，间隔时间长度，是否立即开始)
    const {resume} = useIntervalFn(
      () => {
        if (time.value === 0) {
          router.push({name: 'login'});
          resume();
        } else {
          time.value -= 1
          errorMessage.value = `${time.value}s后跳转到登录页面`
        }
      }, 1000, {immediate: true})

  }
}

if (code) {

  login();
}


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
