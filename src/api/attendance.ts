import axios from 'axios';
import {PageData} from "@/api/common";

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
