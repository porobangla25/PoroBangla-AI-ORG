import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // This maps process.env.API_KEY in your code to the VITE_GEMINI_API_KEY value
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
    },
    build: {
      target: 'ES2020',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-ui': ['lucide-react', 'katex'],
            'vendor-google': ['@google/genai'],
          },
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
      chunkSizeWarningLimit: 1000,
      sourcemap: false,
      cssCodeSplit: true,
    },
    optimizeDeps: {
      include: ['react', 'react-dom', '@google/genai', 'lucide-react', 'katex'],
    },
  };
});
