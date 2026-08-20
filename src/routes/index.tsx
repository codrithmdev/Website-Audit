import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthDialog } from "@/components/growth-lens/auth-dialog";
import { Dashboard } from "@/components/growth-lens/dashboard";
import { Landing } from "@/components/growth-lens/landing";
import { Processing } from "@/components/growth-lens/processing";
import { Report } from "@/components/growth-lens/report";
import { UpgradeModal } from "@/components/growth-lens/upgrade-modal";
import {
  startAudit as startAuditFn,
  getAuditStatus,
  getMyAudits,
  getProfile,
} from "@/lib/services/audit-service";
import { signOut as signOutFn, getSession } from "@/lib/services/auth-service";
import type { AuditResultState, AuthUser, MyAuditRow, View } from "@/lib/types/growth-lens";

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

function GrowthLensApp() {
  const [view, setView] = useState<View>("landing"),
    [url, setUrl] = useState("https://yourcompany.com"),
    [progress, setProgress] = useState(0),
    [upgrade, setUpgrade] = useState(false),
    [user, setUser] = useState<AuthUser | null>(null),
    [authOpen, setAuthOpen] = useState(false),
    [authMode, setAuthMode] = useState<"signin" | "signup">("signin"),
    [, setSessionLoading] = useState(true),
    [menu, setMenu] = useState(false),
    [credits, setCredits] = useState(0),
    [auditResult, setAuditResult] = useState<AuditResultState>(null),
    [myAudits, setMyAudits] = useState<MyAuditRow[]>([]);

  useEffect(() => {
    getSession({ data: undefined })
      .then((r) => {
        setUser(r.user);
        return r.user ? r.user : null;
      })
      .then((activeUser) => {
        if (!activeUser) return;
        getMyAudits({ data: undefined })
          .then((res) => setMyAudits(res.audits))
          .catch(() => {});
        getProfile({ data: undefined })
          .then((res) => setCredits(res.credits))
          .catch(() => {});
      })
      .finally(() => setSessionLoading(false));
  }, []);

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

  const refreshAccount = () => {
    getMyAudits({ data: undefined })
      .then((r) => setMyAudits(r.audits))
      .catch(() => {});
    getProfile({ data: undefined })
      .then((r) => setCredits(r.credits))
      .catch(() => {});
  };

  const startAudit = async () => {
    if (!url.trim()) {
      toast.error("Enter a website URL to continue");
      return;
    }
    if (!user) {
      setAuthMode("signin");
      setAuthOpen(true);
      return;
    }
    setView("processing");
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      const { auditId } = await startAuditFn({ data: { targetUrl: url } });
      // Poll real audit status until the audit completes.
      const started = async () => {
        const res = await getAuditStatus({ data: auditId });
        if (res.status === "completed" || res.status === "failed") {
          setAuditResult({
            id: auditId,
            status: res.status,
            score: res.score ?? null,
            report: res.report ?? null,
            screenshotUrl: res.screenshotUrl ?? null,
            pdfUrl: res.pdfUrl ?? null,
          });
          setView("report");
          refreshAccount();
          return;
        }
        window.setTimeout(started, 2000);
      };
      started();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong starting the audit.";
      if (msg === "AUTH_REQUIRED") {
        setAuthMode("signin");
        setAuthOpen(true);
        setView("landing");
        toast.error("Please sign in to run an audit.");
      } else if (msg === "INSUFFICIENT_CREDITS") {
        setUpgrade(true);
        setView("landing");
        toast.error("You're out of audit credits.");
      } else {
        setView("landing");
        toast.error(msg);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutFn({ data: undefined });
    } catch {
      // still clear local state below
    }
    setUser(null);
    setCredits(0);
    setMyAudits([]);
    setAuditResult(null);
    setView("landing");
    toast.success("Signed out.");
  };

  const handleViewReport = async (auditId: string) => {
    try {
      const res = await getAuditStatus({ data: auditId });
      if (res.status === "completed" || res.status === "failed") {
        setAuditResult({
          id: auditId,
          status: res.status,
          score: res.score ?? null,
          report: res.report ?? null,
          screenshotUrl: res.screenshotUrl ?? null,
          pdfUrl: res.pdfUrl ?? null,
        });
        setView("report");
      } else {
        toast.info("This audit is still processing.");
      }
    } catch {
      toast.error("Couldn't load that audit.");
    }
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
        result={auditResult}
      />
    );
  if (view === "dashboard")
    return (
      <Dashboard
        onReport={() => setView("report")}
        onNew={() => setView("landing")}
        onUpgrade={() => setUpgrade(true)}
        onSignOut={handleSignOut}
        onViewReport={handleViewReport}
        audits={myAudits}
        credits={credits}
        user={user}
      />
    );

  return (
    <>
      <Landing
        url={url}
        onUrlChange={setUrl}
        onStartAudit={startAudit}
        user={user}
        credits={credits}
        menu={menu}
        onMenuToggle={() => setMenu((m) => !m)}
        onDashboard={() => setView("dashboard")}
        onSignOut={handleSignOut}
        onSignIn={() => {
          setAuthMode("signin");
          setAuthOpen(true);
        }}
        onUpgrade={() => setUpgrade(true)}
      />
      <UpgradeModal open={upgrade} onOpenChange={setUpgrade} />
      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        mode={authMode}
        onModeChange={setAuthMode}
        onAuthenticated={(u) => {
          setUser(u);
          setAuthOpen(false);
          refreshAccount();
        }}
      />
    </>
  );
}
