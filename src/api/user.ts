import axios from 'axios';
import {UserState} from '@/store/modules/user/types';
import {PageData} from '@/api/common';
import {Role} from '@/api/role';

export interface LoginData {
  username: string;
  password: string;
  week: boolean;
}
export interface LoginDataByCode {
  code: string;
}
export interface Password {
  password: string;
  rePassword: string;
  newPassword: string;
}

export interface UserInfo {
  username?: string;
  id?: string;
  name?: string;
  sex?: string;
  studentId?: string;
  phone?: string;
  avatar?: string;
  roles?: Role[];
  deptId?: string;
  deptName?: string;
}

export interface UserManger extends UserInfo {
  createTime?: string;
  updateTime?: string;
  status?: number;
  email?: string;
  password?: string;
}
export interface LoginRes {
  token: string;
    toSetPassword?: number;
    oneTimeSetPasswordCode?: string;
}

export interface LoginByEmailCodeReq {
    week: boolean;
    emailCode: string;
    email: string;
}

export interface UserSelectResp {
    id: string;
    name: string;
}


export interface UserSelectListResp {
    options: UserSelectResp[];
}

interface UserFrontConfigReq {
  req: string;
}

export function login(data: LoginData) {
  return axios.post<LoginRes>('/api/user/login', data);
}
export function loginbycode(data: LoginDataByCode) {
  return axios.post<LoginRes>('/api/user/loginbycode', data);
}

export function loginByEmailCode(data: LoginByEmailCodeReq) {
    return axios.post<LoginRes>('/api/user/login_by_email_code', data);
}
export function loginbytoken() {
  return axios.post<LoginRes>('/api/user/login_by_token');
}
export function updataUserInfo(data: UserInfo) {
  return axios.put<string>('/api/user/update', data);
}

export function updataUserByAdmin(data: UserManger) {
  return axios.put<string>('/api/user/updateByAdmin', data);
}

export function updataUserStatusByAdmin(id: string, status: string) {
  return axios.get<string>('/api/user/updateStatus', {
    params: {
      id,
      status,
    },
  });
}
export function setPassword(data: Password) {
  return axios.put<string>('/api/user/setPassword', data);
}

export function logout() {
  return axios.post<string>('/api/user/logout');
}

export function getUserInfo() {
  return axios.post<UserState>('/api/user/info');
}

export function getUserCount() {
  return axios.get<number>('/api/user/user_count');
}

export function getUserFrontConfig() {
  return axios.get<string>('/api/user_front_config/get_user_front_config');
}

export function setUserFrontConfig(data: UserFrontConfigReq) {
  return axios.post<string>(
    '/api/user_front_config/set_user_front_config',
    data
  );
}

export function getRoleName(roles: string) {
  return axios.get<string[]>('/api/user/role_name', {
    params: {
      role_key: roles,
    },
  });
}

export function getUserListManger(params: {
  pageNum: number;
  pageSize: number;
  name?: string;
  deptId?: string;
  cascade: number;
}) {
  return axios.get<PageData<UserManger[]>>('/api/user/user_manger', { params });
}

export function listForBMPN(params: {
    pageNum: number;
    pageSize: number;
    name?: string;
    deptId?: string;
}) {
    return axios.get<PageData<UserManger[]>>('/api/user/listForBMPN', {params});
}

export function getUserPassword() {
  return axios.get<number>('/api/user/user_password');
}

export function userSelectList(name: string) {
    return axios.get<UserSelectListResp>('/api/user/user_select_list', {
        params: {
            name
        }
    });
}

export function userSelectOnlyXUserList(deptId: string) {
    return axios.get<UserSelectListResp>('/api/user/user_select_list_only_x_user', {
        params: {
            deptId
        }
    });
}
