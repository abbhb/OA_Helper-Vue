import axios from 'axios';

export interface RegisterEmailRes {
  password: string;
  emailCode: string;
  email: string;
}
export interface RegisterResp {
  token: string;
}

export function getEmailCode(params: { email: string; vail_code?: string }) {
  return axios.get<string>('/api/user/get_email_code', { params });
}

export function registerByEmail(data: RegisterEmailRes) {
  return axios.post<RegisterResp>('/api/user/register_email', data);
}
export default { getEmailCode };
