import type { CSSProperties } from 'react'

// Decorative "live AI detection" overlay for the hero — a sweeping scan line
// plus detection boxes that travel along the traffic flow (so they read as
// tracking moving vehicles, matching the background video, rather than sitting
// in fixed spots). Purely visual: aria-hidden and pointer-events-none, so it
// never interferes with content or screen readers. Honors reduced-motion.
type Box = {
  label: string
  conf: string
  anim: string
  dur: string
  delay?: string
  style: CSSProperties
}

// Each box starts near the left and drifts across the scene along a road-like
// path. Shown on md+ only; mobile keeps just the scan line + badge.
const boxes: Box[] = [
  {
    label: 'רכב',
    conf: '97%',
    anim: 'tdy-trk-a',
    dur: '7.5s',
    style: { left: '1%', top: '50%', width: 'clamp(70px,8vw,120px)', height: 'clamp(46px,5vw,80px)' },
  },
  {
    label: 'רכב',
    conf: '95%',
    anim: 'tdy-trk-b',
    dur: '9.5s',
    delay: '-3s',
    style: { left: '3%', top: '14%', width: 'clamp(60px,7vw,104px)', height: 'clamp(42px,5vw,74px)' },
  },
  {
    label: 'רכב',
    conf: '93%',
    anim: 'tdy-trk-a',
    dur: '8.5s',
    delay: '-5s',
    style: { left: '5%', top: '70%', width: 'clamp(56px,6vw,92px)', height: 'clamp(40px,4.5vw,68px)' },
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

      {/* Tracking detection boxes (desktop only) */}
      {boxes.map((b, i) => (
        <div
          key={i}
          className={`${b.anim} absolute hidden md:block`}
          style={{ ...b.style, animationDuration: b.dur, animationDelay: b.delay }}
        >
          {/* corner-bracket frame */}
          <span className="absolute -left-px -top-px h-3.5 w-3.5 border-l-2 border-t-2 border-accent-400" />
          <span className="absolute -right-px -top-px h-3.5 w-3.5 border-r-2 border-t-2 border-accent-400" />
          <span className="absolute -bottom-px -left-px h-3.5 w-3.5 border-b-2 border-l-2 border-accent-400" />
          <span className="absolute -bottom-px -right-px h-3.5 w-3.5 border-b-2 border-r-2 border-accent-400" />
          <span className="absolute inset-0 rounded-[3px] ring-1 ring-accent-400/25" />
          {/* label chip */}
          <span className="absolute -top-5 right-0 whitespace-nowrap rounded bg-accent-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-slate-900 shadow">
            {b.label}<span className="opacity-70"> · {b.conf}</span>
          </span>
        </div>
      ))}
    </div>
  )
}
