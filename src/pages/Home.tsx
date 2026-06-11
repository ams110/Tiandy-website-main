import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle'
import ProductCard from '../components/ProductCard'
import TrustBar from '../components/TrustBar'
import HeroAIDetection from '../components/HeroAIDetection'
import Camera3DShowcase from '../components/Camera3DShowcase'
import Icon from '../components/Icon'
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
              <img src={b.image_url} alt={b.title_he ?? ''} className="h-full w-full object-contain" />
            </a>
          ) : (
            <img src={b.image_url} alt={b.title_he ?? ''} className="h-full w-full object-contain" />
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
      <section className="relative overflow-hidden bg-slate-900 text-white">
        {/* Stylized, fully-synced AI traffic-monitoring scene (decorative) */}
        <HeroAIDetection />
        <div className="absolute inset-0 bg-gradient-to-l from-slate-900/90 via-slate-900/55 to-slate-900/10" />
        <div className="container relative py-24 md:py-36">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">{heroTitle}</h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-300">{heroSubtitle}</p>
            <div className="mt-8">
              <Link to={heroDefaults.primaryCta.to} className="btn bg-brand-500 px-6 py-3 text-white hover:bg-brand-600">
                {heroDefaults.primaryCta.label}
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
                className="group overflow-hidden rounded-xl border border-slate-200 text-center transition hover:border-brand-400 hover:shadow-md"
              >
                <div className="h-28 overflow-hidden bg-slate-100">
                  {c.image_url ? (
                    <img
                      src={c.image_url}
                      alt={c.name_he}
                      className="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-3xl">📷</div>
                  )}
                </div>
                <div className="px-2 py-2 text-sm font-medium text-slate-700 group-hover:text-brand-600">
                  {c.name_he}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <TrustBar />

      {/* Interactive 3D camera showcase (Tiandy TC-H389M PTZ) */}
      <Camera3DShowcase />

      {/* Stats */}
      <section className="border-b border-slate-200 bg-white">
        <div className="container grid grid-cols-2 gap-y-10 py-16 md:grid-cols-4 md:divide-x md:divide-slate-200 md:rtl:divide-x-reverse">
          {stats.map((s) => (
            <div key={s.label} className="px-4 text-center">
              <div className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">{s.value}</div>
              <div className="mt-2 text-sm font-medium uppercase tracking-wide text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products — only rendered when there are featured items, so the
          homepage never shows an empty section. Flag products as "מובלט" in the
          admin to populate it. */}
      {featured.length > 0 && (
        <section className="container py-24">
          <SectionTitle
            eyebrow="המוצרים שלנו"
            title="מוצרים נבחרים"
            subtitle="מבחר פתרונות מובילים למעקב ואבטחה."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/products" className="btn-outline">
              לכל המוצרים
            </Link>
          </div>
        </section>
      )}

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
      <section className="bg-slate-50 py-24">
        <div className="container">
          <SectionTitle
            center
            eyebrow="פתרונות"
            title="פתרונות לכל תחום"
            subtitle="התאמה מדויקת לצרכים של כל ענף ותעשייה."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((s) => (
              <Link
                to="/solutions"
                key={s.slug}
                className="group rounded-2xl border border-slate-200 bg-white p-8 transition hover:border-brand-300 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-500 group-hover:text-white">
                  <Icon name={s.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="container py-24">
        <SectionTitle center eyebrow="למה אנחנו" title="יתרונות שעושים את ההבדל" />
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {[
            { icon: 'reliability', t: 'אמינות מוכחת', d: 'ציוד עמיד בתקנים בינלאומיים ותמיכה לאורך זמן.' },
            { icon: 'ai', t: 'בינה מלאכותית', d: 'זיהוי אדם ורכב והפחתת התראות שווא.' },
            { icon: 'global', t: 'נוכחות גלובלית', d: 'טכנולוגיה בפריסה בעשרות מדינות, מותאמת לישראל.' },
          ].map((f) => (
            <div key={f.t} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <Icon name={f.icon} className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{f.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Case studies */}
      <section className="bg-slate-50 py-24">
        <div className="container">
          <SectionTitle
            center
            eyebrow="סיפורי הצלחה"
            title="פרויקטים נבחרים"
            subtitle="תוצאות מדידות מפריסות אמיתיות בשטח."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {caseStudies.map((cs) => (
              <div key={cs.slug} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-600">
                  {cs.industry}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{cs.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{cs.desc}</p>
                <p className="mt-6 border-t border-slate-100 pt-4 text-base font-semibold text-brand-600">
                  {cs.metric}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900">
        <div className="container py-24 text-center text-white">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">מחפשים פתרון אבטחה לעסק שלכם?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
            צוות המומחים שלנו ישמח לבנות עבורכם מערכת מותאמת אישית.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/quote" className="btn bg-brand-500 px-6 py-3 text-white hover:bg-brand-600">
              בקשת הצעת מחיר
            </Link>
            <Link to="/contact" className="btn border border-white/30 px-6 py-3 text-white hover:bg-white/10">
              לקבלת ייעוץ חינם
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
