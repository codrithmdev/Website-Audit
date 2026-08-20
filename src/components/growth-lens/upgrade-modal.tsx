import { LockKeyhole, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function UpgradeModal({
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
