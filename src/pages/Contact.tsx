import { useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import { site, telHref, mailHref } from '../data/content'

export default function Contact() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Demo only — wire this to email/CRM/Supabase as needed.
    setSent(true)
  }

  return (
    <div className="container py-12">
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
                <input required className="field" placeholder="ישראל ישראלי" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">טלפון</label>
                  <input required className="field" placeholder="050-0000000" />
                </div>
                <div>
                  <label className="label">דוא״ל</label>
                  <input type="email" required className="field" placeholder="name@email.com" />
                </div>
              </div>
              <div>
                <label className="label">הודעה</label>
                <textarea required rows={4} className="field" placeholder="כיצד נוכל לעזור?" />
              </div>
              <button type="submit" className="btn-primary w-full">
                שליחה
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
