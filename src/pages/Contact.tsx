import { useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import Seo from '../components/Seo'
import { breadcrumbLd } from '../lib/seo'
import { submitLead } from '../lib/api'
import { site, telHref, mailHref } from '../data/content'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  function update(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    try {
      await submitLead({ ...form, type: 'contact' })
      setSent(true)
    } catch (err) {
      // Graceful fallback: if the leads table/CRM isn't wired yet, open the
      // user's email client pre-filled so the lead is never lost.
      console.error(err)
      const body = `שם: ${form.name}\nטלפון: ${form.phone}\nדוא״ל: ${form.email}\n\n${form.message}`
      window.location.href = `${mailHref}?subject=${encodeURIComponent('פנייה מהאתר')}&body=${encodeURIComponent(body)}`
      setSent(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="container py-12">
      <Seo
        title="צור קשר"
        description="צרו קשר עם צוות Tiandy ישראל — טלפון, דוא״ל וטופס פנייה מהיר."
        path="/contact"
        jsonLd={breadcrumbLd([
          { name: 'דף הבית', path: '/' },
          { name: 'צור קשר', path: '/contact' },
        ])}
      />
      <SectionTitle
        eyebrow="יצירת קשר"
        title="דברו איתנו"
        subtitle="השאירו פרטים ונחזור אליכם בהקדם עם הצעה מותאמת."
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-slate-900">פרטי התקשרות</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>📞 טלפון: <a href={telHref} className="font-medium text-brand-600 hover:underline">{site.phone}</a></li>
              <li>✉️ דוא״ל: <a href={mailHref} className="font-medium text-brand-600 hover:underline">{site.email}</a></li>
              <li>📍 כתובת: {site.address}</li>
              <li>🕘 שעות פעילות: א׳–ה׳, 09:00–17:00</li>
            </ul>
          </div>
        </div>

        <div className="card p-6">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="text-4xl">✅</div>
              <h3 className="mt-3 text-lg font-bold text-slate-900">הפנייה נשלחה!</h3>
              <p className="mt-1 text-sm text-slate-600">נחזור אליכם בהקדם האפשרי.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">שם מלא</label>
                <input
                  required
                  className="field"
                  placeholder="ישראל ישראלי"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">טלפון <span className="font-normal text-slate-400">(לא חובה)</span></label>
                  <input
                    className="field"
                    placeholder="050-0000000"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">דוא״ל</label>
                  <input
                    type="email"
                    required
                    className="field"
                    placeholder="name@email.com"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="label">הודעה</label>
                <textarea
                  required
                  rows={4}
                  className="field"
                  placeholder="כיצד נוכל לעזור?"
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                />
              </div>
              <button type="submit" disabled={sending} className="btn-primary w-full disabled:opacity-60">
                {sending ? 'שולח…' : 'שליחה'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
