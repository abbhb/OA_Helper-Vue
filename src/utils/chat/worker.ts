// 发消息给主进程
const postMsg = ({ type, value }: { type: string; value?: object }) => {
  // eslint-disable-next-line no-restricted-globals
  self.postMessage(JSON.stringify({ type, value }));
};

// ws instance
let connection: WebSocket;
// 心跳 timer
let heartTimer: number | null = null;

// 重连次数上限
const reconnectCountMax = 100;
let reconnectCount = 0;
// 重连 timer
// @ts-ignore
let timer: null | number = null;
// 重连🔐
let lockReconnect = false;
// 重连🔐
let token: null | string = null;

// 往 ws 发消息
const connectionSend = (value: object) => {
  connection?.send(JSON.stringify(value));
};

// 发送心跳 10s 内发送
const sendHeartPack = () => {
  // 10s 检测心跳
  // @ts-ignore
  heartTimer = setInterval(() => {
    // 心跳消息类型 2
    connectionSend({ type: 2 });
  }, 9900);
};
// 清除❤️跳 timer
const clearHeartPackTimer = () => {
  if (heartTimer) {
    clearInterval(heartTimer);
    heartTimer = null;
  }
};

const onCloseHandler = () => {
  clearHeartPackTimer();
  // 已经在连接中就不重连了
  if (lockReconnect) return;

  // 标识重连中
  lockReconnect = true;

  // 清除 timer，避免任务堆积。
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  // 达到重连次数上限
  if (reconnectCount >= reconnectCountMax) {
    reconnectCount = 0;
    return;
  }

  // 断线重连
  // @ts-ignore
  timer = setTimeout(() => {
    // eslint-disable-next-line no-use-before-define
    initConnection();
    // eslint-disable-next-line no-plusplus
    reconnectCount++;
    // 标识已经开启重连任务
    lockReconnect = false;
  }, 2000);
};

// ws 连接 error
const onConnectError = () => {
  onCloseHandler();
  postMsg({ type: 'error' });
};
// ws 连接 close
const onConnectClose = () => {
  onCloseHandler();
  token = null;
  postMsg({ type: 'close' });
};
// ws 连接成功
const onConnectOpen = () => {
  postMsg({ type: 'open' });
  // 心跳❤️检测
  sendHeartPack();
};
// ws 连接 接收到消息
const onConnectMsg = (e: any) => postMsg({ type: 'message', value: e.data });

// 初始化 ws 连接
const initConnection = () => {
  console.log("new WebSocket")

  connection?.removeEventListener('message', onConnectMsg);
  connection?.removeEventListener('open', onConnectOpen);
  connection?.removeEventListener('close', onConnectClose);
  connection?.removeEventListener('error', onConnectError);
  // 建立链接
  // 本地配置到 .env 里面修改。生产配置在 .env.production 里面
  connection = new WebSocket(
    `ws://localhost:8090${
      token
        ? `?token=${token}`
        : '?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhdXRoMCIsImlkIjoiMTY1OTkzOTcyNjM4NjgyNzI2NSJ9.j8nqvt4gS_zDOqE_4OVGICkM2asWodBe6EpsxNmur9c'
    }`
  );
  // 收到消息
  connection.addEventListener('message', onConnectMsg);
  // 建立链接
  connection.addEventListener('open', onConnectOpen);
  // 关闭连接
  connection.addEventListener('close', onConnectClose);
  // 连接错误
  connection.addEventListener('error', onConnectError);
};

// eslint-disable-next-line no-restricted-globals
self.onmessage = (e: MessageEvent<string>) => {
  const { type, value } = JSON.parse(e.data);
  // eslint-disable-next-line default-case
  switch (type) {
    case 'initWS': {
      reconnectCount = 0;
      token = value;
      initConnection();
      break;
    }
    case 'message': {
      if (connection?.readyState !== 1) return;
      connectionSend(value);
      break;
    }
  }
};
