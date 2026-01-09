import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all addresses
    port: process.env.PORT || 5173, // Use PORT from environment or default to 5173
    strictPort: false, // Allow fallback to next available port if in use
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 5173,
    strictPort: false,
    allowedHosts: ['drisi-ai-rpmd.onrender.com', '.onrender.com'],
  },
})
