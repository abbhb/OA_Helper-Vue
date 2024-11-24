// 计算展示的回复消息的内容
import {ChatMsgEnum} from '@/types/enums/chat';
import {useUserInfo} from "@/hooks/chat/useCached";

const getMessageBody = (msg:string, type:number) => {
  console.log(msg,type)
  if (msg && type && type === ChatMsgEnum.TEXT) {
    // 获取消息内容
    let content = msg;

    // 使用正则表达式匹配成对的@到○之间的内容
    const regex = /@([0-9]+)○/g;
    let match;
    const matchedUIDs = [];

    // 匹配并保存到数组
    // eslint-disable-next-line no-cond-assign
    while ((match = regex.exec(content)) !== null) {
      matchedUIDs.push(match[1]);
    }

    // 获取用户信息并替换文本
    for (const uid of matchedUIDs) {
      const userInfo = useUserInfo(String(uid));
      const username = userInfo.value.name;
      const regexUID = new RegExp(`@${uid}○`, 'g');
      content = content.replace(regexUID, "@"+username);
    }

    return content;
  }
  return msg;
};
const renderReplyContent = (
  name?: string,
  type?: ChatMsgEnum,
  content?: string
) => {
  switch (type) {
    case ChatMsgEnum.SYSTEM:
    case ChatMsgEnum.TEXT: {

      return `${name}:${getMessageBody(content,1)}`;
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
