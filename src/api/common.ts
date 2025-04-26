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

export function getSystemMessageConfig() {
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

// ---- LDAP

export interface SyncLdapJobVO {
  id?:string;
  createTime?:string;
  updateTime?:string;
  state?:string;//0：进行中，1：成功，2：失败
  createUser?:string;
  userName?:string;
}
export function SyncMysqlToLdap() {
  return axios.get<string>('/api/system_control/sync_mysql_ldap');
}
export function syncMysqlToLdapJobs() {
  return axios.get<SyncLdapJobVO>('/api/system_control/sync_mysql_ldap_jobs');
}
