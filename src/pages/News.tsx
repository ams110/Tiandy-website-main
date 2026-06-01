import SectionTitle from '../components/SectionTitle'
import Seo from '../components/Seo'
import { breadcrumbLd } from '../lib/seo'
import { news } from '../data/content'

export default function News() {
  return (
    <div className="container py-12">
      <Seo
        title="חדשות ומאמרים"
        description="עדכונים, השקות מוצרים ומאמרים מקצועיים בתחום אבטחה ומעקב וידאו."
        path="/news"
        jsonLd={breadcrumbLd([
          { name: 'דף הבית', path: '/' },
          { name: 'חדשות', path: '/news' },
        ])}
      />
      <SectionTitle
        eyebrow="עדכונים"
        title="חדשות ומאמרים"
        subtitle="התעדכנו בחידושים, השקות מוצרים ועדכוני מערכת."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {news.map((item) => (
          <article key={item.id} className="card overflow-hidden">
            <div className="bg-brand-50 px-6 py-3 text-sm font-medium text-brand-700">
              {new Date(item.date).toLocaleDateString('he-IL')}
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
