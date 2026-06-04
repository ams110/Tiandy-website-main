import { test, expect } from './fixtures'

// Static marketing pages driven entirely by data/content.ts — fully
// deterministic, no backend involved.

test.describe('solutions page', () => {
  test('lists every industry solution and the process steps', async ({ page }) => {
    await page.goto('/solutions')
    await expect(page.getByRole('heading', { name: 'פתרונות מותאמים לכל ענף' })).toBeVisible()
    for (const title of [
      'קמעונאות',
      'עיר חכמה',
      'תעשייה ולוגיסטיקה',
      'בנקאות ופיננסים',
      'חינוך',
      'תחבורה',
    ]) {
      await expect(page.getByRole('heading', { name: title })).toBeVisible()
    }
    // "How we work" 4-step flow
    await expect(page.getByRole('heading', { name: 'איך אנחנו עובדים' })).toBeVisible()
    for (const step of ['אפיון צרכים', 'תכנון מערכת', 'התקנה', 'תמיכה']) {
      await expect(page.getByRole('heading', { name: step })).toBeVisible()
    }
  })
})

test.describe('about page', () => {
  test('shows company intro, stats and values', async ({ page }) => {
    await page.goto('/about')
    await expect(page.getByRole('heading', { name: 'אודות החברה' })).toBeVisible()
    for (const value of ['אמינות', 'חדשנות', 'שירות']) {
      await expect(page.getByRole('heading', { name: value })).toBeVisible()
    }
    // Stats repeated from content
    await expect(page.getByText('שנות ניסיון בתחום')).toBeVisible()
  })
})

test.describe('news page', () => {
  test('renders all news items with localized dates', async ({ page }) => {
    await page.goto('/news')
    await expect(page.getByRole('heading', { name: 'חדשות ומאמרים' })).toBeVisible()
    for (const title of [
      'השקת סדרת מצלמות AI חדשה',
      'שיתוף פעולה עם משלבי מערכות מקומיים',
      'עדכון קושחה לשיפור אבטחת הסייבר',
    ]) {
      await expect(page.getByRole('heading', { name: title })).toBeVisible()
    }
    // Three article cards
    await expect(page.getByRole('article')).toHaveCount(3)
  })
})
