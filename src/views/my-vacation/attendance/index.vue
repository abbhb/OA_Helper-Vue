<script setup lang="ts">
  import { h, ref } from 'vue';
  import { IconSearch } from '@arco-design/web-vue/es/icon';
  import { getColor } from '@/utils/color-index';
  import { RoleManger } from '@/api/role';
  import ShareCopyIcon from '@/assets/icons/shape-copy.svg';

  import {
    index_page_data_withuser,
    IndexPageDataWithuserReq,
    SigninLogForSelfResp,
  } from '@/api/attendance';
  import {Message} from "@arco-design/web-vue";
  import router from "@/router";

  interface statuEI {
    clickLoading: boolean;
    req: IndexPageDataWithuserReq;
  }

  const statuEs = ref<statuEI>({
    clickLoading: false,
    req: {
      pageNum: 1,
      pageSize: 10,
      state: null,
      start: null,
      end: null,
    },
  });

  const tableData = ref<SigninLogForSelfResp[]>([]);

  const initData = async () => {
    statuEs.value.clickLoading = true;
    const { data } = await index_page_data_withuser(statuEs.value.req);
    console.log(data);
    tableData.value = data.records;
    pagination.value.total = data.total;
    statuEs.value.clickLoading = false;
  };

  const pagination = ref({
    current: 1,
    defaultPageSize: 10,
    total: 0,
    pageSize: 10,
    pageSizeOptions: [10, 20, 50],
    showPageSize: true,
    showJumper: true,
    onChange(page) {
      pagination.value.current = page;
      statuEs.value.req.pageNum = page;
      initData();
    },
    onPageSizeChange(pageSize) {
      pagination.value.pageSize = pageSize;
      statuEs.value.req.pageSize = pageSize;

      initData();
    },
    showTotal: () => `共 ${11} 条`,
  });
  initData();
  const getStateName = (state: number) => {
    if (state === 0) {
      return '正常';
    }
    if (state === 4) {
      return '请假';
    }
    if (state === 3) {
      return '缺勤';
    }

    return '异常';
  };

  const gotoDetail = (record) => {
    console.log(record);
    Message.info('详情页暂未实现!敬请期待');
  };
  const gotoQingJia = () => {
    router.push({
      name:'StartProcessNewV1'
    })
  }
</script>

<template>
  <div class="content-region">
    <div class="view-list"
      ><div id="ViewListLayer" class="layerForTab"
        ><span class="head-icon sys-icon-cus-kaoqinjilu sys-bgcolor-f1"></span>

        <div class="out_view_item out_view_item_active"
          ><span class="out_view_item-innerText"
            ><div class="view_active_line"></div>我的考勤</span
          ><div class="visualViewListDom">我的考勤</div></div
        >
        <div class="out_view_item_last"
          ><div class="out_view_item"
            ><span class="out_view_item-innerText"
              ><div class="view_active_line"></div>我的补签</span
            ></div
          ></div
        ></div
      ><div class="drop-list-region"
        ><div class="drop-list drop-list-shadow" style="display: none"
          ><ul class="clearfix"
            ><div class="view-list-scroll-wrap"
              ><!-- react-text: 29 --><!-- /react-text --><!-- react-text: 35 --><!-- /react-text --></div
            ><!-- react-text: 36 --><!-- /react-text --></ul
          >

    </div
        ><div class="drop-list drop-list-real" style="display: none"
          ><ul class="clearfix"
            ><div class="view-list-scroll-wrap"
              ><!-- react-text: 40 --><!-- /react-text --><!-- react-text: 46 --><!-- /react-text --></div
            ><!-- react-text: 47 --><!-- /react-text --></ul
          ></div
        ></div
      ></div
    >
    <a-alert
      banner
      style="
        margin-top: 10px;
        margin-bottom: 10px;
        margin-left: 30px;
        width: 96%;
      "
      >点击考勤日期可查看详情
    </a-alert>
    <a-button :type="'primary'" style="position: absolute;top: 0;right: 36px;margin-top: 12px;
    margin-bottom: 12px;" @click="gotoQingJia">请假</a-button>

    <div class="content-view">
      <div class="shaixuan"> </div>

      <a-table
        class="test"
        :bordered="false"
        :data="tableData"
        :loading="statuEs.clickLoading"
        :pagination="pagination"
        :size="'medium'"
        row-key="id"
        :scrollbar="true"
        :scroll="{ y: 600 }"
        column-resizable
      >
        <template #columns>
          <a-table-column
            :ellipsis="true"
            :tooltip="true"
            title="考勤日期"
            :width="150"
          >
            <template #cell="{ record }">
              <a-link :hoverable="false" @click="gotoDetail(record)">
                {{ record.currentDate }}<span> </span> {{ record.currentXQ
                }}<Component
                  v-if="!record.needSB"
                  :is="ShareCopyIcon"
                  style="width: 14px; height: 14px"
                />
              </a-link>
            </template>
          </a-table-column>
          <a-table-column
            title="首打卡"
            :width="100"
            :ellipsis="true"
            :tooltip="true"
          >
            <template #cell="{ record }">
              {{ record.firstTime ? record.firstTime : '--' }}
            </template>
          </a-table-column>
          <a-table-column
            title="末打卡"
            :width="100"
            :ellipsis="true"
            :tooltip="true"
          >
            <template #cell="{ record }">
              {{ record.endTime ? record.endTime : '--' }}
            </template>
          </a-table-column>
          <a-table-column
            :ellipsis="true"
            :tooltip="true"
            title="缺勤时长"
            :width="100"
          >
            <template #cell="{ record }">
              {{ record.queQinTime?record.queQinTime:'--' }}
            </template>
          </a-table-column>
          <a-table-column
            :ellipsis="true"
            :tooltip="true"
            title="考勤状态"
            :width="100"
          >
            <template #cell="{ record }">
              <span
                :style="
                  record.state !== 0 && record.state !== 4
                    ? 'color: #cc2929'
                    : ''
                "
              >
                {{ record.needSB ? getStateName(record.state) : '正常' }}
              </span>
            </template>
          </a-table-column>
          <a-table-column
            :ellipsis="true"
            :tooltip="true"
            title="异常原因"
            :width="200"
          >
            <template #cell="{ record }">
              {{ record.errMsg?record.errMsg:'--' }}
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style lang="less" scoped>
  @import '@/views/my-vacation/attendance/icon.css';

  .arco-table-size-medium .arco-table-td {
    font-size: 12px;
    color: #0e1114;
  }
  .content-region {
    position: relative;
    box-sizing: border-box;
    float: left;
    width: 100%;
    background-color: var(--color-menu-light-bg);
    background: RGB(247, 249, 250);
  }

  .view-list {
    height: 56px;
    position: relative;
    padding: 6px 20px 12px 24px;
    box-sizing: border-box;
  }
  .view-list .layerForTab {
    align-items: center;
    display: inline-flex;
    height: 42px;
    position: relative;
    font-size: 16px;
    font-weight: 600;
    color: RGB(var(--skin-css-var-M2, 51, 56, 61));
  }

  .view-list .layerForTab {
    align-items: center;
    display: inline-flex;
    height: 42px;
    position: relative;
    font-size: 16px;
    font-weight: 600;
    color: RGB(var(--skin-css-var-M2, 51, 56, 61));
  }

  .view-list .layerForTab .head-icon {
    cursor: default;
    width: 26px;
    height: 26px;
    line-height: 26px;
    display: inline-block;
    float: left;
    border-radius: var(--skin-css-var-Ra2, 5px);
    font-size: 20px;
    text-align: center;
    margin-right: 24px;
    background-color: RGB(var(--skin-css-var-S3, 20, 106, 255));
  }

  .view-list .layerForTab .head-icon:before {
    color: #fff;
  }

  .view-list .layerForTab .out_view_item {
    display: inline-block;
    cursor: pointer;
    height: 24px;
    margin-left: 0;
    margin-right: 40px;
  }

  .view-list .layerForTab .out_view_item:hover {
    color: RGB(var(--skin-css-var-S3, 20, 106, 255));
  }

  .view-list .layerForTab .out_view_item span {
    height: 24px;
    display: inline-block;
    max-width: 128px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    word-break: break-all;
    word-wrap: break-word;
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
  }

  .view-list .layerForTab .out_view_item.out_view_item_en_US span {
    max-width: 260px;
  }

  .view-list .layerForTab .out_view_item_last {
    display: inline-flex;
    align-items: center;
    margin-left: 0;
    margin-right: 0;
  }

  .view-list .layerForTab .out_view_item_active {
    color: RGB(var(--skin-css-var-S2, 0, 75, 224));
    position: relative;
  }

  .view-list .layerForTab .out_view_item_active:hover {
    color: RGB(var(--skin-css-var-S3, 20, 106, 255));
  }

  .view-list .layerForTab .out_view_item_active .view_active_line {
    background: RGB(var(--skin-css-var-S3, 20, 106, 255));
    height: 2px;
    width: 28px;
    position: absolute;
    bottom: -4px;
    left: 0;
    right: 0;
    margin: 0 auto;
    border-radius: 1px;
  }

  .view-list .layerForTab .out_view_more {
    cursor: pointer;
    height: 18px;
    width: 18px;
    vertical-align: top;
    display: inline-block;
  }

  .view-list .layerForTab .out_view_more:hover .icon__more-active__fill {
    fill: RGB(var(--skin-css-var-S2, 0, 75, 224));
  }

  .view-list
    .layerForTab
    .out_view_more
    .out_view_more_show
    .icon__more-active__fill,
  .view-list .layerForTab .out_view_more:active .icon__more-active__fill {
    fill: RGB(var(--skin-css-var-S3, 20, 106, 255));
  }

  .view-list .layerForTab .out_view_more.safari_fix-vertical-align-text {
    vertical-align: text-bottom;
  }

  .view-list .layerForTab .out_view_more .icon__more-active {
    vertical-align: top;
  }

  .view-list .layerForTab .out_view_more .icon__more-active__fill {
    fill: RGB(var(--skin-css-var-M2, 51, 56, 61));
  }

  .view-list .layerForTab .isSafri_out_view_more {
    transform: translateY(8px);
  }

  .view-list .layerForTab .out_view_more_show {
    cursor: pointer;
    height: 18px;
    width: 18px;
    vertical-align: top;
    display: inline-flex;
    align-items: center;
  }

  .view-list .layerForTab .out_view_item-innerText .view_active_line {
    display: none;
  }

  .view-list .layerForTab .out_view_item_active .view_active_line {
    display: block;
  }

  .view-list .layerForTab .out_view_item_active .visualViewListDom {
    position: absolute;
    height: 42px;
    width: calc(100% - 30px);
    left: 15px;
    top: 0;
    max-width: 130px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    word-break: break-all;
    word-wrap: break-word;
    font-size: 14px;
    opacity: 0;
  }

  .view-list .layer {
    height: 24px;
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
    color: RGB(var(--skin-css-var-S2, 0, 75, 224));
    position: relative;
    margin-top: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    float: left;
    padding-right: 20px;
  }

  .view-list .layer[data-style='view-list-drop-layer'] {
    align-items: center;
    display: inline-flex;
  }

  .view-list .layer,
  .view-list .layer[data-style='view-list-drop-layer'] {
    color: RGB(var(--skin-css-var-S2, 0, 75, 224));
  }

  .view-list .layer .icon__dropdown-max-active__fill,
  .view-list
    .layer[data-style='view-list-drop-layer']
    .icon__dropdown-max-active__fill {
    fill: RGB(var(--skin-css-var-S3, 20, 106, 255));
  }

  .view-list .layer:hover,
  .view-list .layer[data-style='view-list-drop-layer']:hover {
    color: RGB(var(--skin-css-var-S3, 20, 106, 255));
  }

  .view-list .layer:hover .icon__dropdown-max-active__fill,
  .view-list
    .layer[data-style='view-list-drop-layer']:hover
    .icon__dropdown-max-active__fill {
    fill: RGB(var(--skin-css-var-S2, 0, 75, 224));
  }

  .view-list .layer:active,
  .view-list .layer[data-style='view-list-drop-layer']:active {
    color: RGB(var(--skin-css-var-S3, 20, 106, 255));
  }

  .view-list .layer:active .icon__dropdown-max-active__fill,
  .view-list
    .layer[data-style='view-list-drop-layer']:active
    .icon__dropdown-max-active__fill {
    fill: RGB(var(--skin-css-var-S2, 0, 75, 224));
  }

  .view-list .layer[data-style='view-list-drop-layer-active'] {
    color: RGB(var(--skin-css-var-S3, 20, 106, 255));
  }

  .view-list
    .layer[data-style='view-list-drop-layer-active']
    .icon__dropdown-max-active__fill {
    fill: RGB(var(--skin-css-var-S2, 0, 75, 224));
  }

  .view-list .layer .viewListTitle {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 325px;
    display: inline-block;
  }

  .view-list .layer .pc-sys-dropdownmax-active-svg__back {
    display: inline-block;
    position: absolute;
    right: 6px;
    top: 10px;
    background-size: 100% 100%;
    height: 6px;
    width: 10px;
  }

  .view-list
    .layer
    .pc-sys-dropdownmax-active-svg__back
    .icon__dropdown-max-active {
    vertical-align: top;
    height: 100%;
  }

  .view-list .layer .head-icon {
    cursor: default;
    margin-right: 8px;
    width: 26px;
    height: 26px;
    line-height: 26px;
    display: inline-block;
    border-radius: var(--skin-css-var-Ra2, 5px);
    float: left;
    font-size: 20px;
    text-align: center;
    background-color: RGB(var(--skin-css-var-S3, 20, 106, 255));
  }

  .view-list .layer .head-icon:before {
    color: #fff;
  }

  .view-list .layerForOneView,
  .view-list .layerForOneView:hover {
    color: #36434d;
  }

  .view-list .cursor-default {
    cursor: default;
  }

  .view-list .drop-list-region {
    display: inline-block;
    position: absolute;
    background-color: RGB(var(--skin-css-var-M9, 255, 255, 255));
    z-index: 15;
    top: 44px;
    left: 20px;
    z-index: 100000;
  }

  .view-list .drop-list-region .drop-list {
    background: #fff;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.15);
    border-radius: var(--skin-css-var-Ra2, 5px);
    width: 240px;
    box-sizing: border-box;
    font-size: 14px;
    overflow: hidden;
    position: relative;
    left: 0;
  }

  .view-list .drop-list-region .drop-list-shadow {
    position: absolute;
    top: 0;
    left: 0;
    background-color: transparent !important;
    z-index: 2;
    height: 0;
    pointer-events: none;
  }

  .view-list .drop-list-region .drop-list-shadow ul li {
    padding: 0 16px;
    display: table-row-group;
    opacity: 0;
    transform-origin: center center;
    transition: transform 0.3s;
  }

  .view-list .drop-list-region ul {
    position: relative;
    z-index: 2;
  }

  .view-list .drop-list-region li {
    position: relative;
    height: 24px;
    line-height: 24px;
    color: RGB(var(--skin-css-var-M1, 14, 17, 20));
    text-indent: 35px;
    padding: 3px 0;
    cursor: pointer;
    background: #fff;
    overflow: hidden;
  }

  .view-list .drop-list-region li .viewListLineText {
    height: 24px;
    width: 218px;
    overflow: hidden;
    display: inline-block;
    text-indent: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .view-list .drop-list-region li:hover {
    background: RGBA(var(--skin-css-var-S5, 128, 183, 255), 0.2);
  }

  .view-list .drop-list-region li .deleteViewButton {
    position: absolute;
    height: 12px;
    width: 12px;
    right: 12px;
    top: 9px;
    text-indent: 0;
    color: RGB(var(--skin-css-var-M2, 51, 56, 61));
  }

  .view-list
    .drop-list-region
    li
    .deleteViewButton:hover.combindViewButtonActive:before,
  .view-list
    .drop-list-region
    li
    .deleteViewButton:hover.deleteViewButtonActive:before {
    color: RGB(var(--skin-css-var-S2, 0, 75, 224));
  }

  .view-list
    .drop-list-region
    li
    .deleteViewButton:active.combindViewButtonActive:before,
  .view-list
    .drop-list-region
    li
    .deleteViewButton:active.deleteViewButtonActive:before {
    color: RGB(var(--skin-css-var-S3, 20, 106, 255));
  }

  .view-list .drop-list-region li .combindViewButton {
    position: absolute;
    height: 12px;
    width: 12px;
    right: 40px;
    top: 9px;
    text-indent: 0;
    color: RGB(var(--skin-css-var-M2, 51, 56, 61));
  }

  .view-list
    .drop-list-region
    li
    .combindViewButton:hover.combindViewButtonActive:before,
  .view-list
    .drop-list-region
    li
    .combindViewButton:hover.deleteViewButtonActive:before {
    color: RGB(var(--skin-css-var-S2, 0, 75, 224));
  }

  .view-list
    .drop-list-region
    li
    .combindViewButton:active.combindViewButtonActive:before,
  .view-list
    .drop-list-region
    li
    .combindViewButton:active.deleteViewButtonActive:before {
    color: RGB(var(--skin-css-var-S3, 20, 106, 255));
  }

  .view-list .drop-list-region li .checkViewListItem {
    position: absolute;
    height: 14px;
    width: 14px;
    left: 15px;
    top: 10px;
    text-indent: 0;
  }

  .view-list
    .drop-list-region
    li
    .checkViewListItem.sys-icon-Checkbox-active:before {
    color: RGB(var(--skin-css-var-S3, 20, 106, 255));
  }

  .view-list .drop-list-region .basicViewListTip:hover {
    background: #fff;
  }

  .view-list .drop-list-region .viewListItemActive {
    color: RGB(var(--skin-css-var-S2, 0, 75, 224));
  }

  .view-list .drop-list-region .viewListItemBasic .viewListLineText {
    width: calc(100% - 48px);
  }

  .view-list .drop-list-region .clearfix:after {
    content: '.';
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }

  .view-list .drop-list-region .bgslide {
    height: 24px;
    width: 100%;
    position: absolute;
    top: 0;
    z-index: -1;
    background-color: #f5f8fa;
    transition: top 0.2s ease;
  }

  .view-list .drop-list-region .addView {
    color: RGB(var(--skin-css-var-S2, 0, 75, 224));
    text-indent: 15px;
  }

  .view-list .drop-list-region .addView .Combined-Shape {
    height: 12px;
    width: 20px;
    float: left;
    margin-top: 5px;
  }

  .view-list
    .drop-list-region
    .addView
    .Combined-Shape.sys-icon-IM-tianjia:before {
    color: RGB(var(--skin-css-var-S3, 20, 106, 255));
  }

  .view-list .drop-list-region .addView_disable {
    color: #c2cbd1;
    cursor: not-allowed;
  }

  .view-list .drop-list-region .addView_disable .Combined-Shape-disable {
    color: #c2cbd1;
  }

  .view-list .drop-list-region .basicViewListTip {
    text-indent: 15px;
    color: #828f99;
    font-size: 12px;
    cursor: default;
  }

  .view-list .drop-list-real {
    z-index: 3;
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.3);
  }

  .view-list .list-real-spread {
    -webkit-animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
    animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
    -webkit-animation-name: antslideupin;
    animation-name: antSlideUpIn;
    -webkit-animation-play-state: running;
    animation-play-state: running;
  }

  .view-list .view-list-scroll-wrap {
    max-height: 390px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .content-view {
    position: relative;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.05);
    background: #fff;
    overflow-y: hidden;
    margin: 0 26px;
    border-radius: 16px;
    padding: 0 16px;
  }
  .shaixuan {
    width: 100%;
    height: 50px;
  }
  .view-list .layerForTab .head-icon:before {
    color: #fff;
  }
  .sys-icon-cus-kaoqinjilu:before {
    content: '\E9C2';
    color: #4a4a4a;
  }
  .test {
    height: 500px;
  }
</style>
