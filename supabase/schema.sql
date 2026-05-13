-- StyliQ — Supabase-ready schema (PostgreSQL)
-- Run in Supabase SQL editor or via migrations.
-- RLS policies should be added per your auth model.

create extension if not exists "uuid-ossp";

-- 1. users
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text,
  created_at timestamptz default now()
);

-- 2. products
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null,
  description text,
  material text,
  price numeric(12,2),
  cover_image text,
  is_featured boolean default false,
  slug text unique,
  subtitle text,
  narrative text,
  budget_tier smallint check (budget_tier between 1 and 4)
);

-- 3. product_tags (one row per tag dimension; or normalize to junction tables — this matches the spec)
create table if not exists public.product_tags (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  style_tag text,
  occasion_tag text,
  mood_tag text,
  metal_tone text,
  collection_name text
);

-- 4. product_assets
create table if not exists public.product_assets (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text,
  model_3d_url text,
  tryon_asset_url text
);

-- 5. advisor_sessions
create table if not exists public.advisor_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete set null,
  outfit_image text,
  occasion text not null,
  style text not null,
  mood text not null,
  budget text,
  jewelry_category text,
  created_at timestamptz default now()
);

-- 6. advisor_results
create table if not exists public.advisor_results (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references public.advisor_sessions(id) on delete cascade,
  recommended_product_ids uuid[] not null,
  explanation text,
  styling_tip text
);

-- 7. tryon_sessions
create table if not exists public.tryon_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete set null,
  uploaded_photo_url text not null,
  selected_product_id uuid not null references public.products(id),
  result_url text,
  created_at timestamptz default now()
);

-- 8. customization_requests
create table if not exists public.customization_requests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete set null,
  inspiration_text text,
  reference_image text,
  budget_range text,
  deadline text,
  status text default 'pending',
  desired_style text,
  contact_email text,
  contact_name text
);

-- 9. vip_requests
create table if not exists public.vip_requests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete set null,
  service_type text not null,
  message text,
  created_at timestamptz default now()
);

-- 10. newsletter_subscribers
create table if not exists public.newsletter_subscribers (
  email text primary key,
  created_at timestamptz default now()
);

create index if not exists idx_product_tags_product on public.product_tags(product_id);
create index if not exists idx_product_assets_product on public.product_assets(product_id);
create index if not exists idx_advisor_results_session on public.advisor_results(session_id);
