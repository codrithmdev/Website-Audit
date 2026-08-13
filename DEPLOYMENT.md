# Deploying to Vercel

This guide covers deploying **GrowthLens** on Vercel. The repo is a **TanStack Start (SSR)** app — it needs Nitro (already configured in `vite.config.ts`) so Vercel can run its server functions.

> **No demo mode.** Real audits require Supabase, Browserless, OpenRouter, and Trigger.dev credentials (see §2). Without them, `startAudit` refuses to run rather than simulating.

---

## 1. Import the repo into Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New… → Project**.
2. Import the **Website-Audit** repository.
3. Vercel should auto-detect the framework as **TanStack Start** (via `vercel.json` + Nitro).
   - If it asks, confirm: **Framework Preset = TanStack Start**.
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: leave default (Nitro emits `.vercel/output`).
   - **Node.js Version**: `22.x` (required by TanStack Start).
4. Click **Deploy**.

Verify: the landing page renders with server-side content, and you can sign up / sign in.

---

## 2. Environment Variables (Settings → Environment Variables)

Add these (Production + Preview):

| Variable                    | Purpose                                        |
| --------------------------- | ---------------------------------------------- |
| `SUPABASE_URL`              | Supabase project URL                           |
| `SUPABASE_ANON_KEY`         | Supabase public/anon key (client-side, RLS)    |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin/service-role key (bypasses RLS) |
| `BROWSERLESS_API_KEY`       | Browserless.io WebSocket token                 |
| `OPENROUTER_API_KEY`        | OpenRouter key for AI analysis                 |
| `OPENROUTER_MODEL`          | Optional AI model (default `google/gemma-4-26b-a4b-it:free`) |
| `TRIGGER_SECRET_KEY`        | Trigger.dev access token — **must be `tr_prod_...`** (see §3) |

> ⚠️ `SUPABASE_ANON_KEY` is required on Vercel for the SSR auth client (`src/lib/supabase/auth.ts`) to read sessions server-side. Without it, sign-in/sign-up and `startAudit` fail.

> ⚠️ **Security:** never expose `SUPABASE_SERVICE_ROLE_KEY` or `TRIGGER_SECRET_KEY` to the browser. They are only read server-side.

---

## 3. Set up Trigger.dev (needed for real audits)

The heavy audit work (Browserless scraping, Lighthouse, AI, PDF) runs on **Trigger.dev cloud workers**, not on Vercel.

1. Project ID is `proj_isyixjxwxwchnmntortu` in `trigger.config.ts` (project "auditor", org `codrithm-2847`).
2. Generate an **API key for the prod environment** in Trigger.dev → project → **API Keys**. Only `tr_prod_...` keys route runs to the deployed prod worker; `tr_dev_...` keys will leave runs stuck `QUEUED`.
3. Set that key as `TRIGGER_SECRET_KEY` in Vercel (§2).
4. Deploy the worker from this repo:
   ```sh
   npm install
   npx trigger.dev@4.5.10 login
   npx trigger.dev@4.5.10 deploy --env prod
   ```
5. The worker needs these env vars in the Trigger.dev **prod** environment (Trigger.dev Settings → Environment Variables):
   `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENROUTER_API_KEY`, `BROWSERLESS_API_KEY`, and optionally `OPENROUTER_MODEL`.

The task id `run-growth-audit` (`src/trigger/audit-pipeline1.ts`) matches what `startAudit` calls. The worker runs on **Node 22** (`runtime: "node-22"` in `trigger.config.ts`) and marks `build.external` for `@react-pdf/renderer`, `playwright-core`, `chromium-bidi`, `lighthouse`, and `chrome-launcher`.

> Known non-fatal deploy warning: `[bundleSkills] skill discovery failed, skipping skill bundling: Worker timed out`. This does not affect the task.

---

## 4. Supabase (needed for real audits)

1. Create a Supabase project.
2. Run the migration `supabase/migrations/0001_init.sql` (tables, RLS, RPCs, storage buckets).
3. Create storage buckets `audit-assets` and `audit-reports` if not created by the migration.
4. Paste `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` into Vercel (§2).

### Schema drift notes

The live `audits` table has a NOT NULL `domain` column (inserts must include `domain` — `startAudit` does this). `credit_transactions.type` is a Postgres enum `transaction_type` with values `signup_bonus | purchase | subscription_grant | audit_deduction`; the migration's check constraint matches.

### Auth

Auth is Supabase email/password. The app uses `@supabase/ssr` with a cookie-bound server client (`src/lib/supabase/auth.ts`) plus server functions in `src/lib/services/auth-service.ts`. The `handle_new_user()` trigger grants 1 free credit on signup. Confirm email confirmation is enabled or disabled per your auth settings — sign-up returns `requiresEmailConfirmation` and the UI handles both.

---

## Troubleshooting

| Symptom                          | Fix                                                                 |
| -------------------------------- | ------------------------------------------------------------------- |
| Routes 404 / server functions fail | Confirm `nitro()` is present in `vite.config.ts` and framework preset is **TanStack Start** (not Vite/static) |
| Audit stuck in demo mode          | No demo mode exists — `startAudit` throws if Supabase env vars are missing |
| `startAudit` throws                | Missing `TRIGGER_SECRET_KEY` (or it's a `tr_dev_...` key), or the Trigger.dev worker isn't deployed to prod |
| Sign-in/sign-up fail on Vercel     | `SUPABASE_ANON_KEY` not set in Vercel env (needed by the SSR auth client) |
| Audit marked `failed` but PDF exists | Post-commit errors (e.g. credit deduction) no longer flip committed audits to `failed`; deploy the latest worker |
| Audit stuck `QUEUED` / `pending`   | Worker not deployed to prod, or `TRIGGER_SECRET_KEY` is a dev-scoped `tr_dev_...` token |
| `null value in column "domain"`    | Remote `audits` table requires `domain`; use the current `startAudit` (it derives `domain` from the URL) |