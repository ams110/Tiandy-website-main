// Generates public/sitemap.xml including all static routes + live product pages.
// Runs at build time. Resilient: if Supabase env/credentials are missing or the
// fetch fails, it keeps the existing static sitemap and exits 0 (never breaks build).
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const SITE_URL = 'https://ams110.github.io/Tiandy'
const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../public/sitemap.xml')

const staticRoutes = [
  { loc: '/', priority: '1.0', freq: 'weekly' },
  { loc: '/products', priority: '0.9', freq: 'weekly' },
  { loc: '/solutions', priority: '0.8', freq: 'monthly' },
  { loc: '/about', priority: '0.6', freq: 'monthly' },
  { loc: '/news', priority: '0.6', freq: 'weekly' },
  { loc: '/contact', priority: '0.7', freq: 'yearly' },
  { loc: '/quote', priority: '0.8', freq: 'yearly' },
]

function urlTag({ loc, priority, freq }) {
  return `  <url><loc>${SITE_URL}${loc}</loc><changefreq>${freq}</changefreq><priority>${priority}</priority></url>`
}

async function fetchProductSlugs() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  if (!url || !key) {
    console.warn('[sitemap] No Supabase env — writing static routes only.')
    return []
  }
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, key)
    const { data, error } = await supabase
      .from('tiandy_il_products')
      .select('slug, updated_at')
      .is('deleted_at', null)
    if (error) throw error
    return data ?? []
  } catch (e) {
    console.warn('[sitemap] Product fetch failed — static routes only:', e.message)
    return []
  }
}

const products = await fetchProductSlugs()
const productTags = products.map((p) =>
  urlTag({ loc: `/products/${p.slug}`, priority: '0.7', freq: 'monthly' }),
)

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes.map(urlTag).join('\n')}
${productTags.join('\n')}
</urlset>
`

writeFileSync(OUT, xml)
console.log(`[sitemap] Wrote ${staticRoutes.length + productTags.length} URLs to public/sitemap.xml`)
