import { test, expect } from './fixtures'

// SEO / document head: every route should set a unique <title> and a meta
// description, and the document must stay Hebrew + RTL.
const pages: { path: string; title: RegExp }[] = [
  { path: '/', title: /Tiandy/ },
  { path: '/products', title: /מוצרים/ },
  { path: '/solutions', title: /פתרונות/ },
  { path: '/about', title: /אודות/ },
  { path: '/news', title: /חדשות/ },
  { path: '/contact', title: /צור קשר/ },
  { path: '/quote', title: /הצעת מחיר/ },
]

test.describe('SEO head', () => {
  for (const p of pages) {
    test(`${p.path} sets title and description`, async ({ page }) => {
      await page.goto(p.path)
      await expect(page).toHaveTitle(p.title)
      const desc = page.locator('head meta[name="description"]')
      await expect(desc).toHaveCount(1)
      await expect(desc).toHaveAttribute('content', /.+/)
    })
  }

  test('document is Hebrew and right-to-left', async ({ page }) => {
    await page.goto('/')
    const html = page.locator('html')
    await expect(html).toHaveAttribute('lang', 'he')
    await expect(html).toHaveAttribute('dir', 'rtl')
  })

  test('404 route is marked noindex', async ({ page }) => {
    await page.goto('/no-such-page')
    await expect(page.locator('head meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  })
})
