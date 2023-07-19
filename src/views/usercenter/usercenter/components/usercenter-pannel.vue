<template>
  <a-card
    class="general-card"
    :title="$t('workplace.quick.operation')"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ paddingTop: '26px' }"
  >
    <div style="margin-bottom: -1rem">
      <a-row :gutter="8">
        <a-col
          v-for="link in links"
          :key="link.text"
          :span="8"
          class="wrapper"
          @click="goto(link.type)"
        >
          <div class="icon">
            <component :is="link.icon" />
          </div>
          <a-typography-paragraph class="text">
            {{ $t(link.text) }}
          </a-typography-paragraph>
        </a-col>
      </a-row>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  import {useRouter} from "vue-router";

  const router = useRouter()

  const links = [
    {
      text: 'workplace.safe-center.settingPassword',
      icon: 'icon-settings',
      type: 'settingPassword',
    },
    {
      text: 'workplace.safe-center.updateUserInfo',
      icon: 'icon-file',
      type: 'updateUserInfo',
    },
  ];
  const goto = (type: string) => {
    router.push({
      name: 'profile',
      query: {
        type,
      },
    });
  };
</script>

<style scoped lang="less">
  .wrapper {
    border: aliceblue 1px solid;
    border-radius: 5px;
    margin-right: 2px;
    padding: 2px 0px 2px 0;
    .icon {
      font-size: 18px;
    }
  }
  .wrapper:hover {
    background-color: #e8f3ff;
    cursor: pointer;
  }
</style>
