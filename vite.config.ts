import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsConfigPaths from 'vite-tsconfig-paths';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  build: {
    rollupOptions: {
      external: (id) => {
        // Externalize solid-js dependencies for devtools
        if (id.includes('solid-js')) return true;
        return false;
      },
    },
  },
});
