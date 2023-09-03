import axios from "axios";
import {RouteRecordNormalized} from "vue-router";

export function getMenuList() {
    return axios.post<RouteRecordNormalized[]>('/api/menu/menu');
}

export default getMenuList();