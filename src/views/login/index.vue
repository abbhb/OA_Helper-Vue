<template>
  <transition name="fade">
    <div class="container">
      <div class="logo">
        <img
          alt="logo"
          src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/dfdba5317c0c20ce20e64fac803d52bc.svg~tplv-49unhts6dw-image.image"
        />
        <div class="logo-text">{{ $t('footer.company') }}</div>
      </div>
      <LoginBanner class="banners"/>

      <div class="content">
        <div class="content-inner">
          <LoginForm v-if="!isCallback"/>
          <ThirdLogin v-if="!isCallback"/>
          <ThirdCallback v-if="isCallback"/>
        </div>
        <div class="footer">
          <Footer />
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import Footer from '@/components/footer/index.vue';
import {getQueryVariable} from '@/utils/utils';
import {ref} from 'vue';
import LoginBanner from './components/banner.vue';
import LoginForm from './components/login-form.vue';
import ThirdLogin from './components/third-login.vue';
import ThirdCallback from './components/third-callback.vue';

const isCallback = ref(false);

const callbackCode = getQueryVariable('code');
const callbackType = getQueryVariable('type');

if (callbackCode !== '' && callbackType !== '') {
  isCallback.value = true;
}
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    height: 100vh;

    .banner {
      width: 550px;
      background: linear-gradient(163.85deg, #1d2129 0%, #00308f 100%);
    }

    .content {
      position: relative;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      padding-bottom: 40px;
    }

    .footer {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 100%;
    }
  }

  .logo {
    position: fixed;
    top: 24px;
    left: 22px;
    z-index: 1;
    display: inline-flex;
    align-items: center;

    &-text {
      margin-right: 4px;
      margin-left: 4px;
      color: var(--color-fill-1);
      font-size: 20px;
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  @media (max-width: @screen-lg) {
    .container {
      .banner {
        width: 25%;
      }
    }
  }

  @media (max-width: @screen-sm) {
    .banners {
      display: none;
    }

    .logo-text {
      color: black;
    }
  }
</style>
