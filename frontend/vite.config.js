import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true
  },
  // Since we are using a custom index.html, we need to tell Vite to use it
  // Actually, Vite by default uses index.html in the root, which we have set to our custom one.
  // So we don't need to change anything.
})