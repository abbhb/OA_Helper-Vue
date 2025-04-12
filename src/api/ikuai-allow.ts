import axios from 'axios';
import {PageData} from "@/api/common";

// 关联信息
export interface IkuaiAllowUser {
    id: string;
    linkId: string;
    linkName: string;
    linkType: number;
}

// Ikuai用户
export interface IkuaiAllowUserLinkReq {
    linkIds: string[];
    linkType: number;
}

export interface IkuaiAllowLinkQuery {
    pageNum?: number;
    pageSize?: number;
}


// 获取打印机用户列表 done
export function getIkuaiAllowLinks(params: IkuaiAllowLinkQuery) {
    return axios.get<PageData<IkuaiAllowUser[]>>('/api/ikuai_controller/link/list', {
        params,
    });
}
export function getIkuaiAllowLinkIds() {
    return axios.get<Map<number,string[]>>(
        '/api/ikuai_controller/link/id/list');
}

// 添加打印机用户 done
export function addIkuaiAllowLinks(data: IkuaiAllowUserLinkReq) {
    return axios.post<string>('/api/ikuai_controller/link/add', data);
}

// 移除打印机用户 userId可以，分隔(批量移除) done
export function removeIkuaiAllowLink(linkId: string
    ,linkType :number) {
    return axios.delete<string>('/api/ikuai_controller/link/remove', {
        params: {
            linkId,
            linkType,
        },
    });
}