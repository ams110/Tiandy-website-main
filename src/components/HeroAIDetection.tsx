// Stylized "AI traffic monitoring" hero scene. Fully self-contained and
// deterministic: cars drive down stylized lanes, and the tracked cars carry
// their detection box AS THE SAME ELEMENT — so the box is mathematically locked
// to the car (perfect sync, unlike an overlay on real footage). Decorative:
// aria-hidden + pointer-events-none; honors prefers-reduced-motion globally.

type Car = {
  lane: number   // left position, % of hero
  w: number      // width in px
  dur: number    // seconds to cross
  delay: number  // negative => already on screen
  tracked?: boolean
  conf?: string
}

// A few lanes on the left; mostly calm traffic with just two AI-tracked
// vehicles so the scene stays elegant and never competes with the headline.
const cars: Car[] = [
  { lane: 7,  w: 15, dur: 15, delay: -2 },
  { lane: 7,  w: 14, dur: 15, delay: -10, tracked: true, conf: '98%' },
  { lane: 17, w: 15, dur: 18, delay: -6 },
  { lane: 27, w: 16, dur: 13, delay: -3, tracked: true, conf: '96%' },
  { lane: 27, w: 14, dur: 13, delay: -9 },
  { lane: 36, w: 14, dur: 16, delay: -5 },
]

export default function HeroAIDetection() {
  return (
    <div aria-hidden data-testid="hero-ai" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Stylized road + moving traffic (desktop only — keeps mobile uncluttered).
          Kept subtle (low opacity) so it reads as quiet ambiance, not clutter. */}
      <div className="absolute inset-y-0 left-0 hidden w-[42%] opacity-60 md:block">
        {/* lane divider dashes */}
        {[12, 22, 32].map((x) => (
          <div
            key={x}
            className="absolute inset-y-0"
            style={{
              left: `${x}%`,
              width: '2px',
              backgroundImage:
                'repeating-linear-gradient(to bottom, rgba(148,163,184,0.18) 0 18px, transparent 18px 46px)',
            }}
          />
        ))}

        {/* cars */}
        {cars.map((c, i) => (
          <div
            key={i}
            className="tdy-drive absolute"
            style={{
              left: `${c.lane}%`,
              width: `${c.w}px`,
              height: `${Math.round(c.w * 1.8)}px`,
              animationDuration: `${c.dur}s`,
              animationDelay: `${c.delay}s`,
            }}
          >
            {/* car body (top-down, dimmed so it stays subtle) */}
            <div
              className="h-full w-full rounded-[4px]"
              style={{
                background: 'linear-gradient(180deg,#cbd5e1 0%,#64748b 45%,#334155 100%)',
                boxShadow: '0 5px 9px -3px rgba(226,232,240,0.25)',
              }}
            />
            {c.tracked && (
              <>
                {/* corner-bracket detection box, locked to the car */}
                <span className="absolute -left-1.5 -top-1.5 h-3 w-3 border-l-2 border-t-2 border-accent-400" />
                <span className="absolute -right-1.5 -top-1.5 h-3 w-3 border-r-2 border-t-2 border-accent-400" />
                <span className="absolute -bottom-1.5 -left-1.5 h-3 w-3 border-b-2 border-l-2 border-accent-400" />
                <span className="absolute -bottom-1.5 -right-1.5 h-3 w-3 border-b-2 border-r-2 border-accent-400" />
                <span className="absolute -inset-1.5 rounded-[3px] ring-1 ring-accent-400/30" />
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-accent-500 px-1.5 py-0.5 text-[9px] font-bold leading-none text-slate-900 shadow">
                  רכב<span className="opacity-70"> · {c.conf}</span>
                </span>
              </>
            )}
          </div>
        ))}

        {/* sweeping scan line over the road */}
        <div className="tdy-scanline absolute right-0 left-0 h-px bg-gradient-to-r from-transparent via-accent-400 to-transparent shadow-[0_0_14px_2px_rgba(110,232,79,0.55)]" />
      </div>

      {/* LIVE · AI badge */}
      <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-accent-400/40 bg-black/40 px-2.5 py-1 backdrop-blur-sm">
        <span className="tdy-dot inline-block h-2 w-2 rounded-full bg-accent-400 shadow-[0_0_8px_rgba(110,232,79,0.9)]" />
        <span className="text-[11px] font-bold tracking-wide text-accent-400">AI&nbsp;LIVE</span>
      </div>
    </div>
  )
}
