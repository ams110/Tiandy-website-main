import { test, expect } from './fixtures'

// Walks the public site like a visitor: lands on the homepage and clicks
// through every main nav link, asserting the right page actually renders.
test.describe('public navigation', () => {
  test('homepage loads with hero and primary CTA', async ({ page }) => {
    await page.goto('/')
    // Hero headline from data/content.ts
    await expect(
      page.getByRole('heading', { name: 'טכנולוגיית מעקב חכמה לכל סביבה' }),
    ).toBeVisible()
    // Quote CTA in the navbar
    await expect(page.getByRole('link', { name: 'בקשת הצעת מחיר' }).first()).toBeVisible()
  })

  // Each main nav entry should take the user to its page without errors.
  const pages = [
    { name: 'מוצרים', path: '/products' },
    { name: 'פתרונות', path: '/solutions' },
    { name: 'אודות', path: '/about' },
    { name: 'חדשות', path: '/news' },
    { name: 'צור קשר', path: '/contact' },
  ]

  for (const p of pages) {
    test(`nav link "${p.name}" opens ${p.path}`, async ({ page }) => {
      await page.goto('/')
      // The "מוצרים" link carries a "▾" dropdown glyph in its accessible name,
      // so match by substring rather than an exact string.
      await page.getByRole('navigation').getByRole('link', { name: p.name }).first().click()
      await expect(page).toHaveURL(new RegExp(`${p.path}$`))
      // The page should render some heading content (not a blank screen).
      await expect(page.getByRole('heading').first()).toBeVisible()
    })
  }

  test('unknown route shows the 404 page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist')
    await expect(page.getByText('404')).toBeVisible()
  })
})
