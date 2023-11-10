import axios from 'axios';

export interface Captcha {
  nonce_str?: string;
  value?: string;
  canvas_src?: string;
  canvas_width?: string;
  canvas_height?: string;
  block_src?: string;
  block_width?: string;
  block_height?: string;
  block_radius?: string;
  block_x?: string;
  block_y?: string;
  place?: string;
}

export function getCodeImg(data: Captcha) {
  return axios.post<Captcha>('/api/vail_code/get_captcha', data);
}

/**
 * 返回code
 * @param data
 */
export function checkCaptchaCode(data: Captcha) {
  return axios.post<string>('/api/vail_code/check_captcha_code', data);
}
