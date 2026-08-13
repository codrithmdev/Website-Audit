# Implementation Roadmap — Codrithm Audit AI

**Product:** AI-assisted Website Growth Diagnostic Platform
**Last Updated:** August 14, 2026

---

> The full stack is built, deployed, and verified live (see README + PROJECT-STATUS.md). Real audits run end-to-end on the Trigger.dev prod worker and auth is wired with Supabase email/password + SSR sessions. This file lists what remains.

---

## ✅ What's Already Done

| Area | Status |
| :--- | :--- |
| Frontend (Landing / Processing / Report / Dashboard) | Complete |
| Design system (Tailwind v4, light/dark, responsive) | Complete |
| Audit pipeline (`src/trigger/audit-pipeline1.ts`, 6 steps) | Live, verified E2E |
| Scraper (Browserless + Playwright) | Live |
| Lighthouse audit | Live (scores in `report_json.technicalPerformance`) |
| AI analysis (OpenRouter Gemma 4 free vision, 3× retry) | Live |
| PDF engine (`AuditPDFDocument.tsx` + Zod schema) | Live (uploads to `audit-reports` bucket) |
| Supabase migration (tables, RLS, RPCs, buckets) | Applied to project `dxezxcjylbpkmlmvqjxo` |
| Server functions (`startAudit` / `getAuditStatus` / `getMyAudits` / `getProfile`) | Live, session-based |
| Auth (email/password + SSR sessions) | Live (`signUp`/`signIn`/`signOut`/`getSession`) |
| Type safety (`tsc --noEmit` clean) + production build | Passing |
| Deployment (Vercel + Trigger.dev prod + Supabase) | Live at https://website-audit.vercel.app/ |

---

## 📋 Remaining Work

### 1. Credit Management & Billing

- `[ ]` **Self-serve credit top-up** — currently credits are granted manually in Supabase (test user hit 0 credits).
- `[ ]` **Stripe billing** — Checkout, Customer Portal, and webhook endpoints (`purchase` transactions).
- `[ ]` **Verify `handle_new_user()` trigger** grants 1 free credit on signup.

### 2. Backend Hardening

- `[ ]` **Rate limiting** — per-IP audit limits (10/hour target per PRD).
- `[ ]` **`domain_cache` RLS policy** — lock down so cached reports are readable without exposing other users' data.
- `[ ]` **Consider switching AI model** — the free Gemma model intermittently returns output that fails schema validation (mitigated with a 3× retry). A paid model via `OPENROUTER_MODEL` would be more reliable.

### 3. Report Polish

- `[ ]` **Visual screenshot highlight section** in the PDF template (screenshot is captured and stored but not annotated in the PDF).
- `[ ]` **PDF generation memory testing** — verify serverless memory footprint when compiling large PDFs.

### 4. Optional / Post-MVP

- `[ ]` **CI/CD pipeline** — lint + typecheck + build on push; deploy hooks.
- `[ ]` **NPM vulnerability cleanup** — 20 upstream OpenTelemetry vulns in `@trigger.dev` (needs Trigger.dev v3 migration).
- `[ ]` **Recharts v3 upgrade** — v2 currently deprecated (functional).
- `[ ]` **White-label reports, competitor comparison, scheduled audits, public API** (future features per PRD).

---

## Priority Order

1. Credit top-up (Stripe or admin) so users aren't blocked at 0 credits
2. Enforce rate limiting + `domain_cache` RLS
3. (Optional) Paid AI model for more reliable structured output
4. (Optional) CI/CD + Stripe webhooks + PDF annotation polish