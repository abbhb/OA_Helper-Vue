import {DirectiveBinding} from 'vue';
import {useUserStore} from '@/store';

function checkRoles(el: HTMLElement, binding: DirectiveBinding) {
  const { value } = binding;
  const userStore = useUserStore();
  const {roles} = userStore;
  const roleKeyList = [];
  roles.forEach((item) => {
    roleKeyList.push(item.key);
  });
  if (Array.isArray(value)) {
    if (value.length > 0) {
      const needRoles = value;
      const hasPermission =
          needRoles.length + roles.length !==
          Array.from(new Set([...needRoles, ...roleKeyList])).length;
      if (!hasPermission && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }
  } else {
    throw new Error(`need roles! Like v-roles="['superadmin']"`);
  }
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkRoles(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkRoles(el, binding);
  },
};
