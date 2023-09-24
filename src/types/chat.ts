import {ChatActEnum, ChatMarkEnum, ChatMsgEnum, ChatOnlineEnum,} from '@/types/enums/chat';

export type ChatUserItem = {
  /** 在线状态 */
  activeStatus: ChatOnlineEnum;
  /** 头像 */
  avatar: string;
  /** 最后一次上下线时间 */
  lastOptTime: number;
  /** 用户名称 */
  name: string;
  /** uid */
  uid: string;
};

export type ChatGroupStatisticType = {
  /** 在线人数 */
  onlineNum: number
  /** 总人数 */
  totalNum: number
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
  lastOptTime: number;
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
  lastOptTime: number;
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
  lastOptTime: number;
  /** 用户名称 */
  name: string;
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
};

/**
 * 消息返回体
 */
export type MessageType = {
  /** 发送者信息 */
  fromUser: MsgUserType;
  /** 消息主体 */
  message: MsgType;
  /** 发送时间 */
  sendTime: string;
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
