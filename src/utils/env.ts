export const debug = import.meta.env.MODE !== 'production';

// todo:dns寄了会导致各种bug，需要优化为后端存储桶之后的路径比如，aistudio/a.jpg,就直接存jpg，前端去做拼接或者请求某个接口，转换成url
/**
 * 修复dev模式下异常
 * 不建议使用!!
 */
export const getImageBase = () => {
  if (debug) {
    return import.meta.env.VITE_Image_BASE_URL;
  }
  return window.location.host
      ? `http://${window.location.host}/oss/`
      : import.meta.env.VITE_Image_BASE_URL;
};

export const getWSBase = () => {
  if (debug) {
    return import.meta.env.VITE_WS_BASE_URL;
  }
  // eslint-disable-next-line no-restricted-globals
  if (typeof self !== 'undefined' && typeof self.postMessage === 'function') {
    // 在Worker环境下
    // eslint-disable-next-line no-restricted-globals
    return self.location.host
        ? // eslint-disable-next-line no-restricted-globals
        `ws://${self.location.host}/websocket`
        : import.meta.env.VITE_WS_BASE_URL;
  }
  // 在主线程环境下
  return window.location.host
      ? // eslint-disable-next-line no-restricted-globals
      `ws://${window.location.host}/websocket`
      : import.meta.env.VITE_WS_BASE_URL;
};

export const getAPIBase = () => {
  if (debug) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  return window.location.host
      ? `http://${window.location.host}`
      : import.meta.env.VITE_API_BASE_URL;
};
