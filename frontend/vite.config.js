import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/notes': 'http://localhost:3002',
      '/auth': 'http://localhost:3002',
      '/admin': 'http://localhost:3002'
    }
  }
})
