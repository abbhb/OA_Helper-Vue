import axios from 'axios';

export interface ContentDataRecord {
  x: string;
  y: number;
}

export function queryContentData() {
  return axios.get<ContentDataRecord[]>('/api/content-data');
}

export interface PopularRecord {
  key: number;
  clickNumber: string;
  title: string;
  increases: number;
}


export function queryApiCount() {
  return axios.get<number>('/api/common/api_count');
}
export function queryLastdayApiCount() {
  return axios.get<number>('/api/common/api_count_lastday');
}
export function queryDayPrintCount() {
  return axios.get<number>('/api/printer/day_print_count');
}
