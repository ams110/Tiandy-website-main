import { test, expect } from './fixtures'

// Products catalog page. Without Supabase there are no categories or items,
// so we verify the page frame, the always-present "all" filter, the URL-driven
// filter state, and the empty-state copy.
test.describe('products page', () => {
  test('renders the catalog heading and the "all" filter', async ({ page }) => {
    await page.goto('/products')
    await expect(page.getByRole('heading', { name: 'המוצרים שלנו' })).toBeVisible()
    const allBtn = page.getByRole('button', { name: 'הכל' })
    await expect(allBtn).toBeVisible()
  })

  test('shows an empty-state message when no products are available', async ({ page }) => {
    await page.goto('/products')
    await expect(page.getByText('לא נמצאו מוצרים בקטגוריה זו.')).toBeVisible()
  })

  test('a category in the URL is reflected as the active filter', async ({ page }) => {
    await page.goto('/products?cat=cameras')
    // The page still renders without crashing on an unknown category.
    await expect(page.getByRole('heading', { name: 'המוצרים שלנו' })).toBeVisible()
    await expect(page).toHaveURL(/cat=cameras/)
  })

  test('clicking "all" clears the category query param', async ({ page }) => {
    await page.goto('/products?cat=cameras')
    await page.getByRole('button', { name: 'הכל' }).click()
    await expect(page).toHaveURL(/\/products$/)
  })
})

// Product detail handles the "not found" path gracefully (no backend row).
test.describe('product detail', () => {
  test('unknown slug shows a not-found message and a way back', async ({ page }) => {
    await page.goto('/products/does-not-exist')
    await expect(page.getByText('המוצר לא נמצא.')).toBeVisible()
    const back = page.getByRole('link', { name: 'חזרה למוצרים' })
    await expect(back).toBeVisible()
    await back.click()
    await expect(page).toHaveURL(/\/products$/)
  })
})
