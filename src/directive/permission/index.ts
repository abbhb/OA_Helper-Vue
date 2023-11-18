import { DirectiveBinding } from 'vue';
import {useUserStore} from "@/store";

function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
  const { value } = binding;
  const userStore = useUserStore();

  // 异步服务端校验是否有该权限
  if (value) {
    // todo:为什么会调用两次接口
    if (value.length > 0) {
      const needPermission = value;
      if (!userStore.checkPermission(needPermission)) {
        if (el&&el.parentNode) {
          el.parentNode.removeChild(el);
        }
      }
    }
  } else {
    throw new Error(`need Permission! Like v-permission="sys:print:alldata"`);
  }
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
};
