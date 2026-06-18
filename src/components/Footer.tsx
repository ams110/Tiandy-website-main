import { Link } from 'react-router-dom'
import { nav, site, telHref, mailHref } from '../data/content'
import Logo from './Logo'
import Icon from './Icon'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50">
      <div className="container grid gap-8 py-12 md:grid-cols-4">
        <div>
          <Logo variant="color" />
          <p className="mt-3 text-sm text-slate-600">{site.tagline}</p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold text-slate-800">ניווט</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            {nav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="hover:text-brand-700">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold text-slate-800">יצירת קשר</h4>
          <ul className="space-y-2.5 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <Icon name="phone" className="h-4 w-4 shrink-0 text-brand-700" />
              <a href={telHref} className="hover:text-brand-700">{site.phone}</a>
            </li>
            <li className="flex items-center gap-2">
              <Icon name="mail" className="h-4 w-4 shrink-0 text-brand-700" />
              <a href={mailHref} className="hover:text-brand-700">{site.email}</a>
            </li>
            <li className="flex items-center gap-2">
              <Icon name="address" className="h-4 w-4 shrink-0 text-brand-700" />
              {site.address}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold text-slate-800">אזור ניהול</h4>
          <Link to="/admin" className="text-sm text-brand-700 hover:underline">
            כניסת מנהל
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-200 py-4">
        <div className="container flex flex-col items-center justify-between gap-2 text-xs text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. כל הזכויות שמורות.</p>
          <p>אתר הדגמה — יש לוודא הרשאות שימוש במותג ובלוגו.</p>
        </div>
      </div>
    </footer>
  )
}
