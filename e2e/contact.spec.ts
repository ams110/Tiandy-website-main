import { test, expect } from './fixtures'

// Contact page: company details block, the click-to-call / click-to-email
// links, full form submission, and required-field validation.
test.describe('contact page', () => {
  test('shows contact details and clickable phone/email', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.getByRole('heading', { name: 'דברו איתנו' })).toBeVisible()
    // Address appears in both the contact card and the footer.
    await expect(page.getByText('אזור התעשייה, תל אביב, ישראל').first()).toBeVisible()
    await expect(page.getByRole('link', { name: /03-0000000/ }).first()).toHaveAttribute(
      'href',
      /^tel:/,
    )
    await expect(
      page.getByRole('link', { name: /info@tiandy-il\.example/ }).first(),
    ).toHaveAttribute('href', /^mailto:/)
  })

  test('a visitor can fill and submit the contact form', async ({ page }) => {
    await page.goto('/contact')
    await page.getByLabel('שם מלא').fill('בודק אוטומטי')
    await page.getByLabel(/טלפון/).fill('050-1234567')
    await page.getByLabel('דוא״ל').fill('qa@example.com')
    await page.getByLabel('הודעה').fill('הודעת בדיקה אוטומטית.')
    await page.getByRole('button', { name: 'שליחה' }).click()
    await expect(page.getByText('הפנייה נשלחה!')).toBeVisible()
  })

  test('required fields block an empty submit', async ({ page }) => {
    await page.goto('/contact')
    await page.getByRole('button', { name: 'שליחה' }).click()
    await expect(page.getByText('הפנייה נשלחה!')).toHaveCount(0)
    const valid = await page
      .getByLabel('שם מלא')
      .evaluate((el: HTMLInputElement) => el.checkValidity())
    expect(valid).toBe(false)
  })

  test('an invalid email is rejected by the browser', async ({ page }) => {
    await page.goto('/contact')
    await page.getByLabel('שם מלא').fill('בודק')
    await page.getByLabel('דוא״ל').fill('not-an-email')
    await page.getByLabel('הודעה').fill('בדיקה')
    await page.getByRole('button', { name: 'שליחה' }).click()
    await expect(page.getByText('הפנייה נשלחה!')).toHaveCount(0)
    const valid = await page
      .getByLabel('דוא״ל')
      .evaluate((el: HTMLInputElement) => el.checkValidity())
    expect(valid).toBe(false)
  })
})
