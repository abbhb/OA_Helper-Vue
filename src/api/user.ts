import axios from 'axios';
import { UserState } from '@/store/modules/user/types';
import { PageData } from '@/api/common';
import { Role } from '@/api/role';

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

export interface ResetReq {
  userId: string;
}
export interface ResetResp {
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

export interface UserInfoBaseExtStateResp {
  state: boolean; // 修改状态1 在等待审核中 0就是可以修改
  currentInfo?: UserInfoBaseExt;
  newInfo?: UserInfoBaseExt; // 如果在修改中，这里展示新的数据
}

export interface UserInfoBaseExt {
  zsxm?: string;
  csd1?: string;
  csd2?: string;
  csd3?: string;
  zzmm?: string;
  jg1?: string;
  jg2?: string;
  jg3?: string;
  syd1?: string;
  syd2?: string;
  sex?: string;
  mz?: string;
  csrq?: string;
  studentId?: string;
  phone?: string;
  idPhoto?: string;
  detailAddress?: string;
  sfzLx?: string;
  sfzId?: string;
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
export function resetPassword(data: ResetReq) {
  return axios.post<ResetResp>('/api/user/reset_password', data);
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

export function exportUserData() {
  return axios.post<string>('/api/user/export');
}

export function getImportUserTemplate() {
  return axios.get<string>('/api/user/importTemplate');
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

export function updataUserInfoBaseExt(data: UserInfoBaseExt) {
  return axios.post<string>('/api/user/userinfo_ext_my_apply_for', data);
}

export function getUserCount() {
  return axios.get<number>('/api/user/user_count');
}

export function userinfoExtMy() {
  return axios.get<UserInfoBaseExtStateResp>('/api/user/userinfo_ext_my');
}

export function approvalUserinfoExtData(taskId: string) {
  return axios.get<UserInfoBaseExt>(
    '/api/user/approval_userinfo_ext_data/' + taskId
  );
}

export function userinfoExtMyWthdraw() {
  return axios.post<string>('/api/user/userinfo_ext_my_withdraw');
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
  level?: string;
  cascade: number;
  mustHaveStudentId: number;
}) {
  return axios.get<PageData<UserManger[]>>('/api/user/user_manger', { params });
}

export function listForBMPN(params: {
  pageNum: number;
  pageSize: number;
  name?: string;
  deptId?: string;
}) {
  return axios.get<PageData<UserManger[]>>('/api/user/listForBMPN', { params });
}

export function listForLevels() {
  return axios.get<string[]>('/api/user/levels');
}

export function getUserPassword() {
  return axios.get<number>('/api/user/user_password');
}

export function userSelectList(name: string) {
  return axios.get<UserSelectListResp>('/api/user/user_select_list', {
    params: {
      name,
    },
  });
}

export function userSelectOnlyXUserList(deptId: string) {
  return axios.get<UserSelectListResp>(
    '/api/user/user_select_list_only_x_user',
    {
      params: {
        deptId,
      },
    }
  );
}
