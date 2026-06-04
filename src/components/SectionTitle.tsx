export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  center,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  center?: boolean
}) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg leading-relaxed text-slate-500">{subtitle}</p>}
    </div>
  )
}
