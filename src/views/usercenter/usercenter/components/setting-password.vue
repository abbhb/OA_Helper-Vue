<template>
  <div class="safe-center">
    <a-form :model="form" :style="{ width: '400px' }" @submit="handleSubmit">
      <a-form-item
        field="password"
        tooltip="只有首次不需要输入原密码"
        :label="$t('workplace.safe-center.password')"
      >
        <a-input
          v-model="form.password"
          type="password"
          autocomplete="password"
          :disabled="!needPassword"
          :placeholder="
              $t('workplace.safe-center.please') +
              $t('workplace.safe-center.password')
            "
        />
      </a-form-item>

      <a-form-item
        field="newPassword"
        :label="$t('workplace.safe-center.newPassword')"
      >
        <a-input
          v-model="form.newPassword"
          type="password"
          autocomplete="new-password"
          :placeholder="
              $t('workplace.safe-center.please') +
              $t('workplace.safe-center.newPassword')
            "
        />
      </a-form-item>
      <a-form-item
        field="rePassword"
        :label="$t('workplace.safe-center.rePassword')"
      >
        <a-input
          v-model="form.rePassword"
          autocomplete="re-password"
          type="password"
          :placeholder="
              $t('workplace.safe-center.please') +
              $t('workplace.safe-center.rePassword')
            "
        />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit">{{
            $t('workplace.safe-center.reCommit')
          }}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  import { reactive, ref } from 'vue';
  import { useUserStore } from '@/store';
  import { Message } from '@arco-design/web-vue';
  import {getUserPassword, setPassword, updataUserInfo} from '@/api/user';

  export default {
    setup() {
      const form = reactive({
        password: '',
        newPassword: '',
        rePassword: '',
      });
      const needPassword = ref(false);
      try {
        getUserPassword().then(res=>{
              if (res.data === 1) {
                  needPassword.value = false;
              } else {
                  needPassword.value = true;
              }
          })
      } catch (e) {
        Message.error('环境初始化失败');
      }
      const userStore = useUserStore();
      const info = userStore.userInfo;
      const handleSubmit = async (data) => {
        try {
          const res = await setPassword(form);
          form.password= '';
          form.newPassword = '';
          form.rePassword = '';
          Message.success(res.msg);
          userStore.info();

        } catch (e) {
          Message.error(e.toString());
        }
      };



      return {
        form,needPassword,
        handleSubmit,
      };
    },
  };
</script>

<style scoped>
  .safe-center {
      background-color: var(--color-bg-2);
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    .title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 20px;
        color: var(--color-text-1);

    }
  }
</style>
