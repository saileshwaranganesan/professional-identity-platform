import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // @/ maps to src/ — all application imports use this alias.
      // Mirrors the `paths` setting in tsconfig.app.json exactly.
      '@': `${import.meta.dirname}/src`,
    },
  },
})
