# Project Status — GrowthLens (Codrithm Audit AI)

**Last Updated:** Aug 21, 2026
**Stage:** Live MVP — deployed, real audits working end-to-end on the Trigger.dev prod worker, real Supabase auth wired, frontend redesign shipped.

---

## Current Status

| Area                         | Status           | Notes                                                                     |
| ---------------------------- | ---------------- | ------------------------------------------------------------------------- |
| Frontend UI                  | ✅ Complete      | Redesigned as `src/components/growth-lens/*`; Landing, Processing, Report, Dashboard, Auth dialog, Upgrade modal wired to server functions |
| Design System                | ✅ Complete      | Tailwind v4 with 30+ custom utilities, light/dark themes, responsive      |
| Landing Page                 | ✅ Complete      | Hero, features, sample report preview, pricing section, mobile nav        |
| Processing View              | ✅ Complete      | Step-by-step progress animation, polls real audit status                  |
| Report View                  | ✅ Complete      | Executive summary, score ring, tabbed findings, real PDF + screenshot     |
| Dashboard View               | ✅ Complete      | Audit history from Supabase, search, view report / download PDF           |
| Pricing & Upgrade            | ✅ Complete      | 3 tiers (Free, Starter, Agency), upgrade modal (credit grant manual)      |
| Audit Pipeline (Trigger.dev) | ✅ Live          | Full pipeline verified E2E on the prod worker (scrape → storage → AI → score → PDF → DB) |
| Page Scraper (Playwright)    | ✅ Live          | Browserless.io integration, cookie banner dismissal, metadata extraction |
| Lighthouse Audit             | ✅ Live          | Performance/a11y/SEO scores written to `report_json.technicalPerformance` |
| AI Analysis                  | ✅ Live          | OpenRouter Gemma 4 free vision, retries 3× on schema-validation failures |
| PDF Generation               | ✅ Live          | `AuditPDFDocument` component, uploaded to `audit-reports` storage bucket |
| Database (Supabase)          | ✅ Live          | Migrations `0001`–`0003` written; `0001` applied to project `dxezxcjylbpkmlmvqjxo`, `0002`/`0003` pending push (see Known Issues) |
| Credit Accounting            | ✅ Fixed         | Reserved atomically at audit creation (`deduct_user_credit` RPC), refunded on pipeline failure (`refund_audit_credit` RPC) — closes a prior race where concurrent requests could run the full pipeline on a single credit |
| Server Functions             | ✅ Live          | `startAudit`/`getAuditStatus`/`getMyAudits`/`getProfile` (session-based)  |
| Authentication               | ✅ Live          | Supabase email/password + SSR sessions (`@supabase/ssr` + cookie-bound client) |
| Stripe Payments              | ⏭️ Skipped       | Portal/webhook endpoints intentionally skipped; credits granted manually |
| Error Handling (SSR)         | ✅ Complete      | Custom error pages, error capture middleware, React error boundary |
| Package Manager              | ✅ npm only      | Removed Bun entirely (`bun.lock`, `bunfig.toml` deleted)                  |
| Lovable Integration          | ✅ Removed       | No Lovable deps/config/files remain in the repo                            |
| Type Safety                  | ✅ Passing       | `tsc --noEmit` passes with zero errors; `npm run build` succeeds           |

---

## Deployment Topology

- **Live site:** https://website-audit.vercel.app/ (Vercel, TanStack Start SSR)
- **Supabase:** project `dxezxcjylbpkmlmvqjxo` ("Web Auditor Project", Tokyo)
- **Trigger.dev:** project `proj_isyixjxwxwchnmntortu` ("auditor", org `codrithm-2847`), SDK `4.5.10`, worker runtime `node-22`
- **AI:** OpenRouter `google/gemma-4-26b-a4b-it:free` (override via `OPENROUTER_MODEL`)
- **Env split:**
  - **Trigger.dev prod env:** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENROUTER_API_KEY`, `BROWSERLESS_API_KEY`, `OPENROUTER_MODEL`
  - **Vercel:** `SUPABASE_URL`, `SUPABASE_ANON_KEY` (required for SSR auth reads), `SUPABASE_SERVICE_ROLE_KEY`, `TRIGGER_SECRET_KEY` (prod `tr_prod_...`)

### Critical operational notes

- **Trigger.dev token scoping:** only `tr_prod_...` keys reach the deployed prod worker. A `tr_dev_...` key leaves runs `QUEUED` forever.
- **Schema drift handled:** remote `audits` table has NOT NULL `domain` (inserts include it); `credit_transactions.type` is enum `transaction_type` (`signup_bonus | purchase | subscription_grant | audit_deduction`).
- **Worker robustness:** AI step retries 3× on invalid schema output. Credits are reserved atomically before the pipeline runs and refunded automatically if it fails; domain-cache write failures are logged and never flip a committed audit to `failed`.

---

## This Session's Changes

1. **Removed Bun** — deleted `bun.lock` and `bunfig.toml`; README + `.prettierignore` updated; npm is the sole package manager.

2. **Removed Lovable integration** — rewrote `vite.config.ts` on standard TanStack Start plugins, dropped `@lovable.dev/vite-tanstack-config` + `vite-tsconfig-paths`, deleted `src/lib/lovable-error-reporting.ts` + `.lovable/`.

3. **Implemented the roadmap** (per `implementation.md`, adapted to TanStack Start):
   - PDF engine, pipeline deps (`@supabase/supabase-js`, `ai`, `@openrouter/ai-sdk-provider`, `playwright-core`, `lighthouse`, `chrome-launcher`), Supabase migration, server functions, frontend wiring.

4. **Made audits live end-to-end:**
   - Trigger.dev prod env fully configured; deployed worker with runtime `node-22` (Node 21 lacked native WebSocket for `@supabase/realtime-js`).
   - Switched AI from OpenAI `gpt-4o-mini` to OpenRouter Gemma 4 free vision (`@openrouter/ai-sdk-provider@3.0.0`); system prompt moved to top-level `system:` (OpenRouter Responses API rejects `role: "system"`).
   - Verified full pipeline E2E: example.com scored 44, PDF + screenshot uploaded, `audit_deduction` transaction recorded, credits 10→9.
   - Fixed enum mismatch in `deduct_user_credit` (`'deduction'` → `'audit_deduction'`) in the remote SQL Editor and the migration.
   - Fixed `audits.domain` NOT NULL insert failure (derived from target URL).
   - Worker fixes: 3× AI retry on schema-validation failures; post-commit errors no longer flip committed audits to `failed`.

5. **Wired real auth:**
   - `src/lib/supabase/auth.ts`: SSR cookie-bound Supabase client via `createServerClient` (`getSupabaseAuth`, `clearAuthCookies`) using `@tanstack/react-start/server` cookie helpers.
   - `src/lib/services/auth-service.ts`: `signUp`, `signIn`, `signOut`, `getSession` server functions (email + password ≥ 6 chars).
   - `src/lib/services/audit-service.ts`: `requireUser()` from the SSR session; `startAudit` throws `AUTH_REQUIRED` when logged out; demo-mode fallback removed.
   - `src/routes/index.tsx`: session state from `getSession`, email/password auth dialog (signin/signup modes), sign-out wired (header/mobile/dashboard), demo rows + hardcoded credits removed, Report shows real Lighthouse breakdown, dashboard empty state added.

## Aug 21 Session — Frontend Redesign + Backend Fixes

1. **Frontend redesign** — rebuilt the app UI as `src/components/growth-lens/*` (`landing.tsx`, `dashboard.tsx`, `report.tsx`, `processing.tsx`, `pricing.tsx`, `auth-dialog.tsx`, `upgrade-modal.tsx`, `brand.tsx`), with shared types moved to `src/lib/types/growth-lens.ts`. `src/routes/index.tsx` now just wires the state machine to these components. Verified end-to-end with Playwright: landing → sign-in dialog → create-account switch → pricing → upgrade modal, no console errors.

2. **Fixed `.env.local` naming mismatch** — it had Next.js-style `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` (leftover from an earlier setup) while the code reads plain `SUPABASE_URL`/`SUPABASE_ANON_KEY`, which silently broke the browser Supabase client. Renamed to match; not tracked by git, so this only fixes it locally — check any deployment secrets for the same stale naming.

3. **Closed the credit-deduction race condition** — `startAudit` previously checked the credit balance, then deducted only *after* the pipeline completed, so concurrent requests could both pass the check and run the full (expensive) pipeline against a single credit. Credits are now reserved atomically via `deduct_user_credit` right after the audit row is created and before the pipeline is dispatched; the pipeline refunds via a new `refund_audit_credit` RPC if it fails. See `src/lib/services/audit-service.ts`, `src/trigger/audit-pipeline1.ts`, `supabase/migrations/0003_credit_refund_and_storage_lockdown.sql`.

4. **Locked down the storage upload policy** — `storage.objects` had an `INSERT` policy letting any authenticated user (via the public anon key + their session JWT) upload to `audit-assets`/`audit-reports`, even though all real uploads go through the service-role worker (bypasses RLS). Same class of issue `0002` fixed for `domain_cache`; dropped in `0003`.

5. **Unified URL-hash/domain logic** — `audit-service.ts` and `audit-pipeline1.ts` each computed the cache `url_hash`/`domain` slightly differently. Extracted into `src/lib/audit-url.ts`, used by both.

6. **Removed `.scratch/`** — ad-hoc Playwright test scripts and screenshots used to verify the redesign; not meant to be tracked.

> Migrations `0002` and `0003` are written but **not yet applied to the remote database** — the project isn't `supabase link`-ed from this machine (no DB password available). Run `supabase db push` or paste the SQL into the dashboard SQL editor before relying on these fixes in production.

---

## Known Issues & Risks

| Issue                                                  | Severity | Status                                                     |
| ------------------------------------------------------ | -------- | ---------------------------------------------------------- |
| 20 npm vulnerabilities (OpenTelemetry in @trigger.dev) | Low      | Upstream dependency, fix requires Trigger.dev v3 migration |
| Recharts v2 deprecated                                 | Low      | Functional, upgrade to v3 available                        |
| `tsconfck@3.1.x` deprecated                            | Low      | Dev dependency, no runtime impact                          |
| Free AI model intermittently fails schema validation   | Low      | Mitigated with 3× in-worker retry; could switch to paid model via `OPENROUTER_MODEL` |
| Test users can hit 0 credits                           | Medium   | No self-serve top-up yet; credits granted manually in Supabase |
| Stripe billing skipped                                 | Medium   | Payment/Checkout flows not implemented                      |
| Rate limiting (10 audits/hour/IP) not enforced         | Medium   | PRD requirement, not yet implemented                        |
| Migrations `0002`/`0003` not yet pushed to remote      | Medium   | Written locally; project isn't `supabase link`-ed from this machine (no DB password) — apply via `supabase db push` or the dashboard SQL editor |
| `audits.domain` column absent from original migration  | Resolved | Migration updated; remote already had the column            |
| Credit deduction race (concurrent requests could run the pipeline on one credit) | Resolved | `startAudit` now reserves the credit atomically before dispatching the pipeline; refunded on failure |
| `domain_cache` publicly readable via anon key           | Resolved | `0002_lock_domain_cache.sql` drops the public SELECT policy |
| `storage.objects` INSERT policy let any signed-in user upload to audit buckets | Resolved | `0003_credit_refund_and_storage_lockdown.sql` drops the policy; all uploads go through the service-role worker |

---

## What's Missing for Production

1. **Credit top-up / billing** — either manual credit grants (current) or Stripe checkout + portal + webhooks.
2. **Rate limiting** — per-IP audit limits (10/hour target per PRD).
3. **Push migrations `0002`/`0003` to the remote Supabase project** — `supabase link` + `supabase db push`, or paste into the dashboard SQL editor.
4. **(Optional) CI/CD** — lint + typecheck + build on push; deploy hooks.
5. **(Optional) Upgrade AI model** — switch from free Gemma to a paid model for more reliable structured output.

---

## Next Steps

- [x] Set up Supabase project and run database migrations
- [x] Wire real values into `.env.local` (Supabase, Browserless, OpenRouter)
- [x] Implement authentication (Supabase Auth email/password + SSR sessions)
- [x] Run an end-to-end audit with real Trigger.dev + API keys
- [x] Lock down `domain_cache` RLS policy (`0002`)
- [x] Fix credit-deduction race condition + lock down storage upload policy (`0003`)
- [ ] Push migrations `0002`/`0003` to the remote Supabase project
- [ ] Implement credit top-up / Stripe billing
- [ ] Enforce rate limiting (10 audits/hour/IP)
- [ ] (Optional) CI/CD pipeline

> The consolidated remaining-work list lives in [`implementation.md`](implementation.md).