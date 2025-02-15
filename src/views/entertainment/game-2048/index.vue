<script setup lang="ts">
  import { ref, onMounted, onUnmounted, nextTick } from 'vue';
  import NumberBlock from '@/views/entertainment/game-2048/components/NumberBlock.vue';
  import { GameSave, gameService } from '@/api/gameService';
  import { useUserInfo } from '@/hooks/chat/useCached';
  import SaveListDialog from './components/SaveListDialog.vue';

  let uid = 0;
  const isUsingTool = ref(false);
  const isSelectingBlock = ref(false);
  const selectedBlock = ref(null);
  const isHammerSelected = ref(false); // 新增状态
  const gameType = '2048';
  const grid = [[], [], [], []];
  const numberList = ref([]).value;

  function selectBlock(block: any) {
    if (isHammerSelected.value) {
      removeBlock(block);
      isSelectingBlock.value = false;
      isUsingTool.value = false;
    }
  }

  function removeBlock(block: any) {
    console.log('道具，锤');
    console.log(block);
    const index = numberList.findIndex((n) => n.uid === block.uid);
    if (index > -1) {
      grid[block.x][block.y] = undefined;
      numberList.splice(index, 1);
      hammerUsed.value += 1;
      // 添加锤碎特效
      if (block.element) {
        block.element.classList.add('crushed');
        setTimeout(() => {
          block.element.classList.remove('crushed');
        }, 500);
      }
    }
  }

  // 计分
  const score = ref(0);
  const gameId = ref<string>('');
  const moveCount = ref(0);
  const hammerUsed = ref(0);
  const refreshUsed = ref(0);
  const startTime = ref(Date.now());
  const totalTime = ref(0);

  const addScore = (num) => {
    score.value += num;
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}`;
  };

  // 初始化游戏
  function initGame() {
    uid = 0;
    score.value = 0;
    moveCount.value = 0;
    hammerUsed.value = 0;
    refreshUsed.value = 0;
    startTime.value = Date.now();
    totalTime.value = 0;
    grid.forEach((v, i) => {
      grid[i] = [];
    });
    if (numberList.length > 0) {
      for (let i = 0; i < numberList.length; i += 1) {
        numberList[i]._delete = true;
      }
    }
    // eslint-disable-next-line no-use-before-define
    random();
    // eslint-disable-next-line no-use-before-define
    random();

    // 启动时间更新定时器
    setInterval(() => {
      totalTime.value += 1000;
    }, 1000);
  }

  // 随机选中一个空位置
  // eslint-disable-next-line consistent-return
  const random = () => {
    let num = Math.floor(Math.random() * 16);
    while (num > -1) {
      for (let i = 0; i < 4; i += 1) {
        for (let j = 0; j < 4; j += 1) {
          if (!grid[i][j]) {
            if (num === 0) {
              // eslint-disable-next-line no-use-before-define
              return createNumber(i, j);
            }
            num -= 1;
          }
        }
      }
    }
  };
  // 创建number
  function createNumber(x, y) {
    const number = ref({
      x,
      y,
      number: 2,
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
    for (let i = 1; i < 4; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        // eslint-disable-next-line no-use-before-define
        move(i, j, 'up');
      }
    }
  }
  function down() {
    for (let i = 2; i >= 0; i -= 1) {
      for (let j = 0; j < 4; j += 1) {
        // eslint-disable-next-line no-use-before-define
        move(i, j, 'down');
      }
    }
  }
  function left() {
    for (let i = 0; i < 4; i += 1) {
      for (let j = 1; j < 4; j += 1) {
        // eslint-disable-next-line no-use-before-define
        move(i, j, 'left');
      }
    }
  }
  function right() {
    for (let i = 0; i < 4; i += 1) {
      for (let j = 2; j >= 0; j -= 1) {
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

  const moveTo = (self, x, y) => {
    // 判断下一格是否能移动，以及是否合并
    if (grid[x][y]) {
      if (grid[x][y].number === self.number) {
        self.x = x;
        self.y = y;
        // eslint-disable-next-line no-underscore-dangle
        self._delete = true;
        grid[x][y].number *= 2;
        addScore(grid[x][y].number);
        _moved = true;
      }
      return false;
    }
    self.x = x;
    self.y = y;
    _moved = true;
    return true;
  };

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
    if (_moved && !isUsingTool.value) {
      _moved = false;
      random();
    } else if (_moved && isUsingTool.value) {
      _moved = false;
    } else {
      isEnded();
    }
    isUsingTool.value = false;
  }

  // 锤子道具：移除指定位置的块
  function useHammer() {
    isHammerSelected.value = !isHammerSelected.value; // 切换选中模式
  }

  function handleRefresh() {
    isUsingTool.value = false;
    isHammerSelected.value = false;
    useRefresh();
  }

  // 刷新道具：合并所有可相加的块
  function useRefresh() {
    let merged = false;
    const mergedBlocks = new Set();

    // 合并所有相同数字的块（不考虑位置）
    for (let i = numberList.length - 1; i >= 0; i--) {
      const block = numberList[i];
      if (mergedBlocks.has(block.uid)) continue;

      const sameBlocks = numberList.filter(
        (n) =>
          n.number === block.number &&
          !mergedBlocks.has(n.uid) &&
          n.uid !== block.uid
      );

      if (sameBlocks.length > 0) {
        const target = sameBlocks[0];
        target.number *= 2;
        addScore(target.number);
        mergedBlocks.add(target.uid);
        mergedBlocks.add(block.uid);

        const index = numberList.findIndex((n) => n.uid === block.uid);
        if (index > -1) {
          grid[block.x][block.y] = undefined;
          numberList.splice(index, 1);
          merged = true;
        }
      }
    }

    if (merged) {
      refreshUsed.value += 1;
    }
    // 不再生成新的块
    isUsingTool.value = false;
    return merged;
  }

  function listener(e) {
    moveCount.value += 1;
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
    fetchLeaderboard();
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', listener);
  });

  // Add new refs
  const saveListVisible = ref(false);

  // Add new refs for leaderboard
  const leaderboardData = ref<GameSave[]>([]);
  const hoverSave = ref<GameSave>(null);

  // Add new functions
  const getGameState = () => ({
    score: score.value,
    grid,
    guid:uid,
    numberList,
    moveCount: moveCount.value,
    hammerUsed: hammerUsed.value,
    refreshUsed: refreshUsed.value,
    startTime: startTime.value,
    totalTime: totalTime.value
  });

  const saveGame = async () => {
    try {
      const { data } = await gameService.saveGame({
        id: gameId.value !== '' ? gameId.value : undefined,
        gameType: gameType,
        gameData: getGameState(),
        score: score.value,
      });
      await fetchLeaderboard()
      loadGameSave(data);

      console.log('游戏已保存');
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败');
    }
  };

  const showSaves = () => {
    saveListVisible.value = true;
  };

  const loadGameSave = (save: GameSave) => {
    console.log('重载');
    console.log(save);
    const state = save.gameData;
    score.value = state.score;
    moveCount.value = state.moveCount;
    hammerUsed.value = state.hammerUsed;
    refreshUsed.value = state.refreshUsed;
    startTime.value = state.startTime;
    gameId.value = save.id;
    uid = state.guid;
    totalTime.value = state.totalTime
    grid.forEach((v, i) => {
      grid[i] = [];
    });
    if (numberList.length > 0) {
      for (let i = 0; i < numberList.length; i += 1) {
        numberList[i]._delete = true;
      }
    }

    state.numberList.forEach((number: any) => {
      const number2 = ref({
        x: number.x,
        y: number.y,
        number: number.number,
        // eslint-disable-next-line no-plusplus
        uid: number.uid,
      }).value;
      numberList.push(number2);
      grid[number.x][number.y] = number2;
    });
  };

  // Add new functions for leaderboard
  const fetchLeaderboard = async () => {
    try {
      const {data} = await gameService.getLeaderboard(gameType);
      leaderboardData.value = data;
    } catch (error) {
      console.error('获取排行榜失败:', error);
    }
  };
  const setHover = (item) => {
    hoverSave.value = item;
  };
</script>

<template>
  <div class="game-root">
    <div class="game-paihangbang">
      <div class="title">排行榜</div>
      <div class="bo">
        <div class="header">
          <div class="avatar">头像</div>
          <div class="name">用户昵称</div>
          <div class="time">最佳用时</div>
          <div class="score">最高得分</div>
        </div>
        <div class="leaderboard-list">
          <a-popover position="right">
            <div
              v-for="(item, index) in leaderboardData"
              :key="index"
              class="leaderboard-item"
              @mouseenter="setHover(item)"
              @mouseleave="hoverSave = null"
            >
              <div class="avatar">
                <img :src="useUserInfo(item.userId).value?.avatar" alt="avatar" />
              </div>
              <div class="name">{{
                  useUserInfo(item.userId).value?.name
                }}</div>
              <div class="time">{{ formatTime(item.gameData.totalTime) }}</div>
              <div class="score">{{ item.score }}</div>
            </div><template #content>
            <div
              v-if="hoverSave!==null"
            >
              <h3>游戏详情</h3>
              <p>操作次数: {{ hoverSave.gameData.moveCount }}</p>
              <p>使用锤子: {{ hoverSave.gameData.hammerUsed }}次</p>
              <p>使用刷新: {{ hoverSave.gameData.refreshUsed }}次</p>
              <p>游戏时间: {{ formatTime(hoverSave.gameData.totalTime) }}</p>
            </div>

          </template>
          </a-popover>

        </div>
      </div>
    </div>

    <!-- Hover details popup -->

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
            ref="blockRef"
            :item="v"
            :element="v.element ? v.element : undefined"
            @remove="removeNumber(i)"
            @bclick="
              (block) => {
                if (isHammerSelected) {
                  selectBlock(block);
                  isHammerSelected = false;
                }
              }
            "
          />
        </div>
      </div>
    </div>
    <div class="controls">
      <div class="intro">
        <div class="stats-panel">
          <div class="stat-item">
            <span class="label">操作次数:</span>
            <span class="value">{{ moveCount }}</span>
          </div>
          <div class="stat-item">
            <span class="label">游戏时间:</span>
            <span class="value">{{ formatTime(totalTime) }}</span>
          </div>
          <div class="stat-item">
            <span class="label">使用锤子:</span>
            <span class="value">{{ hammerUsed }} 次</span>
          </div>
          <div class="stat-item">
            <span class="label">使用刷新:</span>
            <span class="value">{{ refreshUsed }} 次</span>
          </div>
        </div>

        <div class="tools-panel">
          <button
            class="tool-btn hammer"
            :class="{ active: isHammerSelected }"
            @click="useHammer"
          >
            <i class="icon">🔨</i>
            <span>锤子</span>
            <small>{{
              isHammerSelected ? '点击块以锤掉' : '点击后进入选中模式'
            }}</small>
          </button>
          <button class="tool-btn refresh" @click="handleRefresh">
            <i class="icon">🔄</i>
            <span>刷新合并</span>
            <small>自动合并所有相同块</small>
          </button>
        </div>

        <div class="game-actions">
          <button class="action-btn" @click="saveGame">
            <i class="icon">💾</i>
            <span>保存游戏</span>
          </button>
          <button class="action-btn" @click="showSaves">
            <i class="icon">📁</i>
            <span>加载存档</span>
          </button>
          <button class="action-btn" @click="initGame">
            <i class="icon">🔄</i>
            <span>重新开始</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <SaveListDialog
    :visible="saveListVisible"
    :game-type="gameType"
    @close="saveListVisible = false"
    @load="loadGameSave"
  />
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
      background: #faf8ef;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

      .stats-panel {
        background: #bbada0;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;

        .stat-item {
          display: flex;
          justify-content: space-between;
          margin: 8px 0;
          color: #776e65;
          font-size: 16px;

          .label {
            font-weight: bold;
          }
          .value {
            color: #fff;
          }
        }
      }

      .tools-panel {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;

        .tool-btn {
          background: #8f7a66;
          border: none;
          border-radius: 5px;
          padding: 12px;
          color: white;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.2s;

          &.active {
            box-shadow: 0 0 15px #ffd700;
            border: 2px solid #ffd700;
          }

          &:hover {
            background: #7d6a58;
          }

          .icon {
            font-size: 24px;
            margin-bottom: 5px;
          }

          span {
            font-size: 14px;
          }
        }
      }

      .game-actions {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin-top: 150px;
      }

      .action-btn {
        background: #8f7a66;
        border: none;
        border-radius: 5px;
        padding: 12px;
        color: white;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: all 0.2s;

        &:hover {
          background: #7d6a58;
        }

        .icon {
          font-size: 24px;
          margin-bottom: 5px;
        }

        span {
          font-size: 14px;
        }
      }
    }
    .control {
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
    .title {
      text-align: center;
      height: 10%;
    }
    .bo {
      width: 100%;
      height: 80%;
      background-color: #faf8ef;
      border-radius: 8px;
      padding: 15px;

      .header {
        display: grid;
        grid-template-columns: 60px 1fr 100px 100px;
        padding: 10px;
        background: #bbada0;
        color: #f9f6f2;
        font-weight: bold;
        border-radius: 5px;
        margin-bottom: 10px;
      }

      .leaderboard-list {
        overflow-y: auto;
        height: calc(100% - 50px);

        .leaderboard-item {
          display: grid;
          grid-template-columns: 60px 1fr 100px 100px;
          padding: 10px;
          border-bottom: 1px solid #ccc1b4;
          transition: background-color 0.2s;

          &:hover {
            background-color: #eee4da;
            cursor: pointer;
          }

          .avatar img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
        }
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

  /* 锤击动画 */
  .crushed {
    animation: crush 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  @keyframes crush {
    0% {
      transform: rotate(0) scale(1);
      opacity: 1;
    }
    30% {
      transform: rotate(-15deg) scale(1.2);
      opacity: 0.8;
    }
    100% {
      transform: rotate(45deg) scale(0);
      opacity: 0;
    }
  }

  .hover-details {
    position: fixed;
    background: #faf8ef;
    border: 2px solid #bbada0;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 4096;
    min-width: 200px;

    h3 {
      margin: 0 0 10px 0;
      color: #776e65;
    }

    p {
      margin: 5px 0;
      color: #776e65;
    }
  }
</style>
