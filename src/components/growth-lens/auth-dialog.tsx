import { useState, type FormEvent } from "react";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn as signInFn, signUp as signUpFn } from "@/lib/services/auth-service";
import type { AuthUser } from "@/lib/types/growth-lens";

export function AuthDialog({
  open,
  onOpenChange,
  mode,
  onModeChange,
  onAuthenticated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "signin" | "signup";
  onModeChange: (m: "signin" | "signup") => void;
  onAuthenticated: (u: AuthUser) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!busy) {
      setBusy(true);
      try {
        if (mode === "signin") {
          const res = await signInFn({ data: { email, password } });
          onAuthenticated(res.user);
        } else {
          const res = await signUpFn({ data: { email, password } });
          if (res.user && !res.requiresEmailConfirmation) {
            onAuthenticated(res.user);
          } else {
            setNotice("Account created. Check your email to confirm, then sign in.");
            onModeChange("signin");
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setBusy(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="icon-box mb-3">
            <LockKeyhole />
          </div>
          <DialogTitle className="text-2xl">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </DialogTitle>
          <DialogDescription>
            {mode === "signin"
              ? "Sign in to run audits and access your reports."
              : "Get 1 free audit credit on sign-up."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="auth-email">Email</Label>
            <Input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="auth-password">Password</Label>
            <Input
              id="auth-password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
          </div>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          {notice && <p className="text-sm font-medium text-growth">{notice}</p>}
          <Button type="submit" variant="growth" className="w-full" disabled={busy}>
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          {mode === "signin" ? (
            <>
              New to GrowthLens?{" "}
              <button
                type="button"
                className="text-growth font-semibold hover:underline"
                onClick={() => onModeChange("signup")}
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="text-growth font-semibold hover:underline"
                onClick={() => onModeChange("signin")}
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </DialogContent>
    </Dialog>
  );
}
