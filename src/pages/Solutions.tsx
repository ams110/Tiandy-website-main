import SectionTitle from '../components/SectionTitle'
import Seo from '../components/Seo'
import { breadcrumbLd } from '../lib/seo'
import { solutions } from '../data/content'

export default function Solutions() {
  return (
    <div className="container py-12">
      <Seo
        title="פתרונות"
        description="פתרונות אבטחה מותאמים לכל ענף — קמעונאות, עיר חכמה, תעשייה, בנקאות, חינוך ותחבורה."
        path="/solutions"
        jsonLd={breadcrumbLd([
          { name: 'דף הבית', path: '/' },
          { name: 'פתרונות', path: '/solutions' },
        ])}
      />
      <SectionTitle
        eyebrow="פתרונות"
        title="פתרונות מותאמים לכל ענף"
        subtitle="אנו מתאימים את הטכנולוגיה לאתגרים הספציפיים של כל תחום פעילות."
      />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {solutions.map((s) => (
          <div key={s.slug} className="card p-6">
            <div className="text-4xl">{s.icon}</div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">{s.title}</h3>
            <p className="mt-2 text-slate-600">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-8">
        <h3 className="text-xl font-bold text-slate-900">איך אנחנו עובדים</h3>
        <div className="mt-6 grid gap-6 md:grid-cols-4">
          {[
            { n: '1', t: 'אפיון צרכים', d: 'הבנת הדרישות וסקר באתר.' },
            { n: '2', t: 'תכנון מערכת', d: 'בחירת ציוד ופריסה מיטבית.' },
            { n: '3', t: 'התקנה', d: 'התקנה מקצועית והגדרה מלאה.' },
            { n: '4', t: 'תמיכה', d: 'ליווי ותחזוקה שוטפת לאורך זמן.' },
          ].map((step) => (
            <div key={step.n}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 font-bold text-white">
                {step.n}
              </div>
              <h4 className="mt-3 font-bold text-slate-800">{step.t}</h4>
              <p className="mt-1 text-sm text-slate-600">{step.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
