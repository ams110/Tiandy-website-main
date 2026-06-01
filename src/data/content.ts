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
