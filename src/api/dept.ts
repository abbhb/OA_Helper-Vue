import axios from 'axios';
import {Role} from '@/api/role';
import {PageData} from "@/api/common";

export interface DeptManger {
  id?: string;
  parentId?: string;
  status?: number;
  leader?: string;
  deptName?: string;
  orderNum?: number;
  phone?: string;
  email?: string;
  createUser?: string;
  createUserName?: string;
  createTime?: string;
  updateUser?: string;
  updateUserName?: string;
  updateTime?: string;
  roles?: Role[];
  children?: DeptManger[];
}

export function deptList() {
  return axios.post<DeptManger[]>('/api/dept/list');
}

export function deptListForBPM(params: {
    pageNum: number,
    pageSize: number,
    name?: string
}) {
    return axios.get<PageData<DeptManger[]>>('/api/dept/listForBPM', {
        params
    });
}

export function deptListTree() {
    return axios.get<DeptManger[]>('/api/dept/list-only-tree');
}

export function updateDept(data: DeptManger) {
  return axios.put<string>('/api/dept/update', data);
}

export function addDept(data: DeptManger) {
  return axios.post<string>('/api/dept/add', data);
}

export function deleteDept(id: string) {
  return axios.delete<string>('/api/dept/delete', {
    params: {
      id,
    },
  });
}
