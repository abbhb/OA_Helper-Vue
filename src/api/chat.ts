import axios from 'axios';
import {
  CacheUserItem,
  CacheUserReq,
  ChatCacheUserItem,
  ChatGroupStatisticType,
  ChatUserItem,
  ContactItem,
  EmojiItem,
  GroupDetailReq,
  ListResponse,
  MarkMsgReq,
  MessageReq,
  MessageType,
  MsgReadUnReadCountType, RemoveMsgReq,
  RequestFriendItem,
  SessionItem,
} from '@/types/chat';

/** 获取群成员列表 */
export function getGroupList(params?: any) {
  return axios.get<ListResponse<ChatUserItem>>(
    '/api/room/public/group/member/page',
    params
  );
}

/** 获取群成员统计 */
export function getMemberStatistic() {
  return axios.get<ChatGroupStatisticType>('/api/chat/public/member/statistic');
}

/** 房间内的所有群成员列表-@专用 */
export function getAllUserBaseInfo(params?: any) {
  return axios.get<Pick<ChatCacheUserItem, 'avatar' | 'name' | 'uid'>[]>(
    '/api/room/group/member/list',
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

/** 会话详情 */
export function sessionDetail(params: { id: string }) {
  return axios.get<SessionItem>('/api/chat/public/contact/detail', { params });
}

/** 群组详情 */
export function groupDetail(params: { id: string }) {
  return axios.get<GroupDetailReq>('/api/room/public/group', { params });
}

/** 发送消息 */
export function sendMsg(data?: MessageReq) {
  return axios.post<MessageType>('/api/chat/msg', data);
}

export function createGroup(params: { uidList: string[] }) {
  return axios.post<{ id: string }>('/api/room/group', params);
}
export function inviteGroupMember(params: {
  roomId: string;
  uidList: string[];
}) {
  return axios.post<void>('/api/room/group/member', params);
}

/** 标记消息，点赞等 */
export function markMsg(data?: MarkMsgReq) {
  return axios.put<void>('/api/chat/msg/mark', data);
}

/**
 * 删除消息记录
 * @param data
 */
export function removeMsg(data?: RemoveMsgReq) {
  return axios.post<void>('/api/chat/msg/remove', data);
}

export function addAdmin({
  roomId,
  uidList,
}: {
  roomId: string;
  uidList: string[];
}) {
  return axios.put<boolean>('/api/room/group/admin', {
    roomId,
    uidList,
  });
}

export function revokeAdmin({
  roomId,
  uidList,
}: {
  roomId: string;
  uidList: string[];
}) {
  return axios.delete<boolean>('/api/room/group/admin', {
    data:{
      roomId,
      uidList,
    }
  });
}

export function removeGroupMember(params: { roomId: string; uid: string }) {
  return axios.delete<boolean>('/api/room/group/member', {
    params
  });
}

/** 撤回消息 */
export function recallMsg(data: { msgId: string; roomId: string }) {
  return axios.put<void>('/api/chat/msg/recall', data);
}

/**
 * 更新群组的名称
 * @param data
 */
export function putRoomName(data: { roomId: string; name: string }) {
  return axios.put<void>('/api/room/group/name', data);
}
export function putRoomAvatar(data: { roomId: string; avatar: string }) {
  return axios.put<void>('/api/room/group/avatar', data);
}

export function getSessionList(params?: any) {
  return axios.get<ListResponse<SessionItem>>('/api/chat/public/contact/page', {
    params,
  });
}

interface uploadT {
  downloadUrl: string;
  uploadUrl: string;
}
/** 获取临时上传链接 */
export function getUploadUrl(params: any) {
  return axios.get<uploadT>('/api/chat-oss/upload/url', {
    params,
  });
}

/** 新增表情包 */
export function addEmoji(data: { expressionUrl: string }) {
  return axios.post<MessageType>('/api/user/emoji/add', data);
}

/** 获取表情 */
export function getEmoji(params: { uid: string }) {
  return axios.get<EmojiItem[]>('/api/user/emoji/list', {
    params,
  });
}

/** 删除id */
export function deleteEmoji(params: { id: string }) {
  return axios.delete<EmojiItem[]>('/api/user/emoji/delete', {
    params,
  });
}
/** 删除会话 */
export function deleteContact(params: { roomId: string }) {
  return axios.delete<EmojiItem[]>('/api/chat/public/contact', {
    params,
  });
}

export function exitGroup({ roomId }: { roomId: string }) {
  return axios.delete<boolean>('/api/room/group/member/exit', {
    params:{
      roomId
    }
  });
}

// -------------- 好友相关 ---------------
export function getContactList() {
  return axios.get<ContactItem[]>('/api/chat-friend/v2/page', {

  });
}

export function requestFriendList(params?: any) {
  return axios.get<ListResponse<RequestFriendItem>>(
    '/api/chat-friend/apply/page',
    {
      params,
    }
  );
}

export function sessionDetailWithFriends(params: { uid: string }) {
  return axios.get<SessionItem>('/api/chat/public/contact/detail/friend', {
    params,
  });
}
export function getMsgReadCount(msgIds: any) {
  return axios.post<MsgReadUnReadCountType[]>('/api/chat/msg/read', {
    msgIds: msgIds,
  });
}
interface ChatMessageReadResp {
  uid: string;
}
export function getMsgReadList(params: any) {
  return axios.get<ListResponse<ChatMessageReadResp>>(
    '/api/chat/msg/read/page',
    params
  );
}

/** 发送添加好友请求 */
export function sendAddFriendRequest(params: {
  targetUid: string;
  msg: string;
}) {
  return axios.post<EmojiItem[]>('/api/chat-friend/apply', params);
}

/** 同意好友申请 */
export function applyFriendRequest(params: { applyId: string }) {
  return axios.put<void>('/api/chat-friend/apply', params);
}

/** 消息阅读上报 */
export function markMsgRead(data: any) {
  return axios.put<MsgReadUnReadCountType>('/api/chat/msg/read', data);
}

/** 删除好友 */
export function deleteFriend(params: { targetUid: string }) {
  return axios.delete('/api/chat-friend', {
    data:params,
  });
}
