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

export interface SigninUserFaceDataReq {
  data?: SigninUserFaceDataResp[];
  syncModel?: string;
  deviceId?: string;
}
export interface SigninUserCardDataReq {
  data?: SigninUserCardDataResp[];
  syncModel?: string;
  deviceId?: string;
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

export interface SigninUserFaceDataResp {
  userId?: string;
  studentId?: string;
  name?: string;
  username?: string;
  deptName?: string;
  deptId?: string;
  localExist?: boolean;
  deviceExist?: boolean;
}
export interface SigninUserCardDataResp {
  userId?: string;
  studentId?: string;
  name?: string;
  username?: string;
  deptName?: string;
  deptId?: string;
  localExist?: boolean;
  deviceExist?: boolean;
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

export function signinCanBindDeviceList() {
  return axios.get<SigninDeviceDto[]>('/api/signin_device/list-online');
}

export function addSigninDevice(data?: SigninDeviceDto) {
  return axios.post<string>('/api/signin_device/add', data);
}

export function updateSigninDevice(data?: SigninDeviceDto) {
  return axios.put<string>('/api/signin_device/update', data);
}

export function deleteSigninDevice(deviceId: string) {
  return axios.delete<string>('/api/signin_device/delete', {
    params: {
      deviceId,
    },
  });
}

/** 获取考勤组信息 */
export function listGroupRule() {
  return axios.get<SigninGroupDto[]>('/api/signin_group/list');
}

export function get_signin_face_data(deviceId: string) {
  return axios.get<SigninUserFaceDataResp[]>(
    '/api/signin_user_data/get_signin_face_data',
    {
      params: {
        deviceId,
      },
    }
  );
}
export function get_signin_card_data(deviceId: string) {
  return axios.get<SigninUserCardDataResp[]>(
    '/api/signin_user_data/get_signin_card_data',
    {
      params: {
        deviceId,
      },
    }
  );
}

/** 同步人脸【上传方向】 */
export function uploadSigninFaceData(data: SigninUserFaceDataReq) {
  return axios.post<string>(
    '/api/signin_user_data/upload_signin_face_data',
    data
  );
}
/** 同步ID卡【上传方向】 */
export function uploadSigninCardData(data: SigninUserCardDataReq) {
  return axios.post<string>(
    '/api/signin_user_data/upload_signin_card_data',
    data
  );
}
/** 同步人脸【下载方向】 */
export function downloadSigninFaceData(data: SigninUserFaceDataReq) {
  return axios.post<string>(
    '/api/signin_user_data/download_signin_face_data',
    data
  );
}
/** 同步ID卡【下载方向】 */
export function downloadSigninCardData(data: SigninUserCardDataReq) {
  return axios.post<string>(
    '/api/signin_user_data/download_signin_card_data',
    data
  );
}

export function deleteGroupRule(id: string) {
  return axios.delete<string>('/api/signin_group/delete', {
    params: {
      id,
    },
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
      id,
    },
  });
}

/** 新增班次 */
export function addBc(data: SigninBc) {
  return axios.post<string>('/api/signin_bc/add', data);
}

export function editBc(data: SigninBc) {
  return axios.put<string>('/api/signin_bc/update', data);
}
