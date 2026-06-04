// Decorative "live AI detection" overlay for the hero — animated scan line and
// pulsing detection boxes (person / vehicle / face) that evoke Tiandy's AI video
// analytics. Purely visual: aria-hidden and pointer-events-none, so it never
// interferes with content, links or screen readers. Honors reduced-motion.
import type { CSSProperties } from 'react'

type Box = {
  label: string
  conf?: string
  style: CSSProperties
  className?: string
  delay?: string
}

const boxes: Box[] = [
  {
    label: 'אדם',
    conf: '98%',
    style: { left: '7%', top: '26%', width: 'clamp(86px, 11vw, 150px)', height: 'clamp(120px, 16vw, 200px)' },
    className: 'hidden md:block',
  },
  {
    label: 'רכב',
    conf: '96%',
    style: { left: '30%', top: '54%', width: 'clamp(96px, 13vw, 180px)', height: 'clamp(70px, 9vw, 120px)' },
    className: 'hidden md:block',
    delay: '-3s',
  },
  {
    label: 'פנים',
    conf: '94%',
    style: { left: '20%', top: '12%', width: 'clamp(56px, 7vw, 92px)', height: 'clamp(56px, 7vw, 92px)' },
    className: 'hidden lg:block',
    delay: '-1.5s',
  },
]

export default function HeroAIDetection() {
  return (
    <div aria-hidden data-testid="hero-ai" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Sweeping scan line over the image side */}
      <div className="absolute inset-y-0 left-0 w-full sm:w-3/5">
        <div className="tdy-scanline absolute right-0 left-0 h-px bg-gradient-to-r from-transparent via-accent-400 to-transparent shadow-[0_0_14px_2px_rgba(110,232,79,0.55)]" />
      </div>

      {/* LIVE · AI badge */}
      <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-accent-400/40 bg-black/40 px-2.5 py-1 backdrop-blur-sm">
        <span className="tdy-dot inline-block h-2 w-2 rounded-full bg-accent-400 shadow-[0_0_8px_rgba(110,232,79,0.9)]" />
        <span className="text-[11px] font-bold tracking-wide text-accent-400">AI&nbsp;LIVE</span>
      </div>

      {/* Detection boxes */}
      {boxes.map((b) => (
        <div
          key={b.label}
          className={`tdy-box absolute ${b.className ?? ''}`}
          style={{ ...b.style, animationDelay: b.delay }}
        >
          {/* corner-bracket frame */}
          <span className="absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2 border-accent-400" />
          <span className="absolute -right-px -top-px h-4 w-4 border-r-2 border-t-2 border-accent-400" />
          <span className="absolute -bottom-px -left-px h-4 w-4 border-b-2 border-l-2 border-accent-400" />
          <span className="absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-accent-400" />
          <span className="absolute inset-0 rounded-[3px] ring-1 ring-accent-400/30" />
          {/* label chip */}
          <span className="absolute -top-6 right-0 whitespace-nowrap rounded bg-accent-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-slate-900 shadow">
            {b.label}
            {b.conf && <span className="opacity-70"> · {b.conf}</span>}
          </span>
        </div>
      ))}
    </div>
  )
}
