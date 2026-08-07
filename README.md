# GrowthLens — AI Website Growth Audit Platform

> AI-powered visual, trust, and UX audits that turn bounce rates into booked revenue in under 60 seconds.

Built with [Lovable](https://lovable.dev)

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
| Task Queue         | Trigger.dev SDK v3                                   |
| Browser Automation | Playwright (via Browserless.io)                      |
| Performance Audit  | Lighthouse (chrome-launcher)                         |
| AI                 | Vercel AI SDK + OpenAI gpt-4o-mini                   |
| Database           | Supabase (PostgreSQL)                                |
| PDF Generation     | @react-pdf/renderer                                  |
| Package Manager    | Bun (with supply-chain guard)                        |

## Project Structure

```
src/
├── components/ui/          # 46 shadcn/ui components
├── hooks/                  # Custom React hooks
├── lib/
│   ├── utils.ts            # cn() utility (clsx + tailwind-merge)
│   ├── error-page.ts       # Static HTML error page renderer
│   ├── error-capture.ts    # Server-side error capture
│   ├── lovable-error-reporting.ts
│   └── scraper/
│       ├── browser.ts      # Playwright + Browserless.io page scraper
│       └── lighthouse.ts   # Lighthouse audit runner
├── routes/
│   ├── __root.tsx          # Root layout, error boundary, 404 page
│   └── index.tsx           # Main app UI (Landing + Processing + Report + Dashboard)
├── trigger/
│   ├── audit-pipeline.ts   # Trigger.dev task stub
│   └── audit-pipeline1.ts  # Full audit pipeline
├── styles.css              # Tailwind v4 design system (203 lines)
├── router.tsx              # TanStack Router factory
├── server.ts               # SSR server entry
├── shims.d.ts              # Type declarations for server-side dependencies
└── start.ts                # TanStack Start setup
```

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: install with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm or Bun

### Installation

```sh
git clone https://github.com/Atiqumer/Website-Audit.git
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

Create a `.env.local` file for the audit pipeline (Trigger.dev background tasks):

| Variable                    | Purpose                                        |
| --------------------------- | ---------------------------------------------- |
| `BROWSERLESS_API_KEY`       | Browserless.io WebSocket connection token      |
| `SUPABASE_URL`              | Supabase project URL                           |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin/service-role key (bypasses RLS) |
| `OPENAI_API_KEY`            | OpenAI API key for AI analysis                 |

## Audit Pipeline

The background audit pipeline (`src/trigger/audit-pipeline1.ts`) runs the following steps:

1. **Scrape & Screenshot** — Playwright + Browserless.io captures page content and screenshots
2. **Lighthouse Audit** — Performance, accessibility, and SEO scores
3. **AI Analysis** — OpenAI gpt-4o-mini generates structured findings (trust, friction, CTA, clarity scores)
4. **Growth Score** — Weighted composite: Trust (30%) + Friction (30%) + CTA (20%) + Tech/SEO (20%)
5. **PDF Generation** — Professional report via @react-pdf/renderer
6. **Database Commit** — Stores results in Supabase with credit deduction and domain caching

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
- [Lovable](https://lovable.dev)
