import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    {
      // Custom plugin to force Vite to treat .js files as JSX before Rollup sees them
      name: 'treat-js-as-jsx',
      enforce: 'pre',
      async transform(code, id) {
        if (/\/src\/.*\.js$/.test(id) && !id.includes('node_modules')) {
          const { transformWithEsbuild } = await import('vite');
          const result = await transformWithEsbuild(code, id, {
            loader: 'jsx',
            jsx: 'automatic',
          });
          return result;
        }
      },
    },
    react(),
  ],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
  },
});
