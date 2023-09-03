import axios from 'axios';
import {RouteRecordNormalized} from 'vue-router';

export function getMenuList() {
    return axios.post<RouteRecordNormalized[]>('/api/menu/get');
}

/**
 * for admin
 */

export interface MenuManger {
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
    children?: MenuManger[];
}

export function menuList() {
    return axios.post<MenuManger[]>('/api/menu/list');
}

export function updateMenu(data: MenuManger) {
    return axios.put<string>('/api/menu/update', data);
}

export function addMenu(data: MenuManger) {
    return axios.post<string>('/api/menu/add', data);
}

export function deleteMenu(id: string) {
    return axios.delete<string>('/api/menu/delete', {
        params: {
            id,
        },
    });
}

