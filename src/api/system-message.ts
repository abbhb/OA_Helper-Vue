import axios from 'axios';
import { MessageType } from '@/types/chat';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SystemMessageResp {
  message?: MessageType;
  read?: boolean;
  id?: string;
  createTime?: string;
  createUser?: string;
  username?: string;
  avatar?: string;
}

export function listSystemMessage() {
  return axios.get<SystemMessageResp[]>('/api/system-message/list');
}

export function getUnReadCount() {
  return axios.get<number>('/api/system-message/noreadCount');
}

export function readPost(id:string,type:number) {
  return axios.post<void>(`/api/system-message/read/${id}/${type}`);
}

export function readPostBatch(ids:string[],type:number) {
  return axios.post<void>(`/api/system-message/readbatch/${type}`,{
    ids
  });
}
