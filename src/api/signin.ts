import axios from 'axios';
import {UserInfo, UserManger} from "@/api/user";
import {PageData} from "@/api/common";
import {SigninLogCliBcDto} from "@/api/attendance";

export interface SigninGroupDateUserDto {
  userId?:string;
  name?:string;
  deptId?:string;
  deptName?:string;
  bcCount?:number;
  state?:number;
  logList?:SigninLogCliBcDto[];

}

export interface SigninGroupDateResp {
  atendanceRequired?:boolean; // 今日是否需要考勤
  numberOfPeopleSupposedToCome?:number;// 应该出勤人数
  numberOfFullAttendance?:number;// numberOfFullAttendance
  numberOfError?:number;// 出勤异常人数
  userErrorLogList?:SigninGroupDateUserDto[];// 异常拷贝一份
  userLogList?:SigninGroupDateUserDto[];// 用户详细情况
}

export interface Holidays {
  id?:string;
  signinGroupId?:string;
  dateD?:string;
  name?:string;
  workingDay?:number;
}




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
export interface SigninDataResp extends UserInfo {
  existFace?: boolean;
  updateTime?: string;
  existCard?: boolean;
  cardId?: string;
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

export function getDataMangerList(params: {
  pageNum: number;
  pageSize: number;
  name?: string;
  deptId?: string;
  cascade: number;
}) {
  return axios.get<PageData<SigninDataResp[]>>('/api/signin_user_data/data_manger', { params });
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

export function exportSigninUserData() {
  return axios.post<string>('/api/signin_user_data/export');
}

/**
 * 此方法使用了el-upload所以空缺
 * @param file
 * @param updateSupport
 */
export function importSigninUserData(file,updateSupport:boolean) {
  return axios.post<string>('/api/signin_user_data/importData',file,{
    params:{
      updateSupport
    }
  });
}
export function getImportTemplate() {
  return axios.get<string>('/api/signin_user_data/importTemplate');
}


export function listHolidays(groupId,startDate,endDate) {
  return axios.get<Holidays[]>('/api/signin_group/list_holidays/' + groupId, {
    params:{
      startDate,
      endDate
    }
  });
}

export function deleteHolidays(groupId,id) {
  return axios.delete<string>('/api/signin_group/delete_holidays/' + groupId+"/"+id);
}

export function updateHolidays(groupId, data: Holidays) {
  return axios.post<string>('/api/signin_group/update_holidays/'+ groupId,data);
}



export function getSigninGroupDate(groupId:string,date:string) {
  return axios.get<SigninGroupDateResp>('/api/signin_log/export_signin_group_date',{
    params:{
      groupId,
      date
    }
  });
}

export function getMyGroupId() {
  return axios.get<string>('/api/signin_log/get_my_group_id');
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
