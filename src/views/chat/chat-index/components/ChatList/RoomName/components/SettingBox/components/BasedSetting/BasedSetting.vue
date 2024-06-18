<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { useGroupStore } from '@/store/modules/chat/group';
  import { useUserStore } from '@/store';
  import _ from 'lodash';
  import { useChatStore } from '@/store/modules/chat/chat';
  import {putRoomAvatar, putRoomName} from '@/api/chat';
  import { Message } from '@arco-design/web-vue';
  import ImageUpload from '@/components/image/ImageUpload.vue';

  const groupStore = useGroupStore();
  const userStore = useUserStore();
  const chatStore = useChatStore();

  const currentRoom = computed(() => {
    return chatStore.currentSessionInfo;
  });
  const groupName = ref(''); // 群聊名称
  const groupAvatar = ref(''); // 群聊头像
  groupName.value = _.cloneDeep(currentRoom.value.name);
  groupAvatar.value = _.cloneDeep(currentRoom.value.avatar);
  const lastGroupName = ref(''); // 群聊名称
  const lastGroupAvatar = ref(''); // 群聊头像
  lastGroupName.value = _.cloneDeep(groupName.value);
  lastGroupAvatar.value = _.cloneDeep(groupAvatar.value);
  const myNickname = ref('暂不支持'); // 用户的本群昵称
  const groupRemark = ref('暂不支持'); // 群聊备注

  // 更换房间更新设置里的值
  watch(currentRoom, (newValue) => {
    groupName.value = _.cloneDeep(currentRoom.value.name);
    lastGroupName.value = _.cloneDeep(currentRoom.value.name);
    groupAvatar.value = _.cloneDeep(currentRoom.value.avatar);
    lastGroupAvatar.value = _.cloneDeep(currentRoom.value.avatar);
  });

  const updateGroupName = async () => {
    // 更新房间的名称
    await putRoomName({
      roomId: currentRoom.value.roomId,
      name: groupName.value,
    });
    lastGroupName.value = _.cloneDeep(groupName.value);
    Message.success('修改成功');
    // 刷新数据
    await chatStore.getSessionList(true);
  };

  const handleSuccess = (data) => {
    // r为data
    groupAvatar.value = data;
  };
  const updateGroupAvatar = async () => {
    await putRoomAvatar({
      roomId: currentRoom.value.roomId,
      avatar: groupAvatar.value,
    });
    lastGroupAvatar.value = _.cloneDeep(groupAvatar.value);
    // 刷新数据
    await chatStore.getSessionList(true);
    Message.success('修改头像成功');

  }
</script>

<template>
  <div class="set-base">
    <div class="chat-group">
      <el-form class="chat-group__form">
        <el-form-item label="群聊名称">
          <div style="display: flex">
            <el-input v-model="groupName" placeholder="请输入昵称"></el-input>
            <el-button
              v-if="groupName !== lastGroupName"
              :type="'primary'"
              @click="updateGroupName"
              >应用名称</el-button
            >
          </div>
        </el-form-item>

        <el-form-item label="群聊头像">
          <div style="display: flex">
            <ImageUpload
              :draggable="true"
              :image="groupAvatar"
              :key="groupAvatar"
              url="./api/common/uploadimage"
              @on-success="handleSuccess"
            />
            <el-button
              v-if="groupAvatar !== lastGroupAvatar"
              :type="'primary'"
              @click="updateGroupAvatar"
            >应用头像</el-button
            >
          </div>

        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./styles.scss">
  .chat-group {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
  }

  .chat-group__title {
    margin-bottom: 20px;
  }

  .chat-group__form {
    margin-top: 20px;
  }
</style>
