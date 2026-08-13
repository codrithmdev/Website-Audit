import React from "react";
import { task } from "@trigger.dev/sdk/v3";
import { generateObject } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { auditResultSchema } from "@/lib/schemas/audit";
import { pdf } from "@react-pdf/renderer";
import { AuditPDFDocument } from "@/components/pdf/AuditPDFDocument";
import crypto from "crypto";
import { capturePageData } from "@/lib/scraper/browser";
import { runLighthouseAudit } from "@/lib/scraper/lighthouse";
import { getSupabaseAdmin } from "@/lib/supabase/client";

export const runGrowthAudit = task({
  id: "run-growth-audit",
  retry: { maxAttempts: 2 },
  run: async (payload: { auditId: string; userId: string; targetUrl: string }) => {
    const { auditId, userId, targetUrl } = payload;

    // Step 0: Mark audit status as processing
    const supabaseAdmin = getSupabaseAdmin();
    await supabaseAdmin.from("audits").update({ status: "processing" }).eq("id", auditId);

    try {
      // ----------------------------------------------------------------------
      // STEP 1: Parallel Scrape, Screenshot & Lighthouse Audit
      // ----------------------------------------------------------------------
      const [browserData, lighthouseData] = await Promise.all([
        capturePageData(targetUrl),
        runLighthouseAudit(targetUrl),
      ]);

      // Upload capture screenshot to Supabase Storage
      const screenshotPath = `screenshots/${auditId}.png`;
      // Upload capture screenshot to Supabase Storage (convert Buffer -> Blob where appropriate)
      const screenshotDataToUpload =
        typeof browserData.imageBuffer === "object" &&
        (browserData.imageBuffer instanceof Buffer || ArrayBuffer.isView(browserData.imageBuffer))
          ? new Blob([new Uint8Array(browserData.imageBuffer)])
          : browserData.imageBuffer;

      const { error: uploadError } = await supabaseAdmin.storage
        .from("audit-assets")
        .upload(screenshotPath, screenshotDataToUpload, { contentType: "image/png", upsert: true });
      if (uploadError) throw uploadError;

      const { data: screenshotData } = supabaseAdmin.storage
        .from("audit-assets")
        .getPublicUrl(screenshotPath);
      const screenshotPublicUrl = screenshotData.publicUrl;

      // ----------------------------------------------------------------------
      // STEP 2: Structured Vision AI Analysis via Vercel AI SDK
      // ----------------------------------------------------------------------
      const { object: aiAnalysis } = await generateObject({
        model: createOpenRouter({
          ...(process.env["OPENROUTER_API_KEY"]
            ? { apiKey: process.env["OPENROUTER_API_KEY"] }
            : {}),
        })(process.env["OPENROUTER_MODEL"] ?? "google/gemma-4-26b-a4b-it:free"),
        schema: auditResultSchema,
        system: `You are an elite CRO and Buyer Psychology Expert. Analyze landing pages strictly through buyer trust, friction points, value proposition clarity, and Call-To-Action (CTA) effectiveness. Output actionable, prioritized "Fix First" recommendations.`,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze landing page for domain: ${targetUrl}. Page Title: "${browserData.title}". Meta Description: "${browserData.description}".`,
              },
              { type: "image", image: browserData.imageBuffer },
            ],
          },
        ],
      });

      // ----------------------------------------------------------------------
      // STEP 3: Overall Growth Score Algorithm
      // Weights: Trust (30%), Friction (30%), CTA (20%), Tech/SEO (20%)
      // ----------------------------------------------------------------------
      const overallScore = Math.round(
        aiAnalysis.trustScore * 0.3 +
          aiAnalysis.frictionScore * 0.3 +
          aiAnalysis.ctaScore * 0.2 +
          lighthouseData.performanceScore * 0.2,
      );

      const finalAuditPayload = {
        ...aiAnalysis,
        overallScore,
        technicalPerformance: lighthouseData,
      };

      // ----------------------------------------------------------------------
      // STEP 4: Programmatic PDF Compilation & Storage
      // ----------------------------------------------------------------------
      // Generate PDF using react-pdf without JSX (keeps file as .ts)
      const pdfDoc = pdf(
        React.createElement(AuditPDFDocument, {
          auditData: finalAuditPayload,
          targetUrl,
        }) as React.ReactElement<import("@react-pdf/renderer").DocumentProps>,
      );
      const pdfBuffer = await pdfDoc.toBuffer();

      const pdfPath = `reports/${auditId}.pdf`;
      const { error: pdfUploadError } = await supabaseAdmin.storage
        .from("audit-reports")
        .upload(pdfPath, pdfBuffer, { contentType: "application/pdf", upsert: true });
      if (pdfUploadError) throw pdfUploadError;

      const { data: pdfData } = supabaseAdmin.storage.from("audit-reports").getPublicUrl(pdfPath);
      const pdfPublicUrl = pdfData.publicUrl;

      // ----------------------------------------------------------------------
      // STEP 5: Database Commit, Credit Deduction & Domain Cache
      // ----------------------------------------------------------------------
      const urlHash = crypto
        .createHash("sha256")
        .update(targetUrl.toLowerCase().trim())
        .digest("hex");
      const domain = new URL(targetUrl).hostname;

      // Update Audit Record
      const { error: auditUpdateError } = await supabaseAdmin
        .from("audits")
        .update({
          status: "completed",
          overall_score: overallScore,
          trust_score: aiAnalysis.trustScore,
          friction_score: aiAnalysis.frictionScore,
          cta_score: aiAnalysis.ctaScore,
          clarity_score: aiAnalysis.clarityScore,
          report_json: finalAuditPayload,
          screenshot_url: screenshotPublicUrl,
          pdf_report_url: pdfPublicUrl,
          completed_at: new Date().toISOString(),
        })
        .eq("id", auditId);
      if (auditUpdateError) throw auditUpdateError;

      // Deduct Credit
      const { error: rpcError } = await supabaseAdmin.rpc("deduct_user_credit", {
        p_user_id: userId,
        p_audit_id: auditId,
      });
      if (rpcError) throw rpcError;

      // Register Domain Cache
      const { error: cacheError } = await supabaseAdmin.from("domain_cache").upsert({
        url_hash: urlHash,
        domain,
        audit_id: auditId,
        expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      });
      if (cacheError) throw cacheError;

      return { success: true, auditId };
    } catch (err: unknown) {
      // Mark job as failed cleanly
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred during execution.";
      await supabaseAdmin
        .from("audits")
        .update({
          status: "failed",
          error_message: message,
        })
        .eq("id", auditId);

      throw err;
    }
  },
});
