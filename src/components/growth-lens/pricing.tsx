import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pricing({ onUpgrade }: { onUpgrade: () => void }) {
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
