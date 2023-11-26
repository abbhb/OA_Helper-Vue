import axios from 'axios';
import { AgreeReq, AgreeResp, SysOauth } from '@/api/oauth';
import { PageData } from '@/api/common';

export interface Notice {
  id?: string;
  title?: string;
  content?: string;
  status?: number;
  amount?: number;
  isAnnex?: number;
  createTime?: string;
  updateTime?: string;
  createUser?: string;
  updateUser?: string;
  tag?: string;
  releaseUser?: string;
  releaseUserName?: string;
  releaseTime?: string;
  releaseDept?: string;
  releaseDeptName?: string;
  urgency?: number;
  version?: number;
  updateUserList?: string;
  visibility?: number;
}

export interface NoticeAddReq {
  notice: Notice;
  deptIds?: string[];
}
export interface NoticeDept {
  id?: string;
  noticeId?: string;
  deptId?: string;
  createTime?: string;
  createUser?: string;
}

export interface NoticeAddResp {
  notice: Notice;
  noticeDepts: NoticeDept[];
}

export interface NoticeMangerListResp {
  id?: string;
  title?: string;
  status?: number;
  amount?: number;
  isAnnex?: number;
  createTime?: string;
  updateTime?: string;
  createUserName?: string;
  updateUserName?: string;
  tag?: string;
  releaseUserName?: string;
  releaseTime?: string;
  releaseDeptName?: string;
  urgency?: number;
  version?: number;
  visibility?: number;
}

export function addNotice(data: NoticeAddReq) {
  return axios.post<NoticeAddResp>('/api/notice/add', data);
}

export function publishNoticeList(
  type: number,
  pageNum: number,
  pageSize: number,
  status?: number,
  search?: string,
  searchType?: number
) {
  return axios.get<PageData<NoticeMangerListResp[]>>(
    '/api/notice/publish_list',
    {
      params: {
        type,
        pageNum,
        pageSize,
        status,
        search,
        searchType,
      },
    }
  );
}
