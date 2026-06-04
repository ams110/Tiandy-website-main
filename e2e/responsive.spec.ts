import { test, expect } from './fixtures'

// Mobile layout: the desktop nav collapses into a hamburger menu, and the
// header exposes a tap-to-call shortcut. Runs at a phone viewport.
test.describe('mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('hamburger toggles the mobile menu', async ({ page }) => {
    await page.goto('/')
    const toggle = page.getByRole('button', { name: 'תפריט' })
    await expect(toggle).toBeVisible()
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')

    // Menu links are now reachable; navigate to Solutions.
    await page.getByRole('link', { name: 'פתרונות' }).first().click()
    await expect(page).toHaveURL(/\/solutions$/)
  })

  test('header shows a tap-to-call shortcut', async ({ page }) => {
    await page.goto('/')
    const call = page.getByRole('link', { name: /חיוג ל-/ })
    await expect(call).toBeVisible()
    await expect(call).toHaveAttribute('href', /^tel:/)
  })

  test('mobile menu surfaces the quote CTA', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'תפריט' }).click()
    const quote = page.getByRole('link', { name: 'בקשת הצעת מחיר' })
    await expect(quote.first()).toBeVisible()
    await quote.first().click()
    await expect(page).toHaveURL(/\/quote$/)
  })
})
