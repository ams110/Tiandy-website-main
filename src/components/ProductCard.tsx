import { Link } from 'react-router-dom'
import type { Product } from '../lib/types'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/products/${product.slug}`} className="card group overflow-hidden">
      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name_he}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">אין תמונה</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-slate-900 transition-colors group-hover:text-brand-700">
          {product.name_he}
        </h3>
        {product.short_desc_he && (
          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{product.short_desc_he}</p>
        )}
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-700">
          פרטים נוספים
          <span className="transition-transform duration-200 group-hover:-translate-x-1" aria-hidden>←</span>
        </span>
      </div>
    </Link>
  )
}
