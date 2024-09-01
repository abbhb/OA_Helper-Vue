import axios from 'axios';

export interface AgreeResp {
  redirectUri: string;
  state: string;
  code: string;
}

export interface AgreeReq {
  responseType: string;
  clientId: string;
  redirectUri: string;
  state: string;
  scope: string;
}
export interface AgreeLoginReq extends AgreeReq {
  username: string;
  password: string;
}

export interface AgreeLoginResp extends AgreeResp {
  token: string;
}

export interface SysOauth {
  id?: string;
  client_id?: string;
  client_name: string;
  client_secret?: string;
  client_image?: string;
  redirect_uri: string;
  force_configuration_redirect?: number;
  domain_name: string;
  no_sert_redirect: number;
  grant_type: string;
  create_time?: string;
  update_time?: string;
  status: number;
}

export function getClientName(clientId: string) {
  return axios.get<string>('/api/oauth2.0/get_client_name', {
    params: {
      client_id: clientId,
    },
  });
}

export function agreementGet(way:string,id: string,type:number) {
  return axios.get<string>(`/api/oauth2.0/agreement_get/${way}/${id}/${type}`);
}

export function agree(data: AgreeReq) {
  return axios.post<AgreeResp>('/api/oauth2.0/agree', data);
}
export function agreeLogin(data: AgreeLoginReq) {
  return axios.post<AgreeLoginResp>('/api/oauth2.0/agree_login', data);
}

export function listOauth() {
  return axios.get<SysOauth[]>('/api/oauth2.0/list');
}
export function deleteOauth(id: string) {
  return axios.delete<string>('/api/oauth2.0/delete', {
    params: {
      id,
    },
  });
}

export function updateOauth(data: SysOauth) {
  return axios.put<string>('/api/oauth2.0/update', data);
}

/**
 * 服务协议/隐私保护协议更新
 * @param sysOauth
 * @param type 约束1：服务协议更新，2:隐私保护协议
 * @return
 */
export function agreementUpdate(
  data: {
    id: string;
    serviceAgreement?: string;
    privacyShieldAgreement?: string;
  },
  type: number
) {
  return axios.put<string>(`/api/oauth2.0/agreement_update/${type}`, data);
}

export function addOauth(data: SysOauth) {
  return axios.post<string>('/api/oauth2.0/add', data);
}

export function test() {}
