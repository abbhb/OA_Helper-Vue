import axios from 'axios';

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
export interface PageData {
  countId: string;
  current: number;
  pages: number;
  records: Printer[];
  size: number;
  MaxLimit: number;
  total: number;
}

export function querySelfPrinterList(params: { page_num: number ,page_size:number}) {
  return axios.get<PageData>('/api/printer/getMyHistoryPrints',{ params });
}

export function queryAllPrinterList(params: { page_num: number ,page_size:number}) {
  return axios.get<PageData>('/api/printer/getAllHistoryPrints',{ params });
}
