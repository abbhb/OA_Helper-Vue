import axios from 'axios';
import {MenuManger} from '@/api/menu';

export interface RoleManger {
  id?: string;
  roleName?: string;
  roleKey?: string;
  roleSort?: number;
  status?: number;
  createUser?: string;
  createTime?: string;
  updateUser?: string;
  updateTime?: string;
  menuMangerList?: MenuManger[];
  haveKey?: string[];
}

export interface Role {
  id?: string;
  roleName?: string;
  roleKey?: string;
  roleSort?: number;
}

export interface RoleRoot {
  mangers?: RoleManger[];
  menuMangerList?: MenuManger[];
}

export function roleList() {
  return axios.post<RoleRoot>('/api/role/list');
}

export function roleTagList() {
  return axios.get<Role[]>('/api/role/list-tag');
}

export function updaterole(data: RoleManger) {
  return axios.put<string>('/api/role/update', data);
}

export function addrole(data: RoleManger) {
  return axios.post<string>('/api/role/add', data);
}

export function deleterole(id: string) {
  return axios.delete<string>('/api/role/delete', {
    params: {
      id,
    },
  });
}
