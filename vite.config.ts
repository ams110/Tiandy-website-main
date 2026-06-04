import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// On GitHub Pages the site is served from https://<user>.github.io/<repo>/
// The repo is "Tiandy-website-main", so production assets need the
// "/Tiandy-website-main/" base. Local dev stays at "/".
// If the repo name ever changes, update the base value below (and SITE_URL
// in src/data/content.ts + scripts/generate-sitemap.mjs).
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Tiandy-website-main/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
}))
