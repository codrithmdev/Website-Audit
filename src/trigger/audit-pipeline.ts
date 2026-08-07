import { task } from "@trigger.dev/sdk/v3";

export const runGrowthAudit = task({
  id: "run-growth-audit",
  retry: { maxAttempts: 2 },
  run: async (payload: { auditId: string; userId: string; targetUrl: string }) => {
    console.log(`Starting audit for ${payload.targetUrl}`);
    return { success: true, auditId: payload.auditId };
  },
});
