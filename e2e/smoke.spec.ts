import { test, expect } from './fixtures'

// Crash sweep: visit every public route and assert the page never throws an
// uncaught exception and renders a heading. Console errors are tolerated here
// (Supabase calls fail without a backend and are caught by the app), but an
// uncaught `pageerror` is a real bug and fails the test.
const routes = [
  '/',
  '/products',
  '/products/sample-slug',
  '/solutions',
  '/about',
  '/news',
  '/contact',
  '/quote',
  '/admin/login',
  '/totally-unknown-route',
]

for (const route of routes) {
  test(`no uncaught errors on ${route}`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))

    // Use 'load' rather than 'networkidle': the hero's looping background
    // video keeps a media connection open, so the network never goes idle.
    await page.goto(route, { waitUntil: 'load' })
    // Give late-firing scripts a moment to surface any uncaught error.
    await page.waitForTimeout(1000)

    // Something meaningful rendered (heading or the page body has text).
    await expect(page.locator('body')).not.toBeEmpty()
    expect(errors, `uncaught errors on ${route}:\n${errors.join('\n')}`).toEqual([])
  })
}
