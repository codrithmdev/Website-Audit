-- ============================================================================
-- GrowthLens — Initial Schema
-- Tables: profiles, subscriptions, audits, domain_cache, credit_transactions
-- RPCs:   handle_new_user, deduct_user_credit, increment_user_credits
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. User Profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  email         text,
  full_name     text,
  credits_balance integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2. Subscriptions
-- ---------------------------------------------------------------------------
create table if not exists public.subscriptions (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references public.profiles (id) on delete cascade,
  stripe_customer_id    text unique,
  stripe_subscription_id text unique,
  plan_tier             text not null default 'free',
  status                text not null default 'active',
  current_period_end    timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 3. Audits Core
-- ---------------------------------------------------------------------------
create table if not exists public.audits (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles (id) on delete cascade,
  target_url     text not null,
  url_hash       text not null,
  status         text not null default 'pending'
                   check (status in ('pending', 'processing', 'completed', 'failed')),
  overall_score  integer,
  trust_score    integer,
  friction_score integer,
  cta_score      integer,
  clarity_score  integer,
  report_json    jsonb,
  screenshot_url text,
  pdf_report_url text,
  error_message  text,
  completed_at   timestamptz,
  created_at     timestamptz not null default now()
);

create index if not exists audits_user_id_idx on public.audits (user_id, created_at desc);
create index if not exists audits_url_hash_idx on public.audits (url_hash);

-- ---------------------------------------------------------------------------
-- 4. Domain Cache (14-day)
-- ---------------------------------------------------------------------------
create table if not exists public.domain_cache (
  id         uuid primary key default gen_random_uuid(),
  url_hash   text not null unique,
  domain     text not null,
  audit_id   uuid references public.audits (id) on delete set null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 5. Credit Transactions Ledger
-- ---------------------------------------------------------------------------
create table if not exists public.credit_transactions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  type       text not null check (type in ('purchase', 'grant', 'deduction', 'renewal')),
  amount     integer not null,
  audit_id   uuid references public.audits (id) on delete set null,
  metadata   jsonb,
  created_at timestamptz not null default now()
);

create index if not exists credit_transactions_user_id_idx on public.credit_transactions (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- 6. Row-Level Security Policies
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.audits enable row level security;
alter table public.domain_cache enable row level security;
alter table public.credit_transactions enable row level security;

-- Users can read/update their own profile
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Subscriptions readable/writable by owning user
drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);
drop policy if exists "subscriptions_insert_own" on public.subscriptions;
create policy "subscriptions_insert_own" on public.subscriptions
  for insert with check (auth.uid() = user_id);
drop policy if exists "subscriptions_update_own" on public.subscriptions;
create policy "subscriptions_update_own" on public.subscriptions
  for update using (auth.uid() = user_id);

-- Audits readable/writable by owning user
drop policy if exists "audits_select_own" on public.audits;
create policy "audits_select_own" on public.audits
  for select using (auth.uid() = user_id);
drop policy if exists "audits_insert_own" on public.audits;
create policy "audits_insert_own" on public.audits
  for insert with check (auth.uid() = user_id);

-- Domain cache readable by all (public lookup), written by service role only
drop policy if exists "domain_cache_select_all" on public.domain_cache;
create policy "domain_cache_select_all" on public.domain_cache
  for select using (true);

-- Credit transactions readable by owning user
drop policy if exists "credit_transactions_select_own" on public.credit_transactions;
create policy "credit_transactions_select_own" on public.credit_transactions
  for select using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 7. Stored Procedures
-- ---------------------------------------------------------------------------

-- Auto-grant 1 free credit on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, credits_balance)
  values (
    new.id,
    new.email,
    1
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Atomic credit deduction on audit run (fails if insufficient balance)
create or replace function public.deduct_user_credit(p_user_id uuid, p_audit_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance integer;
begin
  select credits_balance into v_balance
  from public.profiles
  where id = p_user_id
  for update;

  if v_balance is null then
    raise exception 'Profile not found for user %', p_user_id;
  end if;

  if v_balance < 1 then
    raise exception 'Insufficient credits';
  end if;

  update public.profiles
  set credits_balance = credits_balance - 1,
      updated_at = now()
  where id = p_user_id;

  insert into public.credit_transactions (user_id, type, amount, audit_id)
  values (p_user_id, 'deduction', -1, p_audit_id);
end;
$$;

-- Atomic credit top-up on Stripe event
create or replace function public.increment_user_credits(p_user_id uuid, p_amount integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_amount <= 0 then
    raise exception 'Amount must be positive';
  end if;

  update public.profiles
  set credits_balance = credits_balance + p_amount,
      updated_at = now()
  where id = p_user_id;

  insert into public.credit_transactions (user_id, type, amount, metadata)
  values (p_user_id, 'purchase', p_amount, jsonb_build_object('source', 'stripe'));
end;
$$;

-- ---------------------------------------------------------------------------
-- 8. Storage Buckets (screenshots + PDF reports)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values
  ('audit-assets', 'audit-assets', true),
  ('audit-reports', 'audit-reports', true)
on conflict (id) do nothing;

-- Allow authenticated users to read/upload their own audit assets
drop policy if exists "audit_assets_select_public" on storage.objects;
create policy "audit_assets_select_public" on storage.objects
  for select using (bucket_id = 'audit-assets' or bucket_id = 'audit-reports');

drop policy if exists "audit_assets_insert_authenticated" on storage.objects;
create policy "audit_assets_insert_authenticated" on storage.objects
  for insert with check (
    (bucket_id = 'audit-assets' or bucket_id = 'audit-reports')
    and auth.role() = 'authenticated'
  );
