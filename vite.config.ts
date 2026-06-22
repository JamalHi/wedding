import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  base: '/wedding/',
  optimizeDeps: {
    include: ['framer-motion', 'gsap', 'lucide-react'],
  },
  resolve: {
    dedupe: ['framer-motion'],
  },
})
