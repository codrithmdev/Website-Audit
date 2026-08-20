import { useState } from "react";
import { ArrowRight, Download, FileText, Gauge, Globe2, Search, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AuthUser, MyAuditRow } from "@/lib/types/growth-lens";
import { Brand } from "./brand";

export function Dashboard({
  onReport,
  onNew,
  onUpgrade,
  onSignOut,
  onViewReport,
  audits,
  credits,
  user,
}: {
  onReport: () => void;
  onNew: () => void;
  onUpgrade: () => void;
  onSignOut: () => void;
  onViewReport: (id: string) => void;
  audits: MyAuditRow[];
  credits: number;
  user: AuthUser | null;
}) {
  const [q, setQ] = useState("");
  const rows = audits.map((a) => ({
    id: a.id,
    url: a.target_url.replace(/^https?:\/\//, "").replace(/\/$/, ""),
    date: new Date(a.created_at).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    score: a.overall_score ?? 0,
    status: a.status,
    p: a.status === "completed" ? 3 : 0,
    pdfReportUrl: a.pdf_report_url,
  }));
  const filtered = rows.filter((r) => r.url.includes(q.toLowerCase()));
  const firstName = (user?.email ?? "Guest").split("@")[0] ?? "there";
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Brand />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onSignOut}>
              Sign out
            </Button>
            <Button variant="growth" onClick={onNew}>
              New audit <ArrowRight />
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-growth">Workspace overview</p>
            <h1 className="mt-1 text-3xl font-bold">Good audit, {firstName}.</h1>
          </div>
          <Button variant="outline" onClick={onUpgrade}>
            ⚡ {credits} credits left
          </Button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={FileText} label="Total audits" value={String(rows.length)} />
          <Stat
            icon={Gauge}
            label="Average score"
            value={
              rows.length
                ? String(Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length))
                : "0"
            }
          />
          <Stat icon={Sparkles} label="Credits left" value={String(credits)} />
          <Stat icon={Users} label="Current plan" value="Starter" />
        </div>
        <section className="mt-10 rounded-lg border bg-card">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b p-5">
            <div>
              <h2 className="text-lg font-bold">Audit history</h2>
              <p className="text-sm text-muted-foreground">Your latest website diagnostics.</p>
            </div>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search websites"
                className="h-9 rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            {filtered.length === 0 ? (
              <div className="p-10 text-center">
                <Globe2 className="mx-auto text-muted-foreground/60" size={32} />
                <p className="mt-3 text-sm font-semibold">No audits yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Run your first audit from the homepage to see results here.
                </p>
                <Button variant="growth" className="mt-5" onClick={onNew}>
                  Run an audit <ArrowRight />
                </Button>
              </div>
            ) : (
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="p-4">Website</th>
                    <th>Date run</th>
                    <th>Growth score</th>
                    <th>Priorities</th>
                    <th className="pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-b last:border-0">
                      <td className="p-4 font-semibold">
                        <Globe2 className="mr-2 inline text-growth" size={16} />
                        {r.url}
                      </td>
                      <td className="metric text-xs">{r.date}</td>
                      <td>
                        <span className="metric score-chip">
                          {r.status === "completed" ? r.score : "—"}
                        </span>
                      </td>
                      <td>
                        <span className="badge-warning">{r.status}</span>
                      </td>
                      <td>
                        <div className="flex justify-end gap-1 pr-4">
                          <Button size="sm" variant="ghost" onClick={() => onViewReport(r.id)}>
                            View report
                          </Button>
                          {r.pdfReportUrl && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => window.open(r.pdfReportUrl!, "_blank")}
                            >
                              <Download />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Gauge; label: string; value: string }) {
  return (
    <div className="stat-card">
      <div className="icon-box">
        <Icon />
      </div>
      <div>
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
        <p className="metric mt-1 text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
