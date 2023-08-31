import {App} from 'vue';
import roles from './roles';

export default {
  install(Vue: App) {
    Vue.directive('roles', roles);
  },
};
