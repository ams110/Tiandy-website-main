# Preview deployments (Vercel)

This repo's **production** hosting is GitHub Pages (served under
`/Tiandy-website-main/`, configured in `.github/workflows/deploy.yml`). To
review feature branches on a real URL **without touching** the Pages site, we
use Vercel preview deployments.

## How it works

- `vercel.json` builds the site for the **domain root** by running
  `VITE_BASE=/ npm run build`, then serves `dist/` with an SPA rewrite fallback.
- `vite.config.ts` reads an optional `VITE_BASE` env override. When it is unset
  (as in CI for GitHub Pages) the base stays `/Tiandy-website-main/`, so the
  production deploy is unaffected.

## Getting a preview URL

1. Import the repo once in the Vercel dashboard (**Add New → Project →
   Import**), or connect the GitHub integration.
2. Every pushed branch / open PR gets its own **Preview Deployment**.
3. Open **Vercel → Project → Deployments**, pick the deployment for your
   branch, and click **Visit** to open the `*.vercel.app` preview.

Production (the `main` branch) keeps deploying to GitHub Pages as before.
