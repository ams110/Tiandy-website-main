import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Minimal ambient declaration so we can read the deploy-target env var without
// pulling in @types/node just for the config. `process` exists at runtime.
declare const process: { env: Record<string, string | undefined> }

// Base path differs per deploy target:
//  - GitHub Pages serves project sites at https://<user>.github.io/<repo>/,
//    so production assets need the "/Tiandy-website-main/" base.
//  - Vercel (and local dev) serve from the root "/", so a project-name base
//    would make every CSS/JS/route URL 404 and render the site unstyled.
// Vercel sets the VERCEL=1 env var during its build, which we use to detect it.
// If the GitHub repo name ever changes, update the base below (and SITE_URL in
// src/data/content.ts + scripts/generate-sitemap.mjs).
export default defineConfig(({ command }) => ({
  base: command === 'build' && !process.env.VERCEL ? '/Tiandy-website-main/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
}))
