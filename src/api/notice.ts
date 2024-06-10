import axios from 'axios';
import {PageData} from '@/api/common';

export interface Notice {
  id?: string;
  title?: string;
  content?: string;
  status?: number;
  type?: number;
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

export interface NoticeUserResp extends Notice {
  userRead?: boolean;
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

export interface NoticeAnnex {
  id?: string;
  noticeId?: string;
  sortNum?: number;
  fileUrl?: string;
  fileName?: string;
  downloadCount?: number;
  createTime?: string;
  createUser?: string;
}

/**
 * 预览通知返回对象
 */
export interface NoticeUserReadResp {
  notice?: Notice;
  noticeAnnexes?: NoticeAnnex[];
}


export interface NoticeAddResp {
  notice: Notice;
  noticeDepts: NoticeDept[];
}

export interface NoticeViewResp {
  notice: Notice;
  noticeDepts?: NoticeDept[];
  noticeAnnexes?: NoticeAnnex[];
}

export interface NoticeUpdateReq {
  notice: Notice;
  deptIds?: string[];
  annexes?: NoticeAnnex[];
}

export interface NoticeMangerListResp {
  id?: string;
  title?: string;
  status?: number;
  type?: number;
  amount?: number;
  content?: string;
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
  deptIds?: string[];
}

export function addNotice(data: NoticeAddReq) {
  return axios.post<NoticeAddResp>('/api/notice/add', data);
}

export function quickEditNotice(data: NoticeAddReq) {
  return axios.put<string>('/api/notice/quick_update', data);
}

export function updateNotice(data: NoticeUpdateReq) {
  return axios.put<string>('/api/notice/update', data);
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

export function viewNotice(noticeId: string) {
  return axios.get<NoticeViewResp>(`/api/notice/view/edit/${noticeId}`);
}

export function getViewNoticeList(
    urgency: number,
    pageNum: number,
    pageSize: number,
    deptId?: string,
) {
  return axios.get<PageData<NoticeUserResp[]>>(`/api/notice/list/${urgency}`, {
    params: {
      pageNum,
      pageSize,
      deptId,
    },
  });
}

export function deleteNotice(noticeId: string) {
  return axios.delete<string>(`/api/notice/delete/${noticeId}`);
}


export function getNoticeRead(
    noticeId: string,
    password?: string,
) {
  return axios.get<NoticeUserReadResp>(`/api/notice/read/${noticeId}`, {
    params: {
      password,
    },
  });
}

export function addNoticeReadLog(
    noticeId: string,
) {
  return axios.get<void>(`/api/notice/log/${noticeId}`);
}