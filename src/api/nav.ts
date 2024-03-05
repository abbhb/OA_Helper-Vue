import axios from 'axios';
import {PageData} from '@/api/common';
import {DeptManger} from '@/api/dept';

export interface QuickNavigationItemResult {
    id?: string;
    name?: string;
    path?: string;
    image?: string;
    introduction?: string;
    categorizeId?: string;
    categorizeName?: string;
    /**
     * 0:url
     * 1:md
     */
    type?: number;
    content?: string;
}

export interface QuickNavigationResult {
    id?: string;
    name?: string;
    item?: QuickNavigationItemResult[];
}

export interface QuickNavigationCategorizeResult {
    id?: string;
    name?: string;
    visibility?: number;
    depts?: DeptManger[];
}


export interface selectOptionsResult {
    label?: string;
    value?: string;
}

/**
 * 导航页获取list
 * @param type
 */
export function navList() {
    return axios.get<QuickNavigationResult[]>('/api/quicknavigation/list');
}


export function navFenLeiList(pageNum, pageSize, name) {
    return axios.get<PageData<QuickNavigationCategorizeResult[]>>(
        '/api/quicknavigation/listnavfenlei',
        {
            params: {
                pageNum,
                pageSize,
                name,

            },
        }
    );
}

export function navItemList(pageNum, pageSize, name, selectCate) {
    return axios.get<PageData<QuickNavigationCategorizeResult[]>>(
        '/api/quicknavigation/listnavfenleiitem',
        {
            params: {
                pageNum,
                pageSize,
                name,
                selectCate
            },
        }
    );
}

export function getCategorizeSelectOptionsList() {
    return axios.get<selectOptionsResult[]>(
        '/api/quicknavigation/getCategorizeSelectOptionsList'
    );
}

export function addNavFenlei(forms) {
    return axios.post<string>(
        '/api/quicknavigation/createCategorize',
        {
            quickNavigationCategorize: {
                name: forms.name,
                visibility: forms.visibility,
            },
            visDeptIds: forms.depts,
        }
    );
}

export function addNavItem(forms) {
    return axios.post<string>(
        '/api/quicknavigation/createItem',
        forms
    );
}

export function updateNavFenlei(forms) {
    return axios.put<string>(
        '/api/quicknavigation/updataforquicknavigationcategorize',
        {
            quickNavigationCategorize: {
                name: forms.name,
                id: forms.id,
                visibility: forms.visibility,
            },
            visDeptIds: forms.depts,
        }
    );
}

export function updateNavItem(forms) {
    return axios.put<string>(
        '/api/quicknavigation/updataforquicknavigationitem', forms
    );
}

export function deleteCategorize(id) {
    return axios.delete<string>(
        '/api/quicknavigation/deleteCategorize',
        {
            params: {
                id
            }
        }
    );
}

export function deleteItem(id) {
    return axios.delete<string>(
        '/api/quicknavigation/deleteItem',
        {
            params: {
                id
            }
        }
    );
}

export function navGetPage(type: string) {
    return axios.get<string>('/api/user/third_login', {
        params: {
            type,
        },
    });
}
