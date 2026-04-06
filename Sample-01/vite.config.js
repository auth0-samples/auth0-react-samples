import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      port: 3000,
    },
    build: {
      outDir: 'dist',
    },
    define: {
      'process.env.AUTH0_DOMAIN': JSON.stringify(env.AUTH0_DOMAIN || process.env.AUTH0_DOMAIN || ''),
      'process.env.AUTH0_CLIENT_ID': JSON.stringify(env.AUTH0_CLIENT_ID || process.env.AUTH0_CLIENT_ID || ''),
      'process.env.AUTH0_AUDIENCE': JSON.stringify(env.AUTH0_AUDIENCE || process.env.AUTH0_AUDIENCE || ''),
      'process.env.API_BASE_URL': JSON.stringify(env.API_BASE_URL || process.env.API_BASE_URL || ''),
    },
  }
})
