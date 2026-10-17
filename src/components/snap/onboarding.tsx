"use client";

import { useState } from "react";
import { useSnap } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Camera,
  Sparkles,
  ShieldAlert,
  Link2,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Keyboard,
  Wand2,
  Users,
  Rocket,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "welcome", title: "Welcome to SnapMark", icon: Rocket },
  { key: "capture", title: "Capture modes", icon: Camera },
  { key: "annotate", title: "Annotation toolkit", icon: Sparkles },
  { key: "aiblur", title: "AI auto-blur", icon: ShieldAlert },
  { key: "share", title: "Share & export", icon: Link2 },
  { key: "ready", title: "You're ready!", icon: Check },
];

export function Onboarding() {
  const { completeOnboarding, setView, setCaptureModalOpen } = useSnap();
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState({
    defaultMode: "visible" as "full-page" | "visible" | "selected",
    aiBlur: true,
    hotkey: "Ctrl+Shift+S",
  });

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const finish = () => {
    completeOnboarding();
    setView("dashboard");
    toast.success("Welcome aboard! 🎉");
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setView("landing")}>
          <X className="h-4 w-4" /> Skip intro
        </Button>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{step + 1}</span>
          <span>/ {STEPS.length}</span>
        </div>
      </div>

      <Progress value={progress} className="mb-8 h-1.5" />

      {/* Step content */}
      <Card className="overflow-hidden border-border/60">
        <CardContent className="p-0">
          {/* Step 1: Welcome */}
          {step === 0 && (
            <div className="relative overflow-hidden p-8 text-center sm:p-12">
              <div className="grid-bg absolute inset-0 opacity-50" />
              <div className="relative">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 animate-float">
                  <Camera className="h-8 w-8" />
                </div>
                <Badge variant="secondary" className="mb-3 gap-1">
                  <Sparkles className="h-3 w-3" /> Onboarding
                </Badge>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Welcome to <span className="gradient-text">SnapMark</span>
                </h1>
                <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                  The screenshot tool that respects privacy. In the next 60
                  seconds you&apos;ll learn to capture, annotate, AI-blur and
                  share — like a pro.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-3 text-left">
                  {[
                    { icon: Camera, label: "Capture" },
                    { icon: Sparkles, label: "Annotate" },
                    { icon: ShieldAlert, label: "AI Blur" },
                  ].map((x) => {
                    const I = x.icon;
                    return (
                      <div key={x.label} className="rounded-lg border border-border bg-card p-3 text-center">
                        <I className="mx-auto h-5 w-5 text-primary" />
                        <div className="mt-1.5 text-xs font-medium">{x.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Capture */}
          {step === 1 && (
            <div className="p-8 sm:p-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Camera className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Choose your default capture mode</h2>
                  <p className="text-sm text-muted-foreground">You can change this anytime in Settings.</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { v: "visible", t: "Visible area", d: "Just what you see on screen", icon: Camera },
                  { v: "full-page", t: "Full page", d: "Stitch the entire scrollable page", icon: Camera },
                  { v: "selected", t: "Selected region", d: "Drag to pick a precise area", icon: Camera },
                ].map((o) => {
                  const active = preferences.defaultMode === o.v;
                  return (
                    <button
                      key={o.v}
                      onClick={() => setPreferences({ ...preferences, defaultMode: o.v as any })}
                      className={cn(
                        "rounded-xl border-2 p-4 text-left transition-all hover:-translate-y-0.5",
                        active ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/40"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <o.icon className={cn("h-5 w-5", active ? "text-primary" : "text-muted-foreground")} />
                        {active && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="mt-2 font-semibold">{o.t}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{o.d}</div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 rounded-lg border border-border bg-muted/40 p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Keyboard className="h-4 w-4 text-primary" /> Quick capture hotkey
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <code className="rounded-md bg-background px-2 py-1 font-mono text-sm">{preferences.hotkey}</code>
                  <Button variant="outline" size="sm" onClick={() => setCaptureModalOpen(true)}>Try it now</Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Annotate */}
          {step === 2 && (
            <div className="p-8 sm:p-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">8 precision annotation tools</h2>
                  <p className="text-sm text-muted-foreground">Hover each to learn its shortcut.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { s: "V", n: "Select / Move", d: "Pick & drag annotations" },
                  { s: "P", n: "Freehand", d: "Draw free shapes" },
                  { s: "R", n: "Rectangle", d: "Outline regions" },
                  { s: "A", n: "Arrow", d: "Point at things" },
                  { s: "T", n: "Text", d: "Add labels" },
                  { s: "N", n: "Numbered", d: "Step markers 1,2,3" },
                  { s: "H", n: "Highlight", d: "Spotlight an area" },
                  { s: "B", n: "Blur", d: "Manual pixelate blur" },
                ].map((t) => (
                  <div key={t.s} className="rounded-lg border border-border bg-card p-3 transition-shadow hover:shadow-md">
                    <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-primary">{t.s}</kbd>
                    <div className="mt-1.5 text-sm font-semibold">{t.n}</div>
                    <div className="text-[11px] text-muted-foreground">{t.d}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: AI Blur */}
          {step === 3 && (
            <div className="p-8 sm:p-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-violet-600">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">AI auto-blur protects PII</h2>
                  <p className="text-sm text-muted-foreground">SnapMark scans every screenshot for sensitive data.</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { icon: "📧", p: "Email addresses", d: "RFC-compliant regex matching" },
                  { icon: "📱", p: "Phone numbers", d: "US, intl, PK formats" },
                  { icon: "💳", p: "Credit cards", d: "Luhn-validated 13–16 digits" },
                  { icon: "🆔", p: "CNIC / ID", d: "Pakistani ID format" },
                ].map((x) => (
                  <div key={x.p} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                    <span className="text-2xl">{x.icon}</span>
                    <div>
                      <div className="text-sm font-semibold">{x.p}</div>
                      <div className="text-xs text-muted-foreground">{x.d}</div>
                    </div>
                    <Check className="ml-auto h-4 w-4 text-primary" />
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between rounded-lg border border-violet-400/30 bg-violet-500/5 p-4">
                <div className="flex items-center gap-3">
                  <Wand2 className="h-5 w-5 text-violet-600" />
                  <div>
                    <div className="text-sm font-medium">Enable AI auto-blur by default</div>
                    <div className="text-xs text-muted-foreground">You can review detections before applying.</div>
                  </div>
                </div>
                <Button
                  variant={preferences.aiBlur ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreferences({ ...preferences, aiBlur: !preferences.aiBlur })}
                >
                  {preferences.aiBlur ? "Enabled" : "Enable"}
                </Button>
              </div>
              {preferences.aiBlur && (
                <p className="mt-3 text-xs text-muted-foreground">
                  💡 Pro tip: Even with AI on, you can always use the manual <kbd className="rounded bg-muted px-1">B</kbd> blur tool as a backup.
                </p>
              )}
            </div>
          )}

          {/* Step 5: Share */}
          {step === 4 && (
            <div className="p-8 sm:p-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Link2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Share & export in one click</h2>
                  <p className="text-sm text-muted-foreground">No more save → open → edit → upload dance.</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { icon: Link2, t: "Shareable link", d: "With expiry & password protection (Pro)" },
                  { icon: Camera, t: "Copy to clipboard", d: "Paste straight into Slack / Notion / docs" },
                  { icon: Sparkles, t: "Download PNG/JPG", d: "High-quality export with annotations baked in" },
                  { icon: Users, t: "Team workspace", d: "Shared library with Editor/Viewer roles (Team)" },
                ].map((x) => {
                  const I = x.icon;
                  return (
                    <div key={x.t} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
                      <I className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm font-semibold">{x.t}</div>
                        <div className="text-xs text-muted-foreground">{x.d}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 6: Ready */}
          {step === 5 && (
            <div className="relative overflow-hidden p-8 text-center sm:p-12">
              <div className="grid-bg absolute inset-0 opacity-50" />
              <div className="relative">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 pulse-ring">
                  <Check className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight">You&apos;re all set! 🎉</h1>
                <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                  Capture your first screenshot, try the AI auto-blur, and ship
                  visual feedback like a pro.
                </p>
                <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg border border-border bg-card p-3">
                    <div className="text-2xl font-bold text-primary">8</div>
                    <div className="text-[11px] text-muted-foreground">tools</div>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-3">
                    <div className="text-2xl font-bold text-primary">4</div>
                    <div className="text-[11px] text-muted-foreground">PII patterns</div>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-3">
                    <div className="text-2xl font-bold text-primary">1</div>
                    <div className="text-[11px] text-muted-foreground">click share</div>
                  </div>
                </div>
                <Button size="lg" className="mt-7 gap-2" onClick={() => { finish(); setCaptureModalOpen(true); }}>
                  <Camera className="h-5 w-5" /> Take my first screenshot
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nav */}
      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" onClick={back} disabled={step === 0} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === step ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>
        {step < STEPS.length - 1 ? (
          <Button onClick={next} className="gap-1.5">
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={finish} className="gap-1.5">
            Get started <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
