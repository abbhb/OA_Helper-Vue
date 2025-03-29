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

/**
 * 打卡信息响应接口
 */
export interface SigninDetailSigninInfoResp {
  /**
   * 排序
   */
  index: number;
  /**
   * 应打卡时间 例如：2024-03-16 12:00:00
   */
  scheduledPunchTime: string;
  /**
   * 实打卡时间 例如：2024-03-16 12:00:00
   */
  actualPunchTime: string;
  /**
   * 缺勤时长 例如：40分钟
   */
  absentDuration: string;
  /**
   * 考勤状态 例如：正常、迟到、早退、缺勤
   */
  attendanceStatus: string;
  /**
   * 补签点 例如：2024-03-16 12:00:00
   */
  supplementPoint: string;
  /**
   * 补签状态 例如：待审批、已通过、已拒绝
   */
  supplementStatus: string;
  /**
   * 补签理由 例如：迟到、早退、漏打卡
   */
  supplementReason: string;
  /**
   * 补签申请时间
   */
  supplementApplyTime: string;
  /**
   * 补签审批时间
   */
  supplementApprovalTime: string;
}

/**
 * 获取某日考勤打卡信息
 * @param userId 用户ID
 * @param date 日期，格式为 2024-03-16
 * @returns 打卡信息列表
 */
export function getSigninDetailSigninInfos(userId: string, date: string) {
  return axios.get<SigninDetailSigninInfoResp[]>(
    `/api/signin_detail/get_signin_detail_signin_infos/${userId}`,
    {
      params: { date },
    }
  );
}
