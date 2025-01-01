import axios from 'axios';
import type { PrintDevice } from '@/views/printer/manager/types';
import {PageData} from "@/api/common";

// 打印机用户关联信息
export interface PrintDeviceUser {
  id: string;
  userId: string;
  username: string;
  printDeviceId: string;
  role: number;
}

// 打印机设备信息(包含当前用户角色)
export type PrintDeviceVO = PrintDevice

export interface PrintDeviceNotRegisterVO {
  id:string;
  name?: string;
  description?:string;
  status?:number;
}

// 创建打印机请求
export interface CreatePrintDeviceReq {
  deviceId: string; // 真的打印机设备id
  deviceSecret: string; // 密钥
}

// 更新打印机请求
export interface UpdatePrintDeviceReq {
  id: string;
  deviceName: string;
  deviceDescription?: string;
}

// 打印机用户权限请求
export interface PrintDeviceUserReq {
  printDeviceId: string; // 打印机行id
  userIds: string[];
  role: number;
}

// 转移所有权请求
export interface TransferOwnershipReq {
  printDeviceId: string;
  userId: string;
}

// 用户列表查询参数 role:0 all
export interface PrintDeviceUserQuery {
  printDeviceId: string;
  role?: number;
  pageNum?: number;
  pageSize?: number;
}



// 获取打印机列表
export function getPrintDeviceList() {
  return axios.get<PrintDeviceVO[]>('/api/print_device/list');
}

// 获取未注册的在线打印机 done
export function getUnRegisterPrintDeviceList() {
  return axios.get<PrintDeviceNotRegisterVO[]>(
    '/api/print_device/unregister/list'
  );
}

// 创建打印机 done
export function createPrintDevice(data: CreatePrintDeviceReq) {
  return axios.post<string>('/api/print_device/create', data);
}

// 更新打印机信息 暂不实现（信息会自动同步打印机）
export function updatePrintDevice(data: UpdatePrintDeviceReq) {
  return axios.put<string>('/api/print_device/update', data);
}

// 删除打印机 done
export function deletePrintDevice(id: string) {
  return axios.delete<string>('/api/print_device/delete', {
    params: { id },
  });
}

// 更新打印机状态 done
export function updatePrintDeviceStatus(id: string, status: number) {
  return axios.put<string>('/api/print_device/update_status', {
    id,
    status,
  });
}

// 获取打印机用户列表 done
export function getPrintDeviceUsers(params: PrintDeviceUserQuery) {
  return axios.get<PageData<PrintDeviceUser>>('/api/print_device/user/list', {
    params,
  });
}

// 添加打印机用户
export function addPrintDeviceUsers(data: PrintDeviceUserReq) {
  return axios.post<string>('/api/print_device/user/add', data);
}

// 移除打印机用户
export function removePrintDeviceUser(printDeviceId: string, userId: string) {
  return axios.delete<string>('/api/print_device/user/remove', {
    params: {
      printDeviceId,
      userId,
    },
  });
}

// 更新用户角色
export function updatePrintDeviceUserRole(data: PrintDeviceUserReq) {
  return axios.put<string>('/api/print_device/user/update_role', data);
}

// 转移打印机所有权
export function transferPrintDeviceOwnership(data: TransferOwnershipReq) {
  return axios.post<string>('/api/print_device/transfer_ownership', data);
}

// 获取打印机详情
export function getPrintDeviceDetail(id: string) {
  return axios.get<PrintDeviceVO>('/api/print_device/detail', {
    params: { id },
  });
}
