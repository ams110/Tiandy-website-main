import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

export default function NotFound() {
  return (
    <div className="container py-24 text-center">
      <Seo title="הדף לא נמצא" path="/404" noindex />
      <div className="text-6xl font-extrabold text-brand-500">404</div>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">הדף לא נמצא</h1>
      <p className="mt-2 text-slate-600">ייתכן שהקישור שגוי או שהדף הוסר.</p>
      <Link to="/" className="btn-primary mt-6">
        חזרה לדף הבית
      </Link>
    </div>
  )
}
