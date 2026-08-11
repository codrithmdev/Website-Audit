# 🚀 Implementation Roadmap — Codrithm Audit AI

**Product:** AI-assisted Website Growth Diagnostic Platform  
**Last Updated:** August 2026  

---

> The full stack is built and wired end-to-end (see README + PROJECT-STATUS.md). The app currently runs in **demo mode** (simulated audits) until the production services below are connected. This file lists only what remains to be done.

---

## ✅ What's Already Done

| Area | Status |
| :--- | :--- |
| Frontend (Landing / Processing / Report / Dashboard) | Complete |
| Design system (Tailwind v4, light/dark, responsive) | Complete |
| Audit pipeline (`src/trigger/audit-pipeline1.ts`, 6 steps) | Implemented |
| Scraper (Browserless + Playwright) | Implemented |
| Lighthouse audit | Implemented |
| AI analysis (`ai` + `@ai-sdk/openai`, `generateObject`) | Implemented |
| PDF engine (`AuditPDFDocument.tsx` + Zod schema) | Complete |
| Supabase migration SQL (tables, RLS, RPCs, buckets) | Written |
| Server functions (`startAudit` / `getAuditStatus` / `getMyAudits` / `getProfile`) | Implemented |
| Type safety (`tsc --noEmit` clean) | Passing |

---

## 📋 Remaining Work

### 1. Production Setup (Blocking)

- `[ ]` **Apply the Supabase migration** — run `supabase/migrations/0001_init.sql` against a real project (tables + RLS + 3 RPCs + 2 storage buckets).
- `[ ]` **Configure `.env.local`** — copy `.env.example` and fill in real Supabase / Browserless / OpenAI values.
- `[ ]` **Verify storage security policies** for the `audit-assets` and `audit-reports` buckets.

### 2. Authentication (Blocking)

- `[ ]` **Wire real auth** — Supabase Auth UI (Google SSO + Magic Link).
- `[ ]` **Session persistence** in `@tanstack/react-start` (client + server clients).
- `[ ]` **Auto-redirect to dashboard** after login; tie the dashboard to the logged-in user.
- `[ ]` **Onboarding credit** — confirm `handle_new_user()` grants 1 free credit on signup.

### 3. End-to-End Verification (Blocking)

- `[ ]` **Run a real audit** — `npx trigger.dev@latest dev` and fire `startAudit` against a live task.
- `[ ]` **Validate the full pipeline** — browser capture → storage upload → OpenAI inference → PDF render → DB commit → credit deduction.

### 4. Backend Hardening

- `[ ]` **Enforce credit deduction** — verify the `deduct_user_credit()` RPC runs atomically on audit completion.
- `[ ]` **Domain cache RLS policy** — lock down `domain_cache` so cached reports are readable without exposing other users' data.
- `[ ]` **Rate limiting** — per-IP audit limits (10/hour target per PRD).

### 5. Report Polish

- `[ ]` **Render real assets in the Report view** — show `screenshot_url` and `pdf_report_url` once real runs produce them (currently demo fallbacks).
- `[ ]` **PDF generation memory testing** — verify serverless memory footprint when compiling large PDFs.
- `[ ]` **Visual screenshot highlight section** in the PDF template.

### 6. Optional / Post-MVP

- `[ ]` **Stripe billing** — Checkout, Customer Portal, and webhook endpoints.
- `[ ]` **CI/CD pipeline** — lint + typecheck + build on push; deploy hooks.
- `[ ]` **NPM vulnerability cleanup** — 20 upstream OpenTelemetry vulns in `@trigger.dev` (needs Trigger.dev v3 migration).
- `[ ]` **Recharts v3 upgrade** — v2 currently deprecated (functional).

---

## 🎯 Priority Order

1. Apply Supabase migration → configure `.env.local`
2. Wire real auth (Google SSO + Magic Link)
3. Run the end-to-end Trigger.dev audit
4. Enforce credits / domain-cache RLS / rate limiting
5. Show real PDFs + screenshots in the Report
6. Stripe billing + CI/CD (post-MVP)
