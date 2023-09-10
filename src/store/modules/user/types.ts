import {Role} from "@/api/role";

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
  deptId?: string;
  deptName?: string;
  roles?: Role[];
}
