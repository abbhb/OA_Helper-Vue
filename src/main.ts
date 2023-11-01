import { createApp } from 'vue';
import '@/utils/chat/websocket';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-themes/vue-gi-demo/index.less';
// 官方主题 import '@arco-design/web-vue/dist/arco.css';
import globalComponents from '@/components';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import useRSAStore from '@/store/modules/rsa';
import router from './router';
import store from './store';
import i18n from './locale';
import directive from './directive';
import './mock';
import 'highlight.js/styles/atom-one-dark.css'; // 样式
import App from './App.vue';
// Styles are imported via arco-plugin. See config/plugin/arcoStyleImport.ts in the directory for details
// 样式通过 arco-plugin 插件导入。详见目录文件 config/plugin/arcoStyleImport.ts
// https://arco.design/docs/designlab/use-theme-package
import '@/assets/style/global.less';
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css';
import '@/api/interceptor';

// 会发现这样不行
// if (!isT()) {
//   const app = createApp(BrowserOld);
//   app.mount('#app');
// }
const app = createApp(App);

app.use(ArcoVue, {});
app.use(ArcoVueIcon);
app.use(router);
// 持久化插件
app.use(store.use(piniaPluginPersistedstate));

app.use(store);
app.use(i18n);
app.use(globalComponents);
app.use(directive);

app.mount('#app');

// 初始化加密
const rsaState = useRSAStore();
if (!rsaState.getPublicKey) {
  rsaState.updateRSA();
}
