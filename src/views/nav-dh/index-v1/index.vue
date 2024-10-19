<script lang="ts" setup>
import router from '@/router';
import {computed, ref} from 'vue';
import AvatarImage from '@/components/image/AvatarImage.vue';
import {useUserStore} from '@/store';
import {navList, QuickNavigationResult} from '@/api/nav';
import {Message} from '@arco-design/web-vue';
import {MdPreview} from 'md-editor-v3';

const userStore = useUserStore();

const avatar = computed(() => {
  return userStore.avatar;
});

const cards = ref<QuickNavigationResult[]>([]);
const activate = ref(0);
const markdownDialog = ref({
  dialogTitle: 'markdown',
  dialogVisible: false,
  dialogContent: '123123',
  row: null,
});

const getpage = (id) => {
  window.open(`cas/common/get_page/${id}`);
};

const initData = async () => {
  const {data} = await navList();
  cards.value = data;
};

initData();

const pathGoTo = (row, lo) => {
  if (row === 'houtai' && lo === 'goto') {
    router.push({name: 'Workplace'});
    return;
  }
  if (lo === 1) {
    if (String(row.type) === '0') {
      if (String(row.content)) {
        markdownDialog.value.dialogTitle = row.name;
        markdownDialog.value.dialogContent = row.content;
        markdownDialog.value.row = row;
        markdownDialog.value.dialogVisible = true;
      } else {
        window.open(row.path, '_blank');
      }
    } else if (String(row.type) === '1') {
      markdownDialog.value.dialogTitle = row.name;
      markdownDialog.value.dialogContent = row.content;
      markdownDialog.value.row = row;
      markdownDialog.value.dialogVisible = true;
    }
  } else if (lo === 2) {
    window.open(row.path, '_blank');
  }
};

const ellipsis = (intro?: string) => {
  if (!intro) return '';
  if (intro.length > 17) {
    return `${intro.slice(0, 17)}...`;
  }
  return intro;
};

const beforeClose = (flag) => {
  markdownDialog.value.dialogVisible = flag;
};
const anchorChange = (hash: string) => {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < cards.value.length; i++) {
    if (`#${cards.value[i].id}` === hash) {
      activate.value = i;
      break;
    }
  }
};
</script>

<template>
  <div id="Oauth-management" class="bd">
    <div class="portal">
      <div class="tableBar">
        <a-link target="_blank" @click="pathGoTo('houtai', 'goto')"
        >工作台
        </a-link>

        <a-dropdown trigger="click">
          <a-avatar
            :size="32"
            :style="{ marginRight: '8px', cursor: 'pointer' }"
            style="float: right; right: auto"
          >
            <img :src="avatar" alt="avatar"/>
          </a-avatar>
          <template #content>
            <!--            <a-doption>-->
            <!--              <a-space @click="switchRoles">-->
            <!--                <icon-tag />-->
            <!--                <span>-->
            <!--                  {{ $t('messageBox.switchRoles') }}-->
            <!--                </span>-->
            <!--              </a-space>-->
            <!--            </a-doption>-->
            <a-doption>
              <a-space
                v-is-auth="true"
                @click="$router.push({ name: 'profile' })"
              >
                <icon-user/>
                <span>
                  {{ userStore.name }}
                </span>
              </a-space>
            </a-doption>

            <a-doption>
              <a-space @click="Message.info('此功能尚未实现')">
                <icon-export/>
                <span>
                  {{ $t('messageBox.logout') }}
                </span>
              </a-space>
            </a-doption>
          </template>
        </a-dropdown>
      </div>
      <div class="portal-wrap">
        <div class="portal-header"></div>
        <div class="portal-content">
          <div class="portal-content-inner">
            <div class="portal-content__anchor">
              <a-scrollbar
                class="scrollbar-for"
                style="height: 800px; overflow-y: auto; overflow-x: hidden"
              >
                <div class="a-scrollba__r">
                  <div class="a-scrollba__r__wrap">
                    <div class="a-scrollba__r__view" style="padding-top: 46px">
                      <a-anchor
                        :change-hash="false"
                        line-less
                        scroll-container="#sss-gundongrongqi"
                        @change="anchorChange"
                      >
                        <a-anchor-link
                          v-for="(card, key) in cards"
                          :key="key"
                          :class="
                            activate === key
                              ? 'anchor__item_hover'
                              : 'anchor__item'
                          "
                          :href="'#' + card.id"
                        >{{ card.name }}
                        </a-anchor-link>
                      </a-anchor>
                    </div>
                  </div>
                  <div class="a-scrollba__r__bar is-horizontal">
                    <div
                      class="a-scrollba__r__thumb"
                      style="transform: translateX(0%)"
                    ></div>
                  </div>
                  <div class="a-scrollba__r__bar is-vertical">
                    <div
                      class="a-scrollba__r__thumb"
                      style="transform: translateY(0%)"
                    ></div>
                  </div>
                </div>
              </a-scrollbar>
            </div>
            <div class="portal-content__block">
              <a-scrollbar
                id="sss-gundongrongqi"
                class="scrollbar-for"
                style="height: 803px; overflow-y: auto; overflow-x: hidden"
              >
                <div class="a-scrollba__r">
                  <div
                    class="a-scrollba__r__wrap"
                    style="padding-top: 15px; padding-left: 15px"
                  >
                    <div class="a-scrollba__r__view">
                      <section
                        v-for="(card, keys) in cards"
                        :key="keys"
                        class="bigBody"
                      >
                        <div class="right-content">
                          <div class="head">
                            <h4 :id="card.id" class="text">
                              <a>{{ card.name }}</a>
                            </h4>
                          </div>
                          <div
                            v-if="card.item.length === 0"
                            class="box_"
                            style="border: #0085f1 dashed 1px; width: 100%"
                          >
                            <a-empty style="width: 100%"/>
                          </div>
                          <ul
                            v-for="item in card.item"
                            :key="item.id"
                            class="box_"
                          >
                            <div class="acard">
                              <div class="box-card" shadow="hover">
                                <div
                                  class="ico_ cont_ image_box"
                                  @click="pathGoTo(item, 1)"
                                >
                                  <!--                                  <img v-if="item.image===''" class="img_" src="@/assets/notimage.png">-->
                                  <AvatarImage
                                    :key="item.id+'navdh'+item.name"

                                    :avatar="item.image"
                                    :name="item.name"
                                  />
                                </div>
                                <div class="cont_" @click="pathGoTo(item, 1)">
                                  <div>
                                    <strong class="cont_head">{{
                                        item.name
                                      }}</strong>
                                  </div>
                                  <div class="cont_cont">
                                    <a-tooltip
                                      :content="item.introduction"
                                      effect="dark"
                                      placement="right"
                                    >
                                      <span>{{
                                          ellipsis(item.introduction)
                                        }}</span>
                                    </a-tooltip>
                                  </div>
                                </div>
                                <div class="link_" @click="pathGoTo(item, 2)">
                                  <a-tooltip
                                    content="直达"
                                    effect="dark"
                                    placement="right"
                                  >
                                    <icon-send :size="20"/>
                                  </a-tooltip>
                                </div>
                              </div>
                            </div>
                          </ul>
                        </div>

                        <a-modal
                          v-model:visible="markdownDialog.dialogVisible"
                          :click-mask-close="true"
                          :content="markdownDialog.dialogContent"
                          :mask="true"
                          okText="跳转"
                          @ok="pathGoTo(markdownDialog.row,2)"
                          :show-close-icon="true"
                          :title="markdownDialog.dialogTitle"
                        >
                          <MdPreview
                            v-model="markdownDialog.dialogContent"
                          >
                          </MdPreview>
                        </a-modal>
                      </section>
                    </div>
                  </div>
                  <div class="a-scrollba__r__bar is-horizontal">
                    <div
                      class="a-scrollba__r__thumb"
                      style="transform: translateX(0%)"
                    ></div>
                  </div>
                  <div class="a-scrollba__r__bar is-vertical">
                    <div
                      class="a-scrollba__r__thumb"
                      style="transform: translateY(0%); height: 44.6674%"
                    ></div>
                  </div>
                </div>
              </a-scrollbar>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">Easy_OA - 导航页</div>
    </div>
  </div>
</template>

<style lang="less" scoped src="./style.less"></style>

<style>
.arco-anchor-line-less .arco-anchor-link-active > .arco-anchor-link {
  background-color: var(--color-bg-1);
}
</style>
