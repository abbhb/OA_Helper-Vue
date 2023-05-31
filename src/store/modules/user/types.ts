export type PermissionType = 1 | 2 | 3 | 10;
export type StatusType = 1 | 0;
export interface UserState {
  name?: string;
  avatar?: string;
  username?: string;
  id?: number;
  email?: string;
  sex?: string;
  status?: StatusType;
  phone?: string;
  createTime?: string;
  updateTime?: string;
  studentId?: string;
  permission?: PermissionType;
  permissionName?: string;
}
