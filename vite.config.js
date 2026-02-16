import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    // `allowedHosts` not needed when host:true, but we'll keep explicit if required
    allowedHosts: [
      'nonaccommodating-patty-preorganically.ngrok-free.dev'
    ]
  }

})
