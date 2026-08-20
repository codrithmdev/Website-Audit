import {
  ArrowRight,
  CircleDollarSign,
  Globe2,
  Menu,
  MousePointer2,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import auditTarget from "@/assets/audit-target.jpg";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AuthUser } from "@/lib/types/growth-lens";
import { Brand } from "./brand";
import { Pricing } from "./pricing";

export function Landing({
  url,
  onUrlChange,
  onStartAudit,
  user,
  credits,
  menu,
  onMenuToggle,
  onDashboard,
  onSignOut,
  onSignIn,
  onUpgrade,
}: {
  url: string;
  onUrlChange: (v: string) => void;
  onStartAudit: () => void;
  user: AuthUser | null;
  credits: number;
  menu: boolean;
  onMenuToggle: () => void;
  onDashboard: () => void;
  onSignOut: () => void;
  onSignIn: () => void;
  onUpgrade: () => void;
}) {
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
            {user ? (
              <>
                <span className="credit-pill hidden xl:inline-flex">⚡ {credits} Credits Left</span>
                <Button variant="ghost" onClick={onDashboard}>
                  Dashboard
                </Button>
                <Button size="icon" className="shrink-0 rounded-full" onClick={onSignOut} title="Sign out">
                  {(user.email ?? "AM").slice(0, 2).toUpperCase()}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="shrink-0" onClick={onSignIn}>
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
          <Button size="icon" variant="ghost" className="shrink-0 md:hidden" onClick={onMenuToggle}>
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
                {user ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        onMenuToggle();
                        onSignOut();
                      }}
                    >
                      Sign out
                    </Button>
                    <Button
                      variant="growth"
                      onClick={() => {
                        onMenuToggle();
                        onDashboard();
                      }}
                    >
                      Dashboard
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        onMenuToggle();
                        onSignIn();
                      }}
                    >
                      Sign in
                    </Button>
                    <Button
                      variant="growth"
                      onClick={() => {
                        onMenuToggle();
                        document.querySelector("input")?.focus();
                      }}
                    >
                      Start free audit
                    </Button>
                  </>
                )}
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
                  onChange={(e) => onUrlChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onStartAudit()}
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
              <Button size="xl" variant="growth" className="m-1.5" onClick={onStartAudit}>
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
                <PreviewFinding n="01" title="Promise lacks a measurable outcome" tag="High impact" />
                <PreviewFinding n="02" title="Proof arrives after the first ask" tag="High impact" />
                <PreviewFinding n="03" title="Too many competing actions" tag="Medium" />
              </div>
              <Button
                variant="link"
                className="mt-5 px-0"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Run your own audit <ArrowRight />
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
        <Pricing onUpgrade={onUpgrade} />
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
