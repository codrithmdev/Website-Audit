import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  PanelsTopLeft,
  CheckCircle2,
  CircleDollarSign,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Gauge,
  Globe2,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  MousePointer2,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import auditTarget from "@/assets/audit-target.jpg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type View = "landing" | "processing" | "report" | "dashboard";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GrowthLens — AI Website Growth Audits" },
      {
        name: "description",
        content:
          "Find the conversion, trust, and UX issues costing your website revenue with a business-first AI audit.",
      },
      { property: "og:title", content: "GrowthLens — AI Website Growth Audits" },
      {
        property: "og:description",
        content:
          "Turn any URL into a prioritized, business-first growth diagnostic in under 60 seconds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GrowthLensApp,
});

const findings = [
  {
    title: "Clarify the primary promise above the fold",
    impact: "High impact",
    effort: "Low effort",
    problem: "The headline describes a service, but not the business outcome buyers get.",
    why: "Visitors must interpret the offer before deciding to continue, increasing early exits.",
    action: "Lead with a measurable customer outcome and support it with one clear proof point.",
  },
  {
    title: "Add proof next to the primary CTA",
    impact: "High impact",
    effort: "Medium effort",
    problem: "The core action appears before any recognizable customer or outcome evidence.",
    why: "High-intent visitors hesitate at the exact moment you ask them to commit.",
    action: "Place 3 customer logos and one quantified result directly below the hero CTA.",
  },
  {
    title: "Reduce competing navigation choices",
    impact: "Medium impact",
    effort: "Low effort",
    problem: "Six equal-weight navigation links compete with the main conversion path.",
    why: "Choice overload dilutes attention and lowers clicks on the highest-value action.",
    action: "Group secondary resources and retain one visually dominant header CTA.",
  },
];

function Brand() {
  return (
    <button
      onClick={() => location.reload()}
      className="flex items-center gap-2.5"
      aria-label="GrowthLens home"
    >
      <span className="relative grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
        <PanelsTopLeft size={19} />
        <TrendingUp
          className="absolute -right-1 -top-1 rounded-full bg-growth p-0.5 text-growth-foreground"
          size={14}
        />
      </span>
      <span className="text-lg font-extrabold">
        Growth<span className="text-growth">Lens</span>
      </span>
    </button>
  );
}

function GrowthLensApp() {
  const [view, setView] = useState<View>("landing"),
    [url, setUrl] = useState("https://yourcompany.com"),
    [progress, setProgress] = useState(0),
    [upgrade, setUpgrade] = useState(false),
    [loggedIn, setLoggedIn] = useState(false),
    [menu, setMenu] = useState(false);
  useEffect(() => {
    if (view !== "processing") return;
    setProgress(4);
    const id = window.setInterval(
      () =>
        setProgress((p) => {
          if (p >= 100) {
            window.clearInterval(id);
            window.setTimeout(() => setView("report"), 450);
            return 100;
          }
          return Math.min(100, p + Math.ceil(Math.random() * 5));
        }),
      260,
    );
    return () => window.clearInterval(id);
  }, [view]);
  const startAudit = () => {
    if (!url.trim()) {
      toast.error("Enter a website URL to continue");
      return;
    }
    setView("processing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  if (view === "processing")
    return <Processing url={url} progress={progress} onCancel={() => setView("landing")} />;
  if (view === "report")
    return (
      <Report
        url={url}
        onDashboard={() => setView("dashboard")}
        onReaudit={startAudit}
        onUpgrade={() => setUpgrade(true)}
      />
    );
  if (view === "dashboard")
    return (
      <Dashboard
        onReport={() => setView("report")}
        onNew={() => setView("landing")}
        onUpgrade={() => setUpgrade(true)}
      />
    );
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:px-8">
          <Brand />
          <nav className="hidden items-center justify-center gap-5 lg:gap-7 md:flex">
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#sample" className="nav-link">
              Sample audit
            </a>
            <a href="#pricing" className="nav-link">
              Pricing
            </a>
            <a href="#docs" className="nav-link">
              Docs
            </a>
          </nav>
          <div className="hidden min-w-0 items-center justify-end gap-2 md:flex">
            {loggedIn ? (
              <>
                <span className="credit-pill hidden xl:inline-flex">⚡ 8 Credits Left</span>
                <Button variant="ghost" onClick={() => setView("dashboard")}>
                  Dashboard
                </Button>
                <Button
                  size="icon"
                  className="shrink-0 rounded-full"
                  onClick={() => setLoggedIn(false)}
                >
                  AM
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="shrink-0" onClick={() => setLoggedIn(true)}>
                  Sign in
                </Button>
                <Button
                  variant="growth"
                  className="shrink-0"
                  onClick={() => document.querySelector("input")?.focus()}
                >
                  Start free audit
                </Button>
              </>
            )}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="shrink-0 md:hidden"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </Button>
        </div>
        {menu && (
          <div className="border-t bg-background p-5 md:hidden">
            <nav className="grid gap-4 text-sm font-semibold">
              <a href="#features">Features</a>
              <a href="#sample">Sample audit</a>
              <a href="#pricing">Pricing</a>
              <a href="#docs">Docs</a>
              <div className="grid grid-cols-2 gap-2 border-t pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setLoggedIn(true);
                    setMenu(false);
                  }}
                >
                  Sign in
                </Button>
                <Button
                  variant="growth"
                  onClick={() => {
                    setMenu(false);
                    document.querySelector("input")?.focus();
                  }}
                >
                  Start free audit
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>
      <main className="hero-grid">
        <section className="relative overflow-hidden border-b">
          <div className="mx-auto max-w-6xl px-5 pb-20 pt-20 text-center lg:pb-28 lg:pt-28">
            <div className="eyebrow mx-auto">
              <Sparkles size={14} /> Business-first website intelligence
            </div>
            <h1 className="mx-auto mt-6 max-w-5xl text-balance text-4xl font-extrabold leading-tight sm:text-6xl lg:text-7xl">
              Stop losing website visitors. Know exactly what to{" "}
              <span className="text-growth">fix first.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-8 text-muted-foreground">
              AI-powered visual, trust, and UX audits that turn bounce rates into booked revenue in
              under 60 seconds.
            </p>
            <div className="audit-bar mx-auto mt-10 max-w-4xl">
              <div className="flex min-w-0 flex-1 items-center gap-3 px-4">
                <Globe2 className="shrink-0 text-muted-foreground" size={20} />
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && startAudit()}
                  aria-label="Website URL"
                  className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none sm:text-base"
                />
              </div>
              <div className="hidden w-44 border-l sm:block">
                <Select defaultValue="sales">
                  <SelectTrigger className="h-full rounded-none border-0 shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Increase Sales</SelectItem>
                    <SelectItem value="leads">Generate Leads</SelectItem>
                    <SelectItem value="ux">Improve UX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button size="xl" variant="growth" className="m-1.5" onClick={startAudit}>
                Audit my website <ArrowRight />
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              No credit card required <span className="mx-1">•</span> 1 free audit included
            </p>
          </div>
        </section>
        <section id="sample" className="section-shell relative z-10 -mt-10">
          <div className="report-preview grid overflow-hidden lg:grid-cols-[1.35fr_.65fr]">
            <div className="relative overflow-hidden bg-primary p-3 sm:p-6">
              <img
                src={auditTarget}
                alt="Example business website being audited"
                width={1280}
                height={800}
                className="aspect-video w-full rounded-sm object-cover opacity-90"
              />
              <span className="pin left-[44%] top-[37%]">1</span>
              <span className="pin left-[73%] top-[23%]">2</span>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="eyebrow m-0">Live audit preview</span>
                <span className="score-sm">72</span>
              </div>
              <h2 className="mt-5 text-2xl font-bold">
                The page looks polished. The buying path doesn’t.
              </h2>
              <div className="mt-7 space-y-5">
                <PreviewFinding
                  n="01"
                  title="Promise lacks a measurable outcome"
                  tag="High impact"
                />
                <PreviewFinding
                  n="02"
                  title="Proof arrives after the first ask"
                  tag="High impact"
                />
                <PreviewFinding n="03" title="Too many competing actions" tag="Medium" />
              </div>
              <Button variant="link" className="mt-5 px-0" onClick={() => setView("report")}>
                Explore the full sample report <ArrowRight />
              </Button>
            </div>
          </div>
        </section>
        <section id="features" className="section-shell py-24">
          <div className="section-heading">
            <span className="eyebrow">Built for decisions, not data dumps</span>
            <h2>See what’s costing you growth.</h2>
            <p>Every insight is translated into business impact and a clear next action.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <Pillar
              icon={CircleDollarSign}
              title="Business-first analysis"
              text="Focus on sales friction, buyer confidence, and message clarity—not raw server logs."
            />
            <Pillar
              icon={MousePointer2}
              title="Evidence-backed insights"
              text="Visual annotations pinpoint weak CTAs, missing proof, and costly UX decisions."
            />
            <Pillar
              icon={Target}
              title="Prioritized fix list"
              text="Recommendations ranked by expected revenue impact and implementation effort."
            />
          </div>
        </section>
        <Pricing onUpgrade={() => setUpgrade(true)} />
        <section id="docs" className="bg-primary py-16 text-primary-foreground">
          <div className="section-shell flex flex-col items-start justify-between gap-7 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold text-growth">
                Start with one page. Leave with a plan.
              </p>
              <h2 className="mt-2 text-3xl font-bold">Find your highest-leverage fix today.</h2>
            </div>
            <Button
              size="xl"
              variant="growth"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Run your free audit <ArrowRight />
            </Button>
          </div>
        </section>
      </main>
      <footer className="border-t px-5 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <Brand />
          <span>© 2026 GrowthLens. Clearer websites, stronger growth.</span>
        </div>
      </footer>
      <UpgradeModal open={upgrade} onOpenChange={setUpgrade} />
    </div>
  );
}

function PreviewFinding({ n, title, tag }: { n: string; title: string; tag: string }) {
  return (
    <div className="flex items-start gap-4 border-b pb-4">
      <span className="metric text-xs text-muted-foreground">{n}</span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{title}</p>
        <span className="mt-1 inline-block text-xs font-semibold text-warning">{tag}</span>
      </div>
    </div>
  );
}
function Pillar({ icon: Icon, title, text }: { icon: typeof Target; title: string; text: string }) {
  return (
    <article className="feature-card">
      <div className="icon-box">
        <Icon strokeWidth={1.5} />
      </div>
      <h3 className="mt-6 text-lg font-bold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
    </article>
  );
}
function Pricing({ onUpgrade }: { onUpgrade: () => void }) {
  const [annual, setAnnual] = useState(true);
  const plans = [
    {
      n: "Free Trial",
      p: "$0",
      d: "One complete audit",
      f: ["1 website audit", "Executive summary", "Shareable report"],
    },
    {
      n: "Starter",
      p: annual ? "$23" : "$29",
      d: "For growing businesses",
      f: ["10 audits per month", "PDF exports", "Audit history"],
      hot: true,
    },
    {
      n: "Agency",
      p: annual ? "$71" : "$89",
      d: "For teams and consultants",
      f: ["40 audits per month", "White-label reports", "Priority processing"],
    },
  ];
  return (
    <section id="pricing" className="border-t bg-muted/40 py-24">
      <div className="section-shell">
        <div className="section-heading">
          <span className="eyebrow">Simple pricing</span>
          <h2>From first insight to repeatable growth.</h2>
          <div className="mt-6 inline-flex rounded-md border bg-background p-1 text-sm">
            <button
              className={!annual ? "toggle-active" : "toggle"}
              onClick={() => setAnnual(false)}
            >
              Monthly
            </button>
            <button className={annual ? "toggle-active" : "toggle"} onClick={() => setAnnual(true)}>
              Annual · save 20%
            </button>
          </div>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.map((p) => (
            <article key={p.n} className={p.hot ? "price-card price-hot" : "price-card"}>
              {p.hot && <span className="popular">Most popular</span>}
              <p className="font-bold">{p.n}</p>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-4xl font-extrabold">{p.p}</span>
                {p.p !== "$0" && <span className="mb-1 text-sm text-muted-foreground">/mo</span>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
              <Button
                variant={p.hot ? "growth" : "outline"}
                className="mt-6 w-full"
                onClick={onUpgrade}
              >
                {p.p === "$0" ? "Start free" : "Choose " + p.n}
              </Button>
              <ul className="mt-6 space-y-3">
                {p.f.map((x) => (
                  <li key={x} className="flex gap-2 text-sm">
                    <CheckCircle2 size={17} className="text-growth" />
                    {x}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Processing({
  url,
  progress,
  onCancel,
}: {
  url: string;
  progress: number;
  onCancel: () => void;
}) {
  const steps = [
    { at: 10, t: "Capturing high-resolution visual layout" },
    { at: 32, t: "Measuring conversion CTA hierarchy & contrast" },
    { at: 58, t: "Extracting trust signals and social proof" },
    { at: 82, t: "Synthesizing priority recommendations" },
  ];
  return (
    <main className="min-h-screen bg-canvas px-5 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <Brand />
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
        <div className="mt-16 text-center">
          <div className="eyebrow mx-auto">
            <span className="pulse-dot" />
            Analyzing page layout
          </div>
          <h1 className="mt-6 text-3xl font-bold sm:text-4xl">Building your growth diagnostic</h1>
          <p className="mt-3 text-muted-foreground">{url}</p>
        </div>
        <div className="mx-auto mt-12 max-w-3xl rounded-lg border bg-card p-6 shadow-sm sm:p-9">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold">Audit progress</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Usually complete in under 60 seconds
              </p>
            </div>
            <span className="metric text-3xl font-bold">{progress}%</span>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-growth transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-8 space-y-3">
            {steps.map((s) => {
              const done = progress >= s.at + 18,
                active = progress >= s.at && !done;
              return (
                <div key={s.t} className={active ? "process-row process-active" : "process-row"}>
                  {done ? (
                    <CheckCircle2 className="text-growth" />
                  ) : active ? (
                    <RefreshCw className="animate-spin text-growth" />
                  ) : (
                    <span className="size-5 rounded-full border" />
                  )}
                  <span className="flex-1 text-sm font-medium">{s.t}</span>
                  <span className="text-xs text-muted-foreground">
                    {done ? "Complete" : active ? "In progress" : "Waiting"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-4xl rounded-lg border bg-card p-5 shadow-sm">
          <div className="skeleton-preview">
            <div className="skeleton-line w-1/3" />
            <div className="grid grid-cols-3 gap-3">
              <div className="skeleton-block col-span-2" />
              <div className="skeleton-block" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="skeleton-card" />
              <div className="skeleton-card" />
              <div className="skeleton-card" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Report({
  url,
  onDashboard,
  onReaudit,
  onUpgrade,
}: {
  url: string;
  onDashboard: () => void;
  onReaudit: () => void;
  onUpgrade: () => void;
}) {
  const domain = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
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
            <span className="credit-pill hidden sm:inline-flex">⚡ 8 Credits Left</span>
            <Button variant="ghost" size="sm" onClick={onDashboard}>
              <LayoutDashboard /> Dashboard
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="report-banner">
          <div className="flex min-w-0 items-center gap-4">
            <img
              src={auditTarget}
              alt={`Audited homepage for ${domain}`}
              width={160}
              height={100}
              className="hidden h-20 w-32 rounded-sm border object-cover sm:block"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-growth">Executive growth audit</p>
              <h1 className="truncate text-2xl font-bold">{domain}</h1>
              <p className="metric mt-1 text-xs text-muted-foreground">
                Aug 6, 2026 · 12:06 PM · Homepage
              </p>
            </div>
          </div>
          <Score value={72} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => toast.success("PDF report download started")}>
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
        <section className="summary-box mt-8">
          <div className="flex items-center gap-2">
            <Sparkles className="text-growth" />
            <h2 className="text-xl font-bold">Executive summary</h2>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <Summary
              label="Trust"
              text="Professional appearance, but proof arrives too late in the journey."
              status="Needs work"
            />
            <Summary
              label="Message clarity"
              text="The offer is clear, but the outcome and differentiation are not."
              status="Fair"
            />
            <Summary
              label="Conversion friction"
              text="Too many competing paths weaken your primary action."
              status="High friction"
            />
          </div>
        </section>
        <section className="mt-12">
          <div className="section-title">
            <div>
              <span className="eyebrow">Priority action plan</span>
              <h2>Fix first</h2>
            </div>
            <span className="metric text-sm text-muted-foreground">3 critical findings</span>
          </div>
          <div className="mt-6 space-y-4">
            {findings.map((f, i) => (
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
              <img
                src={auditTarget}
                alt="Annotated audit evidence"
                width={1280}
                height={800}
                loading="lazy"
                className="w-full rounded-sm"
              />
              <span className="pin left-[44%] top-[37%]">1</span>
              <span className="pin left-[74%] top-[22%]">2</span>
            </div>
            <div className="divide-y">
              <Evidence
                n="1"
                title="Unclear primary promise"
                text="The headline names the service, not the result."
              />
              <Evidence
                n="2"
                title="Missing trust at decision point"
                text="No customer evidence supports the main CTA."
              />
            </div>
          </div>
        </section>
        <Breakdown />
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
function Breakdown() {
  const data = {
    ux: [
      ["Headline clarity", 68],
      ["CTA visibility", 74],
      ["Form friction", 81],
    ],
    trust: [
      ["Testimonials", 52],
      ["Security cues", 88],
      ["Contact ease", 64],
    ],
    tech: [
      ["Performance", 83],
      ["Accessibility", 91],
      ["Mobile readiness", 78],
    ],
    seo: [
      ["Title & description", 94],
      ["Open Graph", 71],
      ["Indexing", 100],
    ],
  };
  return (
    <section className="mt-14">
      <div className="section-title">
        <div>
          <span className="eyebrow">Detailed analysis</span>
          <h2>Audit breakdown</h2>
        </div>
      </div>
      <Tabs defaultValue="ux" className="mt-6">
        <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-lg border bg-card p-1">
          <TabsTrigger value="ux">UX & conversion</TabsTrigger>
          <TabsTrigger value="trust">Trust & proof</TabsTrigger>
          <TabsTrigger value="tech">Performance</TabsTrigger>
          <TabsTrigger value="seo">SEO basics</TabsTrigger>
        </TabsList>
        {Object.entries(data).map(([key, rows]) => (
          <TabsContent value={key} key={key} className="rounded-lg border bg-card p-6">
            <div className="grid gap-6 md:grid-cols-3">
              {rows.map(([label, val]) => (
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

function Dashboard({
  onReport,
  onNew,
  onUpgrade,
}: {
  onReport: () => void;
  onNew: () => void;
  onUpgrade: () => void;
}) {
  const [q, setQ] = useState("");
  const rows = useMemo(
    () =>
      [
        { url: "northstar.io", date: "Aug 6, 2026", score: 72, p: 3 },
        { url: "brightpath.co", date: "Aug 2, 2026", score: 84, p: 2 },
        { url: "acme-studio.com", date: "Jul 29, 2026", score: 61, p: 5 },
      ].filter((r) => r.url.includes(q.toLowerCase())),
    [q],
  );
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Brand />
          <Button variant="growth" onClick={onNew}>
            New audit <ArrowRight />
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-growth">Workspace overview</p>
            <h1 className="mt-1 text-3xl font-bold">Good afternoon, Alex.</h1>
          </div>
          <Button variant="outline" onClick={onUpgrade}>
            ⚡ 8 credits left
          </Button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={FileText} label="Total audits" value="24" />
          <Stat icon={Gauge} label="Average score" value="74.6" />
          <Stat icon={Sparkles} label="Credits saved" value="8" />
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
                {rows.map((r) => (
                  <tr key={r.url} className="border-b last:border-0">
                    <td className="p-4 font-semibold">
                      <Globe2 className="mr-2 inline text-growth" size={16} />
                      {r.url}
                    </td>
                    <td className="metric text-xs">{r.date}</td>
                    <td>
                      <span className="metric score-chip">{r.score}</span>
                    </td>
                    <td>
                      <span className="badge-warning">{r.p} fix first</span>
                    </td>
                    <td>
                      <div className="flex justify-end gap-1 pr-4">
                        <Button size="sm" variant="ghost" onClick={onReport}>
                          View report
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => toast.success("PDF download started")}
                        >
                          <Download />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => toast.success("Audit removed")}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
function UpgradeModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="icon-box mb-3">
            <Sparkles />
          </div>
          <DialogTitle className="text-2xl">Keep the insights coming</DialogTitle>
          <DialogDescription>
            You’re out of audit credits. Choose a one-time pack or upgrade for the best value.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <button
            className="upgrade-option"
            onClick={() => toast.success("Opening secure checkout…")}
          >
            <span className="badge-neutral">One time</span>
            <strong className="mt-4 text-lg">1 Audit Pack</strong>
            <span className="metric mt-1 text-2xl font-bold">$14.99</span>
            <span className="mt-3 text-sm text-muted-foreground">One complete growth audit</span>
          </button>
          <button
            className="upgrade-option upgrade-best"
            onClick={() => toast.success("Opening secure checkout…")}
          >
            <span className="popular">Best value</span>
            <strong className="mt-4 text-lg">Starter Subscription</strong>
            <span className="metric mt-1 text-2xl font-bold">$29/mo</span>
            <span className="mt-3 text-sm text-muted-foreground">10 audits every month</span>
          </button>
        </div>
        <div className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
          <LockKeyhole size={13} /> Secure checkout · Cancel anytime
        </div>
      </DialogContent>
    </Dialog>
  );
}
