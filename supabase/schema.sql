-- =========================================================================
-- ARTEE — Supabase schema
-- Run this once in Supabase SQL Editor (or `supabase db push` with the CLI)
-- after creating a new project. Safe to re-run (uses IF NOT EXISTS guards).
-- =========================================================================

create extension if not exists "pgcrypto";

-- -------------------------------------------------------------------------
-- ADMINS  (allow-list of auth.users who may access /admin)
-- -------------------------------------------------------------------------
create table if not exists public.admins (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------------------------
-- ARTIST  (single-row "About" profile)
-- -------------------------------------------------------------------------
create table if not exists public.artist (
  id int primary key default 1 check (id = 1), -- singleton row
  name text not null default 'Ravinash',
  brand_name text not null default 'ARTEE',
  short_intro text not null default '',
  biography text not null default '',
  philosophy text not null default '',
  experience text not null default '',
  achievements text[] not null default '{}',
  location text not null default '',
  featured_quote text not null default '',
  portrait_url text,
  signature_url text,
  supporting_image_urls text[] not null default '{}',
  updated_at timestamptz not null default now()
);
insert into public.artist (id) values (1) on conflict (id) do nothing;

-- -------------------------------------------------------------------------
-- ARTWORK CATEGORIES
-- -------------------------------------------------------------------------
create table if not exists public.artwork_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  is_enabled boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------------------------
-- ARTWORKS
-- -------------------------------------------------------------------------
create table if not exists public.artworks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category_id uuid references public.artwork_categories (id) on delete set null,
  medium text not null default '',
  year int,
  tags text[] not null default '{}',
  description text not null default '',
  story text not null default '',
  cover_image_url text,
  gallery_image_urls text[] not null default '{}',
  is_featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  display_order int not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists artworks_status_idx on public.artworks (status);
create index if not exists artworks_category_idx on public.artworks (category_id);

-- Process images (IDEA -> SKETCH -> LINE ART -> DETAILING -> FINAL, etc.)
create table if not exists public.artwork_process_steps (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid not null references public.artworks (id) on delete cascade,
  label text not null,
  image_url text not null,
  display_order int not null default 0
);
create index if not exists process_steps_artwork_idx on public.artwork_process_steps (artwork_id);

-- -------------------------------------------------------------------------
-- SERVICES
-- -------------------------------------------------------------------------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_url text,
  starting_price text,
  cta_label text not null default 'Enquire on WhatsApp',
  whatsapp_message text,
  is_featured boolean not null default false,
  is_enabled boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------------------------
-- SOCIAL LINKS
-- -------------------------------------------------------------------------
create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null, -- instagram | youtube | facebook | x | pinterest | behance | linkedin | other
  label text not null default '',
  username text not null default '',
  url text not null,
  is_enabled boolean not null default true,
  display_order int not null default 0
);

-- -------------------------------------------------------------------------
-- SITE SETTINGS (singleton) — general, appearance, contact, SEO, WhatsApp, content
-- -------------------------------------------------------------------------
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  -- General
  site_name text not null default 'ARTEE',
  artist_name text not null default 'Ravinash',
  logo_url text,
  favicon_url text,
  site_description text not null default '',
  -- Appearance
  theme_mode text not null default 'system' check (theme_mode in ('light', 'dark', 'system')),
  accent_color text not null default '#A63D2F',
  -- Contact
  whatsapp_number text not null default '',
  contact_email text not null default '',
  location text not null default '',
  business_hours text,
  contact_message text not null default '',
  -- WhatsApp prefilled messages
  whatsapp_default_message text not null default 'Hi Ravinash, I found your ARTEE website and I''d love to know more.',
  whatsapp_commission_message text not null default 'Hi Ravinash, I''m interested in commissioning an artwork.',
  whatsapp_wall_painting_message text not null default 'Hi Ravinash, I''d like to discuss a wall painting project.',
  -- Content / CTA labels
  hero_headline text not null default 'Art that turns imagination into something tangible.',
  hero_subheadline text not null default 'Artist / Illustrator / Mural Artist',
  hero_primary_cta text not null default 'Explore the Work',
  hero_secondary_cta text not null default 'Commission an Artwork',
  commission_cta_label text not null default 'Commission Art',
  footer_note text not null default '',
  -- SEO
  seo_title text not null default 'ARTEE — Ravinash | Original Artwork & Commissions',
  seo_description text not null default 'Original hand-drawn portraits, custom artwork, and wall paintings by artist Ravinash.',
  og_image_url text,
  google_verification text,
  -- Advanced
  analytics_id text,
  maintenance_mode boolean not null default false,
  updated_at timestamptz not null default now()
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- -------------------------------------------------------------------------
-- ENQUIRY LOG (lightweight tracking of WhatsApp CTA clicks, for the dashboard)
-- -------------------------------------------------------------------------
create table if not exists public.enquiry_log (
  id uuid primary key default gen_random_uuid(),
  source text not null, -- e.g. 'hero', 'artwork:<slug>', 'service:<id>', 'wall-painting', 'contact'
  created_at timestamptz not null default now()
);

-- =========================================================================
-- ROW LEVEL SECURITY
-- =========================================================================
alter table public.admins enable row level security;
alter table public.artist enable row level security;
alter table public.artwork_categories enable row level security;
alter table public.artworks enable row level security;
alter table public.artwork_process_steps enable row level security;
alter table public.services enable row level security;
alter table public.social_links enable row level security;
alter table public.site_settings enable row level security;
alter table public.enquiry_log enable row level security;

-- Helper: is the current request from a logged-in admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins where id = auth.uid()
  );
$$;

-- Public read policies -----------------------------------------------------
create policy "public can read artist" on public.artist for select using (true);
create policy "public can read enabled categories" on public.artwork_categories for select using (is_enabled = true or public.is_admin());
create policy "public can read published artworks" on public.artworks for select using (status = 'published' or public.is_admin());
create policy "public can read process steps" on public.artwork_process_steps for select using (true);
create policy "public can read enabled services" on public.services for select using (is_enabled = true or public.is_admin());
create policy "public can read enabled socials" on public.social_links for select using (is_enabled = true or public.is_admin());
create policy "public can read site settings" on public.site_settings for select using (true);
create policy "anyone can insert enquiry log" on public.enquiry_log for insert with check (true);

-- Admin full-access policies -------------------------------------------------
create policy "admins manage artist" on public.artist for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage categories" on public.artwork_categories for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage artworks" on public.artworks for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage process steps" on public.artwork_process_steps for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage services" on public.services for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage socials" on public.social_links for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());
create policy "admins read enquiry log" on public.enquiry_log for select using (public.is_admin());
create policy "admins read admins table" on public.admins for select using (public.is_admin());

-- =========================================================================
-- STORAGE — public bucket for artwork & profile images
-- =========================================================================
insert into storage.buckets (id, name, public)
values ('artee-media', 'artee-media', true)
on conflict (id) do nothing;

create policy "public can view artee media"
  on storage.objects for select
  using (bucket_id = 'artee-media');

create policy "admins can upload artee media"
  on storage.objects for insert
  with check (bucket_id = 'artee-media' and public.is_admin());

create policy "admins can update artee media"
  on storage.objects for update
  using (bucket_id = 'artee-media' and public.is_admin());

create policy "admins can delete artee media"
  on storage.objects for delete
  using (bucket_id = 'artee-media' and public.is_admin());
