import { certifications, clients } from '../data/content'

// Trust signals — certifications/compliance + customer logos.
// Strong B2B conversion driver, especially in the security industry.
export default function TrustBar() {
  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="container py-8">
        <p className="text-center text-xs font-bold uppercase tracking-wide text-slate-400">
          תקנים ותאימות
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {certifications.map((c) => (
            <div
              key={c.code}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
              title={c.label}
            >
              <span className="text-lg" aria-hidden>{c.icon}</span>
              <span className="text-sm font-bold text-slate-700">{c.code}</span>
              <span className="hidden text-xs text-slate-400 sm:inline">{c.label}</span>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs font-bold uppercase tracking-wide text-slate-400">
          לקוחות ושותפים
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {clients.map((c) => (
            <span key={c.name} className="text-sm font-medium text-slate-500">
              {c.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
