-- ============================================================================
-- Lock down domain_cache: remove the public SELECT policy.
--
-- domain_cache is only ever read server-side via the service-role admin
-- client (src/lib/services/audit-service.ts), which bypasses RLS entirely.
-- The "using (true)" policy therefore served no legitimate purpose but let
-- anyone with the public anon key enumerate every audited domain and its
-- audit_id straight from Supabase's REST API (no auth, no app involved).
-- ============================================================================
drop policy if exists "domain_cache_select_all" on public.domain_cache;
