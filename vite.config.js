import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/town_budget/',
  deploy: "gh-pages -d dist/town_budget",
  plugins: [react()],
})
