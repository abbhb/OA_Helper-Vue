// 计算展示的回复消息的内容
import {ChatMsgEnum} from '@/types/enums/chat';

const renderReplyContent = (
  name?: string,
  type?: ChatMsgEnum,
  content?: string
) => {
  switch (type) {
    case ChatMsgEnum.SYSTEM:
    case ChatMsgEnum.TEXT: {
      return `${name}:${content}`;
    }
    case ChatMsgEnum.IMAGE: {
      return `${name}: [图片]`;
    }
    case ChatMsgEnum.FILE: {
      return `${name}: [文件]`;
    }
    case ChatMsgEnum.VOICE: {
      return `${name}: [语音]`;
    }
    case ChatMsgEnum.VIDEO: {
      return `${name}: [视频]`;
    }
    case ChatMsgEnum.EMOJI: {
      return `${name}: [表情]`;
    }
    default: {
      return '';
    }
  }
};
export default renderReplyContent;
