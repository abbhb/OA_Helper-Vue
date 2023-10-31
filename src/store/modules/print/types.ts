// 打印模式：默认单文件打印模式:1 多文件打印模式为9
import { PrintDeviceImpl } from '@/utils/print/PrintDeviceImpl';

export type modelType = 1 | 9;

export interface PrintJob {
  id: string;
  documentName: string;
  pagesPrinted: number;
  pageCount: number;
  jobStatus: string;
  startTime: string;
}

export interface PrintDevice {
  id: string; // 打印机id
  name: string; // 打印机name
  description: string; // 描述
  ip: string; // 设备ip
  port: number; // 设备端口
  status: number; // 设备状态；1为空闲，0状态提示打印机异常，轮询的时候及时更新
  listNums: number; // 当前打印机队列任务数
  statusTypeMessage: string; // 没有任务为空闲
  printJobs: PrintJob[];
}

export interface PrintState {
  model: modelType;
  printDevice: PrintDeviceImpl;
  printDeviceList: PrintDeviceImpl[];
  // 大队列轮询，所有小队列都轮询，小队列轮询可通过引用对象来控制是否开启轮询，如果对象被选中，且进入页面的一瞬间开启轮询
  isSelecting: boolean; // 如果用户正在选择就把大队列轮询时间缩短到10s一次，否则2分钟一次，后期添加手动刷新。且用户选择的时候就算打印机状态异常也不删除，不可选状态，然后当用户选泽结束了马上更新列表
  needDelectId: string[]; // 这个就是每次选择时发现死掉的打印机需要删除,如果用户已经选择了，也是此方法，放在此列表，直到用户状态不为选择，且换成了其他打印机，则从对象列表清除该项
  timer: any;
}
