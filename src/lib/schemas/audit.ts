import { z } from "zod";

export const prioritySchema = z.enum(["CRITICAL", "HIGH", "MEDIUM"]);

export const findingSchema = z.object({
  title: z.string(),
  impact: prioritySchema,
  effort: z.string(),
  problem: z.string(),
  why: z.string(),
  action: z.string(),
});

export const auditResultSchema = z.object({
  trustScore: z.number().min(0).max(100),
  frictionScore: z.number().min(0).max(100),
  ctaScore: z.number().min(0).max(100),
  clarityScore: z.number().min(0).max(100),
  heroCritique: z.string(),
  valuePropClarity: z.string(),
  trustSignalSummary: z.string(),
  trustGaps: z.array(z.string()),
  fixFirst: z.array(findingSchema),
});

export type Finding = z.infer<typeof findingSchema>;
export type AuditResult = z.infer<typeof auditResultSchema>;
