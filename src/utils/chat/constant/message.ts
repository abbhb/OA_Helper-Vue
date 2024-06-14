// 消息回复映射表
import {ChatMsgEnum} from "@/types/enums/chat";

// eslint-disable-next-line import/prefer-default-export
export const MSG_REPLY_TEXT_MAP: Record<number, string> = {
    [ChatMsgEnum.UNKNOWN]: '[未知]',
    [ChatMsgEnum.RECALL]: '[撤回消息]',
    [ChatMsgEnum.IMAGE]: '[图片]',
    [ChatMsgEnum.FILE]: '[文件]',
    [ChatMsgEnum.VOICE]: '[语音]',
    [ChatMsgEnum.VIDEO]: '[音频]',
    [ChatMsgEnum.EMOJI]: '[表情]',
}
