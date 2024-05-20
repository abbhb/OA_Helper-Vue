import axios from 'axios';

export interface PageData<T> {
  countId: string;
  current: string;
  pages: string;
  records: T;
  size: string;
  MaxLimit: number;
  total: number;
}

export interface SystemMessageConfig {
  userId: string;
  roomId: string;
}
export interface UploadFileFromV1Resp {
  url:string;
  name:string;
}

export function getPublicKey() {
  return axios.get<string>('/api/common/get_public_key');
}

export function getSystemMessage() {
  return axios.get<SystemMessageConfig>('/api/common/get_system_message');
}

export function isConfirm(key: string) {
  return axios.get<boolean>(`/api/common/is_confirm/${key}`);
}
export function confirmToServer(key: string) {
  return axios.get<string>(`/api/common/confirm/${key}`);
}

export function getAllImageUrl(params: { key: string }) {
  return axios.get<string>('/api/common/get_all_image_url', { params });
}
