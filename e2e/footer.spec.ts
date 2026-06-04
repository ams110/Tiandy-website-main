import { test, expect } from './fixtures'

// The footer is shared across every public page: navigation links, contact
// details, the admin entry point and the copyright line.
test.describe('footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('exposes the main navigation links', async ({ page }) => {
    const footer = page.getByRole('contentinfo')
    for (const label of ['דף הבית', 'מוצרים', 'פתרונות', 'אודות', 'חדשות', 'צור קשר']) {
      await expect(footer.getByRole('link', { name: label })).toBeVisible()
    }
  })

  test('links to the admin area', async ({ page }) => {
    const footer = page.getByRole('contentinfo')
    const admin = footer.getByRole('link', { name: 'כניסת מנהל' })
    await expect(admin).toHaveAttribute('href', /\/admin$/)
    await admin.click()
    // Unauthenticated → bounced to the login screen.
    await expect(page).toHaveURL(/\/admin\/login$/)
  })

  test('shows the current-year copyright', async ({ page }) => {
    const year = new Date().getFullYear().toString()
    await expect(page.getByRole('contentinfo').getByText(new RegExp(`© ${year}`))).toBeVisible()
  })
})
