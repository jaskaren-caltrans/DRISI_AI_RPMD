import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all addresses
    port: process.env.PORT || 3000, // Use PORT from environment or default to 3000
    strictPort: true, // Fail if port is in use
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 3000,
    strictPort: true,
  },
})
