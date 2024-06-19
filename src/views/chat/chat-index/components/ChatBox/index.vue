<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { RoomTypeEnum } from '@/types/enums/chat';
  import { useGlobalStore } from '@/store/modules/chat/global';
  import UserList from '../UserList/index.vue';
  import ChatList from '../ChatList/index.vue';
  import SendBar from './SendBar/index.vue';


  const globalStore = useGlobalStore();
  const currentSession = computed(() => globalStore.currentSession);
  const isSelect = computed(()=>{
    return currentSession.value.roomId&&currentSession.value.roomId!==''
  });
</script>

<template>
  <div class="chat-box">
    <div class="chat-wrapper">
      <template v-if="!isSelect">
        <!--        此处可能出问题-->
        <icon-reply :style="{ fontSize: '160px' }" />
      </template>
      <div v-else class="chat">
        <ChatList />
        <SendBar />
      </div>
    </div>
    <UserList v-show="currentSession.type === RoomTypeEnum.Group" />
  </div>
</template>

<style lang="less" scoped>
  .chat-box {
    display: flex;
    flex: 1;
    align-items: stretch;
    padding: 20px 20px 20px 0;
    overflow: hidden;
  }

  .chat-wrapper {
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
  }

  .chat {
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100%;
    padding-bottom: 16px;
    border: 1px var(--color-border) solid;
    background-color: var(--color-bg-3);
    border-radius: 8px;
  }

  .chat-edit {
    position: relative;
    padding: 0 16px;
    word-break: break-all;
    border: 1px var(--color-border) solid;
    border-radius: 13px;
    .m-input {
      padding: 0 4px;
      margin: 0 4px;
      color: #2299dd;
    }

    .msg-input {
      display: flex;
      align-items: center;
      width: 100%;
      min-height: 40px;
      padding: 2px 6px;
      font-size: 14px;
      color: var(--color-text-2);
      background-color: var(--color-bg-3);
      border-radius: 12px;

      .action {
        display: flex;
        align-items: center;
        padding: 4px;
        line-height: 1;
        cursor: pointer;
        background-color: var(--color-bg-3);
        border-radius: 4px;
      }

      .action:hover {
        background-color: var(--color-secondary);
      }

      .send {
        transition: all 0.3s ease;
      }

      .is-edit {
        background-color: var(--color-bg-2);
      }

      .is-edit .send {
        transform: rotate(45deg);
      }

      .disabled {
        color: var(--color-text-1);
        pointer-events: none;
      }

      .divider {
        position: relative;
        display: inline-block;
        width: 1px;
        height: 1.2em;
        margin: 0 4px;
        vertical-align: middle;
        border-left: 1px solid var(--color-bg-2);
      }

      :deep(.el-textarea__inner) {
        padding: 0;
        font-size: 14px;
        color: var(--font-main);
        resize: none;
        background-color: var(--color-bg-3);
        border: none;
        box-shadow: none;
        transition: 0.2s;
      }

      .recorded {
        position: relative;
        z-index: 20;
        display: inline-flex;
        justify-content: center;
        width: 100%;
        cursor: pointer;
        user-select: none;
        border-radius: 12px;

        &-tips {
          animation: scale-in-center 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)
            both;

          @keyframes scale-in-center {
            0% {
              opacity: 1;
              transform: scale(0);
            }

            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        }

        &:active {
          margin: 0 10px;
          font-weight: bolder;
          line-height: 2em;
          color: #ffb357;
          box-shadow: 0 0 12px 10px var(--color-bg-2);
          transition: all 0.2s ease;
          transform: scaleY(1.1);
        }
      }
    }

    .reply-msg-wrapper {
      display: flex;
      column-gap: 12px;
      align-items: center;
      padding: 4px 12px;
      margin-bottom: 4px;
      font-size: 12px;
      color: var(--color-text-4);
      word-wrap: break-all;
      white-space: pre-wrap;
      background-color: var(--color-bg-3);
      border-radius: 12px;
    }

    .reply-msg-content {
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .reply-msg-icon {
      margin-left: auto;
      cursor: pointer;
      border-radius: 4px;

      &:hover {
        background-color: var(--color-secondary-hover);
      }
    }

    .tips {
      position: absolute;
      top: 0;
      left: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      font-size: 14px;
      cursor: pointer;
      backdrop-filter: saturate(90%) blur(2px);
    }

    .tips-text {
      margin-right: 2px;
      margin-left: 2px;
      color: var(--color-primary);
    }
  }

  .emoji-panel {
    display: flex;
    flex-direction: column;
    background-color: black;
    .footer {
      display: flex;
      align-items: center;
      padding: 4px 6px 0;
      margin-top: 4px;
      border-top: 1px solid var(--color-bg-2);

      &-act {
        color: #2299dd;
        padding: 4px;
        margin-right: 8px;
        line-height: 18px;
        border-radius: 6px;
      }

      .active {
        background-color: var(--color-bg-3);
      }
    }

    &-content {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      height: 220px;
      overflow-y: auto;

      .item {
        position: relative;
        width: 60px;
        height: 60px;
        margin: 7px;
        cursor: pointer;
        border-radius: 6px;

        .del {
          position: absolute;
          top: 0;
          right: 2px;
          font-weight: 500;
          color: #f54e4e;
          cursor: pointer;
        }

        img {
          width: 100%;
          height: 100%;
          vertical-align: bottom;
          border-radius: 2px;
        }

        &:hover {
          box-shadow: var(--el-box-shadow-light);
        }
      }

      .item-add {
        width: 60px;
        height: 60px;
        margin: 7px;
        line-height: 58px;
        text-align: center;
        border: 1px solid #fff;
        border-radius: 6px;
      }
    }
  }

  .emoji-list {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
    word-wrap: break-word;
    list-style-type: none;
  }

  .emoji-item {
    width: 28px;
    height: 28px;
    padding-top: 3px;
    padding-left: 2px;
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
    border-radius: 4px;

    &:hover {
      background-color: var(--color-bg-3);
    }
  }

  .icon-lock {
    margin-right: 4px;
  }

  @keyframes audio-wave {
    0% {
      transform: scaleY(1);
    }

    50% {
      transform: scaleY(0.8);
    }

    100% {
      transform: scaleY(1);
    }
  }

  @media only screen and (max-width: 640px) {
    .chat-box {
      padding: 8px 0 0;
    }

    .chat-wrapper {
      margin-right: 0;
    }
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .emoji-warpper {
    padding: 4px;
    padding-top: 8px;
    color: var(--color -text-1);
    background-color: var(--color-bg-1);
    border: none;
  }
</style>
