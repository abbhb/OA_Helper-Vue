import axios from 'axios';
import {
    CacheUserItem,
    CacheUserReq,
    ChatCacheUserItem,
    ChatGroupStatisticType,
    ChatUserItem,
    EmojiItem,
    ListResponse,
    MarkMsgReq,
    MessageReq,
    MessageType,
} from '@/types/chat';

/** 获取群成员列表 */
export function getGroupList(params?: any) {
  return axios.get<ListResponse<ChatUserItem>>(
    '/api/chat/public/member/page',
    params
  );
}

/** 获取群成员统计 */
export function getMemberStatistic() {
  return axios.get<ChatGroupStatisticType>('/api/chat/public/member/page');
}

/** 房间内的所有群成员列表-@专用 */
export function getAllUserBaseInfo(params?: any) {
  return axios.get<Pick<ChatCacheUserItem, 'avatar' | 'name' | 'uid'>[]>(
    '/api/chat/member/list',
    params
  );
}

/** 批量获取成员详细信息 */
export function getUserInfoBatch(users: CacheUserReq[]) {
  return axios.post<CacheUserItem[]>(
    '/api/user/public/summary/userInfo/batch',
    { reqList: users }
  );
}

/** 获取消息列表 */
export function getMsgList(params?: any) {
  return axios.get<ListResponse<MessageType>>(
    '/api/chat/public/msg/page',
    params
  );
}

/** 发送消息 */
export function sendMsg(data?: MessageReq) {
  return axios.post<MessageType>('/api/chat/msg', data);
}

/** 标记消息，点赞等 */
export function markMsg(data?: MarkMsgReq) {
  return axios.put<void>('/api/chat/msg/mark', data);
}

/** 撤回消息 */
export function recallMsg(data: { msgId: string; roomId: string }) {
  return axios.put<void>('/api/chat/msg/recall', data);
}

/** 获取临时上传链接 */
export function getUploadUrl(params: any) {
  return axios.get<{ downloadUrl: string; uploadUrl: string }>(
    '/api/chat-oss/upload/url',
    {
      params,
    }
  );
}

/** 新增表情包 */
export function addEmoji(data: { uid: string; expressionUrl: string }) {
  return axios.post<MessageType>('/api/user/emoji', data);
}

/** 获取表情 */
export function getEmoji(params: { uid: string }) {
  return axios.get<EmojiItem[]>('/api/user/emoji/list', {
    params,
  });
}

/** 删除id */
export function deleteEmoji(params: { id: string }) {
  return axios.delete<EmojiItem[]>('/api/user/emoji', {
    params,
  });
}
