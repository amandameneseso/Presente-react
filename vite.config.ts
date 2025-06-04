import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Para funcionar corretamente no GitHub Pages
  build: {
    outDir: 'docs', // Diretório de saída para GitHub Pages
    emptyOutDir: true,
    sourcemap: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
