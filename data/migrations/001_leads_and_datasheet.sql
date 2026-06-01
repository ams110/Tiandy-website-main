-- ─────────────────────────────────────────────────────────────────────────
-- Migration 001 — lead capture + product datasheet
-- Apply in the Supabase SQL editor (or via the MCP) for the contact/RFQ forms
-- and the product datasheet button to work against the database.
-- Safe to run once; uses IF NOT EXISTS where possible.
-- ─────────────────────────────────────────────────────────────────────────

-- 1) Datasheet URL on products (PDF spec sheet link)
alter table public.tiandy_il_products
  add column if not exists datasheet_url text;

-- 2) Leads table — contact form + request-for-quote submissions
create table if not exists public.tiandy_il_leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  company     text,
  message     text,
  type        text not null default 'contact',  -- 'contact' | 'rfq'
  meta        jsonb,
  created_at  timestamptz not null default now()
);

alter table public.tiandy_il_leads enable row level security;

-- Anyone (anon) may submit a lead (INSERT only)…
drop policy if exists "anon can insert leads" on public.tiandy_il_leads;
create policy "anon can insert leads"
  on public.tiandy_il_leads
  for insert
  to anon, authenticated
  with check (true);

-- …but only authenticated admins may read them.
drop policy if exists "authenticated can read leads" on public.tiandy_il_leads;
create policy "authenticated can read leads"
  on public.tiandy_il_leads
  for select
  to authenticated
  using (true);
