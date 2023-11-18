import axios from 'axios';

export function checkPermissionByServer(params: { permission: string }) {
  return axios.get<number>('/api/permission/check', {
    params,
  });
}

export default { checkPermissionByServer };
