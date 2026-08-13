# Project Status — GrowthLens (Codrithm Audit AI)

**Last Updated:** Aug 14, 2026
**Stage:** Live MVP — deployed, real audits working end-to-end on the Trigger.dev prod worker, real Supabase auth wired.

---

## Current Status

| Area                         | Status           | Notes                                                                     |
| ---------------------------- | ---------------- | ------------------------------------------------------------------------- |
| Frontend UI                  | ✅ Complete      | Landing, Processing, Report, Dashboard views wired to server functions   |
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
| Database (Supabase)          | ✅ Live          | Migration applied; project `dxezxcjylbpkmlmvqjxo`; credit deduction works |
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
- **Worker robustness:** AI step retries 3× on invalid schema output; post-commit failures (credit deduction / domain cache) are logged and never flip a committed audit to `failed`.

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
| `audits.domain` column absent from original migration  | Resolved | Migration updated; remote already had the column            |

---

## What's Missing for Production

1. **Credit top-up / billing** — either manual credit grants (current) or Stripe checkout + portal + webhooks.
2. **Rate limiting** — per-IP audit limits (10/hour target per PRD).
3. **Confirm `domain_cache` RLS policy** — cached reports readable without exposing other users' data.
4. **(Optional) CI/CD** — lint + typecheck + build on push; deploy hooks.
5. **(Optional) Upgrade AI model** — switch from free Gemma to a paid model for more reliable structured output.

---

## Next Steps

- [x] Set up Supabase project and run database migrations
- [x] Wire real values into `.env.local` (Supabase, Browserless, OpenRouter)
- [x] Implement authentication (Supabase Auth email/password + SSR sessions)
- [x] Run an end-to-end audit with real Trigger.dev + API keys
- [ ] Implement credit top-up / Stripe billing
- [ ] Enforce rate limiting (10 audits/hour/IP)
- [ ] Verify/lock down `domain_cache` RLS policy
- [ ] (Optional) CI/CD pipeline

> The consolidated remaining-work list lives in [`implementation.md`](implementation.md).