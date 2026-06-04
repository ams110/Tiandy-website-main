import { test as base, expect, type Page, type Route } from '@playwright/test'

// ---------------------------------------------------------------------------
// Supabase network stubbing
//
// The app talks to Supabase for products, categories, banners, settings, leads
// and auth. In tests we never want to hit a real backend — it would be slow,
// flaky and non-deterministic. So we intercept every Supabase call:
//   • by default every table returns an empty list (exercises empty states)
//   • `seedSupabase()` overrides specific tables with canned data
//   • auth token requests fail (so the login error path is deterministic)
// ---------------------------------------------------------------------------

function json(route: Route, body: unknown, status = 200) {
  return route.fulfill({
    status,
    contentType: 'application/json',
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-headers': '*',
      'access-control-allow-methods': '*',
    },
    body: JSON.stringify(body),
  })
}

function preflight(route: Route) {
  return route.fulfill({
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-headers': '*',
      'access-control-allow-methods': '*',
    },
    body: '',
  })
}

export type Category = {
  id: string
  slug: string
  name_he: string
  sort: number
  image_url: string | null
}

export type Product = {
  id: string
  slug: string
  name_he: string
  short_desc_he: string | null
  description_he: string | null
  image_url: string | null
  datasheet_url: string | null
  is_featured: boolean
  sort: number
  specs: Record<string, string>
  deleted_at: string | null
  category_id: string
}

// Canned catalog used by data-driven specs.
export const categories: Category[] = [
  { id: 'c1', slug: 'cameras', name_he: 'מצלמות רשת', sort: 1, image_url: null },
  { id: 'c2', slug: 'nvr', name_he: 'מקליטי NVR', sort: 2, image_url: null },
]

export const products: Product[] = [
  {
    id: 'p1',
    slug: 'ipc-pro-4k',
    name_he: 'מצלמת IP Pro 4K',
    short_desc_he: 'מצלמת רשת 4K לתנאי חוץ',
    description_he: 'מצלמת צינור בעלת חיישן 4K ואנליטיקת AI מובנית.',
    image_url: null,
    datasheet_url: 'https://example.com/ipc-pro-4k.pdf',
    is_featured: true,
    sort: 1,
    specs: { רזולוציה: '4K (8MP)', עדשה: '2.8mm', הגנה: 'IP67' },
    deleted_at: null,
    category_id: 'c1',
  },
  {
    id: 'p2',
    slug: 'nvr-16ch',
    name_he: 'מקליט NVR 16 ערוצים',
    short_desc_he: 'מקליט רשת ל-16 מצלמות',
    description_he: 'מקליט NVR עם תמיכה ב-16 ערוצים והקלטה 4K.',
    image_url: null,
    datasheet_url: null,
    is_featured: true,
    sort: 2,
    specs: {},
    deleted_at: null,
    category_id: 'c2',
  },
  {
    id: 'p3',
    slug: 'ptz-dome',
    name_he: 'מצלמת PTZ ממונעת',
    short_desc_he: 'מצלמת PTZ עם זום אופטי',
    description_he: '',
    image_url: null,
    datasheet_url: null,
    is_featured: false,
    sort: 3,
    specs: {},
    deleted_at: null,
    category_id: 'c1',
  },
]

type Seed = { categories?: Category[]; products?: Product[] }

// Override the default empty stubs with canned catalog data for a given page.
// Call before navigating. Routes registered later take precedence in Playwright.
export async function seedSupabase(page: Page, seed: Seed = {}) {
  const cats = seed.categories ?? categories
  const prods = seed.products ?? products

  await page.route('**/rest/v1/tiandy_il_categories*', (route) => {
    if (route.request().method() === 'OPTIONS') return preflight(route)
    return json(route, cats)
  })

  await page.route('**/rest/v1/tiandy_il_products*', (route) => {
    if (route.request().method() === 'OPTIONS') return preflight(route)
    const url = new URL(route.request().url())
    const params = url.searchParams

    // Single product by slug (maybeSingle)
    const slug = params.get('slug')
    if (slug) {
      const value = slug.replace('eq.', '')
      const found = prods.find((p) => p.slug === value && !p.deleted_at)
      return json(route, found ?? null)
    }

    // Featured products for the homepage
    if (params.get('is_featured')) {
      return json(route, prods.filter((p) => p.is_featured && !p.deleted_at))
    }

    // Catalog list, optionally filtered by category slug
    const catFilter = params.get('category.slug')
    let list = prods.filter((p) => !p.deleted_at)
    if (catFilter) {
      const value = catFilter.replace('eq.', '')
      const cat = cats.find((c) => c.slug === value)
      list = list.filter((p) => p.category_id === cat?.id)
    }
    return json(route, list)
  })
}

// Base fixture: stub all Supabase traffic to empty/failing so every spec is
// deterministic and never touches the network. Data specs opt into content via
// seedSupabase().
export const test = base.extend({
  page: async ({ page }, use) => {
    // REST: empty list by default; writes (lead submit) succeed.
    await page.route('**/rest/v1/**', (route) => {
      const method = route.request().method()
      if (method === 'OPTIONS') return preflight(route)
      if (method === 'POST' || method === 'PATCH' || method === 'DELETE') {
        return json(route, [{}], 201)
      }
      return json(route, [])
    })

    // Auth: sign-in fails (deterministic login-error path); everything else ok.
    await page.route('**/auth/v1/**', (route) => {
      if (route.request().method() === 'OPTIONS') return preflight(route)
      const url = route.request().url()
      if (url.includes('/token')) {
        return json(route, { error: 'invalid_grant', error_description: 'Invalid login credentials' }, 400)
      }
      return json(route, {}, 200)
    })

    await use(page)
  },
})

export { expect }
