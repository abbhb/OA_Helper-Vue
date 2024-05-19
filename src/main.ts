import {createApp} from 'vue';
import '@/utils/chat/websocket';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import 'md-editor-v3/lib/style.css';

// import '@arco-themes/vue-qc-snow-onlyself/index.less';
// 官方主题
import '@arco-design/web-vue/dist/arco.css';
import globalComponents from '@/components';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import ElementPlus from 'element-plus';
// 会发现这样不行
// if (!isT()) {
//   const app = createApp(BrowserOld);
//   app.mount('#app');
// }
// eslint-disable-next-line import/order
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import * as ElementPlusIcons from '@element-plus/icons-vue'
import 'virtual:svg-icons-register'
import formCreate from '@form-create/element-ui';
import FcDesigner from '@form-create/designer';

// eslint-disable-next-line import/order
import useServerConfigStore from './store/modules/server-config';
// eslint-disable-next-line import/order
import router from './router';
// eslint-disable-next-line import/order
import store from './store';
// eslint-disable-next-line import/order
import i18n from './locale';
// eslint-disable-next-line import/order
import directive from './directive';
import './mock';
import 'highlight.js/styles/atom-one-dark.css'; // 样式
import './assets/style/global.less';

// eslint-disable-next-line import/order
import App from './App.vue';
// Styles are imported via arco-plugin. See config/plugin/arcoStyleImport.ts in the directory for details
// 样式通过 arco-plugin 插件导入。详见目录文件 config/plugin/arcoStyleImport.ts
// https://arco.design/docs/designlab/use-theme-package
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css';
import '@/api/interceptor';

import 'element-plus/dist/index.css';

// vfrom相关依赖引入---------------------------------------------
import "@/components/FormDesigner/styles/index.scss";
// eslint-disable-next-line import/extensions
import Draggable from "@/../lib/vuedraggable/dist/vuedraggable.umd.js";
import {registerIcon} from "@/components/FormDesigner/utils/el-icons";

import ContainerWidgets from "@/components/FormDesigner/form-widget/container-widget/index";
import ContainerItems from "@/components/FormDesigner/form-render/container-item/index";

import {addDirective} from "@/components/FormDesigner/utils/directive";
import {installI18n} from "@/components/FormDesigner/utils/i18n";
import {loadExtension} from "@/components/FormDesigner/extension/extension-loader";
// bpmn.js 相关-------------------------------------------------
import "@/components/BpmnJs/styles/index.scss";
import "element-plus/theme-chalk/display.css";
import "element-plus/theme-chalk/index.css";
import 'virtual:svg-icons-register'

const app = createApp(App);

Object.keys(ElementPlusIcons).forEach((iconName) => {
  app.component(
      iconName,
      ElementPlusIcons[iconName as keyof typeof ElementPlusIcons]
  );
});
app.component("draggable", Draggable);
registerIcon(app);
addDirective(app);
installI18n(app);
app.use(ContainerWidgets);
app.use(ContainerItems);
loadExtension(app);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ArcoVue, {});
app.use(ArcoVueIcon);
app.use(router);
// 持久化插件
app.use(store.use(piniaPluginPersistedstate));
app.use(store);
app.use(i18n);
app.use(globalComponents);
app.use(directive);
app.use(ElementPlus);

app.use(formCreate);
app.use(FcDesigner);
app.mount('#app');

// 初始化加密
const serverConfigStore = useServerConfigStore();
serverConfigStore.initDate();
