import axios from 'axios';

export interface DeptManger {
    id?: string;
    name?: string;
    locale?: string;
    parentId?: string;
    sort?: number;
    path?: string;
    isFrame?: number;
    isCache?: number;
    type?: string;
    isShow?: number;
    status?: number;
    perms?: string;
    icon?: string;
    createUser?: string;
    createUserName?: string;
    createTime?: string;
    updateUser?: string;
    updateUserName?: string;
    updateTime?: string;
    children?: DeptManger[];
}

export function deptList() {
    return axios.post<DeptManger[]>('/api/dept/list');
}

export function updateDept(data: DeptManger) {
    return axios.put<string>('/api/dept/update', data);
}

export function addDept(data: DeptManger) {
    return axios.post<string>('/api/dept/add', data);
}

export function deleteDept(id: string) {
    return axios.delete<string>('/api/dept/delete', {
        params: {
            id,
        },
    });
}
