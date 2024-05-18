import {resolve} from 'path';
import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import svgLoader from 'vite-svg-loader';
import {createSvgIconsPlugin} from 'vite-plugin-svg-icons';

import configArcoStyleImportPlugin from './plugin/arcoStyleImport';

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    svgLoader({ svgoConfig: {} }),
    configArcoStyleImportPlugin(),
      createSvgIconsPlugin({
          iconDirs: [
              resolve(process.cwd(), 'src/components/FormDesigner/svg'),
              resolve(process.cwd(), 'src/components/BpmnJs/bpmn-icons'),
          ],
          symbolId: 'icon-[dir]-[name]',
      }),
  ],

  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, '../src'),
      },
      {
        find: 'assets',
        replacement: resolve(__dirname, '../src/assets'),
      },
      {
        find: 'vue-i18n',
        replacement: 'vue-i18n/dist/vue-i18n.cjs.js', // Resolve the i18n warning issue
      },
      {
        find: 'vue',
        replacement: 'vue/dist/vue.esm-bundler.js', // compile template
      },
        {
            find: 'vue-i18n',
            replacement: 'vue-i18n/dist/vue-i18n.cjs.js', // compile template
      },
    ],
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
  },
  define: {
    'process.env': {},
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${resolve(
            'src/assets/style/breakpoint.less'
          )}";`,
        },
        javascriptEnabled: true,
      },
        scss: {
            /* 自动引入全局scss文件 */
            additionalData:
                '@import "./src/components/FormDesigner/styles/global.scss";',
        },
    },
  },
    build: {
        chunkSizeWarningLimit: 1024,
        commonjsOptions: {
            include: /node_modules|lib/,
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    quill: ['quill'],
                    lodash: ['lodash'],
                    vlib: ['vue', 'vue-router', 'element-plus'],
                },
            },
        },
    },
    optimizeDeps: {
        include: ['@/../lib/vuedraggable/dist/vuedraggable.umd.js', 'quill'],
  },
  base: './',
});
