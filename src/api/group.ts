import axios from 'axios';
import {ClockSelfDTO} from '@/api/keeptime';
import {PageData} from "@/api/common";

interface GroupUser {
    id: string;
    groupId: string;
    userId: string;
    userName: string;
    studentId: string;
    sex: string;
}

interface GroupUserFront {
    id: string;
    name: string;
    count: number; // 多少个用户
    createUserName: string;
    createTime: string;
    groupUserVOList: GroupUser[];
}

export default function getGroupUser(pageNum: number, pageSize: number, name?: string) {
    return axios.get<PageData<GroupUserFront[]>>('/api/group/queryGroup', {
        params: {
            pageNum,
            pageSize,
            name,
        },
    });
}
