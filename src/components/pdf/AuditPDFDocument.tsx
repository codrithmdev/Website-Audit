import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { AuditResult, Finding } from "@/lib/schemas/audit";

export type AuditReportData = AuditResult & { overallScore: number };

const NAVY = "#0f2a4a";
const EMERALD = "#10b981";
const AMBER = "#d97706";
const SLATE = "#475569";
const LIGHT = "#f1f5f9";
const BORDER = "#e2e8f0";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    paddingBottom: 56,
    fontSize: 10,
    color: "#0f172a",
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: EMERALD,
    paddingBottom: 12,
    marginBottom: 20,
  },
  brand: {
    flexDirection: "row",
    alignItems: "baseline",
    fontSize: 16,
    fontWeight: "bold",
  },
  brandAccent: {
    color: EMERALD,
  },
  headerMeta: {
    textAlign: "right",
    color: SLATE,
    fontSize: 8,
  },
  titleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  domain: {
    fontSize: 18,
    fontWeight: "bold",
    color: NAVY,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: EMERALD,
  },
  scoreLabel: {
    fontSize: 8,
    color: SLATE,
    marginLeft: 5,
  },
  scoreMeta: {
    color: SLATE,
    fontSize: 9,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: NAVY,
    marginBottom: 8,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingBottom: 6,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: LIGHT,
    borderRadius: 4,
    padding: 10,
  },
  summaryLabel: {
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: SLATE,
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 9,
    lineHeight: 1.5,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  categoryName: {
    fontSize: 10,
    fontWeight: "bold",
    color: NAVY,
  },
  categoryBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#e2e8f0",
    marginHorizontal: 10,
  },
  categoryBarFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: EMERALD,
  },
  categoryScore: {
    fontSize: 10,
    fontWeight: "bold",
    width: 24,
    textAlign: "right",
  },
  finding: {
    marginBottom: 12,
    border: 1,
    borderColor: BORDER,
    borderRadius: 4,
    padding: 10,
  },
  findingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  findingTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: NAVY,
    flex: 1,
  },
  tag: {
    fontSize: 7,
    fontWeight: "bold",
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginLeft: 4,
  },
  tagCritical: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
  },
  tagHigh: {
    backgroundColor: "#fef3c7",
    color: AMBER,
  },
  tagMedium: {
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  detailLabel: {
    width: 74,
    fontSize: 8,
    fontWeight: "bold",
    color: SLATE,
    textTransform: "uppercase",
  },
  detailText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.4,
  },
  criticalBox: {
    backgroundColor: NAVY,
    borderRadius: 4,
    padding: 12,
    marginTop: 16,
  },
  criticalTitle: {
    color: EMERALD,
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 4,
  },
  criticalText: {
    color: "#ffffff",
    fontSize: 9,
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 32,
    right: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 8,
    fontSize: 7,
    color: SLATE,
  },
});

const priorityOrder: Record<Finding["impact"], number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
};

export function AuditPDFDocument({
  auditData,
  targetUrl,
}: {
  auditData: AuditReportData;
  targetUrl: string;
}) {
  const domain = targetUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const sortedFindings = [...(auditData.fixFirst ?? [])].sort(
    (a, b) => priorityOrder[a.impact] - priorityOrder[b.impact],
  );
  const criticalCount = sortedFindings.filter((f) => f.impact === "CRITICAL").length;

  return (
    <Document title={`Growth Audit — ${domain}`} author="GrowthLens">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.header}>
            <Text style={styles.brand}>
              Growth<Text style={styles.brandAccent}>Lens</Text>
            </Text>
          </View>
          <View style={styles.headerMeta}>
            <Text>Websites that convert better, grow faster.</Text>
            <Text>Executive Growth Audit</Text>
          </View>
        </View>

        <View style={styles.titleSection}>
          <View>
            <Text style={styles.domain}>{domain}</Text>
            <Text style={styles.scoreMeta}>{targetUrl}</Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreValue}>{auditData.overallScore ?? 0}</Text>
            <Text style={styles.scoreLabel}>/100{"\n"}Growth Score</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Executive summary</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Trust</Text>
            <Text style={styles.summaryText}>{auditData.trustSignalSummary}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Message clarity</Text>
            <Text style={styles.summaryText}>{auditData.valuePropClarity}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Conversion friction</Text>
            <Text style={styles.summaryText}>{auditData.heroCritique}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Score breakdown</Text>
        {[
          { label: "Trust", value: auditData.trustScore },
          { label: "Friction", value: auditData.frictionScore },
          { label: "CTA", value: auditData.ctaScore },
          { label: "Clarity", value: auditData.clarityScore },
        ].map((row) => (
          <View style={styles.categoryRow} key={row.label}>
            <Text style={styles.categoryName}>{row.label}</Text>
            <View style={styles.categoryBar}>
              <View style={[styles.categoryBarFill, { width: `${row.value}%` }]} />
            </View>
            <Text style={styles.categoryScore}>{row.value}</Text>
          </View>
        ))}

        <Text
          style={styles.sectionTitle}
        >{`Fix first — ${criticalCount} critical finding${criticalCount === 1 ? "" : "s"}`}</Text>
        {sortedFindings.map((finding) => (
          <View style={styles.finding} key={finding.title}>
            <View style={styles.findingHeader}>
              <Text style={styles.findingTitle}>{finding.title}</Text>
              <Text
                style={[
                  styles.tag,
                  finding.impact === "CRITICAL"
                    ? styles.tagCritical
                    : finding.impact === "HIGH"
                      ? styles.tagHigh
                      : styles.tagMedium,
                ]}
              >
                {finding.impact}
              </Text>
              <Text style={[styles.tag, { backgroundColor: LIGHT, color: SLATE }]}>
                {finding.effort}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Problem</Text>
              <Text style={styles.detailText}>{finding.problem}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Impact</Text>
              <Text style={styles.detailText}>{finding.why}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Action</Text>
              <Text style={styles.detailText}>{finding.action}</Text>
            </View>
          </View>
        ))}

        <View style={styles.criticalBox}>
          <Text style={styles.criticalTitle}>Trust gaps flagged by the audit</Text>
          <Text style={styles.criticalText}>
            {(auditData.trustGaps ?? []).join(" · ") ||
              "No additional trust gaps to list — see the prioritized actions above."}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>GrowthLens — growthlens.app</Text>
          <Text>© 2026 GrowthLens. Clearer websites, stronger growth.</Text>
        </View>
      </Page>
    </Document>
  );
}
