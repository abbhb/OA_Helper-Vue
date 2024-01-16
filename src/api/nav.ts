import axios from 'axios';


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

/**
 * 导航页获取list
 * @param type
 */
export function navList() {
    return axios.get<QuickNavigationResult[]>('/api/quicknavigation/list');
}


export function navGetPage(type: string) {
    return axios.get<string>('/api/user/third_login', {
        params: {
            type,
        },
    });
}


