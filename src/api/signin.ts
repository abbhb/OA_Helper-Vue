import axios from 'axios';

export interface BcRule {
  count?: number;
  sbTime?: string;
  sbStartTime?: number;
  sbEndTime?: number;
  xbTime?: string;
  xbStartTime?: number;
  xbEndTime?: number;
  ciRi?: number;
}

export interface SigninBc {
  id?: string;
  name?: string;
  everyDay?: number;
  bak?: number;
  rules?: BcRule[];
}

export interface SigninGroup {
  id?: string;
  name?: string;
  isRev?: number;
}

export interface SigninWay {
  type?: string;
  deviceId?: string;
}

export interface KQSJRule {
  xq?: string;
  bcId?: string;
}

export interface RulesInfo {
  userIds?: string[];
  signinType?: number;
  signinWays?: SigninWay[];
  kqsj?: KQSJRule[];
}

export interface SigninGroupRule {
  id?: string;
  rev?: number;
  startTime?: string;
  endTime?: string;
  rulesInfo?: RulesInfo;
  groupId?: string;
}

export interface SigninGroupDto {
  signinGroup?: SigninGroup;
  signinGroupRule?: SigninGroupRule;
  onlyBasic?: boolean;
}

export interface SigninDeviceDto {
  deviceId?: string;
  name?: string;
  secret?: string;
  remark?: string;
  online?: boolean;
  address?: string;
  port?: number;
  support?: string;
}

/** 获取班次信息 */
export function listBcRule() {
  return axios.get<SigninBc[]>('/api/signin_bc/list');
}

export function signinDeviceList() {
  return axios.get<SigninDeviceDto[]>('/api/signin_device/list');
}

/** 获取考勤组信息 */
export function listGroupRule() {
  return axios.get<SigninGroupDto[]>('/api/signin_group/list');
}

export function deleteGroupRule(id: string) {
  return axios.delete<string>('/api/signin_group/delete', {
    params: {
      id
    }
  });
}

/** 添加考勤组信息 */
export function addGroupRule(data: SigninGroupDto) {
  return axios.post<string>('/api/signin_group/add', data);
}

export function updateGroupRule(data: SigninGroupDto) {
  return axios.put<string>('/api/signin_group/update', data);
}

/** 删除班次信息 */
export function deleteBcRule(id: string) {
  return axios.delete<string>('/api/signin_bc/delete', {
    params: {
      id
    }
  });
}

/** 新增班次 */
export function addBc(data: SigninBc) {
  return axios.post<string>('/api/signin_bc/add', data);
}

export function editBc(data: SigninBc) {
  return axios.put<string>('/api/signin_bc/update', data);
}
