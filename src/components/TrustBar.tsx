import { certifications, clients } from '../data/content'

// Trust signals — certifications/compliance + customer logos.
// Strong B2B conversion driver, especially in the security industry.
export default function TrustBar() {
  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="container py-14">
        <p className="text-center text-sm font-semibold text-slate-500">תקנים ותאימות</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {certifications.map((c) => (
            <span
              key={c.code}
              className="text-base font-semibold tracking-wide text-slate-500 transition hover:text-brand-700"
              title={c.label}
            >
              {c.code}
            </span>
          ))}
        </div>

        <p className="mt-12 text-center text-sm font-semibold text-slate-500">לקוחות ושותפים</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {clients.map((c) => (
            <span
              key={c.name}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm font-medium text-slate-500"
            >
              {c.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
