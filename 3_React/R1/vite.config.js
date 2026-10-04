import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  // Uso una sola copia de React aunque tateti tenga su propio node_modules.
  resolve: { dedupe: ['react', 'react-dom'] },
  build: {
    rolldownOptions: {
      input: {
        inicio: path.resolve(root, 'index.html'),
        ejercicio1: path.resolve(root, 'Ejercicio1/index.html'),
        ejercicio2: path.resolve(root, 'Ejercicio2/index.html'),
        ejercicio3: path.resolve(root, 'Ejercicio3/index.html'),
        ejercicio4: path.resolve(root, 'Ejercicio4/index.html'),
        ejercicio5: path.resolve(root, 'Ejercicio5/index.html'),
        tateti: path.resolve(root, 'tateti/index.html'),
      },
    },
  },
})
