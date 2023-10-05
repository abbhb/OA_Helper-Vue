<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import NumberBlock from '@/views/entertainment/game-2048/components/NumberBlock.vue';

  let uid = 0;

  const grid = [[], [], [], []];
  const numberList = ref([]).value;

  // 计分
  const score = ref(0);
  const addScore = (num) => {
    score.value += num;
  }

  // 初始化游戏
  function initGame() {
    uid = 0;
    score.value = 0;
    grid.forEach((v, i) => {
      grid[i] = [];
    });
    numberList.length = 0;
    // eslint-disable-next-line no-use-before-define
    random();
    // eslint-disable-next-line no-use-before-define
    random();
  }

  // 随机选中一个空位置
  // eslint-disable-next-line consistent-return
  const random = () => {
    let num = Math.floor(Math.random() * 16);
    while (num > -1) {
      for (let i = 0; i < 4; i+=1) {
        for (let j = 0; j < 4; j+=1) {
          if (!grid[i][j]) {
            if (num === 0) {
              // eslint-disable-next-line no-use-before-define
              return createNumber(i, j);
            }
            num-=1;
          }
        }
      }
    }
  }
  // 创建number
  function createNumber(x, y) {
    const number = ref({
      x,
      y,
      number: 1,
      // eslint-disable-next-line no-plusplus
      uid: ++uid,
    }).value;
    grid[x][y] = number;
    numberList.push(number);
  }
  // 移除number
  function removeNumber(i) {
    numberList.splice(i, 1);
  }

  /*
   * 对与用户操作，如果用户操作“上”，那么需要从上往下遍历，操作“左”就从左往右遍历
   */
  function up() {
    for (let i = 1; i < 4; i+=1) {
      for (let j = 0; j < 4; j+=1) {
        // eslint-disable-next-line no-use-before-define
        move(i, j, 'up');
      }
    }
  }
  function down() {
    for (let i = 2; i >= 0; i-=1) {
      for (let j = 0; j < 4; j+=1) {
        // eslint-disable-next-line no-use-before-define
        move(i, j, 'down');
      }
    }
  }
  function left() {
    for (let i = 0; i < 4; i+=1) {
      for (let j = 1; j < 4; j+=1) {
        // eslint-disable-next-line no-use-before-define
        move(i, j, 'left');
      }
    }
  }
  function right() {
    for (let i = 0; i < 4; i+=1) {
      for (let j = 2; j >= 0; j-=1) {
        // eslint-disable-next-line no-use-before-define
        move(i, j, 'right');
      }
    }
  }

  function move(x, y, dir) {
    const self = grid[x][y];
    if (!self) return;

    grid[x][y] = undefined;
    if (dir === 'up') {
      // eslint-disable-next-line no-plusplus
      while (x-- > 0) {
        // eslint-disable-next-line no-use-before-define
        if (moveTo(self, x, y) === false) {
          break;
        }
      }
    } else if (dir === 'down') {
      // eslint-disable-next-line no-plusplus
      while (x++ < 3) {
        // eslint-disable-next-line no-restricted-globals,no-use-before-define
        if (moveTo(self, x, y) === false) {
          break;
        }
      }
    } else if (dir === 'left') {
      // eslint-disable-next-line no-plusplus
      while (y-- > 0) {
        // eslint-disable-next-line no-use-before-define
        if (moveTo(self, x, y) === false) {
          break;
        }
      }
    } else if (dir === 'right') {
      // eslint-disable-next-line no-plusplus
      while (y++ < 3) {
        // eslint-disable-next-line no-use-before-define
        if (moveTo(self, x, y) === false) {
          break;
        }
      }
    }
    // eslint-disable-next-line no-underscore-dangle
    if (!self._delete) {
      grid[self.x][self.y] = self;
    }
  }

  // eslint-disable-next-line no-underscore-dangle
  let _moved = false; // 是否移动过

  const moveTo = (self, x, y) => { // 判断下一格是否能移动，以及是否合并
    if (grid[x][y]) {
      if (grid[x][y].number === self.number) {
        self.x = x;
        self.y = y;
        // eslint-disable-next-line no-underscore-dangle
        self._delete = true;
        grid[x][y].number *= 2;
        addScore(grid[x][y].number)
        _moved = true;
      }
      return false;
    }
      self.x = x;
      self.y = y;
      _moved = true;
      return true;

  }


  const isEnded = () => {
    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        if (!grid[i][j]) {
          return;
        }
      }
    }
    alert(`您的得分是：${score.value}分`);
  };
  function update() {
    if (_moved) {
      _moved = false;
      random();
    } else {
      isEnded();
    }
  }


  function listener(e) {
    switch (e.keyCode) {
      case 38:
      case 87:
        up();
        break;
      case 40:
      case 83:
        down();
        break;
      case 37:
      case 65:
        left();
        break;
      case 39:
      case 68:
        right();
        break;
      default:
        return true;
    }
    e.preventDefault();
    update();
    return false;
  }

  onMounted(() => {
    initGame();
    window.addEventListener('keydown', listener);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', listener);
  });
</script>

<template>
  <div class="game-root">
    <div class="game-paihangbang">
      <div class="title">
        排行榜</div>
      <div class="bo">
        <div class="item">
          <div class="avatar">头像</div>
          <div class="name">用户昵称</div>
          <div class="time">耗时</div>
          <div class="scope">得分</div>
          直接复用打印排行榜得了
        </div>
      </div>
    </div>
    <div class="game-zhuti">
      <div class="title"> 总分： {{ score }} </div>
      <div class="game">
        <!-- 背景布局 -->
        <div class="game-bg">
          <div v-for="i in 16" :key="i" class="item"></div>
        </div>

        <div class="canvas">
          <NumberBlock
            v-for="(v, i) in numberList"
            :key="v.uid"
            :item="v"
            @remove="removeNumber(i)"
          />
        </div>
      </div>
    </div>
    <div class="controls">
      <div class="intro">

      </div>
      <div class="control">

      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
  .game-root {
    width: 100%; /* 占据宽度 */
    height: 93vh; /* 占据视口高度 */
    background-color: #faf8ef;
    background-size: cover; /* 等比例缩放背景图片，以填充整个容器 */
    background-position: center center; /* 居中对齐背景图片 */
    background-repeat: no-repeat; /* 不重复背景图片 */
    display: flex;
    flex-direction: row;

  }
  .controls {
    margin-left: 89px;
    width: 500px;
    height: 93%;
    .intro {
      width: 100%;
      height: 60%;
      background-color: red;
    }
    .control{
      width: 100%;
      height: 38%;
      background-color: #004d8c;
    }
  }
  .game-paihangbang {
    width: 650px;
    height: 93%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 30px 30px 30px;
    margin-top: 30px;
    margin-left: 30px;
    border: 2px #d7b587 solid;
    border-radius: 1rem;
    .title{
      text-align: center;
      height: 10%;
    }
    .bo {
      width: 100%;
      background-color: red;
      height: 80%;
      .item{
        display: flex;flex-direction: row;
        height: 30px;
      }
    }
  }
  .game-zhuti {
    margin-left: 50px;
    padding-top: 120px;
    width: 450px;
  }
  .title {
    text-align: center;
    color: #776e65;
    font-size: 50px;
    font-weight: bold;
  }

  .game {
    position: relative;
  }

  .game-bg {
    display: grid;
    grid-template-columns: repeat(4, 100px);
    grid-template-rows: repeat(4, 100px);
    grid-gap: 10px;
    border: 10px solid #bcaca0;
    background: #bcaca0;
    border-radius: 10px;
  }
  .item {
    width: 100px;
    height: 100px;
    background: #ccc1b4;
    border-radius: 5px;
  }

  .canvas {
    position: absolute;
    top: 10px;
    left: 10px;
  }
</style>
