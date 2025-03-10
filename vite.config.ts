import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import legacy from '@vitejs/plugin-legacy';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: '../resources/static',
    emptyOutDir: true,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 将 '@' 映射到 './src' 目录
    },
  },
  plugins: [
    react(),
    svgr({ svgrOptions: { icon: true } }),
    legacy({
      targets: ['firefox 62', 'safari 11', 'chrome 63'], //需要兼容的目标列表，可以设置多个
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      renderLegacyChunks: true,
      modernPolyfills: ['es/global-this'],
    }),
  ],
  base: './',
});
