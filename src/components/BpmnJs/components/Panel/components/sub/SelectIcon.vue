<script lang="ts" setup>
import addIcon from '@/assets/icons/add.svg';
import readMoreIcon from '@/assets/icons/read_more.svg';
import fengxianIcon from '@/assets/icons/010_风险事件.svg';
import mianshiIcon from '@/assets/icons/010_面试日程.svg';
import lianxirenIcon from '@/assets/icons/010_通讯录联系人.svg';
import tongzhiIcon from '@/assets/icons/010_通知.svg';
import yuanchengbangongIcon from '@/assets/icons/010_远程办公.svg';
import feiyongbaoxiaoIcon from '@/assets/icons/010_费用报销.svg';
import qingjiashenqIcon from '@/assets/icons/010_请假申请-21.svg';
import qingjiashenq2Icon from '@/assets/icons/010_请假申请-02.svg';
import settingIcon from '@/assets/icons/010_设置.svg';
import mettingIcon from '@/assets/icons/010_视频会议.svg';
import chatIcon from '@/assets/icons/010_聊天对话.svg';
import jixiaoIcon from '@/assets/icons/010_绩效查询.svg';
import zuzhiIcon from '@/assets/icons/010_组织架构.svg';
import fuliIcon from '@/assets/icons/010_福利平台.svg';
import yongyinIcon from '@/assets/icons/010_用印审批.svg';
import chuqIcon from '@/assets/icons/010_现场出勤.svg';
import messageIcon from '@/assets/icons/010_消息通知.svg';
import liuchengshenpiIcon from '@/assets/icons/010_流程审批.svg';
import addliuchengshenpiIcon from '@/assets/icons/010_新建流程.svg';
import shoucangIcon from '@/assets/icons/010_收藏.svg';
import saoyisaoIcon from '@/assets/icons/010_扫一扫.svg';
import dakaIcon from '@/assets/icons/010_打卡签到.svg';
import dateIcon from '@/assets/icons/010_我的日程.svg';
import myTodoIcon from '@/assets/icons/010_我的待办.svg';
import myTuanduiIcon from '@/assets/icons/010_我的团队.svg';
import myIndexIcon from '@/assets/icons/010_我的主页.svg';
import gongzuocanyudingIcon from '@/assets/icons/010_工作餐预定.svg';
import worklogIcon from '@/assets/icons/010_工作日志.svg';
import waichIcon from '@/assets/icons/010_外出签到.svg';
import waichsqIcon from '@/assets/icons/010_外出申请.svg';
import cawaichsqIcon from '@/assets/icons/010_出差申请.svg';
import allsssIcon from '@/assets/icons/010_全部功能.svg';
import yunwendangIcon from '@/assets/icons/010_云文档.svg';
import {ref} from "vue";


const emit = defineEmits(['on-change']);

const iconDatas = ref('add');

const props = defineProps<{
  iconData: string;
  onlyShow: boolean;
}>();
// eslint-disable-next-line vue/no-setup-props-destructure
iconDatas.value = props.iconData;

const iconList = new Map();
iconList.set('add', addIcon);
iconList.set('工作日志', worklogIcon);
iconList.set('外出签到', waichIcon);
iconList.set('云文档', yunwendangIcon);
iconList.set('全部功能', allsssIcon);
iconList.set('外出申请', waichsqIcon);
iconList.set('出差申请', cawaichsqIcon);
iconList.set('read_more', readMoreIcon);
iconList.set('风险事件', fengxianIcon);
iconList.set('面试日程', mianshiIcon);
iconList.set('通讯录联系人', lianxirenIcon);
iconList.set('通知', tongzhiIcon);
iconList.set('远程办公', yuanchengbangongIcon);
iconList.set('费用报销', feiyongbaoxiaoIcon);
iconList.set('请假申请', qingjiashenqIcon);
iconList.set('请假申请2', qingjiashenq2Icon);
iconList.set('设置', settingIcon);
iconList.set('视频会议', mettingIcon);
iconList.set('聊天对话', chatIcon);
iconList.set('绩效查询', jixiaoIcon);
iconList.set('组织架构', zuzhiIcon);
iconList.set('福利平台', fuliIcon);
iconList.set('用印审批', yongyinIcon);
iconList.set('现场出勤', chuqIcon);
iconList.set('消息通知', messageIcon);
iconList.set('流程审批', liuchengshenpiIcon);
iconList.set('新建流程', addliuchengshenpiIcon);
iconList.set('收藏', shoucangIcon);
iconList.set('扫一扫', saoyisaoIcon);
iconList.set('打卡签到', dakaIcon);
iconList.set('我的日程', dateIcon);
iconList.set('我的待办', myTodoIcon);
iconList.set('我的团队', myTuanduiIcon);
iconList.set('我的主页', myIndexIcon);
iconList.set('工作餐预定', gongzuocanyudingIcon);


const status = ref({
  model: false,
});
// const iconData = ref("");
const openSelect = () => {
  if (props.onlyShow) {
    return;
  }
  status.value.model = true;
}
const selectIcon = (icon) => {
  iconDatas.value = icon;
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('on-change', icon);
  status.value.model = false;

}
</script>

<template>
  <div :style="props.onlyShow?'':'cursor: pointer;' " @click="openSelect">
    <Component :is="iconList.get(iconDatas)" :key="iconDatas"/>
    <a-modal
      v-model:visible="status.model"
      :draggable="true"
      :footer="false"
      :fullscreen="false"
      :mask="true"
      style="z-index: 951122"
    >
      <template #title>
        选择图标
      </template>
      <div class="icon-selector">
        <div v-for="(it, index) in iconList.keys()" :key="index" class="icon-item" @click="selectIcon(it)">
          <Component :is="iconList.get(it)" style="width: 50px;height: 50px;"/>
          <div style="max-width: 50px;font-size: 12px">
            {{ it }}
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
.icon-selector {
  display: flex;
  flex-wrap: wrap;
}

.icon-item {
  cursor: pointer;
  margin-right: 15px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-item i {
  font-size: 24px;
}
</style>
