import {
  ChatActEnum,
  ChatMarkEnum,
  ChatMsgEnum,
  ChatOnlineEnum,
  RoomTypeEnum,
} from '@/types/enums/chat';

export type ChatUserItem = {
  /** 在线状态 */
  activeStatus: ChatOnlineEnum;
  /** 头像 */
  avatar: string;
  /** 最后一次上下线时间 */
  lastOptTime: string;
  /** 用户名称 */
  name: string;
  /** uid */
  uid: string;
};

export type ChatGroupStatisticType = {
  /** 在线人数 */
  onlineNum: number;
  /** 总人数 */
  totalNum: number;
};

export type ListResponse<T> = {
  cursor: string /** 游标（下次翻页带上这参数） */;
  /** 是否最后一页 */
  isLast: boolean;
  list: T[];
};

export type ChatCacheUserItem = {
  /** 是否需要更新数据源。 */
  needRefresh?: boolean;
  /** 最后更新时间 更新超过 10 分钟异步去更新。 */
  lastModifyTime: number;
  /** 获得的徽章 */
  itemIds: string[];
  /** 佩戴的徽章 */
  wearingItemId: string;
  /** 归属地 */
  locPlace: string;
  /** 头像 */
  avatar: string;
  /** 最后一次上下线时间 */
  lastOptTime: string;
  /** 用户名称 */
  name: string;
  /** uid */
  uid: string;
};

export type CacheUserReq = {
  /** 最后更新时间 更新超过 10 分钟异步去更新。 */
  lastModifyTime?: number;
  /** uid */
  uid: string;
};

export type CacheUserItem = {
  /** 是否需要更新数据源。 */
  needRefresh?: boolean;
  /** 最后更新时间 更新超过 10 分钟异步去更新。 */
  lastModifyTime: number;
  /** 获得的徽章 */
  itemIds: string[];
  /** 佩戴的徽章 */
  wearingItemId: string;
  /** 归属地 */
  locPlace: string;
  /** 头像 */
  avatar: string;
  /** 最后一次上下线时间 */
  lastOptTime: string;
  /** 用户名称 */
  name: string;
  /** uid */
  uid: string;
};

export type UserItem = {
  /** 在线状态 */
  activeStatus: ChatOnlineEnum;
  /** 头像 */
  avatar: string;
  /** 最后一次上下线时间 */
  lastOptTime: string;
  /** 用户名称 */
  name: string;
  /** 角色ID */
  roleId?: number
  /** uid */
  uid: string;
};

export type GroupStatisticType = {
  /** 在线人数 */
  onlineNum: number;
  /** 总人数 */
  totalNum: number;
};

export type MessageReplyType = {
  /** 是否可消息跳转 0否 1是 */
  canCallback: number;
  /** 是否可消息跳转 0否 1是 */
  content: string;
  /** 跳转间隔的消息条数 */
  gapCount: number;
  /** 消息id */
  id: string;
  /** 用户名称 */
  username: string;
};

export type MarkMsgReq = {
  // actType	动作类型 1确认 2取消
  actType: ChatActEnum;
  // 标记类型 1点赞 2举报
  markType: ChatMarkEnum;
  // 消息 ID
  msgId: string;
};

export type RemoveMsgReq = {
  // 标记类型 1删除
  state: number;
  // 消息 ID
  msgId: string;
};

export type MarkItemType = {
  /** 操作用户 */
  uid: string;
  /** 消息id */
  msgId: string;
  /** 操作类型 1点赞 2举报 */
  markType: ChatMarkEnum;
  /** 数量 */
  markCount: number;
  /** 动作类型 1确认 2取消 */
  actType: ChatActEnum;
};


export type GroupDetailReq = {
  /** 群头像 */
  avatar: string
  /** 群名称 */
  groupName: string
  /** 在线人数 */
  onlineNum: number
  /** 成员角色 1群主 2管理员 3普通成员 4踢出群聊 */
  role: number
  /** 房间id */
  roomId: string
}

export type RevokedMsgType = {
  /** 消息ID */
  msgId: string;
  /** 会话ID */
  roomId?: string;
  /** 撤回人ID */
  recallUid?: string;
};

export type EmojiItem = {
  expressionUrl: string;
  id: string;
};

// -------------------- ⬇消息体类型定义⬇ ----------------
export type ReplyType = {
  id: string;
  username: string;
  type: ChatMsgEnum;
  /** 根据不同类型回复的消息展示也不同-`过渡版` */
  body: any;
  /**
   * 是否可消息跳转
   * @enum {number}  `0`否 `1`是
   */
  canCallback: number;
  /** 跳转间隔的消息条数  */
  gapCount: number;
};

/**
 * 消息中用户信息
 */
export type MsgUserType = {
  /** 用户ID */
  uid: string;
  /** 用户名 */
  username: string;
  /** 头像 */
  avatar: string;
  /** 归属地 */
  locPlace: string;
  /** 徽章 */
  badge?: {
    /** 徽章地址 */
    img: string;
    /** 描述 */
    describe: string; // 描述
  };
};

/**
 * 消息互动信息
 */
export type MessageMarkType = {
  /** 点赞 */
  userLike: number;
  /** 举报 */
  userDislike: number;
  /** 点赞数 */
  likeCount: number;
  /** 举报数 */
  dislikeCount: number;
};

/** 图片消息体 */
export type ImageBody = {
  size: number;
  url: string;
  width: number;
  height: number;
};
/** 语音消息体 */
export type VoiceBody = {
  size: number;
  second: number;
  url: string;
};
/** 视频 */
export type VideoBody = {
  size: number;
  url: string;
  thumbSize?: number;
  thumbWidth?: number;
  thumbHeight?: number;
  thumbUrl?: string;
};
/** 文件消息体 */
export type FileBody = {
  size: number;
  fileName: string;
  url: string;
};
/** 文本消息体 */
export type TextBody = {
  /** 消息内容 */
  content: string;
  /** 回复 */
  reply: ReplyType;
  /**
   * 消息链接映射
   */
  urlContentMap: Record<
    string,
    {
      title: string;
      description: string;
      image: string;
    }
  >;
};
/** 表情消息 */
export type EmojiBody = {
  url: string;
};

/**
 * 消息内容
 */
export type MsgType = {
  /** 消息ID */
  id: string;
  /** 消息类型 */
  type: ChatMsgEnum;
  /** 动态消息体-`根据消息类型变化` */
  body:
    | TextBody
    | ImageBody
    | VoiceBody
    | VideoBody
    | FileBody
    | EmojiBody
    | any;
  /** 发送时间戳 */
  sendTime: number;
  /** 消息互动信息 */
  messageMark: MessageMarkType;
  roomId: string;
};

/**
 * 消息返回体
 */
export type MessageType = {
  /** 发送者信息 */
  fromUser?: MsgUserType;
  /** 消息主体 */
  message?: MsgType;
  /** 发送时间 */
  sendTime?: string;
  /** 时间段（可选） */
  timeBlock?: string;
  /** 是否加载中 */
  loading?: boolean;
};

/**
 * 发送消息载体
 */
export type MessageReq = {
  /** 会话id */
  roomId: string;
  /** 消息类型 */
  msgType: ChatMsgEnum;
  /** 消息体 */
  body: {
    /** 文本消息内容 */
    content?: string;
    /** 回复的消息id */
    replyMsgId?: string;
    /** 任意 */
    [key: string]: any;
  };
};

/** 申请状态 */
export enum RequestFriendAgreeStatus {
  /** 1待审批 */
  Waiting = 1,
  /** 2同意 */
  Agree,
}
/** 请求添加好友的列表项 */
export type RequestFriendItem = {
  /** 申请id */
  applyId: string;
  /** 申请信息 */
  msg: string;
  /** 申请状态 1待审批 2同意 */
  status: RequestFriendAgreeStatus;
  /** 申请类型 1加好友 */
  type: number;
  /** 申请人uid */
  uid: string;
  /** 会话 ID */
  roomId: string;
};


export type ChatMemberWResp = {
  id: string;
  remarkName:string;
  name:string;
  avatar:string;
  type:number;
  ext: Map<string, any>;
}

/** 联系人的列表项 -> V2 */
export type ContactItem = {
  index: number;
  /** 块名称，例如群聊 A, B */
  key: string;
  type: number;
  info: ChatMemberWResp[];
};
export type ContactItemW = {
  index: number;
  /** 块名称，例如群聊 A, B */
  key: string;
  type: number;
  id: string;
  remarkName:string;
  name:string;
  avatar:string;
  ext: Map<string, any>;
};

/** 是否全员展示的会话 0否 1是 */
export enum IsAllUserEnum {
  /** 0否 */
  Not,
  /** 1是 */
  Yes,
}

/** 会话列表项 */
export type SessionItem = {
  /** 房间最后活跃时间(用来排序) */
  activeTime: number;
  /** 会话头像 */
  avatar: string;
  /** 是否全员展示的会话 0否 1是 */
  hot_Flag: IsAllUserEnum;
  /** 会话名称 */
  name: string;
  /** 房间id */
  roomId: string;
  /** 最新消息 */
  text: string;
  /** 房间类型 1群聊 2单聊 */
  type: RoomTypeEnum;
  /** 未读数 */
  unreadCount: number;
};

/** 消息已读未读数列表项 */
export type MsgReadUnReadCountType = {
  /** 消息 ID */
  msgId: string;
  /** 已读数 */
  readCount: number;
  /** 未读数 */
  unReadCount: number | null;
};
