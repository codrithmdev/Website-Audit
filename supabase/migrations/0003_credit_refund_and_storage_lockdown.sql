-- ============================================================================
-- 1. Credit refunds
--
-- Credits are now reserved atomically at audit *creation* time (see
-- startAudit in src/lib/services/audit-service.ts) instead of being deducted
-- after the pipeline completes. That closed a race where two concurrent
-- requests could both pass the balance check and run the full (expensive)
-- pipeline against a single credit. It means a failed pipeline run must
-- refund the credit it reserved, so add a dedicated transaction type and RPC
-- for that.
-- ============================================================================
alter table public.credit_transactions drop constraint if exists credit_transactions_type_check;
alter table public.credit_transactions add constraint credit_transactions_type_check
  check (type in ('signup_bonus', 'purchase', 'subscription_grant', 'audit_deduction', 'audit_refund'));

create or replace function public.refund_audit_credit(p_user_id uuid, p_audit_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set credits_balance = credits_balance + 1,
      updated_at = now()
  where id = p_user_id;

  insert into public.credit_transactions (user_id, type, amount, audit_id)
  values (p_user_id, 'audit_refund', 1, p_audit_id);
end;
$$;

-- ============================================================================
-- 2. Lock down storage.objects INSERT policy
--
-- All uploads to audit-assets/audit-reports happen server-side via the
-- service-role client (src/trigger/audit-pipeline1.ts), which bypasses RLS
-- entirely. The "authenticated" INSERT policy from 0001_init.sql therefore
-- served no legitimate purpose but let any signed-in user (via the public
-- anon key + their session JWT) upload arbitrary files into either bucket —
-- the same class of issue 0002 already closed for domain_cache.
-- ============================================================================
drop policy if exists "audit_assets_insert_authenticated" on storage.objects;
