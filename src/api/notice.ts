import axios from 'axios';
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

export interface NoticeAddResp {
  notice: Notice;
  noticeDepts: NoticeDept[];
}

export interface NoticeViewResp {
    notice: Notice;
    noticeDepts?: NoticeDept[];
    noticeAnnexes?: NoticeAnnex[]
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

export function viewNotice(
    noticeId: string
) {
    return axios.get<NoticeViewResp>(
        `/api/notice/view/edit/${noticeId}`,
    );
}
