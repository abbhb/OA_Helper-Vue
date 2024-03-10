import axios from 'axios';
import {PageData} from "@/api/common";
import {HttpResponse} from "@/api/interceptor";
import {AgreeLoginReq, AgreeLoginResp} from "@/api/oauth";


interface DefinitionListVo {
    id?: string;
    deploymentId?: string;
    name?: string;
    key?: string;
    version?: number;
    formJson?: any;
    isSuspended?: boolean;
    deploymentTime?: any;

}

export function getDefinitionXml(deploymentId?: any) {
    return axios.get<string>('/api/processDefinition/getDefinitionXml', {
        params: {
            deploymentId,
        },
    });
}

export function updateProcessDefinitionState(deploymentId?: any) {
    return axios.get<string>('/api/processDefinition/updateState', {
        params: {
            deploymentId,
        },
    });
}

export function listenerList(params?: any) {
    return axios.get<PageData<any[]>>('/api/listener/list', {
        params
    });
}


export function tableList() {
    return axios.get<any[]>('/api/table/list');
}

export function tableColumns(tableName: string) {
    return axios.get<any[]>('/api/table/tableColumns', {
        params: {
            tableName
        }
    });
}


export function getHistoryRecord(instanceId?: any) {
    return axios.get<any[]>('/api/processStart/getHistoryRecord', {
        params: {
            instanceId,
        },
    });
}

export function getHighlightNodeInfo(instanceId?: any) {
    return axios.get<any[]>('/api/processStart/getHighlightNodeInfo', {
        params: {
            instanceId,
        },
    });
}

export function getMainFormInfo(instanceId?: any) {
    return axios.get<any>('/api/processStart/getMainFormInfo', {
        params: {
            instanceId,
        },
    });
}

export function getWidgetDataType() {
    return axios.get<any>('/api/table/getWidgetDataType');
}

export function getDefinitionInfo(deploymentId: any) {
    return axios.get<Map<string, any>>('/api/processDefinition/getDefinitionInfo', {
        params: {
            deploymentId
        }
    });
}

export function deleteProcessDefinition(deploymentId?: any) {
    return axios.delete<string>('/api/processDefinition/delete', {
        params: {
            deploymentId,
        },
    });
}

export function deleteProcessStart(instanceId?: any) {
    return axios.delete<string>('/api/processStart/delete', {
        params: {
            instanceId,
        },
    });
}

export function processDefinitionList(params?: any) {
    return axios.get<PageData<DefinitionListVo[]>>('/api/processDefinition/list', {
        params,
    });
}

export function processStartList(params?: any) {
    return axios.get<PageData<any[]>>('/api/processStart/list', {
        params,
    });
}

export function processTodoList(params?: any) {
    return axios.get<PageData<any[]>>('/api/processTodo/list', {
        params,
    });
}

export function getNodeForm(taskId?: any) {
    return axios.get<any>(`/api/processTodo/getNodeForm/${taskId}`);
}

export function deployProcess(data: any) {
    return axios.post<string>('/api/processDefinition/deployProcess', data);
}

export function completeProcessTodo(data: any) {
    return axios.post<string>('/api/processTodo/complete', data);
}


export function startProcessStart(data: any) {
    return axios.post<string>('/api/processStart/start', data);
}


