import axios from 'axios';
import {PageData} from '@/api/common';

export interface GroupUser {
  id?: string;
  groupId?: string;
  userId: string;
  userName?: string;
  studentId?: string;
  sex?: string;
}

export interface Group {
  id?: string;
  name?: string;
  createUser?: string;
  createTime?: string;
}

interface GroupAndUserVO extends Group {
  groupUserList?: GroupUser[];
}

export interface GroupUserFront {
  id: string;
  name: string;
  count: number; // 多少个用户
  createUserName: string;
  createTime: string;
  groupUserVOList: GroupUser[];
}

interface GroupTreeNode {
  title: string;
  key: string;
}

interface GroupTree {
  title: string;
  key: string;
  children: GroupTreeNode[];
}

export interface Duplicate {
  isDuplicate: boolean;
  why: string;
  suggestion: string[];
}

export function getGroupUser(pageNum: number, pageSize: number, name?: string) {
  return axios.get<PageData<GroupUserFront[]>>('/api/group/queryGroup', {
    params: {
      pageNum,
      pageSize,
      name,
    },
  });
}

export function isDuplicate(name?: string) {
  return axios.get<Duplicate>('/api/group/is_duplicate', {
    params: {
      name,
    },
  });
}

export function getCanBeAdd(groupId?: string) {
  return axios.get<GroupTree[]>('/api/group/get_can_be_add', {
    params: {
      groupId,
    },
  });
}

export function queryGroupSelectList() {
  return axios.get<Group[]>('/api/group/queryGroupSelectList');
}

export function addGroup(data: GroupAndUserVO) {
  return axios.post<string>('/api/group/addGroup', data);
}

export function updateGroup(data: GroupAndUserVO) {
  return axios.put<string>('/api/group/updateGroup', data);
}

export function deleteGroup(data: GroupAndUserVO) {
  return axios.post<string>('/api/group/deleteGroup', data);
}

export function forceDeleteGroup(data: GroupAndUserVO) {
  return axios.post<string>('/api/group/forceDeleteGroup', data);
}
