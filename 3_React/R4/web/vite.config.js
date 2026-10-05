import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// En desarrollo, /api va a la API de ../api (npm run dev en esa carpeta).
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { '/api': 'http://localhost:3000' },
  },
})
