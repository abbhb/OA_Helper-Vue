import axios from 'axios';

export interface PageData<T> {
    countId: string;
    current: string;
    pages: string;
    records: T;
    size: string;
    MaxLimit: string;
    total: string;
}

export function getPublicKey() {
    return axios.get<string>('/api/common/get_public_key');
}
