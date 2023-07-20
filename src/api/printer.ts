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
