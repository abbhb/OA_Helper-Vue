import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { Message } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import { getToken } from '@/utils/auth';
import { notifyMe } from '@/utils/notify';
import router from '@/router';
import { WHITE_LIST } from '@/router/constants';
import { getAPIBase } from '@/utils/env';

export interface HttpResponse<T = unknown> {
  msg: string;
  code: number;
  data: T;
}

if (getAPIBase()) {
  axios.defaults.baseURL = getAPIBase();
}

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // let each request carry token
    // this example using the JWT token
    // Authorization is a custom headers key
    // please modify it according to the actual situation
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    notifyMe('异常', error);
    // do something
    return Promise.reject(error);
  }
);
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 1) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      const whiles = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const whitelistElement of WHITE_LIST) {
        whiles.push(whitelistElement.name);
      }
      if (
        [900].includes(res.code) &&
        !response.config.url.includes('/api/user/login_by_token') &&
        !whiles.includes(router.currentRoute.value.name)
      ) {
        Message.success({
          content: res.msg || '下线成功',
          duration: 5 * 1000,
        });
        useUserStore().logoutCallBack();
        router.push({ name: 'login' });
        return res;
      }
      if (
          !response.config.url.startsWith('/api/room') &&
          !response.config.url.startsWith('/api/chat')
      ) {
        Message.error({
          content: res.msg || 'Error',
          duration: 2 * 1000,
        });
      }


      return Promise.reject(new Error(res.msg || 'Error'));
    }
    return res;
  },
  (error) => {
    notifyMe('异常', error);
    Message.error({
      content: error.msg || 'Request Error',
      duration:2 * 1000,
    });
    return Promise.reject(error);
  }
);
