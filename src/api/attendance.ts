import axios from 'axios';
import { PageData } from '@/api/common';

export interface SigninLogCliBcItem {
  timeY?: string;
  timeS?: string;
  state?: number;
  bq?: boolean;
  bqState?: number;
  bqTime?: string;
  queQingTime?: number;
}
export interface SigninLogCliBcDto {
  userId?: string;
  logDatetime?: string;
  state?: number;
  bcCount?: number;
  sbItem?: SigninLogCliBcItem;
  xbItem?: SigninLogCliBcItem;
}
export interface SigninLogForSelfResp {
  needSB?: boolean;
  currentDate: string;
  currentXQ: string;
  bcCount?: number;
  userId?: string;
  state?: number;
  errMsg?: string;
  bcDetail?: SigninLogCliBcDto[];
  firstTime?: string;
  endTime?: string;
  workingHours?: string;
  queQinTime?: string;
}

export interface IndexPageDataWithuserReq {
  pageNum: number;
  pageSize: number;
  state: number;
  start: string;
  end: string;
}
export function index_page_data_withuser(req: IndexPageDataWithuserReq) {
  return axios.get<PageData<SigninLogForSelfResp[]>>(
    '/api/signin_log/index_page_data_withuser',
    {
      params: req,
    }
  );
}

/**
 * 考勤用户基础信息响应接口
 */
export interface SigninDetailUserInfoResp {
  /**
   * 姓名
   */
  name: string;
  /**
   * 头像URL
   */
  avatar: string;
  /**
   * 部门
   */
  department: string;
}

/**
 * 获取考勤用户基础信息
 * @param userId 用户ID
 * @returns 用户基础信息
 */
export function getSigninDetailUserInfo(userId: string) {
  return axios.get<SigninDetailUserInfoResp>(
    `/api/signin_detail/get_user_info/${userId}`
  );
}

/**
 * 考勤日基础信息响应接口
 */
export interface SigninDetailDataResp {
  /**
   * 日期
   */
  date: string;
  /**
   * 工时
   */
  workingHours: string;
  /**
   * 签到状态
   */
  attendanceStatus: string;
  /**
   * 补签状态
   */
  supplementStatus: string;
  /**
   * 缺勤时长
   */
  durationOfAbsence: string;
  /**
   * 备注，例如请假[请假原因][时间段]
   */
  remarks: string;
}

/**
 * 获取某日考勤基础信息
 * @param userId 用户ID
 * @param date 日期，格式为 2024-03-16
 * @returns 某日考勤基础信息
 */
export function getSigninInfo(userId: string, date: string) {
  return axios.get<SigninDetailDataResp>(
    `/api/signin_detail/get_signin_info/${userId}`,
    {
      params: { date },
    }
  );
}
