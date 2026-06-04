# בדיקות E2E (Playwright)

בדיקות "קצה-לקצה" שמריצות דפדפן אמיתי על האתר ב-`localhost`, מתנהגות
כמו מבקר אמיתי — נכנסות לדפים, לוחצות על קישורים, ממלאות טפסים ושולחות —
ובסוף מדווחות על תקלות. זו אותה גישה כמו Playwright MCP, רק כסוויטת בדיקות
חוזרת שאפשר להריץ בכל פעם.

## הרצה

```bash
npm install                 # פעם ראשונה
npx playwright install chromium   # מוריד את הדפדפן (פעם ראשונה)

npm run test:e2e            # מריץ את כל הבדיקות (מפעיל את שרת ה-dev אוטומטית)
npm run test:e2e:ui         # מצב אינטראקטיבי עם ממשק
npm run test:e2e:report     # פותח את דוח ה-HTML האחרון
```

הקובץ `playwright.config.ts` מפעיל את `npm run dev` לבד לפני הבדיקות
ומכבה אותו אחריהן, כך שאין צורך להריץ שרת בנפרד.

## מה מכוסה

| קובץ                     | תרחיש                                                        |
| ------------------------ | ----------------------------------------------------------- |
| `navigation.spec.ts`     | דף הבית, ניווט בין כל דפי התפריט, ודף 404                    |
| `quote-form.spec.ts`     | מילוי ושליחה של טופס בקשת הצעת מחיר + ולידציית שדות חובה     |
| `admin-login.spec.ts`    | טופס כניסת מנהל, שגיאת התחברות, והגנת הנתיב `/admin`          |

## הוספת בדיקה חדשה

הוסיפו קובץ `*.spec.ts` בתיקיית `e2e/`. דפוס בסיסי:

```ts
import { test, expect } from '@playwright/test'

test('תיאור התרחיש', async ({ page }) => {
  await page.goto('/some-path')
  await page.getByRole('button', { name: 'טקסט הכפתור' }).click()
  await expect(page.getByText('תוצאה צפויה')).toBeVisible()
})
```
