# Deploying to Vercel

This guide is for the GitHub collaborator who will deploy **GrowthLens** on Vercel. The repo is a **TanStack Start (SSR)** app — it needs Nitro (already configured in `vite.config.ts`) so Vercel can run its server functions.

> **Demo mode:** The app runs simulated audits with **zero** environment variables. It will deploy and look complete immediately. Adding the keys below turns on real, live audits.

---

## 1. Import the repo into Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New… → Project**.
2. Import the **Website-Audit** repository (select the GitHub account that owns/collaborates on it).
3. Vercel should auto-detect the framework as **TanStack Start** (via `vercel.json` + Nitro).
   - If it asks, confirm: **Framework Preset = TanStack Start**.
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: leave default (Nitro emits `.vercel/output`).
   - **Node.js Version**: `22.x` (required by TanStack Start).
4. Click **Deploy**.

Verify: the landing page renders with server-side content, "Audit my website" runs a **demo** audit, and the Dashboard works.

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
| `TRIGGER_SECRET_KEY`        | Trigger.dev access token (see §3)              |

> ⚠️ **Security:** never expose `SUPABASE_SERVICE_ROLE_KEY` or `TRIGGER_SECRET_KEY` to the browser. They are only read server-side.

---

## 3. Set up Trigger.dev (needed for real audits)

The heavy audit work (Browserless scraping, Lighthouse, OpenAI, PDF) runs on **Trigger.dev cloud workers**, not on Vercel.

1. Create an account at [trigger.dev](https://trigger.dev) and a **new project**.
2. Replace the project ID in `trigger.config.ts`:
   ```ts
   project: "proj_your-project-id", // currently proj_isyixjxwxwchnmntortu (old owner's project)
   ```
3. Generate an **access token** in Trigger.dev → your project → **Environment Variables / API Keys**, and set it as `TRIGGER_SECRET_KEY` in Vercel (§2).
4. Deploy the worker from this repo:
   ```sh
   npm install
   npx trigger.dev@latest login
   npx trigger.dev@latest deploy
   ```

The task id `run-growth-audit` (`src/trigger/audit-pipeline1.ts`) already matches what `startAudit` calls.

---

## 4. Supabase (needed for real audits)

1. Create a Supabase project.
2. Run the migration `supabase/migrations/0001_init.sql` (tables, RLS, RPCs, storage buckets).
3. Create storage buckets `audit-assets` and `audit-reports` if not created by the migration.
4. Paste `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` into Vercel (§2).

---

## Troubleshooting

| Symptom                          | Fix                                                                 |
| -------------------------------- | ------------------------------------------------------------------- |
| Routes 404 / server functions fail | Confirm `nitro()` is present in `vite.config.ts` and framework preset is **TanStack Start** (not Vite/static) |
| Audit stuck in demo mode          | Missing `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` env vars        |
| `startAudit` throws                | Missing `TRIGGER_SECRET_KEY`, or the Trigger.dev worker isn't deployed |
| PDF/screenshot blank in report     | Expected until real audits complete (demo uses sample assets)        |
