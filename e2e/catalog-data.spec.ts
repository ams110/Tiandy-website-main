import { test, expect, seedSupabase, products, categories } from './fixtures'

// Data-driven catalog specs: seed the Supabase stubs with a canned catalog and
// verify the populated UI — product cards, category filters, featured items on
// the homepage, and the full product-detail view.
test.describe('catalog with data', () => {
  test.beforeEach(async ({ page }) => {
    await seedSupabase(page)
  })

  test('products page lists seeded items and category filters', async ({ page }) => {
    await page.goto('/products')

    // Category filter buttons reflect the seeded categories.
    for (const c of categories) {
      await expect(page.getByRole('button', { name: c.name_he })).toBeVisible()
    }

    // All non-deleted products render as cards.
    for (const p of products) {
      await expect(page.getByRole('heading', { name: p.name_he })).toBeVisible()
    }
  })

  test('filtering by a category narrows the list', async ({ page }) => {
    await page.goto('/products')
    await page.getByRole('button', { name: 'מקליטי NVR' }).click()
    await expect(page).toHaveURL(/cat=nvr/)
    // Only the NVR product remains.
    await expect(page.getByRole('heading', { name: 'מקליט NVR 16 ערוצים' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'מצלמת IP Pro 4K' })).toHaveCount(0)
  })

  test('a product card opens the product detail page', async ({ page }) => {
    await page.goto('/products')
    await page.getByRole('link', { name: /מצלמת IP Pro 4K/ }).click()
    await expect(page).toHaveURL(/\/products\/ipc-pro-4k$/)
    await expect(page.getByRole('heading', { level: 1, name: 'מצלמת IP Pro 4K' })).toBeVisible()
  })

  test('product detail shows specs, datasheet and a quote link', async ({ page }) => {
    await page.goto('/products/ipc-pro-4k')
    await expect(page.getByRole('heading', { name: 'מפרט טכני' })).toBeVisible()
    await expect(page.getByText('4K (8MP)')).toBeVisible()
    await expect(page.getByText('IP67')).toBeVisible()

    // Datasheet link (only rendered when a URL exists)
    await expect(
      page.getByRole('link', { name: /הורדת דף נתונים/ }),
    ).toHaveAttribute('href', /\.pdf$/)

    // Quote CTA carries the product slug through to the form (scope to the
    // page body — the navbar also has a generic quote link).
    const quote = page.getByRole('main').getByRole('link', { name: 'בקשת הצעת מחיר' })
    await expect(quote).toHaveAttribute('href', /product=ipc-pro-4k/)
    await quote.click()
    await expect(page).toHaveURL(/\/quote\?product=ipc-pro-4k/)
    await expect(page.getByLabel('פרטים נוספים')).toHaveValue('מתעניין במוצר: ipc-pro-4k')
  })

  test('homepage features the flagged products', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'מצלמת IP Pro 4K' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'מקליט NVR 16 ערוצים' })).toBeVisible()
    // Non-featured product should not appear in the featured strip.
    await expect(page.getByRole('heading', { name: 'מצלמת PTZ ממונעת' })).toHaveCount(0)
  })

  test('homepage category strip links into the filtered catalog', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'מצלמות רשת' }).first().click()
    await expect(page).toHaveURL(/\/products\?cat=cameras/)
  })
})
