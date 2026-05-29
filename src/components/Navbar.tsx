import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { nav, site } from '../data/content'
import { getCategories } from '../lib/api'
import type { Category } from '../lib/types'
import Logo from './Logo'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [prodOpen, setProdOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {})
  }, [])

  return (
    <header className="sticky top-0 z-40">
      {/* Top utility bar */}
      <div className="hidden bg-brand-800 text-brand-100 md:block">
        <div className="container flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span>📞 {site.phone}</span>
            <span>✉️ {site.email}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="hover:text-white">תמיכה</Link>
            <span className="text-brand-300">|</span>
            <span>🌐 ישראל (עברית)</span>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo variant="color" className="h-9 w-auto" />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) =>
              item.to === '/products' ? (
                <div
                  key={item.to}
                  className="relative"
                  onMouseEnter={() => setProdOpen(true)}
                  onMouseLeave={() => setProdOpen(false)}
                >
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                        isActive ? 'text-brand-600' : 'text-slate-700 hover:text-brand-600'
                      }`
                    }
                  >
                    {item.label}
                    <span className="text-[10px]">▾</span>
                  </NavLink>

                  {prodOpen && categories.length > 0 && (
                    <div className="absolute right-0 top-full w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                      {categories.map((c) => (
                        <Link
                          key={c.id}
                          to={`/products?cat=${c.slug}`}
                          className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600"
                        >
                          {c.name_he}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-medium transition ${
                      isActive ? 'text-brand-600' : 'text-slate-700 hover:text-brand-600'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>

          <div className="hidden md:block">
            <Link to="/contact" className="btn-primary">
              בקשת הצעת מחיר
            </Link>
          </div>

          <button
            className="rounded-lg p-2 text-slate-600 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="תפריט"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-slate-200 bg-white md:hidden">
          <div className="container flex flex-col py-2">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-3 text-sm font-medium ${
                    isActive ? 'bg-brand-50 text-brand-600' : 'text-slate-700'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/contact" onClick={() => setOpen(false)} className="btn-primary mt-2">
              בקשת הצעת מחיר
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
