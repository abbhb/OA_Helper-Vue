import axios from 'axios';

import { LoginRes } from '@/api/user';

export interface UserPasskey {
  id?: string;
  name?: string;
  credentialId?: string;
  publicKey?: string;
  count?: string;
  userId?: string;
  createTime?: string;
  updateTime?: string;
}
export interface ActionPasskeyRegistrationReq {
  action?: string;
  label?: string;
  credentialId?: string;
}

export function getPasskeyRegistrationOptions() {
  return axios.get<string>('/api/authorization/passkey/registration/options');
}

export function listPasskeyRegistrations() {
  return axios.get<UserPasskey[]>(
    '/api/authorization/passkey/registration/list'
  );
}

export function actionPasskeyRegistration(data: ActionPasskeyRegistrationReq) {
  return axios.post<void>(
    '/api/authorization/passkey/registration/action',
    data
  );
}
export function verifyPasskeyRegistration(data: any) {
  return axios.post<UserPasskey>(
    '/api/authorization/passkey/registration',
    data
  );
}

export function getPasskeyOptions() {
  return axios.get<string>('/api/authorization/passkey/assertion/options');
}

export function loginWithPasskey(data: any) {
  return axios.post<LoginRes>('/api/authorization/passkey/assertion', data);
}
