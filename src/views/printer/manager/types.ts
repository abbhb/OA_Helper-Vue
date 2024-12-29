export interface PrintDevice {
  id: number;
  deviceId: string;
  deviceName: string;
  deviceDescription: string;
  createTime: string;
  createUserName: string;
  ownerName: string;
  status: number;
  userRole?: number;
}

export enum PrintDeviceRole {
  OWNER = 1,
  MANAGER = 2,
  USER = 3,
}
