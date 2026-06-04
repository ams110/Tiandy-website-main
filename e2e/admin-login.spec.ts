import { test, expect } from '@playwright/test'

// Exercises the admin gate: the login form should render, reject bad
// credentials with an error, and a protected route should not leak through.
test.describe('admin login', () => {
  test('login form renders', async ({ page }) => {
    await page.goto('/admin/login')
    await expect(page.getByRole('heading', { name: 'כניסת מנהל' })).toBeVisible()
    await expect(page.getByLabel('דוא״ל')).toBeVisible()
    await expect(page.getByLabel('סיסמה')).toBeVisible()
  })

  test('wrong credentials show an error and stay on login', async ({ page }) => {
    await page.goto('/admin/login')
    await page.getByLabel('דוא״ל').fill('nobody@example.com')
    await page.getByLabel('סיסמה').fill('wrong-password')
    await page.getByRole('button', { name: 'התחברות' }).click()
    await expect(page.getByText('פרטי ההתחברות שגויים או שאין הרשאה.')).toBeVisible()
    await expect(page).toHaveURL(/\/admin\/login$/)
  })

  test('protected /admin redirects an anonymous user away', async ({ page }) => {
    await page.goto('/admin')
    // ProtectedRoute should bounce an unauthenticated visitor to login.
    await expect(page).toHaveURL(/\/admin\/login$/)
  })
})
