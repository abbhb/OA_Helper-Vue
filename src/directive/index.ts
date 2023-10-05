import {App} from 'vue';
import isFrends from "@/directive/isFrends";
import highlight from "@/directive/highlight";
import roles from './roles';
import isAuth from './isAuth';

export default {
  install(Vue: App) {
    Vue.directive('roles', roles);
    Vue.directive('isAuth', isAuth);
    Vue.directive('isFrient', isFrends);
    Vue.directive('highlight', highlight);
  },
};
