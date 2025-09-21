import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { generateIndexPlugin } from './vite-plugin-generate-index.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), generateIndexPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: process.env.NODE_ENV === 'production' ? '/apple-global-price/' : '/',
})

