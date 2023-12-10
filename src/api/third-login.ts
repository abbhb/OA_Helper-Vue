import axios from 'axios';
import {LoginRes} from '@/api/user';

export interface ThirdCallbackResp extends LoginRes {
  thirdType?: string;
  newUser?: boolean;
  canLogin?: boolean;
  thirdSocialUid?: string;
  thirdName?: string;
  thirdAvatar?: string;
}

export interface ThirdFirstLoginReq {
  thirdType?: string;
  thirdSocialUid?: string;
  emailCode?: string;
  email?: string;
}

/**
 * 第三方oauth认证请求
 * @param type
 */
export function thirdLogin(type: string) {
  return axios.get<string>('/api/user/third_login', {
    params: {
      type,
    },
  });
}


/**
 * 第三方oauth认证回调
 * @param type
 * @param code
 */
export function uniCallback(type: string, code: string) {
  return axios.get<ThirdCallbackResp>('/api/user/uni_callback', {
    params: {
      type,
      code,
    },
  });
}

/**
 * 第三方oauth认证回调首次登录绑定
 * @param data
 */
export function uniFirstLogin(data: ThirdFirstLoginReq) {
  return axios.post<LoginRes>('/api/user/uni_first_login', data);
}
