export type StatusType = 1 | 0;

interface Role {
  id?: string;
  name?: string;
  key?: string;
  sort?: number;
}


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
