# GrowthLens — AI Website Growth Audit Platform

> AI-powered visual, trust, and UX audits that turn bounce rates into booked revenue in under 60 seconds.

---

## What It Does

GrowthLens takes a website URL and produces a prioritized, business-first action plan. Unlike generic SEO crawlers, it focuses on:

- **Business impact** — how issues affect leads, trust, and conversions
- **Evidence-backed findings** — visual annotations pinpoint weak CTAs, missing proof, and costly UX decisions
- **Prioritized fix list** — recommendations ranked by expected revenue impact and implementation effort
- **PDF reports** — polished enough to send directly to a prospect or include in a sales follow-up

## Tech Stack

| Layer              | Technology                                           |
| ------------------ | ---------------------------------------------------- |
| Framework          | TanStack Start (SSR)                                 |
| UI                 | React 19, shadcn/ui (46 components), Tailwind CSS v4 |
| Language           | TypeScript 5.8 (strict mode)                         |
| Build              | Vite 8                                               |
| State              | TanStack React Query, React Hook Form + Zod          |
| Charts             | Recharts                                             |
| Icons              | Lucide React                                         |
| Auth               | Supabase Auth (email/password + SSR sessions)        |
| Task Queue         | Trigger.dev SDK v3                                   |
| Browser Automation | Playwright (via Browserless.io)                      |
| Performance Audit  | Lighthouse (chrome-launcher)                         |
| AI                 | Vercel AI SDK + OpenRouter (Gemma 4 free vision)     |
| Database           | Supabase (PostgreSQL)                                |
| PDF Generation     | @react-pdf/renderer                                  |
| Package Manager    | npm                                                  |

## Project Structure

```
src/
├── components/
│   ├── growth-lens/               # Product UI (redesign)
│   │   ├── landing.tsx            # Hero, nav, sample audit preview, pricing section
│   │   ├── dashboard.tsx          # Workspace overview, audit history
│   │   ├── report.tsx             # Score ring, tabbed findings (UX/Trust/Performance/SEO)
│   │   ├── processing.tsx         # Step-by-step progress view
│   │   ├── pricing.tsx            # Pricing tiers
│   │   ├── auth-dialog.tsx        # Sign in / create account modal
│   │   ├── upgrade-modal.tsx      # Out-of-credits upsell modal
│   │   └── brand.tsx              # Shared brand/logo mark
│   ├── pdf/AuditPDFDocument.tsx   # Server-rendered report PDF (@react-pdf/renderer)
│   └── ui/                        # shadcn/ui components
├── hooks/                         # Custom React hooks
├── lib/
│   ├── audit-url.ts              # Shared URL hashing + domain extraction (cache key consistency)
│   ├── schemas/audit.ts          # Zod schema for AI audit output
│   ├── scraper/
│   │   ├── browser.ts            # Playwright + Browserless.io page scraper
│   │   └── lighthouse.ts         # Lighthouse audit runner
│   ├── services/
│   │   ├── audit-service.ts      # Server functions (startAudit/getAuditStatus/getMyAudits/getProfile)
│   │   └── auth-service.ts       # Server functions (signUp/signIn/signOut/getSession)
│   ├── supabase/
│   │   ├── auth.ts               # SSR cookie-bound Supabase client (getSupabaseAuth/clearAuthCookies)
│   │   ├── browser.ts            # Client-side Supabase client (getSupabaseBrowser)
│   │   └── client.ts             # Admin/anon Supabase clients
│   ├── types/growth-lens.ts      # Shared frontend types (View, AuthUser, AuditResultState, MyAuditRow)
│   ├── utils.ts                  # cn() utility (clsx + tailwind-merge)
│   ├── error-page.ts             # Static HTML error page renderer
│   └── error-capture.ts          # Server-side error capture
├── routes/
│   ├── __root.tsx                # Root layout, error boundary, 404 page
│   └── index.tsx                 # App state machine wiring Landing/Processing/Report/Dashboard
├── trigger/audit-pipeline1.ts    # Full Trigger.dev audit pipeline
├── styles.css                    # Tailwind v4 design system
├── router.tsx                    # TanStack Router factory
├── server.ts                     # SSR server entry
└── start.ts                      # TanStack Start setup

supabase/migrations/
├── 0001_init.sql                                 # Schema + RLS + RPCs + storage buckets
├── 0002_lock_domain_cache.sql                     # Removes public SELECT policy on domain_cache
└── 0003_credit_refund_and_storage_lockdown.sql    # audit_refund RPC + drops open storage INSERT policy
```

## Getting Started

### Prerequisites

- Node.js 22+ (recommended: install with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm

### Installation

```sh
git clone https://github.com/codrithmdev/Website-Audit.git
cd Website-Audit
npm install
```

### Development

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other Commands

```sh
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build
npm run lint         # ESLint
npm run format       # Prettier
```

## Environment Variables

Create a `.env.local` file. There is **no demo mode** — the app requires real credentials to run live audits.

| Variable                    | Purpose                                        |
| --------------------------- | ---------------------------------------------- |
| `BROWSERLESS_API_KEY`       | Browserless.io WebSocket connection token      |
| `SUPABASE_URL`              | Supabase project URL                           |
| `SUPABASE_ANON_KEY`         | Supabase public/anon key (client-side, RLS)    |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin/service-role key (bypasses RLS) |
| `OPENROUTER_API_KEY`        | OpenRouter key for AI analysis                 |
| `OPENROUTER_MODEL`          | Optional AI model override (default: `google/gemma-4-26b-a4b-it:free`) |
| `TRIGGER_SECRET_KEY`        | Trigger.dev access token (prod: `tr_prod_...`) |

> ⚠️ **Trigger.dev token env-scoping is critical.** Only `tr_prod_...` keys reach the deployed prod worker. A `tr_dev_...` key will leave runs stuck `QUEUED` forever because no dev worker is running.

> ⚠️ **Security:** never expose `SUPABASE_SERVICE_ROLE_KEY` or `TRIGGER_SECRET_KEY` to the browser. They are only read server-side.

## Current Status

The full product is built, deployed, and running live at [https://website-audit.vercel.app/](https://website-audit.vercel.app/). Real audits run end-to-end through the Trigger.dev **prod** worker:

1. Credit reserved atomically at audit creation
2. Browserless scrape + screenshot
3. Lighthouse performance/a11y/SEO scores
4. OpenRouter Gemma 4 vision analysis (structured output)
5. Weighted growth score + PDF generation
6. Supabase commit + domain cache (credit refunded automatically if any step fails)

Auth (email/password + SSR sessions), real PDFs/screenshots in the Report view, and the audit dashboard all work against the live database.

**Still remaining** — see [implementation.md](implementation.md) and [PROJECT-STATUS.md](PROJECT-STATUS.md). In short:
1. Grant/renew credits for test users (deduction requires a positive balance)
2. Rate limiting on audit creation
3. Stripe billing + CI/CD (post-MVP)

## Audit Pipeline

Credits are reserved **atomically at audit creation**, before the pipeline runs — `startAudit` (`src/lib/services/audit-service.ts`) creates the `pending` audit row and immediately calls the `deduct_user_credit` RPC, which row-locks the profile and fails the whole request if the balance is insufficient. This closes a race where two concurrent requests could both pass a plain balance check and run the full (expensive) pipeline against a single credit.

The background pipeline (`src/trigger/audit-pipeline1.ts`) then runs:

1. **Scrape & Screenshot** — Playwright + Browserless.io captures page content and screenshots
2. **Lighthouse Audit** — Performance, accessibility, and SEO scores
3. **AI Analysis** — OpenRouter Gemma 4 (free vision model) generates structured findings (trust, friction, CTA, clarity scores); retries up to 3× when the model's output fails schema validation
4. **Growth Score** — Weighted composite: Trust (30%) + Friction (30%) + CTA (20%) + Tech/SEO (20%)
5. **PDF Generation** — Professional report via @react-pdf/renderer
6. **Database Commit** — Stores results in Supabase and writes the domain cache entry

If the pipeline fails at any step, the audit is marked `failed` and the reserved credit is refunded via the `refund_audit_credit` RPC (logged, non-fatal if it errors). Domain-cache write failures are logged but never flip a committed report to `failed` — the audit stays `completed` so the report/PDF remain downloadable.

## App Views

The app uses a single-page state machine with four views:

- **Landing** — Hero section with URL input, features, sample report preview, pricing
- **Processing** — Step-by-step progress visualization with animated skeleton loading
- **Report** — Executive summary, score ring, detailed findings with tabs (UX, Trust, Performance, SEO)
- **Dashboard** — Workspace overview with stats, audit history, search

## Built With

- [TanStack Start](https://tanstack.com/start)
- [React](https://react.dev)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Trigger.dev](https://trigger.dev)
- [Supabase](https://supabase.com)
- [Vercel AI SDK](https://sdk.vercel.ai)