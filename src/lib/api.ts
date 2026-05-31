import { supabase } from './supabase'
import type { Category, Product } from './types'

const MEDIA_BUCKET = 'tiandy-il-media'

// ---- Media upload (admin) ----

// Uploads an image file to Supabase Storage and returns its public URL.
export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
  const path = `products/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

// ---- Site settings ----

export type SiteSettings = Record<string, string>

export async function getSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from('tiandy_il_settings')
    .select('key, value')
  if (error) throw error
  return Object.fromEntries((data ?? []).map((r) => [r.key, r.value]))
}

export async function updateSetting(key: string, value: string): Promise<void> {
  const { error } = await supabase
    .from('tiandy_il_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
  if (error) throw error
}

// ---- Media upload (admin) ----

export async function uploadHeroImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `hero/hero.${ext}`
  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)
  return data.publicUrl + '?t=' + Date.now()
}

// ---- Public reads (only active / non-deleted products) ----

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('tiandy_il_categories')
    .select('*')
    .order('sort', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function getProducts(categorySlug?: string): Promise<Product[]> {
  let query = supabase
    .from('tiandy_il_products')
    .select('*, category:tiandy_il_categories!inner(slug)')
    .is('deleted_at', null)
    .order('sort', { ascending: true })

  if (categorySlug) {
    query = query.eq('category.slug', categorySlug)
  }
  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as unknown as Product[]
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('tiandy_il_products')
    .select('*')
    .is('deleted_at', null)
    .eq('is_featured', true)
    .order('sort', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('tiandy_il_products')
    .select('*')
    .eq('slug', slug)
    .is('deleted_at', null)
    .maybeSingle()
  if (error) throw error
  return data
}

// ---- Admin (requires authenticated session) ----

export async function getAllProductsAdmin(includeDeleted = true): Promise<Product[]> {
  let query = supabase
    .from('tiandy_il_products')
    .select('*')
    .order('sort', { ascending: true })
  if (!includeDeleted) query = query.is('deleted_at', null)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export type ProductInput = Omit<
  Product,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
>

export async function createProduct(input: ProductInput): Promise<Product> {
  const { data, error } = await supabase
    .from('tiandy_il_products')
    .insert(input)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateProduct(
  id: string,
  patch: Partial<ProductInput>,
): Promise<Product> {
  const { data, error } = await supabase
    .from('tiandy_il_products')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// Soft delete (removable + restorable)
export async function removeProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('tiandy_il_products')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function restoreProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('tiandy_il_products')
    .update({ deleted_at: null })
    .eq('id', id)
  if (error) throw error
}

// Permanent delete
export async function destroyProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('tiandy_il_products')
    .delete()
    .eq('id', id)
  if (error) throw error
}
