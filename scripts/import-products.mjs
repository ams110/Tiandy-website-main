import XLSX from 'xlsx'
import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { extname } from 'path'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const EXCEL_FILE = process.env.EXCEL_FILE || 'data/products.xlsx'
const DRY_RUN = process.env.DRY_RUN === 'true'
const BUCKET = 'tiandy-il-media'

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY env vars')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Load categories for slug → id mapping
const { data: categories, error: catErr } = await supabase
  .from('tiandy_il_categories')
  .select('id, slug')

if (catErr) {
  console.error('❌ Failed to load categories:', catErr.message)
  process.exit(1)
}

const catMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]))
console.log(`✓ Loaded ${categories.length} categories: ${Object.keys(catMap).join(', ') || '(none)'}`)

// Read Excel file
if (!existsSync(EXCEL_FILE)) {
  console.error(`❌ Excel file not found: ${EXCEL_FILE}`)
  console.error('   Put your file at data/products.xlsx or pass EXCEL_FILE env var.')
  process.exit(1)
}

const workbook = XLSX.readFile(EXCEL_FILE)
const sheet = workbook.Sheets[workbook.SheetNames[0]]
const rows = XLSX.utils.sheet_to_json(sheet)

console.log(`✓ Found ${rows.length} rows in ${EXCEL_FILE}\n`)
if (DRY_RUN) console.log('⚠  DRY RUN — nothing will be saved\n')

let saved = 0
let failed = 0

for (const row of rows) {
  const name = String(row['name_he'] ?? row['name'] ?? '').trim()
  if (!name) {
    console.warn('⚠  Skipping row with no name_he:', row)
    continue
  }

  // --- Handle image ---
  let imageUrl = String(row['image'] ?? row['image_url'] ?? '').trim()

  if (imageUrl && !imageUrl.startsWith('http')) {
    const imgPath = `data/images/${imageUrl}`
    if (existsSync(imgPath)) {
      if (!DRY_RUN) {
        const buffer = readFileSync(imgPath)
        const ext = extname(imageUrl).slice(1).toLowerCase() || 'jpg'
        const slug = String(row['slug'] ?? '').trim() || name
        const storagePath = `products/${slug}.${ext}`
        const mime = { png: 'image/png', webp: 'image/webp', gif: 'image/gif' }[ext] ?? 'image/jpeg'

        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(storagePath, buffer, { upsert: true, contentType: mime })

        if (upErr) {
          console.warn(`  ⚠ Image upload failed for "${name}": ${upErr.message}`)
        } else {
          const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
          imageUrl = publicUrl
          console.log(`  ↑ Image uploaded → ${storagePath}`)
        }
      } else {
        imageUrl = `[would upload: ${imgPath}]`
      }
    } else {
      console.warn(`  ⚠ Image file not found: ${imgPath}`)
      imageUrl = ''
    }
  }

  // --- Parse specs JSON ---
  let specs = {}
  const specsRaw = String(row['specs'] ?? '').trim()
  if (specsRaw) {
    try { specs = JSON.parse(specsRaw) } catch {
      console.warn(`  ⚠ Invalid specs JSON for "${name}", using empty specs`)
    }
  }

  // --- Parse is_featured ---
  const featuredRaw = row['is_featured'] ?? row['featured']
  const isFeatured =
    featuredRaw === true ||
    featuredRaw === 1 ||
    String(featuredRaw).toLowerCase() === 'true' ||
    featuredRaw === 'yes' ||
    featuredRaw === 'כן'

  // --- Parse category ---
  const catSlug = String(row['category_slug'] ?? row['category'] ?? '').trim()

  // --- Build slug ---
  const rawSlug = String(row['slug'] ?? '').trim()
  const slug = rawSlug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const product = {
    category_id: catMap[catSlug] ?? null,
    slug,
    name_he: name,
    short_desc_he: String(row['short_desc_he'] ?? row['short_desc'] ?? '').trim() || null,
    description_he: String(row['description_he'] ?? row['description'] ?? '').trim() || null,
    image_url: imageUrl || null,
    specs,
    is_featured: isFeatured,
    sort: Number(row['sort'] ?? 0),
  }

  if (DRY_RUN) {
    console.log(`[DRY RUN] ${product.name_he} → ${product.slug}`)
    console.log('  ', JSON.stringify(product))
    saved++
    continue
  }

  const { error } = await supabase
    .from('tiandy_il_products')
    .upsert(product, { onConflict: 'slug' })

  if (error) {
    console.error(`✗ "${name}": ${error.message}`)
    failed++
  } else {
    console.log(`✓ "${name}" saved`)
    saved++
  }
}

console.log(`\n${'─'.repeat(45)}`)
console.log(`Finished: ✓ ${saved} saved  ✗ ${failed} failed`)
if (DRY_RUN) console.log('(Dry run — no changes made to database)')
