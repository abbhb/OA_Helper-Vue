// 打印模式：默认单文件打印模式:1 多文件打印模式为9
export type modelType = 1 | 9;

export interface PrintDevice {
  id: string; // 打印机id
  name: string; // 打印机name
  description: string; // 描述
  ip: string; // 设备ip
  port: number; // 设备端口
  status: number; // 设备状态；1为空闲，0状态提示打印机异常，轮询的时候及时更新
  listNums:number;// 当前打印机队列任务数
  statusTypeMessage:string;// 没有任务为空闲
}

export interface PrintState {
  model: modelType;
  printDevice: PrintDevice;
}
