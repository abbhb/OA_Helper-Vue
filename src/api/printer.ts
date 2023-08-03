import axios from 'axios';
import {PageData} from '@/api/common';

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

export function getCountTop10VO(params: {
  type: number;
}) {
  return axios.get<CountTop10VO[]>('/api/printer/getUserPrintTopList', {
    params,
  });
}

export function getPrintDocumentTypeStatistics() {
  return axios.get<PrintDocumentTypeStatistics[]>('/api/printer/getPrintDocumentTypeStatistics');
}
