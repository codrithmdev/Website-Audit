import crypto from "crypto";

export function hashAuditUrl(targetUrl: string): string {
  return crypto.createHash("sha256").update(targetUrl.trim().toLowerCase()).digest("hex");
}

export function extractAuditDomain(targetUrl: string): string {
  return new URL(targetUrl).hostname;
}
