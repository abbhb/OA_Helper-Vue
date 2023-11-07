import axios from 'axios';
import {UserState} from "@/store/modules/user/types";

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

export function getClientName(clientId: string) {
  return axios.get<string>('/api/oauth2.0/get_client_name', {
    params: {
      client_id: clientId,
    },
  });
}
export function agree(data:AgreeReq) {
    return axios.post<AgreeResp>('/api/oauth2.0/agree',data);
}
export function agreeLogin(data:AgreeLoginReq) {
    return axios.post<AgreeLoginResp>('/api/oauth2.0/agree_login',data);
}

export function test() {}
