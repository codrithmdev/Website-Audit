import type { CSSProperties } from "react";
import {
  Copy,
  Download,
  ExternalLink,
  LayoutDashboard,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AuditResultState } from "@/lib/types/growth-lens";
import { Brand } from "./brand";

export function Report({
  url,
  onDashboard,
  onReaudit,
  onUpgrade,
  result,
}: {
  url: string;
  onDashboard: () => void;
  onReaudit: () => void;
  onUpgrade: () => void;
  result: AuditResultState;
}) {
  const domain = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const liveScore = result?.score ?? null;
  const liveReport = result?.report;
  const screenshotSrc = result?.screenshotUrl ?? null;
  const copy = () => {
    navigator.clipboard?.writeText(location.href);
    toast.success("Report URL copied to clipboard!");
  };
  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center px-5 lg:px-8">
          <Brand />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onDashboard}>
              <LayoutDashboard /> Dashboard
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="report-banner">
          <div className="flex min-w-0 items-center gap-4">
            {screenshotSrc && (
              <img
                src={screenshotSrc}
                alt={`Audited homepage for ${domain}`}
                width={160}
                height={100}
                className="hidden h-20 w-32 rounded-sm border object-cover sm:block"
              />
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-growth">Executive growth audit</p>
              <h1 className="truncate text-2xl font-bold">{domain}</h1>
              <p className="metric mt-1 text-xs text-muted-foreground">Homepage</p>
            </div>
          </div>
          {liveScore !== null && <Score value={liveScore} />}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (result?.pdfUrl) {
                window.open(result.pdfUrl, "_blank");
              } else {
                toast.info("PDF report is not ready yet.");
              }
            }}
          >
            <Download />
            Download PDF
          </Button>
          <Button variant="outline" onClick={copy}>
            <Copy />
            Share link
          </Button>
          <Button variant="outline" onClick={onReaudit}>
            <RefreshCw />
            Re-audit
          </Button>
          <Button variant="ghost" onClick={onUpgrade}>
            Get more credits
          </Button>
        </div>
        {!liveReport ? (
          <section className="mt-8 rounded-lg border bg-card p-10 text-center">
            <div className="icon-box mx-auto">
              <Trash2 />
            </div>
            <h2 className="mt-4 text-lg font-bold">This audit didn't complete</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              We couldn't produce a report for this site. If you just ran this audit, it may still
              be processing — refresh in a moment. Otherwise try re-auditing the URL.
            </p>
            <Button variant="growth" className="mt-5" onClick={onReaudit}>
              <RefreshCw /> Re-audit
            </Button>
          </section>
        ) : (
          <>
            <section className="summary-box mt-8">
              <div className="flex items-center gap-2">
                <Sparkles className="text-growth" />
                <h2 className="text-xl font-bold">Executive summary</h2>
              </div>
              <div className="mt-6 grid gap-5 md:grid-cols-3">
                <Summary
                  label="Trust"
                  text={liveReport.trustSignalSummary ?? ""}
                  status={`${liveReport.trustScore}/100`}
                />
                <Summary
                  label="Message clarity"
                  text={liveReport.valuePropClarity ?? ""}
                  status={`${liveReport.clarityScore}/100`}
                />
                <Summary
                  label="Conversion friction"
                  text={liveReport.heroCritique ?? ""}
                  status={`${liveReport.frictionScore}/100`}
                />
              </div>
            </section>
            <section className="mt-12">
              <div className="section-title">
                <div>
                  <span className="eyebrow">Priority action plan</span>
                  <h2>Fix first</h2>
                </div>
                <span className="metric text-sm text-muted-foreground">
                  {liveReport.fixFirst?.length ?? 0} priority findings
                </span>
              </div>
              <div className="mt-6 space-y-4">
                {(liveReport.fixFirst ?? []).map((f, i) => (
                  <article className="finding-card" key={f.title}>
                    <div className="priority-no">0{i + 1}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="mr-auto text-lg font-bold">{f.title}</h3>
                        <span className="badge-warning">{f.impact}</span>
                        <span className="badge-neutral">{f.effort}</span>
                      </div>
                      <div className="mt-5 grid gap-5 md:grid-cols-3">
                        <Detail label="The problem" text={f.problem} />
                        <Detail label="Business impact" text={f.why} />
                        <Detail label="Recommended action" text={f.action} good />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <section className="mt-14">
              <div className="section-title">
                <div>
                  <span className="eyebrow">Visual evidence</span>
                  <h2>See the friction in context</h2>
                </div>
              </div>
              <div className="mt-6 grid overflow-hidden rounded-lg border bg-card lg:grid-cols-[1fr_320px]">
                <div className="relative bg-primary p-4">
                  {screenshotSrc ? (
                    <img
                      src={screenshotSrc}
                      alt="Annotated audit evidence"
                      width={1280}
                      height={800}
                      loading="lazy"
                      className="w-full rounded-sm"
                    />
                  ) : (
                    <div className="flex aspect-video items-center justify-center text-sm text-muted-foreground">
                      No screenshot available
                    </div>
                  )}
                </div>
                <div className="divide-y">
                  {(liveReport.fixFirst ?? []).slice(0, 2).map((f, i) => (
                    <Evidence key={f.title} n={String(i + 1)} title={f.title} text={f.problem} />
                  ))}
                </div>
              </div>
            </section>
            <Breakdown technicalPerformance={result?.report?.technicalPerformance ?? null} />
          </>
        )}
        <section className="mt-14 flex flex-col items-start justify-between gap-6 rounded-lg bg-primary p-8 text-primary-foreground sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-growth">Recommended next step</p>
            <h2 className="mt-2 text-2xl font-bold">Need help executing these fixes?</h2>
            <p className="mt-2 text-sm text-primary-foreground/70">
              Book a free strategy call with our growth team.
            </p>
          </div>
          <Button size="lg" variant="growth">
            Book strategy call <ExternalLink />
          </Button>
        </section>
      </main>
    </div>
  );
}

function Score({ value }: { value: number }) {
  return (
    <div className="score-ring" style={{ "--score": `${value * 3.6}deg` } as CSSProperties}>
      <div>
        <span className="metric text-2xl font-bold">{value}</span>
        <span className="metric text-xs text-muted-foreground">/100</span>
      </div>
    </div>
  );
}
function Summary({ label, text, status }: { label: string; text: string; status: string }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase text-muted-foreground">{label}</p>
        <span className="badge-warning">{status}</span>
      </div>
      <p className="mt-3 text-sm leading-6">{text}</p>
    </div>
  );
}
function Detail({ label, text, good }: { label: string; text: string; good?: boolean }) {
  return (
    <div className={good ? "detail-good" : ""}>
      <p className="text-xs font-bold uppercase text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm leading-6">{text}</p>
    </div>
  );
}
function Evidence({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="p-6">
      <span className="pin-static">{n}</span>
      <h3 className="mt-4 font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}
function Breakdown({
  technicalPerformance,
}: {
  technicalPerformance: {
    performanceScore?: number;
    accessibilityScore?: number;
    seoScore?: number;
    largestContentfulPaint?: string;
    cumulativeLayoutShift?: string;
  } | null;
}) {
  const data: Array<{ key: string; tab: string; rows: Array<[string, number]> }> = [];
  if (technicalPerformance) {
    data.push({
      key: "tech",
      tab: "Performance",
      rows: [
        ["Performance", technicalPerformance.performanceScore ?? 0],
        ["Accessibility", technicalPerformance.accessibilityScore ?? 0],
      ],
    });
    data.push({
      key: "seo",
      tab: "SEO basics",
      rows: [["SEO score", technicalPerformance.seoScore ?? 0]],
    });
    const speedRows: Array<[string, number]> = [];
    const lcp = technicalPerformance.largestContentfulPaint ?? "";
    const cls = technicalPerformance.cumulativeLayoutShift ?? "";
    if (lcp) speedRows.push(["Largest Contentful Paint", parseInt(lcp, 10) || 0]);
    if (cls) speedRows.push(["Cumulative Layout Shift", Math.round(parseFloat(cls) * 100) || 0]);
    if (speedRows.length)
      data.push({
        key: "speed",
        tab: "Speed & stability",
        rows: speedRows,
      });
  }
  if (data.length === 0) return null;
  return (
    <section className="mt-14">
      <div className="section-title">
        <div>
          <span className="eyebrow">Detailed analysis</span>
          <h2>Audit breakdown</h2>
        </div>
      </div>
      <Tabs defaultValue={data[0]!.key} className="mt-6">
        <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-lg border bg-card p-1">
          {data.map((d) => (
            <TabsTrigger key={d.key} value={d.key}>
              {d.tab}
            </TabsTrigger>
          ))}
        </TabsList>
        {data.map((d) => (
          <TabsContent value={d.key} key={d.key} className="rounded-lg border bg-card p-6">
            <div className="grid gap-6 md:grid-cols-3">
              {d.rows.map(([label, val]) => (
                <div key={String(label)}>
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold">{label}</span>
                    <span className="metric text-sm font-bold">{val}</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-growth" style={{ width: `${val}%` }} />
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {Number(val) > 80 ? "Meets benchmark" : "Improvement opportunity"}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
