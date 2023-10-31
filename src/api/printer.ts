import axios from 'axios';
import { PageData } from '@/api/common';

export interface Printer {
  contentHash: string;
  copies: number;
  createTime: string;
  createUser: string;
  id: string;
  isDuplex: number;
  name: string;
  needPrintPagesEndIndex: number;
  needPrintPagesIndex: number;
  originFilePages: number;
  printBigValue: number;
  printingDirection: number;
  singleDocumentPaperUsage: number;
  url: string;
}

export interface PrintDocumentTypeStatistics {
  type: string;
  count: number;
  proportion: number;
}

export interface CountTop10VO {
  id: string;
  name: string;
  avatar: string;
  total: number;
}

interface UploadFile {
  file: any;
}

interface PrintFileReq {
  id: string;
  copies: number;
  isDuplex: number;
  startNum: number;
  endNum: number;
  landscape: number;
  deviceId: string;
}

export interface PrintJobC {
  id:string;
  documentName:string;
  startTime:string;
  jobStatus:string;
  pagesPrinted:number;
  pageCount:number;
}

export interface PrintDeviceInfoResp {
  printName:string;
  printDescription:string;
  statusTypeMessage:string;
  listNums:number;
  statusType:number;
  printJobs:PrintJobC[];


}

export interface PrintDeviceResp {
  id: string;
  name: string;
  description: string;
  ip: string;
  port: number;
  status: number;
  detailInfo: PrintDeviceInfoResp;
}

interface PrintImageResp {
  id: string;
  imgUrl: string;
}

interface PrintFileConfigResp {
  id: string;
  firstPage: number;
  lastPage: number;
  fileName: string;
}

interface PrinterBaseResp<T> {
  type: number;
  message: string;
  data: T;
}

export function querySelfPrinterList(params: {
  page_num: number;
  page_size: number;
}) {
  return axios.get<PageData<Printer[]>>('/api/printer/getMyHistoryPrints', {
    params,
  });
}

export function queryAllPrinterList(params: {
  page_num: number;
  page_size: number;
}) {
  return axios.get<PageData<Printer[]>>('/api/printer/getAllHistoryPrints', {
    params,
  });
}

export function getCountTop10VO(params: { type: number }) {
  return axios.get<CountTop10VO[]>('/api/printer/getUserPrintTopList', {
    params,
  });
}

export function getPrintDocumentTypeStatistics() {
  return axios.get<PrintDocumentTypeStatistics[]>(
    '/api/printer/getPrintDocumentTypeStatistics'
  );
}

/**
 * 上传需要打印的文件
 * @param data
 */
export function uploadPrintFile(data: UploadFile) {
  return axios.post<string>('/api/printer/uploadPrintFile', data);
}

/**
 * 确认打印文件
 * @param data
 */
export function printFile(data: PrintFileReq) {
  return axios.post<string>('/api/printer/print_file', data);
}

/**
 * 缩略图轮询接口，查询缩略图状态，有就返回，没告诉前端
 */
export function thumbnailPolling(params: { id: string }) {
  return axios.get<PrinterBaseResp<PrintImageResp>>(
    '/api/printer/thumbnail polling',
    {
      params,
    }
  );
}

/**
 * 设备轮询接口，获取哪些打印机注册了服务，且正常
 */
export function printDevicePolling() {
  return axios.get<PrintDeviceResp[]>('/api/printer/print_device polling');
}

/**
 * 文件配置轮询接口，查询缩略图状态，有就返回，没告诉前端
 */
export function fileConfigurationPolling(params: { id: string }) {
  return axios.get<PrinterBaseResp<PrintFileConfigResp>>(
    '/api/printer/file_configuration_polling',
    {
      params,
    }
  );
}
