import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    host: 'localhost',
    strictPort: false,
    open: false,
    fs: {
      // Allow serving files from one level up (the project's sibling `ai` folder)
      allow: [path.resolve(__dirname, '..')]
    }
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false
  },
  define: {
    'process.env': {}
  },
  optimizeDeps: {
    include: ['@tensorflow/tfjs-backend-webgl', '@tensorflow-models/mobilenet', 'pdfjs-dist']
  }
})
