<script setup lang="ts">
import {onMounted, ref} from 'vue';
  import { checkCaptchaCode, getCodeImg } from '@/api/captcha';
  import { Message } from '@arco-design/web-vue';

  const emit = defineEmits(['success']);

  const props = defineProps({
    // 阻塞块长度
    blockLength: {
      type: Number,
      default: 42,
      require: true,
    },
    // 阻塞块弧度
    block_radius: {
      type: Number,
      default: 10,
    },
    // 画布宽度
    canvas_width: {
      type: Number,
      default: 320,
    },
    // 画布高度
    canvas_height: {
      type: Number,
      default: 155,
    },
    // 滑块操作提示
    sliderHint: {
      type: String,
      default: '向右滑动',
    },
    // 可允许的误差范围小；为1时，则表示滑块要与凹槽完全重叠，才能验证成功。默认值为5，若为 -1 则不进行机器判断
    accuracy: {
      type: Number,
      default: 3,
    },
    // 图片资源数组
    imageList: {
      type: Array,
      default: () => [],
    },
  });

  const vailData = ref({
    // 校验进行状态
    verifyActive: false,
    // 校验成功状态
    verifySuccess: false,
    // 校验失败状态
    verifyFail: false,
    // 阻塞块对象
    blockObj: null,
    // 图片画布对象
    canvasCtx: null,
    // 阻塞块画布对象
    blockCtx: null,
    // 阻塞块宽度
    // eslint-disable-next-line no-use-before-define
    block_width: props.blockLength * 2,
    // 阻塞块的横轴坐标
    block_x: undefined,
    // 阻塞块的纵轴坐标
    block_y: undefined,
    // 图片对象
    image: undefined,
    // 移动的X轴坐标
    originX: undefined,
    // 移动的Y轴做坐标
    originY: undefined,
    // 拖动距离数组
    dragDistanceList: [],
    // 滑块箱拖动宽度
    sliderBoxWidth: '0',
    // 滑块按钮距离左侧起点位置
    sliderButtonLeft: '0',
    // 鼠标按下状态
    isMouseDown: false,
    // 图片加载提示，防止图片没加载完就开始验证
    isLoading: true,
    // 时间戳，计算滑动时长
    timestamp: null,
    // 成功提示
    successHint: '',
    // 随机字符串
    nonce_str: undefined,
  });

  const sum = (x, y) => {
    return x + y;
  };
  const noce = ref(null);
  const canvansss = ref(null);
  const initParams = () => {
    // 校验进行状态
    vailData.value.verifyActive = false;
    // 校验成功状态
    vailData.value.verifySuccess = false;
    // 校验失败状态
    vailData.value.verifyFail = false;
    // 阻塞块对象
    vailData.value.blockObj = null;
    // 图片画布对象
    vailData.value.canvasCtx = null;
    // 阻塞块画布对象
    vailData.value.blockCtx = null;
    // 阻塞块宽度
    vailData.value.block_width = props.blockLength * 2;
    // 阻塞块的横轴坐标
    vailData.value.block_x = undefined;
    // 阻塞块的纵轴坐标
    vailData.value.block_y = undefined;
    // 图片对象
    vailData.value.image = undefined;
    // 移动的X轴坐标
    vailData.value.originX = undefined;
    // 移动的Y轴做坐标
    vailData.value.originY = undefined;
    // 拖动距离数组
    vailData.value.dragDistanceList = [];
    // 滑块箱拖动宽度
    vailData.value.sliderBoxWidth = '0';
    // 滑块按钮距离左侧起点位置
    vailData.value.sliderButtonLeft = '0';
    // 鼠标按下状态
    vailData.value.isMouseDown = false;
    // 图片加载提示，防止图片没加载完就开始验证
    vailData.value.isLoading = true;
    // 时间戳，计算滑动时长
    vailData.value.timestamp = null;
    // 成功提示
    vailData.value.successHint = '';
    // 随机字符串
    vailData.value.nonce_str = undefined;
  };

  const getCaptcha = () => {
    // 取后端默认值
    const data = {};
    getCodeImg(data)
      .then((response) => {
        const { data } = response;
        vailData.value.nonce_str = data.nonce_str;
        noce.value.src = data.block_src;
        noce.value.style.top = `${data.block_y}px`;
        console.log(canvansss.value)
        canvansss.value.src = data.canvas_src;
      })
      .finally(() => {
        vailData.value.isLoading = false;
      });
  };
  const initDom = () => {
    vailData.value.blockObj = noce.value;
    getCaptcha();
  };

  const checkImgSrc = () => {
    return !!canvansss.value.src;
  };
  const refresh = () => {
    // 延迟class的删除，等待动画结束
    setTimeout(() => {
      vailData.value.verifyFail = false;
    }, 500);
    vailData.value.isLoading = true;
    vailData.value.verifyActive = false;
    vailData.value.verifySuccess = false;
    vailData.value.blockObj.style.left = 0;
    vailData.value.sliderBoxWidth = '0';
    vailData.value.sliderButtonLeft = '0';
    getCaptcha();
  };

  const verifyFailEvent = () => {
    vailData.value.verifyFail = true;
    Message.error('感觉不是人类，再试试!');
    refresh();
  };

  const startEvent = (originX, originY) => {
    if (
      !checkImgSrc() ||
      vailData.value.isLoading ||
      vailData.value.verifySuccess
    ) {
      return;
    }
    vailData.value.originX = originX;
    vailData.value.originY = originY;
    vailData.value.isMouseDown = true;
    vailData.value.timestamp = +new Date();
  };
  const turingTest = () => {
    const arr = vailData.value.dragDistanceList; // 拖动距离数组
    const average = arr.reduce(sum) / arr.length; // 平均值
    const deviations = arr.map((x) => x - average); // 偏离值
    // eslint-disable-next-line no-use-before-define
    const stdDev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length); // 标准偏差
    return average !== stdDev; // 判断是否人为操作
  };

  const verifySuccessEvent = () => {
    vailData.value.isLoading = false;
    vailData.value.verifySuccess = true;
    const elapsedTime = (vailData.value.timestamp / 1000).toFixed(1);
    if (Number(elapsedTime) < 1) {
      vailData.value.successHint = `[成功]仅仅${elapsedTime}S，你的速度快如闪电`;
    } else if (Number(elapsedTime) < 2) {
      vailData.value.successHint = `[成功]只用了${elapsedTime}S，这速度简直完美`;
    } else {
      vailData.value.successHint = `[成功]耗时${elapsedTime}S，争取下次再快一点`;
    }
  };
  // eslint-disable-next-line consistent-return
  const moveEvent = (originX, originY) => {
    if (!vailData.value.isMouseDown) {
      return false;
    }
    const moveX = originX - vailData.value.originX;
    const moveY = originY - vailData.value.originY;
    if (moveX < 0 || moveX + 40 >= props.canvas_width) {
      return false;
    }
    vailData.value.sliderButtonLeft = `${moveX}px`;
    const blockLeft =
      ((props.canvas_width - 40 - 20) / (props.canvas_width - 40)) * moveX;
    vailData.value.blockObj.style.left = `${blockLeft}px`;
    vailData.value.verifyActive = true;
    vailData.value.sliderBoxWidth = `${moveX}px`;
    vailData.value.dragDistanceList.push(moveY);
  };

  // eslint-disable-next-line consistent-return
  const endEvent = async (originX) => {
    if (!vailData.value.isMouseDown) {
      return false;
    }
    vailData.value.isMouseDown = false;
    if (originX === vailData.value.originX) {
      return false;
    }
    // 开始校验
    vailData.value.isLoading = true;
    // 校验结束
    vailData.value.verifyActive = false;
    // 滑动时长
    vailData.value.timestamp = +new Date() - vailData.value.timestamp;
    // 移动距离
    const moveLength = parseInt(vailData.value.blockObj.style.left, 10);
    // 限制操作时长5S，超出判断失败
    if (vailData.value.timestamp > 5000) {
      verifyFailEvent();
    }
    // 人为操作判定
    else if (!turingTest()) {
      verifyFailEvent();
    } else {
      checkCaptchaCode({
        nonce_str: vailData.value.nonce_str,
        value: `${moveLength}`,
      }).then((res) => {
        verifySuccessEvent();
        emit('success', res.data);
      }).catch((e)=>{
        // 失败了
        // 重试
        refresh();
      });
    }
  };
  const bindEvents = () => {
    // 监听鼠标按下事件
    document
      .getElementById('slider-button')
      .addEventListener('mousedown', (event) => {
        startEvent(event.clientX, event.clientY);
      });
    // 监听鼠标移动事件
    document.addEventListener('mousemove', (event) => {
      moveEvent(event.clientX, event.clientY);
    });
    // 监听鼠标离开事件
    document.addEventListener('mouseup', (event) => {
      endEvent(event.clientX);
    });
    // 监听触摸开始事件
    document
      .getElementById('slider-button')
      .addEventListener('touchstart', (event) => {
        startEvent(
          event.changedTouches[0].pageX,
          event.changedTouches[0].pageY
        );
      });
    // 监听触摸滑动事件
    document.addEventListener('touchmove', (event) => {
      moveEvent(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
    });
    // 监听触摸离开事件
    document.addEventListener('touchend', (event) => {
      endEvent(event.changedTouches[0].pageX);
    });
  };
  const init = () => {
    initParams();
    initDom();
    bindEvents();
  };

  const square = (x) => {
    return x * x;
  };
  onMounted(()=>{
    init();
  })
</script>

<template>
  <div
    class="slide-verify"
    :style="{ width: canvas_width + 'px' }"
    onselectstart="return false;"
  >
    <!-- 图片加载遮蔽罩 -->
    <div
      v-if="vailData.isLoading"
      :class="{ 'img-loading': vailData.isLoading }"
      :style="{ height: canvas_height + 'px' }"
      style="display: flex;align-items: center;justify-content: center;"
    >
      <span style="color:#fcfcfc;font-size: 22px;" v-if="vailData.verifyActive">校验中</span>
      <span style="color:#fcfcfc;font-size: 22px;" v-else-if="!vailData.verifyActive">滑动验证码加载中</span>
      <span style="color:#fcfcfc;font-size: 22px;" v-else>加载中</span>
      <i class="el-icon-loading"></i>
    </div>
    <!-- 认证成功后的文字提示 -->
    <div
      v-if="vailData.verifySuccess"
      class="success-hint"
      :style="{ height: canvas_height + 'px' }"
      >{{ vailData.successHint }}</div
    >
    <!--刷新按钮-->
    <div class="refresh-icon" @click="refresh" >
      <icon-refresh class="refresh-icon" alt="换一张"/>
    </div>
    <!--后端生成-->
    <!--验证图片-->
    <img
      ref="canvansss"
      class="slide-canvas"
      :width="canvas_width"
      :height="canvas_height"
    />
    <!--阻塞块-->
    <img
      ref="noce"
      :class="['slide-block', { 'verify-fail': vailData.verifyFail }]"
    />
    <!-- 滑动条 -->
    <div
      class="slider"
      :class="{
        'verify-active': vailData.verifyActive,
        'verify-success': vailData.verifySuccess,
        'verify-fail': vailData.verifyFail,
      }"
    >
      <!--滑块-->
      <div class="slider-box" :style="{ width: vailData.sliderBoxWidth }">
        <!-- 按钮 -->
        <div
          id="slider-button"
          class="slider-button"
          :style="{ left: vailData.sliderButtonLeft }"
        >
          <!-- 按钮图标 -->
          <icon-right v-if="!vailData.verifySuccess" class="slider-button-icon" :size="28"/>
          <icon-sun-fill v-else class="slider-button-icon" :size="28"/>
        </div>
      </div>
      <!--滑动条提示文字-->
      <span class="slider-hint">{{ sliderHint }}</span>
    </div>
  </div>
</template>

<style scoped>
  .slide-verify {
    position: relative;
  }

  /*图片加载样式*/
  .img-loading {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 999;
    animation: loading 1.5s infinite;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100px;
    background-color: #737c8e;
    border-radius: 5px;
  }

  @keyframes loading {
    0% {
      opacity: 0.7;
    }
    100% {
      opacity: 9;
    }
  }

  /*认证成功后的文字提示*/
  .success-hint {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.8);
    color: #2cd000;
    font-size: large;
  }

  /*刷新按钮*/
  .refresh-icon {
    position: absolute;
    right: 0;
    top: 0;
    width: 25px;
    height: 25px;
    cursor: pointer;
    color: rgb(215, 181, 135);
    background-size: 35px 470px;
  }

  /*验证图片*/
  .slide-canvas {
    border-radius: 5px;
  }

  /*阻塞块*/
  .slide-block {
    position: absolute;
    left: 0;
    top: 0;
  }

  /*校验失败时的阻塞块样式*/
  .slide-block.verify-fail {
    transition: left 0.5s linear;
  }

  /*滑动条*/
  .slider {
    position: relative;
    text-align: center;
    width: 100%;
    height: 40px;
    line-height: 40px;
    margin-top: 15px;
    background: #f7f9fa;
    color: #45494c;
    border: 1px solid #e4e7eb;
    border-radius: 5px;
  }

  /*滑动盒子*/
  .slider-box {
    position: absolute;
    left: 0;
    top: 0;
    height: 40px;
    border: 0 solid #1991fa;
    background: #d1e9fe;
    border-radius: 5px;
  }

  /*滑动按钮*/
  .slider-button {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    background: #fff;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transition: background 0.2s linear;
    border-radius: 5px;
  }

  /*鼠标悬浮时的按钮样式*/
  .slider-button:hover {
    background: #1991fa;
  }

  /*鼠标悬浮时的按钮图标样式*/
  .slider-button:hover .slider-button-icon {
    background-position: 0 -13px;
  }

  /*滑动按钮图标*/
  .slider-button-icon {
    //display: flex;
    //justify-content: center;
    //align-items: center;
    //position: absolute;
    //top: 15px;
    //left: 13px;
    //width: 15px;
    //height: 13px;
    //background-size: 35px 470px;
  }

  /*校验时的按钮样式*/
  .verify-active .slider-button {

    //border: 1px solid #1991fa;
  }

  /*校验时的滑动箱样式*/
  .verify-active .slider-box {
    height: 38px;
    //border-width: 1px;
  }

  /*校验成功时的滑动箱样式*/
  .verify-success .slider-box {
    height: 38px;
    border: 1px solid #52ccba;
    background-color: #d2f4ef;
  }

  /*校验成功时的按钮样式*/
  .verify-success .slider-button {

    border: 1px solid #52ccba;
    background-color: #52ccba !important;
  }

  /*校验成功时的按钮图标样式*/
  .verify-success .slider-button-icon {
    background-position: 0 0 !important;
  }

  /*校验失败时的滑动箱样式*/
  .verify-fail .slider-box {
    height: 38px;
    border: 1px solid #f57a7a;
    background-color: #fce1e1;
    transition: width 0.5s linear;
  }

  /*校验失败时的按钮样式*/
  .verify-fail .slider-button {

    border: 1px solid #f57a7a;
    background-color: #f57a7a !important;
    transition: left 0.5s linear;
  }

  /*校验失败时的按钮图标样式*/
  .verify-fail .slider-button-icon {
    //top: 14px;
    background-position: 0 -82px !important;
  }

  /*校验状态下的提示文字隐藏*/
  .verify-active .slider-hint,
  .verify-success .slider-hint,
  .verify-fail .slider-hint {
    display: none;
  }
</style>
