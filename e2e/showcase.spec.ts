import { test, expect } from './fixtures'

// The interactive 3D camera showcase (homepage). The WebGL <canvas> mounts
// client-only and isn't deterministic to assert against, so we test the
// always-rendered DOM around it: heading, model name plate, the spec
// highlights, and both CTAs. This content is also server-prerendered, so it
// works for SEO and no-WebGL devices via the static poster fallback.
test.describe('3D camera showcase', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders the section heading and model plate', async ({ page }) => {
    const section = page.getByTestId('camera-3d-showcase')
    await expect(section).toBeVisible()
    await expect(
      section.getByRole('heading', { level: 2, name: 'הכירו את המצלמה — בתלת-ממד' }),
    ).toBeVisible()
    await expect(section.getByText('Tiandy TC-H389M', { exact: true })).toBeVisible()
    await expect(section.getByText('8MP · 4K', { exact: true })).toBeVisible()
  })

  test('lists the camera spec highlights', async ({ page }) => {
    const section = page.getByTestId('camera-3d-showcase')
    for (const value of [
      '44× + 16× דיגיטלי',
      'AI Auto-Tracking (AEW)',
      '0.0008 Lux · Super StarLight',
      'IP66 · גוף מתכת',
    ]) {
      await expect(section.getByText(value, { exact: true })).toBeVisible()
    }
  })

  test('quote CTA carries the product and secondary CTA links to products', async ({ page }) => {
    const section = page.getByTestId('camera-3d-showcase')

    const quote = section.getByRole('link', { name: 'בקשת הצעת מחיר' })
    await expect(quote).toHaveAttribute('href', /\/quote\?product=/)

    const products = section.getByRole('link', { name: 'לכל המוצרים' })
    await expect(products).toHaveAttribute('href', /\/products$/)
  })
})
