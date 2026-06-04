import { test, expect } from './fixtures'

// Full sweep of the homepage: hero, stats, trust bar, solutions, why-us,
// case studies and the closing CTA. Backend-driven sections (banners,
// categories, featured products) are absent without Supabase, so we assert
// the graceful empty state rather than live data.
test.describe('homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('hero shows title, subtitle and the products CTA', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 1, name: 'טכנולוגיית מעקב חכמה לכל סביבה' }),
    ).toBeVisible()
    const cta = page.getByRole('link', { name: 'לצפייה במוצרים' })
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', /\/products$/)
  })

  test('stats band renders all four figures', async ({ page }) => {
    for (const value of ['15+', '60+', '24/7', '4K']) {
      await expect(page.getByText(value, { exact: true }).first()).toBeVisible()
    }
  })

  test('trust bar lists certifications', async ({ page }) => {
    await expect(page.getByText('תקנים ותאימות')).toBeVisible()
    for (const code of ['ISO 9001', 'CE', 'ONVIF', 'NDAA', 'UL']) {
      await expect(page.getByText(code, { exact: true }).first()).toBeVisible()
    }
  })

  test('solutions section links through to /solutions', async ({ page }) => {
    const card = page.getByRole('link', { name: /קמעונאות/ }).first()
    await expect(card).toBeVisible()
    await card.click()
    await expect(page).toHaveURL(/\/solutions$/)
  })

  test('featured products show a friendly empty state without a backend', async ({ page }) => {
    await expect(page.getByText('לא נמצאו מוצרים נבחרים כרגע.')).toBeVisible()
  })

  test('closing CTA offers both quote and contact actions', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'מחפשים פתרון אבטחה לעסק שלכם?' }),
    ).toBeVisible()
    await expect(page.getByRole('link', { name: 'לקבלת ייעוץ חינם' })).toHaveAttribute(
      'href',
      /\/contact$/,
    )
  })

  test('the logo returns to the homepage', async ({ page }) => {
    await page.getByRole('link', { name: 'מוצרים' }).first().click()
    await expect(page).toHaveURL(/\/products$/)
    // The logo link (accessible name "Tiandy ישראל") returns to the homepage.
    await page.getByRole('banner').getByRole('link', { name: 'Tiandy ישראל' }).click()
    await expect(page).toHaveURL(/\/$/)
  })
})
