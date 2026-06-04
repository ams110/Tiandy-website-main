import { test, expect } from './fixtures'

// Fills the Request-for-Quote form end-to-end like a real lead would, then
// submits and checks the success state. Submission falls back to a mailto
// when Supabase isn't configured, but the UI still flips to "sent".
test.describe('quote form', () => {
  test('a visitor can fill and submit the RFQ form', async ({ page }) => {
    await page.goto('/quote')

    await expect(
      page.getByRole('heading', { name: 'בואו נבנה לכם מערכת מותאמת' }),
    ).toBeVisible()

    // Qualifying questions
    await page.getByLabel('סוג הפרויקט').selectOption('new')
    await page.getByLabel('מספר אתרים / מצלמות (משוער)').fill('3 אתרים, ~40 מצלמות')

    // Contact details
    await page.getByLabel('שם מלא').fill('בודק אוטומטי')
    await page.getByLabel(/חברה/).fill('Tiandy QA')
    await page.getByLabel('דוא״ל').fill('qa@example.com')
    await page.getByLabel(/טלפון/).fill('0500000000')
    await page.getByLabel('פרטים נוספים').fill('בדיקת אוטומציה של הטופס.')

    await page.getByRole('button', { name: 'שליחת בקשה' }).click()

    // Success panel
    await expect(page.getByText('הבקשה התקבלה!')).toBeVisible()
  })

  test('a product passed in the URL pre-fills the message', async ({ page }) => {
    await page.goto('/quote?product=ipc-2025')
    await expect(page.getByLabel('פרטים נוספים')).toHaveValue('מתעניין במוצר: ipc-2025')
  })

  test('required fields block an empty submit', async ({ page }) => {
    await page.goto('/quote')
    await page.getByRole('button', { name: 'שליחת בקשה' }).click()
    // Native validation keeps us on the form — success panel must NOT appear.
    await expect(page.getByText('הבקשה התקבלה!')).toHaveCount(0)
    const scope = page.getByLabel('סוג הפרויקט')
    const valid = await scope.evaluate((el: HTMLSelectElement) => el.checkValidity())
    expect(valid).toBe(false)
  })
})
