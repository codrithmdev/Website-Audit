import { CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "./brand";

export function Processing({
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
