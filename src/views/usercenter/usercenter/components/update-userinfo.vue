<template>
  <div class="safe-center">
    <a-space direction="vertical" size="large" :style="{ width: '600px' }">
<!--      <span class="title">{{-->
<!--        $t('workplace.safe-center.updatauserinfo')-->
<!--      }}</span>-->

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
  import { reactive, ref, watch, h } from 'vue';
  import { useUserStore } from '@/store';
  import ImageUpload from '@/components/image/ImageUpload.vue';
  import { Message, Modal } from '@arco-design/web-vue';
  import { updataUserInfo } from '@/api/user';
  import { confirmToServer, isConfirm } from '@/api/common';
  import { FIRST_SUCCESS_UPDATE_USER_INFO } from '@/utils/my-string';

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
      const isCommit = ref(true);
      // vs 打印文件转换节点优化，异常捕获
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
          isCommit.value = true;
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
      const ModalContent = {
        setup() {
          return () =>
            h('div', { class: 'info-modal-content' }, [
              h('h1', { style: 'margin-bottom: 10px;' }, '欢迎你使用本平台！'),
              h(
                'h2',
                { style: 'margin-bottom: 10px;' },
                '请先完善下个人信息，以便您获得更好的服务！'
              ),
              h(
                'h4',
                { style: 'margin-bottom: 10px;' },
                '本提示只会显示一次，若您拒不完善也不会影响大多数功能的使用！'
              ),
            ]);
        },
      };
      const okButtonHandel = async () => {
        await confirmToServer(FIRST_SUCCESS_UPDATE_USER_INFO);
      };
      const successUserUpdataSelfInfo = async () => {
        // 先判断该用户是不是建议过了！
        const { data } = await isConfirm(FIRST_SUCCESS_UPDATE_USER_INFO);
        if (!data) {
          // 需要弹出提示信息!
          Modal.info({
            title: '新人提示',
            content: () => h(ModalContent),
            onOk: okButtonHandel,
          });
        }
      };
      successUserUpdataSelfInfo();
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
