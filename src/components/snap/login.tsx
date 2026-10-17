"use client";

import { useState } from "react";
import { useSnap } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Camera,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Github,
  Chrome,
  ArrowRight,
  Sparkles,
  Check,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function Login() {
  const { setView, setRole } = useSnap();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(mode === "login" ? "Logged in!" : "Account created!", {
        description: "Welcome to SnapMark (demo auth).",
      });
      setRole("FREE");
      setView("dashboard");
    }, 900);
  };

  const social = (provider: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(`Signed in with ${provider}`, { description: "Welcome back (demo)!" });
      setRole("PRO");
      setView("dashboard");
    }, 800);
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2">
      {/* Left: marketing */}
      <div className="hidden lg:block">
        <button onClick={() => setView("landing")} className="mb-6 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            <Camera className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold">SnapMark</span>
        </button>
        <Badge variant="secondary" className="mb-4 gap-1">
          <Sparkles className="h-3 w-3" /> AI-powered screenshots
        </Badge>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
          Screenshot smarter. <br />
          <span className="gradient-text">Blur the sensitive bits.</span>
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          Join 50,000+ developers, QA testers, designers and support teams who
          ship visual feedback with privacy built-in.
        </p>
        <ul className="mt-6 space-y-3">
          {[
            "AI auto-blur for emails, phones, cards, IDs",
            "8 annotation tools + numbered step markers",
            "One-click shareable links with expiry & password",
            "Cloud sync across devices (Pro/Team)",
          ].map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary" /> {f}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-4">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <div>
            <div className="text-sm font-semibold">Privacy-first by design</div>
            <div className="text-xs text-muted-foreground">Free tier is local-only. Your data, your control.</div>
          </div>
        </div>
      </div>

      {/* Right: form */}
      <Card className="border-border/60">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "login"
                ? "Log in to access your screenshots & shared links."
                : "Free forever. No credit card required."}
            </p>
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => social("Google")} disabled={loading} className="gap-2">
              <Chrome className="h-4 w-4" /> Google
            </Button>
            <Button variant="outline" onClick={() => social("GitHub")} disabled={loading} className="gap-2">
              <Github className="h-4 w-4" /> GitHub
            </Button>
          </div>

          <div className="my-5 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or continue with email</span>
            <Separator className="flex-1" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <div>
                <Label htmlFor="name" className="mb-1.5 block text-sm">Full name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="pl-9"
                  />
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="email" className="mb-1.5 block text-sm">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-9"
                  autoComplete="email"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="pass" className="mb-1.5 block text-sm">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="pass"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="px-9"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {mode === "login" && (
                <button type="button" onClick={() => toast.info("Password reset link sent (demo)")} className="mt-1.5 text-xs text-primary hover:underline">
                  Forgot password?
                </button>
              )}
            </div>

            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Please wait…
                </span>
              ) : (
                <>
                  {mode === "login" ? "Log in" : "Create account"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="font-semibold text-primary hover:underline"
            >
              {mode === "login" ? "Sign up free" : "Log in"}
            </button>
          </div>

          <p className="mt-4 text-center text-[11px] text-muted-foreground">
            By continuing you agree to our{" "}
            <a href="#" className="underline hover:text-foreground">Terms</a> &{" "}
            <a href="#" className="underline hover:text-foreground">Privacy Policy</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
