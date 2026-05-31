import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/Logo'
import {
  getAllProductsAdmin,
  getCategories,
  createProduct,
  updateProduct,
  removeProduct,
  restoreProduct,
  destroyProduct,
  uploadImage,
  uploadHeroImage,
  getSettings,
  updateSetting,
  type ProductInput,
} from '../../lib/api'
import type { Category, Product, SiteSettings } from '../../lib/types'

type BulkResult = { file: string; status: 'ok' | 'error' | 'notfound'; message?: string }

const emptyForm: ProductInput = {
  category_id: null,
  slug: '',
  name_he: '',
  short_desc_he: '',
  description_he: '',
  image_url: '',
  specs: {},
  is_featured: false,
  sort: 0,
}

export default function Dashboard() {
  const { signOut } = useAuth()
  const [tab, setTab] = useState<'products' | 'settings'>('products')

  // ── Products state ──
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<ProductInput>(emptyForm)
  const [specsText, setSpecsText] = useState('{}')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  // ── Settings state ──
  const [settings, setSettings] = useState<SiteSettings>({})
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsUploading, setSettingsUploading] = useState(false)
  const [settingsMsg, setSettingsMsg] = useState('')

  // ── Bulk upload state ──
  const [bulkResults, setBulkResults] = useState<BulkResult[]>([])
  const [bulkProgress, setBulkProgress] = useState<{ done: number; total: number } | null>(null)

  async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setForm((f) => ({ ...f, image_url: url }))
    } catch (err) {
      console.error(err)
      setError('העלאת התמונה נכשלה. ודאו שאתם מחוברים ושהקובץ הוא תמונה.')
    } finally {
      setUploading(false)
    }
  }

  async function handleBulkUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setBulkResults([])
    setBulkProgress({ done: 0, total: files.length })
    const results: BulkResult[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const slug = file.name.replace(/\.[^.]+$/, '').toLowerCase().trim()
      const product = products.find((p) => p.slug === slug)

      if (!product) {
        results.push({ file: file.name, status: 'notfound', message: `לא נמצא מוצר עם slug "${slug}"` })
        setBulkProgress({ done: i + 1, total: files.length })
        setBulkResults([...results])
        continue
      }

      try {
        const url = await uploadImage(file)
        await updateProduct(product.id, { image_url: url })
        setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, image_url: url } : p))
        results.push({ file: file.name, status: 'ok', message: product.name_he })
      } catch (err) {
        console.error(err)
        results.push({ file: file.name, status: 'error', message: 'שגיאה בהעלאה' })
      }

      setBulkProgress({ done: i + 1, total: files.length })
      setBulkResults([...results])
    }

    // reset input so same files can be re-uploaded
    e.target.value = ''
  }

  async function load() {
    setLoading(true)
    try {
      const [p, c] = await Promise.all([getAllProductsAdmin(true), getCategories()])
      setProducts(p)
      setCategories(c)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function loadSettings() {
    try {
      const s = await getSettings()
      setSettings(s)
    } catch (e) {
      console.error(e)
    }
  }

  async function handleHeroImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setSettingsMsg('')
    setSettingsUploading(true)
    try {
      const url = await uploadHeroImage(file)
      await updateSetting('hero_image_url', url)
      setSettings((s) => ({ ...s, hero_image_url: url }))
      setSettingsMsg('✓ התמונה עודכנה בהצלחה')
    } catch (err) {
      console.error(err)
      setSettingsMsg('✗ שגיאה בהעלאת התמונה')
    } finally {
      setSettingsUploading(false)
    }
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault()
    setSettingsMsg('')
    setSettingsSaving(true)
    try {
      await Promise.all([
        updateSetting('hero_title', settings.hero_title ?? ''),
        updateSetting('hero_subtitle', settings.hero_subtitle ?? ''),
      ])
      setSettingsMsg('✓ ההגדרות נשמרו בהצלחה')
    } catch (err) {
      console.error(err)
      setSettingsMsg('✗ שגיאה בשמירה')
    } finally {
      setSettingsSaving(false)
    }
  }

  useEffect(() => {
    load()
    loadSettings()
  }, [])

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setSpecsText('{}')
    setError('')
    setShowForm(true)
  }

  function openEdit(p: Product) {
    setEditing(p)
    setForm({
      category_id: p.category_id,
      slug: p.slug,
      name_he: p.name_he,
      short_desc_he: p.short_desc_he ?? '',
      description_he: p.description_he ?? '',
      image_url: p.image_url ?? '',
      specs: p.specs ?? {},
      is_featured: p.is_featured,
      sort: p.sort,
    })
    setSpecsText(JSON.stringify(p.specs ?? {}, null, 2))
    setError('')
    setShowForm(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    let specs: Record<string, unknown> = {}
    try {
      specs = specsText.trim() ? JSON.parse(specsText) : {}
    } catch {
      setError('המפרט (specs) אינו JSON תקין.')
      return
    }
    setSaving(true)
    try {
      const payload = { ...form, specs }
      if (editing) {
        await updateProduct(editing.id, payload)
      } else {
        await createProduct(payload)
      }
      setShowForm(false)
      await load()
    } catch (err: unknown) {
      console.error(err)
      setError('שמירה נכשלה. ודאו שה-slug ייחודי ושאתם מחוברים.')
    } finally {
      setSaving(false)
    }
  }

  async function handleRemove(p: Product) {
    if (!confirm(`להסיר את "${p.name_he}"? ניתן לשחזר אחר כך.`)) return
    await removeProduct(p.id)
    await load()
  }

  async function handleRestore(p: Product) {
    await restoreProduct(p.id)
    await load()
  }

  async function handleDestroy(p: Product) {
    if (!confirm(`למחוק לצמיתות את "${p.name_he}"? פעולה זו בלתי הפיכה!`)) return
    await destroyProduct(p.id)
    await load()
  }

  const catName = (id: string | null) =>
    categories.find((c) => c.id === id)?.name_he ?? '—'

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo variant="color" className="h-8 w-auto" />
            <span className="text-sm font-bold text-slate-700">לוח ניהול</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="btn-ghost text-sm">לאתר</Link>
            <button onClick={signOut} className="btn-outline text-sm">יציאה</button>
          </div>
        </div>
        {/* Tabs */}
        <div className="container flex gap-6 border-t border-slate-100">
          {(['products', 'settings'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-3 text-sm font-medium border-b-2 transition ${
                tab === t
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {t === 'products' ? 'ניהול מוצרים' : 'הגדרות האתר'}
            </button>
          ))}
        </div>
      </header>

      <div className="container py-8">

        {/* ── Settings tab ── */}
        {tab === 'settings' && (
          <div className="mx-auto max-w-2xl">
            <h1 className="mb-6 text-2xl font-extrabold text-slate-900">הגדרות האתר</h1>

            {/* Hero image */}
            <div className="card mb-6 p-6">
              <h2 className="mb-4 text-base font-bold text-slate-800">תמונת הכותרת (Hero)</h2>
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  {settings.hero_image_url ? (
                    <img
                      src={settings.hero_image_url}
                      alt="Hero preview"
                      className="h-24 w-40 rounded-lg border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-40 items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs text-slate-400">
                      אין תמונה
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <label className="btn-outline cursor-pointer text-sm">
                    {settingsUploading ? 'מעלה…' : '⬆ העלאת תמונה חדשה'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={settingsUploading}
                      onChange={handleHeroImageFile}
                    />
                  </label>
                  <p className="text-xs text-slate-400">
                    מומלץ: תמונה רחבה (1600×900 לפחות), JPG או WebP
                  </p>
                  <input
                    dir="ltr"
                    className="field text-left text-xs"
                    placeholder="או הדביקו כתובת URL"
                    value={settings.hero_image_url ?? ''}
                    onChange={(e) => setSettings((s) => ({ ...s, hero_image_url: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Hero text */}
            <form onSubmit={handleSaveSettings} className="card p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-800">טקסט הכותרת</h2>
              <div>
                <label className="label">כותרת ראשית</label>
                <input
                  className="field"
                  value={settings.hero_title ?? ''}
                  onChange={(e) => setSettings((s) => ({ ...s, hero_title: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">תיאור / כותרת משנה</label>
                <textarea
                  rows={3}
                  className="field"
                  value={settings.hero_subtitle ?? ''}
                  onChange={(e) => setSettings((s) => ({ ...s, hero_subtitle: e.target.value }))}
                />
              </div>
              {settingsMsg && (
                <p className={`text-sm ${settingsMsg.startsWith('✓') ? 'text-green-600' : 'text-red-600'}`}>
                  {settingsMsg}
                </p>
              )}
              <div className="flex justify-end">
                <button type="submit" disabled={settingsSaving} className="btn-primary disabled:opacity-60">
                  {settingsSaving ? 'שומר…' : 'שמירה'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Products tab ── */}
        {tab === 'products' && (<>

        {/* Bulk image upload */}
        <div className="mb-6 rounded-xl border border-brand-200 bg-brand-50 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <p className="text-sm font-bold text-brand-800">העלאת תמונות בכמות</p>
              <p className="text-xs text-brand-600">
                בחרו מספר קבצים — שם הקובץ חייב להיות ה-slug של המוצר (לדוגמה: <code className="font-mono">tc-c32qv-2fna-28.jpg</code>)
              </p>
            </div>
            <label className={`btn-primary cursor-pointer text-sm ${bulkProgress && bulkProgress.done < bulkProgress.total ? 'opacity-60 pointer-events-none' : ''}`}>
              {bulkProgress && bulkProgress.done < bulkProgress.total
                ? `מעלה ${bulkProgress.done}/${bulkProgress.total}…`
                : '⬆ בחירת תמונות'}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleBulkUpload}
                disabled={!!(bulkProgress && bulkProgress.done < bulkProgress.total)}
              />
            </label>
            {bulkProgress && (
              <span className="text-xs text-brand-700">
                {bulkProgress.done}/{bulkProgress.total} קבצים
              </span>
            )}
          </div>

          {bulkResults.length > 0 && (
            <div className="mt-3 max-h-40 overflow-y-auto rounded-lg border border-brand-200 bg-white p-2 text-xs space-y-1">
              {bulkResults.map((r, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className={r.status === 'ok' ? 'text-green-600' : r.status === 'notfound' ? 'text-amber-600' : 'text-red-600'}>
                    {r.status === 'ok' ? '✓' : r.status === 'notfound' ? '?' : '✗'}
                  </span>
                  <span className="font-mono text-slate-500">{r.file}</span>
                  {r.message && <span className="text-slate-400">— {r.message}</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">ניהול מוצרים</h1>
            <p className="text-sm text-slate-500">
              סה״כ {products.length} מוצרים · {products.filter((p) => p.deleted_at).length} מוסתרים
            </p>
          </div>
          <button onClick={openCreate} className="btn-primary">+ מוצר חדש</button>
        </div>

        {loading ? (
          <p className="text-slate-500">טוען…</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">מוצר</th>
                  <th className="px-4 py-3 font-medium">קטגוריה</th>
                  <th className="px-4 py-3 font-medium">מובלט</th>
                  <th className="px-4 py-3 font-medium">סטטוס</th>
                  <th className="px-4 py-3 font-medium">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className={p.deleted_at ? 'bg-red-50/40' : ''}>
                    <td className="px-4 py-3">
                      <Link
                        to={`/products/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 group/row"
                        title="פתח בדף המוצר באתר"
                      >
                        <div className="relative h-10 w-10 shrink-0">
                          {p.image_url ? (
                            <img src={p.image_url} alt="" className="h-10 w-10 rounded object-cover" />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-100 text-xs text-slate-400">
                              אין
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-slate-800 group-hover/row:text-brand-600 group-hover/row:underline">
                            {p.name_he}
                          </div>
                          <div className="text-xs text-slate-400">/products/{p.slug}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{catName(p.category_id)}</td>
                    <td className="px-4 py-3">
                      {p.is_featured ? (
                        <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-700">
                          ★ דף הבית
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {p.deleted_at ? (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">מוסר</span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">פעיל</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/products/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-brand-600 hover:underline"
                        >
                          צפה
                        </Link>
                        <button onClick={() => openEdit(p)} className="text-brand-600 hover:underline">עריכה</button>
                        {p.deleted_at ? (
                          <button onClick={() => handleRestore(p)} className="text-green-600 hover:underline">שחזור</button>
                        ) : (
                          <button onClick={() => handleRemove(p)} className="text-amber-600 hover:underline">הסרה</button>
                        )}
                        <button onClick={() => handleDestroy(p)} className="text-red-600 hover:underline">מחיקה</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </>)}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                {editing ? 'עריכת מוצר' : 'מוצר חדש'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">שם המוצר *</label>
                  <input
                    required
                    className="field"
                    value={form.name_he}
                    onChange={(e) => setForm({ ...form, name_he: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">מזהה (slug) *</label>
                  <input
                    required
                    dir="ltr"
                    className="field text-left"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="tc-ip-bullet-4mp"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">קטגוריה</label>
                  <select
                    className="field"
                    value={form.category_id ?? ''}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value || null })}
                  >
                    <option value="">— ללא —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name_he}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">סדר תצוגה</label>
                  <input
                    type="number"
                    className="field"
                    value={form.sort}
                    onChange={(e) => setForm({ ...form, sort: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="label">תיאור קצר</label>
                <input
                  className="field"
                  value={form.short_desc_he ?? ''}
                  onChange={(e) => setForm({ ...form, short_desc_he: e.target.value })}
                />
              </div>

              <div>
                <label className="label">תיאור מלא</label>
                <textarea
                  rows={3}
                  className="field"
                  value={form.description_he ?? ''}
                  onChange={(e) => setForm({ ...form, description_he: e.target.value })}
                />
              </div>

              <div>
                <label className="label">תמונת מוצר</label>
                <div className="flex items-start gap-3">
                  {form.image_url ? (
                    <img
                      src={form.image_url}
                      alt="תצוגה מקדימה"
                      className="h-20 w-20 shrink-0 rounded-lg border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs text-slate-400">
                      אין תמונה
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <label className="btn-outline cursor-pointer text-sm">
                      {uploading ? 'מעלה…' : '⬆ העלאת תמונה מהמחשב'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploading}
                        onChange={handleImageFile}
                      />
                    </label>
                    <input
                      dir="ltr"
                      className="field text-left text-xs"
                      placeholder="או הדביקו כתובת URL"
                      value={form.image_url ?? ''}
                      onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="label">מפרט טכני (JSON)</label>
                <textarea
                  rows={4}
                  dir="ltr"
                  className="field text-left font-mono text-xs"
                  value={specsText}
                  onChange={(e) => setSpecsText(e.target.value)}
                  placeholder='{"resolution":"4MP"}'
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                />
                מוצר מובלט (יוצג בדף הבית)
              </label>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">
                  ביטול
                </button>
                <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
                  {saving ? 'שומר…' : 'שמירה'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
