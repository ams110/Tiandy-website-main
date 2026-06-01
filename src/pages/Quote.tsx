import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle'
import Seo from '../components/Seo'
import { breadcrumbLd } from '../lib/seo'
import { submitLead } from '../lib/api'
import { telHref, mailHref, site } from '../data/content'

// Request-for-Quote (RFQ) — a higher-intent B2B form. Opens with a qualifying
// question (project scope) before personal details to signal a real conversation.
export default function Quote() {
  const [params] = useSearchParams()
  const product = params.get('product') ?? ''
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({
    scope: '',
    sites: '',
    name: '',
    company: '',
    email: '',
    phone: '',
    message: product ? `מתעניין במוצר: ${product}` : '',
  })

  function update(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    const meta = { scope: form.scope, sites: form.sites, product: product || undefined }
    try {
      await submitLead({
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        message: form.message,
        type: 'rfq',
        meta,
      })
      setSent(true)
    } catch (err) {
      console.error(err)
      const body =
        `בקשת הצעת מחיר\n\nהיקף: ${form.scope}\nמספר אתרים: ${form.sites}\n` +
        `שם: ${form.name}\nחברה: ${form.company}\nטלפון: ${form.phone}\nדוא״ל: ${form.email}\n\n${form.message}`
      window.location.href = `${mailHref}?subject=${encodeURIComponent('בקשת הצעת מחיר מהאתר')}&body=${encodeURIComponent(body)}`
      setSent(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="container py-12">
      <Seo
        title="בקשת הצעת מחיר"
        description="קבלו הצעת מחיר מותאמת למערכת אבטחה ומצלמות — מלאו פרטי הפרויקט ונחזור אליכם."
        path="/quote"
        jsonLd={breadcrumbLd([
          { name: 'דף הבית', path: '/' },
          { name: 'בקשת הצעת מחיר', path: '/quote' },
        ])}
      />
      <SectionTitle
        eyebrow="הצעת מחיר"
        title="בואו נבנה לכם מערכת מותאמת"
        subtitle="ספרו לנו על הפרויקט ונחזור אליכם עם הצעה תוך 24 שעות."
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="card p-6">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="text-4xl">✅</div>
                <h3 className="mt-3 text-lg font-bold text-slate-900">הבקשה התקבלה!</h3>
                <p className="mt-1 text-sm text-slate-600">נחזור אליכם עם הצעה בהקדם.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Qualifying questions first */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">סוג הפרויקט</label>
                    <select
                      required
                      className="field"
                      value={form.scope}
                      onChange={(e) => update('scope', e.target.value)}
                    >
                      <option value="">— בחרו —</option>
                      <option value="new">התקנה חדשה</option>
                      <option value="upgrade">שדרוג מערכת קיימת</option>
                      <option value="expansion">הרחבת מערכת</option>
                      <option value="consult">ייעוץ בלבד</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">מספר אתרים / מצלמות (משוער)</label>
                    <input
                      className="field"
                      placeholder="לדוגמה: 3 אתרים, ~40 מצלמות"
                      value={form.sites}
                      onChange={(e) => update('sites', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">שם מלא</label>
                    <input
                      required
                      className="field"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">חברה <span className="font-normal text-slate-400">(לא חובה)</span></label>
                    <input
                      className="field"
                      value={form.company}
                      onChange={(e) => update('company', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">דוא״ל</label>
                    <input
                      type="email"
                      required
                      className="field"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">טלפון <span className="font-normal text-slate-400">(לא חובה)</span></label>
                    <input
                      className="field"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">פרטים נוספים</label>
                  <textarea
                    rows={4}
                    className="field"
                    placeholder="תארו את הצרכים, סוג האתר, דרישות מיוחדות…"
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                  />
                </div>

                <button type="submit" disabled={sending} className="btn-primary w-full disabled:opacity-60">
                  {sending ? 'שולח…' : 'שליחת בקשה'}
                </button>
              </form>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card p-6">
            <h3 className="font-bold text-slate-900">מעדיפים לדבר?</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>📞 <a href={telHref} className="font-medium text-brand-600 hover:underline">{site.phone}</a></li>
              <li>✉️ <a href={mailHref} className="font-medium text-brand-600 hover:underline">{site.email}</a></li>
            </ul>
          </div>
          <div className="card bg-brand-50 p-6 text-sm text-brand-800">
            <p className="font-bold">למה Tiandy ישראל?</p>
            <ul className="mt-2 space-y-1">
              <li>✓ תאימות ONVIF ו-NDAA</li>
              <li>✓ אנליטיקת AI מובנית</li>
              <li>✓ תמיכה ושירות בעברית</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
