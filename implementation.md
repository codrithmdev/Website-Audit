# 🚀 Implementation Status & Roadmap: Codrithm Audit AI

**Product:** AI-assisted Website Growth Diagnostic Platform  
**Architecture:** SaaS-first lead gen & growth diagnostic engine  
**Last Updated:** August 2026  

---

## 📊 High-Level Architecture Overview

| Layer | Selected Tech | Primary Role |
| :--- | :--- | :--- |
| **Framework** | Next.js 14+ (App Router) | Dashboard, server actions, API routes |
| **Database & Auth** | Supabase (Postgres, Auth, RLS) | User accounts, audit history, credit ledger |
| **Task Queue** | Trigger.dev v3 | 45–60s background task execution |
| **Scraper / Vision** | Browserless.io + Playwright | Full-page rendering & screenshot capture |
| **Performance** | Lighthouse CI / Node | Core Web Vitals & technical SEO metrics |
| **AI Engine** | OpenAI `gpt-4o-mini` + Vercel AI SDK | Structured JSON buyer psychology analysis |
| **Billing** | Stripe Checkout + Webhooks | Credit packs and monthly subscriptions |
| **PDF Engine** | `@react-pdf/renderer` + Supabase Storage | Server-side downloadable report rendering |

---

## 🛠️ Implementation Checklist

Legend:  
- `[x]` **Completed / Defined**: Code or schema architected and ready for integration.  
- `[ ]` **Pending**: To be built, connected, or tested.

---

### 1. Database & Security Layer (Supabase PostgreSQL)

- `[x]` **User Profiles Table (`profiles`)**: Extended user metadata and `credits_balance`.
- `[x]` **Subscriptions Table (`subscriptions`)**: Tracking Stripe customer IDs, plan tiers, and status.
- `[x]` **Audits Core Table (`audits`)**: Storing scores, URL hashes, screenshot links, and structured JSON results.
- `[x]` **Domain Cache Table (`domain_cache`)**: 14-day domain audit caching to prevent API abuse and control costs.
- `[x]` **Credit Transactions Ledger (`credit_transactions`)**: Audit trail for purchases, grants, and deductions.
- `[x]` **Row-Level Security (RLS) Policies**: Data isolation across all tables.
- `[x]` **Stored Procedures**:
  - `[x]` `handle_new_user()` (Auto-grants 1 free credit on signup).
  - `[x]` `deduct_user_credit()` (Atomic deduction on audit run).
  - `[x]` `increment_user_credits()` (Atomic credit top-up on Stripe event).
- `[x]` **Storage Buckets Setup** (in `supabase/migrations/0001_init.sql`):
  - `[x]` Create public bucket `audit-assets` (for screenshots).
  - `[x]` Create public bucket `audit-reports` (for downloadable PDFs).
  - `[x]` Configure storage security policies for authenticated user access.
  - `[ ]` Run migration against a real Supabase project (requires credentials).

---

### 2. Scraping & Data Acquisition Layer

- `[x]` **Playwright / Browserless Integration (`src/lib/scraper/browser.ts`)**:
  - `[x]` Connect via WebSocket (`wss://chrome.browserless.io`).
  - `[x]` Cookie banner auto-dismissal logic.
  - `[x]` Full-page PNG screenshot capture.
  - `[x]` DOM metadata extraction (Title, Meta Description, H1).
- `[x]` **Lighthouse Performance Runner (`src/lib/scraper/lighthouse.ts`)**:
  - `[x]` Chrome launcher headless execution.
  - `[x]` Extraction of Core Web Vitals (LCP, CLS) and Performance/SEO scores.
  - `[x]` Error fallback handling for anti-bot protected sites.

---

### 3. AI Analysis & Schema Engine

- `[x]` **Strict Zod Output Schema (`src/lib/schemas/audit.ts`)**:
  - `[x]` Score breakdowns (Trust, Friction, CTA, Clarity).
  - `[x]` Hero section critique & value prop evaluation.
  - `[x]` Trust signal detection & gap analysis.
  - `[x]` Prioritized "Fix First" business impact matrix (CRITICAL / HIGH / MEDIUM).
- `[x]` **OpenAI Vision Integration**:
  - `[x]` System prompt engineered for buyer psychology and CRO.
  - `[x]` `generateObject` via Vercel AI SDK with `gpt-4o-mini`.

---

### 4. Background Task Queue (Trigger.dev v3)

- `[x]` **Trigger.dev Configuration (`trigger.config.ts`)**: Linked to project and configured external build dependencies.
- `[x]` **Audit Orchestration Pipeline (`src/trigger/audit-pipeline.ts`)**:
  - `[x]` Step 1: Parallel scraping & performance crawl.
  - `[x]` Step 2: Upload screenshot to Supabase Storage.
  - `[x]` Step 3: Execute AI Vision analysis.
  - `[x]` Step 4: Calculate weighted Overall Growth Score.
  - `[x]` Step 5: Programmatic PDF compilation & cloud upload.
  - `[x]` Step 6: Atomic database record commit and credit deduction.
- `[ ]` **End-to-End Pipeline Execution Verification**:
  - `[ ]` Run test payload via `npx trigger.dev@latest dev` with real API keys.

---

### 5. API Gateway & Payment Engine

- `[x]` **Audit Gateway Endpoint (`app/api/audits/trigger/route.ts`)**:
  - `[x]` Auth verification via Supabase Server Client.
  - `[x]` Domain cache lookup (0-credit instant return for cached reports).
  - `[x]` Credit balance verification guard.
  - `[x]` Background task dispatching to Trigger.dev.
- `[x]` **Stripe Webhook Engine (`app/api/webhooks/stripe/route.ts`)**:
  - `[x]` Checkout session listener for pay-as-you-go credit packs.
  - `[x]` Monthly invoice payment listener for subscription credit renewals.
- `[ ]` **Stripe Customer Portal Endpoint**:
  - `[ ]` Route to allow users to manage/cancel active subscriptions (`app/api/stripe/portal/route.ts`).

---

### 6. PDF Engine (Pending Implementation)

- `[x]` **React-PDF Template (`src/components/pdf/AuditPDFDocument.tsx`)**:
  - `[x]` "Executive Growth" design system layout (Navy/Emerald/Amber).
  - `[x]` Executive Summary & Score Overview section.
  - `[ ]` Visual screenshot highlight section.
  - `[x]` Prioritized Action Items table.
- `[ ]` **PDF Generation Buffer Testing**:
  - `[ ]` Verify serverless memory footprint when compiling large PDFs.

---

### 7. Frontend User Interface (Pending Implementation)

- `[ ]` **Authentication & Onboarding**:
  - `[ ]` Supabase Auth UI (Google SSO + Magic Link login).
  - `[ ]` Auto-redirect to dashboard upon login.
- `[ ]` **User Dashboard (`app/dashboard/page.tsx`)**:
  - `[ ]` Credit balance display badge.
  - `[ ]` Recent audits table with score indicators and status badges.
  - `[ ]` Quick "Run New Audit" CTA button.
- `[ ]` **Audit Submission Modal / Form**:
  - `[ ]` URL input with client-side regex validation.
  - `[ ]` Insufficient credits state / purchase modal trigger.
- `[ ]` **Real-Time Audit Progress View (`app/audits/[id]/page.tsx`)**:
  - `[ ]` Animated status bar polling or subscribing to Supabase Realtime (`pending` $\rightarrow$ `processing` $\rightarrow$ `completed`).
  - `[ ]` Step-by-step loading state messages ("Capturing page...", "Analyzing buyer psychology...").
- `[ ]` **Interactive Growth Audit Report View**:
  - `[ ]` High-level Growth Score gauge.
  - `[ ]` Trust & Friction breakdown tabs.
  - `[ ]` Interactive "Fix First" priority cards.
  - `[ ]` "Download PDF Report" action button.
- `[ ]` **Pricing & Billing Page (`app/pricing/page.tsx`)**:
  - `[ ]` Pay-as-you-go credit pack checkout buttons.
  - `[ ]` Starter ($29/mo) and Pro ($89/mo) subscription checkout buttons.

---

## 🎯 Immediate Next Steps Priority List

1. **Build `AuditPDFDocument.tsx`** using `@react-pdf/renderer` so the background pipeline can finish without rendering errors.
2. **Create Supabase Storage Buckets** (`audit-assets` & `audit-reports`) via the Supabase Dashboard.
3. **Execute E2E Integration Test**: Run `npx trigger.dev@latest dev` and fire a test payload to confirm browser capture, OpenAI inference, PDF rendering, and DB updates execute seamlessly.
4. **Develop Next.js Frontend Pages**: Build the dashboard, audit status watcher, and report view pages.