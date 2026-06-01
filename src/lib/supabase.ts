import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!url || !anonKey) {
  // Helps catch a missing .env during development
  console.warn('Supabase env vars are missing. Copy .env.example to .env and fill them in.')
}

// Fallbacks keep createClient from throwing during the static prerender (SSG),
// where env vars may be absent and no network calls are made anyway.
export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  anonKey || 'placeholder-anon-key',
)
