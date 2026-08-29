import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  // '/' للنشر على نطاق مستقل (Vercel/Netlify) — يُستبدل بـ /wedding/ عند النشر لـ GitHub Pages عبر npm run deploy
  base: '/',
  optimizeDeps: {
    include: ['framer-motion', 'gsap', 'lucide-react'],
  },
  resolve: {
    dedupe: ['framer-motion'],
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
})
