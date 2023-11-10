<template>
  <transition name="fade">
    <div class="container">
      <!--    <div class="logo">-->
      <!--      <img-->
      <!--        alt="logo"-->
      <!--        src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/dfdba5317c0c20ce20e64fac803d52bc.svg~tplv-49unhts6dw-image.image"-->
      <!--      />-->
      <!--      <div class="logo-text">{{$t('footer.company')}}</div>-->
      <!--    </div>-->
      <!--    <div>左侧</div>-->
      <div class="content">
        <div class="content-inner">
          <RegisterForm />
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
  import RegisterForm from './components/register-form.vue';
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    height: 100vh;
    width: 100%;
    background: url("../../assets/images/register_background.jpeg") center center no-repeat;
    background-size: 100% 100%;

    .banner {
      width: 550px;
      background: linear-gradient(163.85deg, #1d2129 0%, #00308f 100%);
    }

    .content {
      position: relative;
      display: flex;
      flex: 1;
      margin-top: 18rem;
      margin-left: 15rem;
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
</style>
