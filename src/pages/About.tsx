import SectionTitle from '../components/SectionTitle'
import Seo from '../components/Seo'
import { breadcrumbLd } from '../lib/seo'
import { about, stats } from '../data/content'

export default function About() {
  return (
    <div className="container py-12">
      <Seo
        title="אודות"
        description={about.intro}
        path="/about"
        jsonLd={breadcrumbLd([
          { name: 'דף הבית', path: '/' },
          { name: 'אודות', path: '/about' },
        ])}
      />
      <SectionTitle eyebrow="מי אנחנו" title={about.title} subtitle={about.intro} />

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="space-y-4 text-slate-700">
          {about.paragraphs.map((p, i) => (
            <p key={i} className="leading-relaxed">{p}</p>
          ))}
        </div>
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80"
          alt="צוות החברה"
          width={900}
          height={600}
          loading="lazy"
          className="aspect-[3/2] w-full rounded-2xl object-cover shadow-lg"
        />
      </div>

      <div className="mt-12 grid grid-cols-2 gap-6 rounded-2xl bg-slate-50 p-8 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-3xl font-extrabold text-brand-600">{s.value}</div>
            <div className="mt-1 text-sm text-slate-600">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {about.values.map((v) => (
          <div key={v.title} className="card p-6">
            <h3 className="text-lg font-bold text-brand-600">{v.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{v.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
