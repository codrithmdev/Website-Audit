import type { StoredAuditReport } from "@/lib/services/audit-service";

export type View = "landing" | "processing" | "report" | "dashboard";

export type AuthUser = { id: string; email: string };

export type AuditResultState = {
  id: string;
  status: string;
  score: number | null;
  report: StoredAuditReport | null;
  screenshotUrl: string | null;
  pdfUrl: string | null;
} | null;

export type MyAuditRow = {
  id: string;
  target_url: string;
  status: string;
  overall_score: number | null;
  created_at: string;
  pdf_report_url: string | null;
};
