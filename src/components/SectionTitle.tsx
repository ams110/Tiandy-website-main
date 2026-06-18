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
        <span
          className={`inline-flex items-center gap-2 text-sm font-semibold text-brand-700 ${
            center ? 'justify-center' : ''
          }`}
        >
          <span className="h-px w-6 bg-brand-400" aria-hidden />
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-pretty text-lg leading-relaxed text-slate-500">{subtitle}</p>
      )}
    </div>
  )
}
