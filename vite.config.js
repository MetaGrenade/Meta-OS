import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: './',            // ← critical for NUI
  plugins: [vue()],
  build: {
    outDir: '../resources/desktop_ui/html',
    emptyOutDir: true,
  }
})
