export interface ServerConfigState {
  publicKey: string;
  systemMessage: {
    userId: string; // 系统通知的用户，默认为2
    roomId: string; // 系统通知的房间号，专门用来存放系统通知的消息
  };
}
