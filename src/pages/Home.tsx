import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle'
import ProductCard from '../components/ProductCard'
import TrustBar from '../components/TrustBar'
import Seo from '../components/Seo'
import { organizationLd } from '../lib/seo'
import { getFeaturedProducts, getCategories, getSettings, getBanners } from '../lib/api'
import type { Banner, Product, Category, SiteSettings } from '../lib/types'
import { hero as heroDefaults, stats, solutions, caseStudies } from '../data/content'

function BannerSlider({ banners }: { banners: Banner[] }) {
  const [cur, setCur] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (banners.length <= 1) return
    timerRef.current = setInterval(() => setCur((c) => (c + 1) % banners.length), 5000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [banners.length])

  if (!banners.length) return null

  return (
    <div className="relative overflow-hidden bg-black" style={{ height: 'clamp(220px, 40vw, 500px)' }}>
      {banners.map((b, i) => (
        <div
          key={b.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === cur ? 1 : 0, pointerEvents: i === cur ? 'auto' : 'none' }}
        >
          {b.link_url ? (
            <a href={b.link_url} target="_blank" rel="noopener noreferrer" className="block h-full">
              <img src={b.image_url} alt={b.title_he ?? ''} className="h-full w-full object-cover" />
            </a>
          ) : (
            <img src={b.image_url} alt={b.title_he ?? ''} className="h-full w-full object-cover" />
          )}
          {b.title_he && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-6 pb-4 pt-8 text-white">
              <p className="text-base font-semibold md:text-xl">{b.title_he}</p>
            </div>
          )}
        </div>
      ))}
      {banners.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCur(i)
                if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
              }}
              className={`h-2.5 w-2.5 rounded-full transition-all ${i === cur ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/80'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function PromoBanner({ banners }: { banners: Banner[] }) {
  if (!banners.length) return null
  return (
    <section className="bg-white py-4">
      <div className="container space-y-3">
        {banners.map((b) =>
          b.link_url ? (
            <a key={b.id} href={b.link_url} target="_blank" rel="noopener noreferrer" className="block">
              <img src={b.image_url} alt={b.title_he ?? ''} className="w-full rounded-xl object-cover shadow-sm" />
            </a>
          ) : (
            <img key={b.id} src={b.image_url} alt={b.title_he ?? ''} className="w-full rounded-xl object-cover shadow-sm" />
          )
        )}
      </div>
    </section>
  )
}

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [settings, setSettings] = useState<SiteSettings>({})
  const [banners, setBanners] = useState<Banner[]>([])

  useEffect(() => {
    getFeaturedProducts().then(setFeatured).catch((e) => console.error(e))
    getCategories().then(setCategories).catch((e) => console.error(e))
    getSettings().then(setSettings).catch((e) => console.error(e))
    getBanners().then(setBanners).catch((e) => console.error(e))
  }, [])

  const heroBanners  = banners.filter((b) => b.position === 'hero')
  const promoBanners = banners.filter((b) => b.position === 'promo')
  const midBanners   = banners.filter((b) => b.position === 'mid')

  const heroImageUrl = settings.hero_image_url ?? 'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=1600&q=80'
  const heroTitle    = settings.hero_title    ?? heroDefaults.title
  const heroSubtitle = settings.hero_subtitle ?? heroDefaults.subtitle

  return (
    <>
      <Seo
        title="Tiandy ישראל | פתרונות אבטחה ומעקב וידאו"
        description="פתרונות אבטחה ומצלמות מתקדמים לשוק הישראלי — מצלמות רשת, NVR, בקרת כניסה ואנליטיקת וידאו מבוססת בינה מלאכותית."
        path="/"
        jsonLd={organizationLd()}
      />

      {/* Hero banner */}
      <section className="relative overflow-hidden bg-brand-900 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('${heroImageUrl}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-brand-900/95 via-brand-900/80 to-brand-800/40" />
        <div className="container relative py-16 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">{heroTitle}</h1>
            <p className="mt-5 max-w-lg text-lg text-brand-100">{heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={heroDefaults.primaryCta.to} className="btn bg-accent-500 text-white hover:bg-accent-400">
                {heroDefaults.primaryCta.label}
              </Link>
              <Link
                to={heroDefaults.secondaryCta.to}
                className="btn border border-white/60 text-white hover:bg-white/10"
              >
                {heroDefaults.secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hero banner slider */}
      {heroBanners.length > 0 && <BannerSlider banners={heroBanners} />}

      {/* Promo banner strip */}
      <PromoBanner banners={promoBanners} />

      {/* Product categories strip */}
      <section className="border-b border-slate-200 bg-white">
        <div className="container py-10">
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/products?cat=${c.slug}`}
                className="group rounded-xl border border-slate-200 p-4 text-center transition hover:border-brand-400 hover:bg-brand-50"
              >
                <div className="text-2xl">📷</div>
                <div className="mt-2 text-sm font-medium text-slate-700 group-hover:text-brand-600">
                  {c.name_he}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <TrustBar />

      {/* Stats */}
      <section className="bg-brand-700 text-white">
        <div className="container grid grid-cols-2 gap-6 py-12 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-extrabold">{s.value}</div>
              <div className="mt-1 text-sm text-brand-100">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="container py-16">
        <SectionTitle
          eyebrow="המוצרים שלנו"
          title="מוצרים נבחרים"
          subtitle="מבחר פתרונות מובילים למעקב ואבטחה."
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {featured.length === 0 && (
            <p className="text-slate-500">לא נמצאו מוצרים נבחרים כרגע.</p>
          )}
        </div>
        <div className="mt-8 text-center">
          <Link to="/products" className="btn-outline">
            לכל המוצרים
          </Link>
        </div>
      </section>

      {/* Mid-page promotional banner */}
      {midBanners.length > 0 && (
        <section className="py-4">
          <div className="container space-y-3">
            {midBanners.map((b) =>
              b.link_url ? (
                <a key={b.id} href={b.link_url} target="_blank" rel="noopener noreferrer" className="block">
                  <img src={b.image_url} alt={b.title_he ?? ''} className="w-full rounded-xl object-cover shadow-sm" />
                </a>
              ) : (
                <img key={b.id} src={b.image_url} alt={b.title_he ?? ''} className="w-full rounded-xl object-cover shadow-sm" />
              )
            )}
          </div>
        </section>
      )}

      {/* Solutions */}
      <section className="bg-slate-50 py-16">
        <div className="container">
          <SectionTitle
            center
            eyebrow="פתרונות"
            title="פתרונות לכל תחום"
            subtitle="התאמה מדויקת לצרכים של כל ענף ותעשייה."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((s) => (
              <Link
                to="/solutions"
                key={s.slug}
                className="card group p-6 transition hover:border-brand-400"
              >
                <div className="text-3xl">{s.icon}</div>
                <h3 className="mt-3 text-lg font-bold text-slate-900 group-hover:text-brand-600">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="container py-16">
        <SectionTitle center eyebrow="למה אנחנו" title="יתרונות שעושים את ההבדל" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { icon: '🛡️', t: 'אמינות מוכחת', d: 'ציוד עמיד בתקנים בינלאומיים ותמיכה לאורך זמן.' },
            { icon: '🤖', t: 'בינה מלאכותית', d: 'זיהוי אדם ורכב והפחתת התראות שווא.' },
            { icon: '🌐', t: 'נוכחות גלובלית', d: 'טכנולוגיה בפריסה בעשרות מדינות, מותאמת לישראל.' },
          ].map((f) => (
            <div key={f.t} className="card p-6 text-center">
              <div className="text-4xl">{f.icon}</div>
              <h3 className="mt-3 text-lg font-bold text-slate-900">{f.t}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Case studies */}
      <section className="bg-slate-50 py-16">
        <div className="container">
          <SectionTitle
            center
            eyebrow="סיפורי הצלחה"
            title="פרויקטים נבחרים"
            subtitle="תוצאות מדידות מפריסות אמיתיות בשטח."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {caseStudies.map((cs) => (
              <div key={cs.slug} className="card flex flex-col p-6">
                <span className="text-xs font-bold uppercase tracking-wide text-brand-500">
                  {cs.industry}
                </span>
                <h3 className="mt-2 text-lg font-bold text-slate-900">{cs.title}</h3>
                <p className="mt-2 flex-1 text-sm text-slate-600">{cs.desc}</p>
                <p className="mt-4 rounded-lg bg-brand-50 px-3 py-2 text-sm font-bold text-brand-700">
                  {cs.metric}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-800">
        <div className="container py-16 text-center text-white">
          <h2 className="text-2xl font-extrabold md:text-3xl">מחפשים פתרון אבטחה לעסק שלכם?</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">
            צוות המומחים שלנו ישמח לבנות עבורכם מערכת מותאמת אישית.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/quote" className="btn bg-accent-500 text-white hover:bg-accent-400">
              בקשת הצעת מחיר
            </Link>
            <Link to="/contact" className="btn border border-white/60 text-white hover:bg-white/10">
              לקבלת ייעוץ חינם
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
