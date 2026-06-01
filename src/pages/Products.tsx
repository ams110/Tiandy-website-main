import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle'
import ProductCard from '../components/ProductCard'
import Seo from '../components/Seo'
import { breadcrumbLd } from '../lib/seo'
import { getCategories, getProducts } from '../lib/api'
import type { Category, Product } from '../lib/types'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const active = searchParams.get('cat') ?? '' // '' = all
  const [loading, setLoading] = useState(true)

  const setActive = (slug: string) => {
    setSearchParams(slug ? { cat: slug } : {})
  }

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    setLoading(true)
    getProducts(active || undefined)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [active])

  return (
    <div className="container py-12">
      <Seo
        title="מוצרים"
        description="קטלוג מצלמות רשת, מקליטי NVR, מצלמות PTZ ופתרונות אבטחה — סינון לפי קטגוריה."
        path="/products"
        jsonLd={breadcrumbLd([
          { name: 'דף הבית', path: '/' },
          { name: 'מוצרים', path: '/products' },
        ])}
      />
      <SectionTitle
        eyebrow="קטלוג"
        title="המוצרים שלנו"
        subtitle="עיינו במגוון המצלמות, המקליטים ופתרונות האבטחה."
      />

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActive('')}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            active === '' ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          הכל
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.slug)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              active === c.slug
                ? 'bg-brand-500 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {c.name_he}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <p className="text-slate-500">טוען מוצרים…</p>
        ) : products.length === 0 ? (
          <p className="text-slate-500">לא נמצאו מוצרים בקטגוריה זו.</p>
        ) : (
          products.map((p) => <ProductCard key={p.id} product={p} />)
        )}
      </div>
    </div>
  )
}
