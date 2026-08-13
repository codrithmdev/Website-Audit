import { createServerFn } from "@tanstack/react-start";
import { tasks } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase/client";
import { getSupabaseAuth } from "@/lib/supabase/auth";
import type { AuditResult } from "@/lib/schemas/audit";

async function requireUser(): Promise<{ id: string }> {
  const supabase = getSupabaseAuth();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("AUTH_REQUIRED");
  return { id: user.id };
}

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

export type AuditRow = {
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

export type StoredAuditReport = AuditResult & {
  overallScore?: number;
  technicalPerformance?: {
    performanceScore?: number;
    accessibilityScore?: number;
    seoScore?: number;
    largestContentfulPaint?: string;
    cumulativeLayoutShift?: string;
  };
};

export const startAudit = createServerFn({ method: "POST" })
  .validator((data: { targetUrl: string }) => data)
  .handler(async ({ data }) => {
    const targetUrl = urlSchema.parse(data.targetUrl);

    if (!isConfigured()) {
      // Server-side prerequisites are missing; refuse rather than simulate.
      throw new Error("Audit service is not configured yet. Please try again later.");
    }

    const { id: userId } = await requireUser();

    const supabase = getSupabaseAdmin();
    const urlHash = crypto.createHash("sha256").update(targetUrl.toLowerCase()).digest("hex");

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
    if (!isConfigured()) {
      throw new Error("Audit service is not configured yet.");
    }
    await requireUser();

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
      score: data.overall_score,
      report: data.report_json as StoredAuditReport | null,
      screenshotUrl: data.screenshot_url,
      pdfUrl: data.pdf_report_url,
      error: data.error_message,
    };
  });

export const getMyAudits = createServerFn({ method: "GET" })
  .validator((data: undefined) => data)
  .handler(async () => {
    if (!isConfigured()) return { audits: [] };
    const { id: userId } = await requireUser().catch(() => ({ id: "" }));
    if (!userId) return { audits: [] };

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
  .validator((data: undefined) => data)
  .handler(async () => {
    if (!isConfigured()) return { credits: 0 };
    const { id: userId } = await requireUser().catch(() => ({ id: "" }));
    if (!userId) return { credits: 0 };

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("profiles")
      .select("credits_balance")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;

    return { credits: data?.credits_balance ?? 0 };
  });
