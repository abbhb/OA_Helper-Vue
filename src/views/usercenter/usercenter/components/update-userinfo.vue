<template>
  <div class="safe-center">
    <a-space direction="vertical" size="large" :style="{ width: '600px' }">
      <span class="title">{{
        $t('workplace.safe-center.updatauserinfo')
      }}</span>

      <a-form :model="form" :style="{ width: '600px' }" @submit="handleSubmit">
        <a-form-item
          field="username"
          :tooltip="
            $t('workplace.safe-center.please') +
            $t('workplace.safe-center.username')
          "
          :label="$t('workplace.safe-center.username')"
        >
          <a-input
            v-model="form.username"
            disabled
            :placeholder="
              $t('workplace.safe-center.please') +
              $t('workplace.safe-center.username')
            "
          />
        </a-form-item>
        <a-form-item field="name" :label="$t('workplace.safe-center.name')">
          <a-input
            v-model="form.name"
            :placeholder="
              $t('workplace.safe-center.please') +
              $t('workplace.safe-center.name')
            "
          />
        </a-form-item>
        <a-form-item field="sex" :label="$t('workplace.safe-center.sex')">
          <a-select
            v-model="form.sex"
            :style="{ width: '320px' }"
            :placeholder="
              $t('workplace.safe-center.please') +
              $t('workplace.safe-center.sex')
            "
          >
            <a-option>男</a-option>
            <a-option>女</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="phone" :label="$t('workplace.safe-center.phone')">
          <a-input
            v-model="form.phone"
            :placeholder="
              $t('workplace.safe-center.please') +
              $t('workplace.safe-center.phone')
            "
          />
        </a-form-item>
        <a-form-item
          field="studentId"
          :label="$t('workplace.safe-center.studentId')"
        >
          <a-input
            v-model="form.studentId"
            :placeholder="
              $t('workplace.safe-center.please') +
              $t('workplace.safe-center.studentId')
            "
          />
        </a-form-item>
        <a-form-item field="avatar" :label="$t('workplace.safe-center.avatar')">
          <ImageUpload
            :draggable="true"
            :image="form.avatar"
            url="./api/common/uploadimage"
            @on-success="handleSuccess"
          />
        </a-form-item>
        <a-form-item>
          <a-button :disabled="isCommit" type="primary" html-type="submit">{{
            $t('workplace.safe-center.submit')
          }}</a-button>
        </a-form-item>
      </a-form>
    </a-space>
  </div>
</template>

<script>
  import { reactive, ref, watch } from 'vue';
  import { useUserStore } from '@/store';
  import ImageUpload from '@/components/image/ImageUpload.vue';
  import { Message } from '@arco-design/web-vue';
  import { updataUserInfo } from '@/api/user';

  export default {
    components: { ImageUpload },
    setup() {
      const form = reactive({
        username: '',
        id: undefined,
        name: '',
        sex: '',
        studentId: undefined,
        phone: undefined,
        avatar: '',
      });
      const userStore = useUserStore();
      const info = userStore.userInfo;
      const handleSubmit = async (data) => {
        if (`${form.avatar}`.indexOf('http') !== -1) {
          // eslint-disable-next-line prefer-destructuring
          form.avatar = form.avatar.split('aistudio/')[1];
        }
        try {
          const res = await updataUserInfo(form);
          Message.success(res.msg);
          userStore.info();
        } catch (e) {
          Message.error(e);
        }
      };

      form.username = info.username;
      form.id = info.id;
      form.name = info.name;
      form.sex = info.sex;
      form.studentId = info.studentId;
      form.phone = info.phone;
      form.avatar = info.avatar;
      form.age = info.age;
      console.log(info);
      const handleSuccess = (data) => {
        // r为data
        if (data.indexOf('http') !== -1) {
          // eslint-disable-next-line prefer-destructuring
          form.avatar = data.split('aistudio/')[1];
        } else {
          form.avatar = data;
        }
        Message.success('上传成功!');
      };

      const isCommit = ref(true);

      watch(
        form,
        (value) => {
          isCommit.value =
            form.sex === info.sex &&
            form.name === info.name &&
            form.phone === info.phone &&
            form.avatar === info.avatar &&
            form.studentId === info.studentId;
        },
        { deep: true, immediate: true }
      );

      return {
        form,
        isCommit,
        handleSubmit,
        handleSuccess,
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
