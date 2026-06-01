import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { nav, site, telHref, mailHref } from '../data/content'
import { getCategories } from '../lib/api'
import type { Category } from '../lib/types'
import Logo from './Logo'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [prodOpen, setProdOpen] = useState(false)
  const [mobileCatsOpen, setMobileCatsOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {})
  }, [])

  const closeMenu = () => {
    setOpen(false)
    setMobileCatsOpen(false)
  }

  return (
    <header className="sticky top-0 z-40">
      {/* Top utility bar */}
      <div className="hidden bg-brand-800 text-brand-100 md:block">
        <div className="container flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <a href={telHref} className="hover:text-white">📞 {site.phone}</a>
            <a href={mailHref} className="hover:text-white">✉️ {site.email}</a>
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
            <Logo variant="color" />
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
            <Link to="/quote" className="btn-primary">
              בקשת הצעת מחיר
            </Link>
          </div>

          {/* Mobile actions: tap-to-call + menu */}
          <div className="flex items-center gap-1 md:hidden">
            <a
              href={telHref}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-brand-600"
              aria-label={`חיוג ל-${site.phone}`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </a>
            <button
              className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-600"
              onClick={() => setOpen((v) => !v)}
              aria-label="תפריט"
              aria-expanded={open}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <nav className="border-t border-slate-200 bg-white md:hidden">
          <div className="container flex flex-col py-2">
            {nav.map((item) =>
              item.to === '/products' ? (
                <div key={item.to}>
                  <div className="flex items-center">
                    <NavLink
                      to={item.to}
                      end
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `flex-1 rounded-lg px-3 py-3 text-sm font-medium ${
                          isActive ? 'bg-brand-50 text-brand-600' : 'text-slate-700'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                    {categories.length > 0 && (
                      <button
                        onClick={() => setMobileCatsOpen((v) => !v)}
                        className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-500"
                        aria-label="הצגת קטגוריות"
                        aria-expanded={mobileCatsOpen}
                      >
                        <span className={`text-xs transition-transform ${mobileCatsOpen ? 'rotate-180' : ''}`}>▾</span>
                      </button>
                    )}
                  </div>
                  {mobileCatsOpen && categories.length > 0 && (
                    <div className="mb-1 mr-3 border-r border-slate-100 pr-2">
                      {categories.map((c) => (
                        <Link
                          key={c.id}
                          to={`/products?cat=${c.slug}`}
                          onClick={closeMenu}
                          className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-brand-50 hover:text-brand-600"
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
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-3 text-sm font-medium ${
                      isActive ? 'bg-brand-50 text-brand-600' : 'text-slate-700'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ),
            )}

            <Link to="/quote" onClick={closeMenu} className="btn-primary mt-2">
              בקשת הצעת מחיר
            </Link>

            {/* Contact shortcuts — tap to call / email */}
            <div className="mt-3 flex flex-col gap-1 border-t border-slate-100 pt-3 text-sm">
              <a href={telHref} className="rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-50">
                📞 {site.phone}
              </a>
              <a href={mailHref} className="rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-50">
                ✉️ {site.email}
              </a>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
