// Homepage "meet the camera in 3D" section.
//
// The heavy WebGL scene (CameraScene) is:
//   1. lazy-loaded, so three.js/@react-three/* land in a separate chunk that is
//      only fetched on the client (never during SSG/prerender);
//   2. gated behind a `mounted` flag (effects don't run server-side) so the
//      prerendered HTML and the first client render both show the poster — no
//      hydration mismatch;
//   3. gated behind an IntersectionObserver so the canvas only mounts (and only
//      animates) while it's actually on screen;
//   4. wrapped in an error boundary, so a device without WebGL gracefully falls
//      back to the static poster instead of breaking the page.

import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'
import { showcase3d } from '../data/content'

const CameraScene = lazy(() => import('./showcase/CameraScene'))

/** Falls back to `fallback` if the 3D scene throws (e.g. WebGL unavailable). */
class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduced
}

/** Static placeholder shown before the canvas mounts and as the error fallback. */
function Poster() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
      <div className="relative flex h-40 w-40 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full border border-brand-500/30" />
        <span className="absolute inset-4 rounded-full border border-brand-500/20" />
        {/* Simple camera glyph so the area never looks empty */}
        <svg viewBox="0 0 24 24" className="h-20 w-20 text-brand-400/70" fill="none" stroke="currentColor" strokeWidth={1.2}>
          <circle cx="12" cy="11" r="6" />
          <circle cx="12" cy="11" r="2.4" />
          <path d="M12 3.5v1.5M5 17l-1.5 2.5M19 17l1.5 2.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}

export default function Camera3DShowcase() {
  const stageRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [inView, setInView] = useState(false)
  const reduced = usePrefersReducedMotion()

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const el = stageRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '200px 0px', threshold: 0.01 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [mounted])

  const showCanvas = mounted && inView

  return (
    <section
      aria-label={showcase3d.title}
      data-testid="camera-3d-showcase"
      className="relative overflow-hidden bg-slate-900 text-white"
    >
      {/* subtle grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, #000 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, #000 40%, transparent 100%)',
        }}
      />

      <div className="container relative grid items-center gap-10 py-20 lg:grid-cols-2 lg:gap-6 lg:py-24">
        {/* Copy + specs */}
        <div className="order-2 lg:order-1">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
            <Icon name="cube" className="h-4 w-4" />
            {showcase3d.eyebrow}
          </span>

          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight md:text-4xl">{showcase3d.title}</h2>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-slate-300">{showcase3d.subtitle}</p>

          {/* Model name plate */}
          <div className="mt-6 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
            <span className="text-base font-bold text-white">{showcase3d.model}</span>
            <span className="text-xs text-slate-400">{showcase3d.modelTag}</span>
            <span className="rounded-md bg-brand-500/20 px-2 py-0.5 text-xs font-semibold text-brand-300">
              {showcase3d.resolution}
            </span>
          </div>

          {/* Spec highlights */}
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {showcase3d.features.map((f) => (
              <li key={f.label} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300">
                  <Icon name={f.icon} className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs font-medium uppercase tracking-wide text-slate-400">{f.label}</span>
                  <span className="block text-sm font-semibold text-white">{f.value}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={showcase3d.primaryCta.to} className="btn bg-brand-500 px-6 py-3 text-white hover:bg-brand-600">
              {showcase3d.primaryCta.label}
            </Link>
            <Link
              to={showcase3d.secondaryCta.to}
              className="btn border border-white/30 px-6 py-3 text-white hover:bg-white/10"
            >
              {showcase3d.secondaryCta.label}
            </Link>
          </div>
        </div>

        {/* 3D stage */}
        <div className="order-1 lg:order-2">
          <div
            ref={stageRef}
            className="relative mx-auto aspect-square w-full max-w-md touch-pan-y rounded-3xl border border-white/10 bg-gradient-to-b from-slate-800/40 to-slate-950/40"
          >
            {showCanvas ? (
              <SceneBoundary fallback={<Poster />}>
                <Suspense fallback={<Poster />}>
                  <div className="absolute inset-0">
                    <CameraScene animate={inView && !reduced} />
                  </div>
                </Suspense>
              </SceneBoundary>
            ) : (
              <Poster />
            )}
            {/* Interaction hint */}
            <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-[11px] text-slate-300 backdrop-blur-sm">
              {showcase3d.hint}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
