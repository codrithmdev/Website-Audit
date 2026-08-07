import { createServerFn } from "@tanstack/react-start";
import { tasks } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase/client";
import type { AuditResult } from "@/lib/schemas/audit";

const isConfigured = () =>
  Boolean(process.env["SUPABASE_URL"] && process.env["SUPABASE_SERVICE_ROLE_KEY"]);

const urlSchema = z
  .string()
  .trim()
  .min(1, "Enter a website URL")
  .regex(
    /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/,
    "Enter a valid website URL (e.g. https://example.com)",
  )
  .transform((u) => (u.startsWith("http") ? u : `https://${u}`));

type AuditRow = {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  overall_score: number | null;
  trust_score: number | null;
  friction_score: number | null;
  cta_score: number | null;
  clarity_score: number | null;
  report_json: AuditResult | null;
  screenshot_url: string | null;
  pdf_report_url: string | null;
  error_message: string | null;
  target_url: string;
  created_at: string;
};

export const startAudit = createServerFn({ method: "POST" })
  .validator((data: { targetUrl: string; userId?: string }) => data)
  .handler(async ({ data }) => {
    const targetUrl = urlSchema.parse(data.targetUrl);

    if (!isConfigured()) {
      // Demo mode: simulate a completed audit when Supabase isn't wired up.
      await new Promise((r) => setTimeout(r, 900));
      return { auditId: `demo-${crypto.randomUUID().slice(0, 8)}`, demo: true };
    }

    const supabase = getSupabaseAdmin();
    const urlHash = crypto.createHash("sha256").update(targetUrl.toLowerCase()).digest("hex");
    const userId = data.userId ?? "00000000-0000-0000-0000-000000000000";

    // Domain cache lookup — 0-credit instant return for cached reports.
    const { data: cached } = await supabase
      .from("domain_cache")
      .select("audit_id")
      .eq("url_hash", urlHash)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();
    if (cached?.audit_id) {
      return { auditId: cached.audit_id, cached: true };
    }

    // Credit balance verification guard.
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits_balance")
      .eq("id", userId)
      .maybeSingle();
    if (!profile || (profile.credits_balance ?? 0) < 1) {
      throw new Error("INSUFFICIENT_CREDITS");
    }

    // Create the audit record (deduction happens in the background task).
    const { data: audit, error } = await supabase
      .from("audits")
      .insert({
        user_id: userId,
        target_url: targetUrl,
        url_hash: urlHash,
        status: "pending",
      })
      .select()
      .single();
    if (error) throw error;

    // Dispatch the background pipeline.
    await tasks.trigger("run-growth-audit", {
      auditId: audit.id,
      userId,
      targetUrl,
    });

    return { auditId: audit.id, cached: false };
  });

export const getAuditStatus = createServerFn({ method: "GET" })
  .validator((auditId: string) => auditId)
  .handler(async ({ data: auditId }) => {
    if (!isConfigured() || auditId.startsWith("demo-")) {
      return { status: "completed" as const, demo: true };
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("audits")
      .select(
        "id,status,overall_score,report_json,screenshot_url,pdf_report_url,error_message,target_url",
      )
      .eq("id", auditId)
      .single();
    if (error) throw error;

    return {
      status: data.status,
      demo: false,
      score: data.overall_score,
      report: data.report_json as AuditResult | null,
      screenshotUrl: data.screenshot_url,
      pdfUrl: data.pdf_report_url,
      error: data.error_message,
    };
  });

export const getMyAudits = createServerFn({ method: "GET" })
  .validator((userId?: string) => userId)
  .handler(async ({ data: userId }) => {
    if (!isConfigured() || !userId) return { audits: [] };

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("audits")
      .select("id,target_url,status,overall_score,created_at,screenshot_url,pdf_report_url")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw error;

    return { audits: (data as AuditRow[]) ?? [] };
  });

export const getProfile = createServerFn({ method: "GET" })
  .validator((userId?: string) => userId)
  .handler(async ({ data: userId }) => {
    if (!isConfigured() || !userId) return { credits: 0 };

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("profiles")
      .select("credits_balance")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;

    return { credits: data?.credits_balance ?? 0 };
  });
