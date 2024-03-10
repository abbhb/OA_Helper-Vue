import { createPinia } from 'pinia';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTabBarStore from './modules/tab-bar';
import modelerStore from './modules/modeler';

const pinia = createPinia();

export {useAppStore, useUserStore, useTabBarStore, modelerStore};
export default pinia;
