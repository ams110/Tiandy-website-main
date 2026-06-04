# CLAUDE.md

Guidance for Claude (and future sessions) when working in this repository.
Keep this file up to date when the architecture, conventions, or workflows change.

## What this project is

**Tiandy ישראל** — a multi-page **Hebrew / RTL** marketing website for security
cameras and surveillance solutions, plus a small **admin dashboard** for managing
the product catalog (create / edit / soft-delete / restore / hard-delete), backed
by Supabase.

> Brand note: the Tiandy name and logo are placeholders. Replace `public/logo.svg`
> and confirm brand-usage rights before going live.

## Tech stack

- **React 18 + TypeScript**, built with **Vite**
- **vite-react-ssg** — static site generation / prerendering (see `src/main.tsx`)
- **React Router v6** (routes declared in `src/App.tsx`)
- **Tailwind CSS** (RTL, Heebo font) — shared component classes in `src/index.css`
- **Supabase** (`@supabase/supabase-js`) — catalog data, leads, and admin auth
- **react-helmet-async** (via `vite-react-ssg`'s `Head`) for per-route SEO
- **Playwright** for end-to-end tests (`e2e/`)

## Commands

```bash
npm run dev              # Vite dev server at http://localhost:5173
npm run build            # generate sitemap + tsc -b + SSG build into dist/
npm run preview          # preview the production build
npm run test:e2e         # run the Playwright E2E suite (auto-starts dev server)
npm run test:e2e:ui      # interactive Playwright UI
npm run test:e2e:report  # open the last HTML report
npm run gen:sitemap      # regenerate public sitemap
```

Note: `npm run lint` references ESLint but there is **no ESLint config** in the
repo, so it currently errors out. Type-check with `npx tsc -b` instead.

## Project layout

```
src/
  App.tsx                 # route table (public layout + admin routes)
  main.tsx                # ViteReactSSG entry; basename from BASE_URL
  index.css               # Tailwind + component classes (.btn, .card, .field, .label …)
  data/content.ts         # ALL static Hebrew copy (nav, hero, stats, solutions, about, news, site info)
  lib/
    supabase.ts           # Supabase client (falls back to placeholder creds if env missing)
    api.ts                # all data access: products, categories, banners, leads, settings, uploads
    types.ts              # shared TS types (Product, Category, Banner, Lead, SiteSettings)
    seo.ts                # canonical URL + JSON-LD helpers
  context/AuthContext.tsx # Supabase auth session provider (useAuth hook)
  components/
    Navbar.tsx Footer.tsx Logo.tsx Seo.tsx SectionTitle.tsx
    ProductCard.tsx TrustBar.tsx ProtectedRoute.tsx
  pages/
    Home.tsx Products.tsx ProductDetail.tsx Solutions.tsx
    About.tsx News.tsx Contact.tsx Quote.tsx NotFound.tsx
    admin/Login.tsx admin/Dashboard.tsx
data/
  migrations/             # SQL migrations (e.g. 001_leads_and_datasheet.sql)
  products-template.csv   # bulk product import template
scripts/                  # generate-sitemap.mjs, import-products.mjs
docs/                     # B2B research + mobile audit notes
e2e/                      # Playwright tests (see "Testing" below)
```

## Routes (`src/App.tsx`)

| Path | Page | Notes |
|------|------|-------|
| `/` | Home | hero, featured products, categories, solutions, case studies, CTA |
| `/products` | Products | catalog with category filter via `?cat=<slug>` |
| `/products/:slug` | ProductDetail | specs table, datasheet link, quote CTA with `?product=<slug>` |
| `/solutions` `/about` `/news` | static content pages | driven entirely by `data/content.ts` |
| `/contact` | Contact | lead form (`type: 'contact'`) |
| `/quote` | Quote | RFQ lead form (`type: 'rfq'`); pre-fills message from `?product=` |
| `/admin/login` | admin Login | Supabase email/password sign-in |
| `/admin` | admin Dashboard | wrapped in `ProtectedRoute` → redirects to `/admin/login` if no session |
| `*` | NotFound | 404, marked `noindex` |

`PublicLayout` wraps public pages with `<Navbar/>` + `<Footer/>`. `AuthProvider`
wraps everything.

## Data layer & Supabase

- All reads/writes go through `src/lib/api.ts`. Tables are prefixed `tiandy_il_`:
  `tiandy_il_categories`, `tiandy_il_products`, `tiandy_il_banners`,
  `tiandy_il_leads`, `tiandy_il_settings`.
- **Products use a soft delete**: `deleted_at` (null = active). Public reads filter
  `deleted_at IS NULL`; admin can include deleted and restore them.
- **RLS**: public can read active rows; an authenticated admin sees everything and
  can write. Create an admin user via Supabase → Authentication → Users.
- Env vars (`.env`, client-side, safe publishable key):
  `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. If missing, `supabase.ts` uses
  harmless placeholder creds so SSG/build never throws — network calls just fail
  and the UI shows graceful empty states.
- **Graceful fallbacks**: lead forms (Contact/Quote) fall back to a `mailto:` link
  if the Supabase insert fails, so a lead is never lost.

## Conventions & gotchas

- **All UI copy is Hebrew and the document is RTL** (`<html lang="he" dir="rtl">` in
  `index.html`). Edit visible text in `src/data/content.ts` where possible.
- **Code/comments are in English**; keep them that way.
- **SEO**: every page renders a `<Seo>` component (`src/components/Seo.tsx`) that
  sets a unique title (`"<title> | Tiandy ישראל"`), meta description, canonical,
  Open Graph, and JSON-LD. Add one to any new page.
- **Form fields must associate `<label htmlFor>` with input `id`** for
  accessibility (the existing forms were fixed to do this — keep the pattern).
- **Production base path**: `vite.config.ts` sets `base: '/Tiandy-website-main/'`
  for builds — it MUST match the GitHub repo name, since Pages serves project
  sites at `https://<user>.github.io/<repo>/`. The router reads `basename` from
  `BASE_URL` in `main.tsx`. Dev stays at `/`. If the repo is renamed, update the
  base here **and** `SITE_URL` in `src/data/content.ts` + `scripts/generate-sitemap.mjs`,
  or every CSS/JS/route URL will 404 and the site renders unstyled.
- Shared CSS component classes live under `@layer components` in `index.css`:
  `.btn`, `.btn-primary`, `.btn-outline`, `.btn-ghost`, `.card`, `.field`, `.label`,
  `.container`.

## Testing (Playwright, `e2e/`)

The suite drives a real browser against the dev server like a user — navigating,
filling forms, and submitting — then asserts the result. **63 tests**, Chromium.

- `e2e/fixtures.ts` — the heart of the setup. It **stubs all Supabase traffic** so
  tests never hit a network/backend and stay deterministic:
  - Default: every REST table returns `[]` (exercises empty states); writes succeed;
    `auth/token` returns 400 (deterministic login-error path).
  - `seedSupabase(page)` overrides product/category endpoints with a **canned
    catalog** (`products`, `categories` exports) to test populated states.
  - **Import `test`/`expect` from `./fixtures`, NOT from `@playwright/test`** — the
    fixture is what installs the Supabase stubs.
- Spec files: `navigation`, `home`, `products`, `catalog-data`, `content-pages`,
  `contact`, `quote-form`, `admin-login`, `footer`, `seo`, `responsive`, `smoke`.
- `playwright.config.ts` auto-starts `npm run dev` and reuses it locally.
- Browsers may live at a custom path in CI; locally set
  `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers` if Chromium isn't found.
- CI: `.github/workflows/e2e.yml` runs the suite on every push/PR.

When adding a feature, add/extend a spec in `e2e/` and prefer role/label locators.
Scope ambiguous matches (e.g. the quote CTA exists in both navbar and page body)
with `getByRole('main')` / `getByRole('contentinfo')` / `.first()`.

## CI / Deploy

- `.github/workflows/e2e.yml` — Playwright tests on push/PR.
- `.github/workflows/deploy.yml` — builds and deploys `dist/` to **GitHub Pages**
  on push to `main`. Supabase env vars come from repo secrets (with fallbacks).
- `.github/workflows/import-products.yml` — bulk product import workflow.

## Git workflow

- Default branch: `main`. Develop on feature branches and open PRs.
- After pushing, open a (draft) PR; merge only after CI is green.
