<template>
  <div v-show="visible" class="save-dialog">
    <div class="dialog-content">
      <h2>存档列表</h2>
      <div class="save-list">
        <div v-for="save in saves" :key="save.id" class="save-item">
          <div class="save-info">
            <span>得分: {{ save.score }}</span>
            <span>{{ new Date(save.createTime).toLocaleString() }}</span>
          </div>
          <div class="save-actions">
            <button @click="loadSave(save)">加载</button>
            <button class="delete" @click="deleteSave(save.id)">删除</button>
          </div>
        </div>
      </div>
      <div class="dialog-buttons">
        <button @click="close">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, toRefs, watch, nextTick } from 'vue';
  import { gameService, type GameSave } from '@/api/gameService';

  const props = defineProps<{
    visible: boolean;
    gameType: string;
  }>();

  const emit = defineEmits(['close', 'load']);
  const { visible } = toRefs(props);

  const saves = ref<GameSave[]>([]);

  const loadSaves = async () => {
    try {
      const { data } = await gameService.getSaves(props.gameType);
      saves.value = data;
    } catch (error) {
      console.error('Failed to load saves:', error);
    }
  };

  const loadSave = (save: GameSave) => {
    emit('load', save);
    close();
  };

  const deleteSave = async (id: number) => {
    try {
      await gameService.deleteSave(id);
      await loadSaves();
    } catch (error) {
      console.error('Failed to delete save:', error);
    }
  };

  const close = () => {
    emit('close');
  };

  watch(
    () => visible.value,
    () => {
      if (visible.value) {
        loadSaves();
      }
    }
  );
</script>

<style scoped>
  .save-dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 4096;
  }

  .dialog-content {
    background: #faf8ef;
    padding: 20px;
    border-radius: 10px;
    min-width: 300px;
  }

  .save-list {
    max-height: 400px;
    overflow-y: auto;
  }

  .save-item {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }

  .save-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .save-actions {
    display: flex;
    gap: 10px;
  }

  button {
    background: #8f7a66;
    border: none;
    padding: 5px 10px;
    color: white;
    border-radius: 3px;
    cursor: pointer;
  }

  button.delete {
    background: #e74c3c;
  }

  .dialog-buttons {
    margin-top: 20px;
    text-align: right;
  }
</style>
