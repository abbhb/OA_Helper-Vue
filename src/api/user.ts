import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

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
  username: string;
  id: number;
  name: string;
  sex: string;
  studentId: string;
  phone: string;
  avatar: string;
}

export interface LoginRes {
  token: string;
}

export function login(data: LoginData) {
  return axios.post<LoginRes>('/api/user/login', data);
}
export function loginbycode(data: LoginDataByCode) {
  return axios.post<LoginRes>('/api/user/loginbycode', data);
}
export function loginbytoken() {
  return axios.post<LoginRes>('/api/user/login_by_token');
}
export function updataUserInfo(data: UserInfo) {
  return axios.put<string>('/api/user/update', data);
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

export function getUserPassword() {
  return axios.get<number>('/api/user/user_password');
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}
