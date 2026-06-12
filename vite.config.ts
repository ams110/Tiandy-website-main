import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// On GitHub Pages the site is served from https://<user>.github.io/<repo>/
// The repo is "Tiandy-website-main", so production assets need the
// "/Tiandy-website-main/" base. Local dev stays at "/".
// If the repo name ever changes, update the base value below (and SITE_URL
// in src/data/content.ts + scripts/generate-sitemap.mjs).
//
// Hosts that serve from the domain root (e.g. Vercel preview deployments) can
// override the base by setting the VITE_BASE env var to "/" — see vercel.json.
// Read VITE_BASE off the process env without pulling in @types/node (tsc -b
// type-checks this file, so we reach the global defensively via globalThis).
const envBase = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
  ?.env?.VITE_BASE

export default defineConfig(({ command }) => ({
  base: envBase ?? (command === 'build' ? '/Tiandy-website-main/' : '/'),
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
}))
