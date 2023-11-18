import { DirectiveBinding } from 'vue';
import { checkPermissionByServer } from '@/api/permission';

function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
  const { value } = binding;
  // 异步服务端校验是否有该权限

  if (value) {
    if (value.length > 0) {
      const needPermission = value;

      checkPermissionByServer({ permission: needPermission })
        .then((res) => {
          if (res.data !== 1) {
            if (el&&el.parentNode) {
              el.parentNode.removeChild(el);
            }
          }
        })
        .catch((e) => {
          if (el&&el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });
    }
  } else {
    throw new Error(`need Permission! Like v-permission="sys:print:alldata"`);
  }
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
};
