// Central Hebrew content for the site. Edit text here freely.

export const site = {
  name: 'Tiandy ישראל',
  tagline: 'פתרונות אבטחה ומעקב וידאו לשוק הישראלי',
  phone: '03-0000000',
  email: 'info@tiandy-il.example',
  address: 'אזור התעשייה, תל אביב, ישראל',
}

// Click-to-call / click-to-email hrefs (important on mobile).
// Strips spaces/dashes from the phone so `tel:` dials correctly.
export const telHref = `tel:${site.phone.replace(/[^\d+]/g, '')}`
export const mailHref = `mailto:${site.email}`

// Public production URL — used for canonical links, sitemap and Open Graph.
// Update this if the site moves to a custom domain.
export const SITE_URL = 'https://ams110.github.io/Tiandy'

// Trust signals — industry certifications / compliance shown across the site.
// Replace the emoji with real badge images in /public when available.
export const certifications = [
  { code: 'ISO 9001', label: 'ניהול איכות', icon: '🏅' },
  { code: 'CE', label: 'תקן אירופי', icon: '✅' },
  { code: 'ONVIF', label: 'תאימות מצלמות', icon: '🔗' },
  { code: 'NDAA', label: 'תאימות ביטחונית', icon: '🛡️' },
  { code: 'UL', label: 'בטיחות חשמלית', icon: '⚡' },
]

// Customer / partner logos. Add real logo files to /public and set `logo`.
export const clients = [
  { name: 'עיריית תל אביב' },
  { name: 'רשת קמעונאות ארצית' },
  { name: 'נמל אשדוד' },
  { name: 'מוסד פיננסי מוביל' },
  { name: 'אוניברסיטה' },
]

// Case studies — replace with real projects and metrics.
export const caseStudies = [
  {
    slug: 'smart-city',
    industry: 'עיר חכמה',
    title: 'פריסת מעקב עירוני ב-120 צמתים',
    metric: '40% ↓ בזמני תגובה לאירועים',
    desc: 'מערכת מצלמות AI עם זיהוי לוחיות רישוי וניהול תנועה מרכזי.',
  },
  {
    slug: 'retail-chain',
    industry: 'קמעונאות',
    title: 'אבטחת 60 סניפים ברשת ארצית',
    metric: '30% ↓ באירועי גניבה',
    desc: 'ספירת מבקרים, התראות בזמן אמת וניהול מאוחד מכל הסניפים.',
  },
  {
    slug: 'logistics',
    industry: 'לוגיסטיקה',
    title: 'מתחם לוגיסטי בשטח 80 דונם',
    metric: 'כיסוי 24/7 ללא נקודות מתות',
    desc: 'מצלמות עמידות לתנאי חוץ עם אנליטיקת חדירה להיקף.',
  },
]

export const nav = [
  { to: '/', label: 'דף הבית' },
  { to: '/products', label: 'מוצרים' },
  { to: '/solutions', label: 'פתרונות' },
  { to: '/about', label: 'אודות' },
  { to: '/news', label: 'חדשות' },
  { to: '/contact', label: 'צור קשר' },
]

export const hero = {
  title: 'טכנולוגיית מעקב חכמה לכל סביבה',
  subtitle:
    'מצלמות רשת, מקליטים, בקרת כניסה ואנליטיקת וידאו מבוססת בינה מלאכותית — מותאמים לעסקים, מוסדות ותעשייה בישראל.',
  primaryCta: { label: 'לצפייה במוצרים', to: '/products' },
  secondaryCta: { label: 'דברו איתנו', to: '/contact' },
}

export const stats = [
  { value: '15+', label: 'שנות ניסיון בתחום' },
  { value: '60+', label: 'מדינות פעילות' },
  { value: '24/7', label: 'תמיכה טכנית' },
  { value: '4K', label: 'איכות תמונה' },
]

export const solutions = [
  {
    slug: 'retail',
    icon: '🛍️',
    title: 'קמעונאות',
    desc: 'הגנה על חנויות ומרכזי קניות, מניעת גניבות וספירת מבקרים בזמן אמת.',
  },
  {
    slug: 'city',
    icon: '🏙️',
    title: 'עיר חכמה',
    desc: 'מעקב עירוני, ניהול תנועה וזיהוי לוחיות רישוי לרשויות מקומיות.',
  },
  {
    slug: 'industry',
    icon: '🏭',
    title: 'תעשייה ולוגיסטיקה',
    desc: 'אבטחת מתחמים, מחסנים ונמלים עם מצלמות עמידות ואנליטיקה.',
  },
  {
    slug: 'banking',
    icon: '🏦',
    title: 'בנקאות ופיננסים',
    desc: 'הגנה על סניפים וכספומטים עם זיהוי אירועים חריגים.',
  },
  {
    slug: 'education',
    icon: '🎓',
    title: 'חינוך',
    desc: 'בטיחות בקמפוסים ובבתי ספר עם בקרת כניסה ומעקב.',
  },
  {
    slug: 'transport',
    icon: '🚆',
    title: 'תחבורה',
    desc: 'אבטחת תחנות, רכבות ושדות תעופה עם פתרונות מרכזיים.',
  },
]

export const about = {
  title: 'אודות החברה',
  intro:
    'אנו נציגים מובילים של פתרונות מעקב וידאו בישראל, ומספקים מערכות אבטחה מתקדמות לעסקים, מוסדות וגופים ציבוריים.',
  paragraphs: [
    'הצוות שלנו משלב ידע הנדסי עמוק עם היכרות מעמיקה של השוק המקומי, ומלווה את הלקוחות משלב התכנון ועד ההתקנה והתחזוקה השוטפת.',
    'אנו מאמינים שטכנולוגיית אבטחה צריכה להיות פשוטה לתפעול, אמינה לאורך זמן ומותאמת לצרכים הייחודיים של כל ארגון.',
  ],
  values: [
    { title: 'אמינות', desc: 'ציוד עמיד ותמיכה מקצועית לאורך כל חיי המערכת.' },
    { title: 'חדשנות', desc: 'אנליטיקה מבוססת בינה מלאכותית בקדמת הטכנולוגיה.' },
    { title: 'שירות', desc: 'מענה מהיר בעברית וליווי אישי לכל לקוח.' },
  ],
}

export const news = [
  {
    id: 'n1',
    date: '2026-05-10',
    title: 'השקת סדרת מצלמות AI חדשה',
    excerpt: 'סדרה חדשה של מצלמות עם זיהוי אדם ורכב מובנה, להפחתת התראות שווא.',
  },
  {
    id: 'n2',
    date: '2026-04-22',
    title: 'שיתוף פעולה עם משלבי מערכות מקומיים',
    excerpt: 'הרחבת רשת השותפים בישראל לשיפור זמני ההתקנה והתמיכה.',
  },
  {
    id: 'n3',
    date: '2026-03-15',
    title: 'עדכון קושחה לשיפור אבטחת הסייבר',
    excerpt: 'עדכון מומלץ לכלל המצלמות והמקליטים לחיזוק ההגנה מפני איומי רשת.',
  },
]
