import {App} from 'vue';
import roles from './roles';
import isAuth from './isAuth';

export default {
  install(Vue: App) {
    Vue.directive('roles', roles);
    Vue.directive('isAuth', isAuth);
  },
};
