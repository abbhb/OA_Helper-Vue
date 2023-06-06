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

export function queryPrinterList() {
  return axios.post<Printer>('/api/message/list');
}
