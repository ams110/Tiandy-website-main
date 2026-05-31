export type SiteSettings = Record<string, string>

export interface Category {
  id: string
  slug: string
  name_he: string
  description_he: string | null
  sort: number
  created_at: string
}

export interface Product {
  id: string
  category_id: string | null
  slug: string
  name_he: string
  short_desc_he: string | null
  description_he: string | null
  image_url: string | null
  specs: Record<string, unknown>
  is_featured: boolean
  sort: number
  deleted_at: string | null
  created_at: string
  updated_at: string
}
