"use client";

import { useState } from "react";
import { useSnap } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Check,
  Sparkles,
  Users,
  Zap,
  Shield,
  Cloud,
  FileText,
  Crown,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    key: "FREE" as const,
    name: "Free",
    price: 0,
    period: "forever",
    icon: Zap,
    color: "border-border",
    accent: "text-foreground",
    desc: "For individuals getting started with screenshots.",
    features: [
      "20 screenshots / month",
      "Basic annotation (arrow, text, rect, freehand)",
      "Manual blur only",
      "PNG / JPG download",
      "Share links (watermarked, 7-day expiry)",
      "Local storage only",
    ],
    notIncluded: ["AI auto-blur", "Cloud sync", "PDF export", "No watermark", "Team workspace"],
    cta: "Current plan",
  },
  {
    key: "PRO" as const,
    name: "Pro",
    price: 7,
    period: "month",
    icon: Crown,
    color: "border-primary",
    accent: "text-primary",
    popular: true,
    desc: "For power users & professionals who ship visual feedback daily.",
    features: [
      "Unlimited screenshots",
      "AI auto-blur (email, phone, card, CNIC)",
      "All annotation tools + numbered markers",
      "No watermark on share links",
      "Cloud sync across devices (5GB)",
      "PDF export & compile",
      "Custom branding / watermark",
      "Password-protected share links",
      "Spotlight & highlight tools",
    ],
    notIncluded: ["Team workspace", "Team analytics"],
    cta: "Upgrade to Pro",
  },
  {
    key: "TEAM_OWNER" as const,
    name: "Team",
    price: 19,
    period: "seat / month",
    icon: Users,
    color: "border-border",
    accent: "text-violet-600",
    desc: "For teams that collaborate on screenshots, bugs & guides.",
    features: [
      "Everything in Pro, plus:",
      "Shared team workspace library",
      "Invite unlimited members (per seat)",
      "Team-wide branding on share links",
      "Usage analytics across team",
      "Centralized billing for all seats",
      "Editor & Viewer role permissions",
      "Priority support",
    ],
    notIncluded: [],
    cta: "Start Team trial",
  },
];

const COMPARISON: { feature: string; free: boolean | string; pro: boolean | string; team: boolean | string }[] = [
  { feature: "Screenshots / month", free: "20", pro: "Unlimited", team: "Unlimited" },
  { feature: "AI auto-blur", free: false, pro: true, team: true },
  { feature: "Cloud sync", free: false, pro: "5GB", team: "50GB" },
  { feature: "PDF export", free: false, pro: true, team: true },
  { feature: "Numbered markers", free: false, pro: true, team: true },
  { feature: "Spotlight tool", free: false, pro: true, team: true },
  { feature: "Watermark on shares", free: "Yes", pro: "No", team: "Optional" },
  { feature: "Password-protected links", free: false, pro: true, team: true },
  { feature: "Custom expiry links", free: "7 days", pro: "Custom", team: "Custom" },
  { feature: "Team workspace", free: false, pro: false, team: true },
  { feature: "Team branding", free: false, pro: false, team: true },
  { feature: "Team analytics", free: false, pro: false, team: true },
  { feature: "Priority support", free: false, pro: false, team: true },
];

const FAQS = [
  { q: "Is there really a free tier?", a: "Yes — Free is free forever with no credit card. 20 screenshots/month and manual blur." },
  { q: "How does AI auto-blur work?", a: "We scan every screenshot with regex patterns for emails, phones, credit cards (Luhn-validated), and CNIC IDs, then blur detected regions in one click. A 'review before share' step keeps you in control." },
  { q: "Can I cancel anytime?", a: "Absolutely. Plans are month-to-month. Cancel anytime, no lock-in." },
  { q: "Do you support local payments (JazzCash/EasyPaisa)?", a: "Yes — Pro & Team tiers support both Stripe (cards) and local Pakistani payment methods." },
  { q: "Where is my data stored?", a: "Free tier is local-only. Pro & Team sync to encrypted cloud storage. You can delete/export anytime." },
  { q: "Is there an education discount?", a: "Yes — 50% off Pro for verified students & teachers. Contact support." },
];

export function Pricing() {
  const { user, setRole, setView } = useSnap();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const onPick = (plan: "FREE" | "PRO" | "TEAM_OWNER") => {
    if (plan === user.role) return;
    setRole(plan);
    toast.success(`Switched to ${plan.replace("_", " ")} plan (demo)`, {
      description: "In production this would route to Stripe / JazzCash / EasyPaisa checkout.",
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary" className="mb-3">Pricing</Badge>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Simple pricing for{" "}
          <span className="gradient-text">every kind of maker</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          Start free, upgrade when you need AI blur & cloud sync. Cancel anytime.
        </p>

        {/* Billing toggle */}
        <div className="mt-6 inline-flex items-center gap-1 rounded-full border border-border bg-card p-1">
          <button
            onClick={() => setBilling("monthly")}
            className={cn("rounded-full px-4 py-1.5 text-sm font-medium transition-colors", billing === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={cn("rounded-full px-4 py-1.5 text-sm font-medium transition-colors", billing === "yearly" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
          >
            Yearly
            <Badge variant="secondary" className="ml-1.5 bg-amber-400/20 text-amber-700">-20%</Badge>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {PLANS.map((p, idx) => {
          const Icon = p.icon;
          const isCurrent = user.role === p.key;
          const price = billing === "yearly" && p.price > 0 ? Math.round(p.price * 0.8) : p.price;
          return (
            <Card
              key={p.key}
              className={cn(
                "relative flex flex-col overflow-hidden border-2 transition-all animate-fade-in-up",
                p.color,
                `stagger-${idx + 1}`,
                p.popular && "shadow-xl shadow-primary/20 lg:scale-[1.04] glow-primary shimmer-border"
              )}
            >
              {p.popular && (
                <div className="absolute right-0 top-0 bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  Most popular
                </div>
              )}
              <CardContent className="flex flex-1 flex-col p-6">
                <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl bg-muted", p.accent)}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-bold">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">${price}</span>
                  <span className="text-sm text-muted-foreground">/{p.period}</span>
                </div>
                <Button
                  className="mt-5 w-full gap-2"
                  variant={isCurrent ? "outline" : "default"}
                  disabled={isCurrent}
                  onClick={() => onPick(p.key)}
                >
                  {isCurrent ? (
                    <><Check className="h-4 w-4" /> Current plan</>
                  ) : (
                    <>{p.cta} <ArrowRight className="h-4 w-4" /></>
                  )}
                </Button>
                <div className="mt-6 space-y-2.5">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span>{f}</span>
                    </div>
                  ))}
                  {p.notIncluded.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-sm text-muted-foreground/60 line-through">
                      <span className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Enterprise strip */}
      <Card className="mt-6 border-dashed bg-muted/30">
        <CardContent className="flex flex-col items-center justify-between gap-3 p-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold">Enterprise / Education</div>
              <div className="text-sm text-muted-foreground">Custom seats, SSO, audit logs, on-prem option. Contact sales@snapmark.io</div>
            </div>
          </div>
          <Button variant="outline" onClick={() => toast.success("Sales will reach out (demo)")}>Contact sales</Button>
        </CardContent>
      </Card>

      {/* Comparison table */}
      <div className="mt-14">
        <h2 className="text-center text-2xl font-bold">Compare every feature</h2>
        <Card className="mt-6 overflow-hidden">
          <div className="overflow-x-auto snap-scroll">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="p-4 text-left font-semibold">Feature</th>
                  <th className="p-4 text-center font-semibold">Free</th>
                  <th className="p-4 text-center font-semibold text-primary">Pro</th>
                  <th className="p-4 text-center font-semibold text-violet-600">Team</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={i % 2 ? "bg-muted/20" : ""}>
                    <td className="p-4 font-medium">{row.feature}</td>
                    {[row.free, row.pro, row.team].map((val, j) => (
                      <td key={j} className="p-4 text-center">
                        {typeof val === "boolean" ? (
                          val ? (
                            <Check className="mx-auto h-4 w-4 text-primary" />
                          ) : (
                            <span className="text-muted-foreground/40">—</span>
                          )
                        ) : (
                          <span className="font-medium">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* FAQ */}
      <div className="mt-14">
        <h2 className="text-center text-2xl font-bold">Frequently asked questions</h2>
        <div className="mx-auto mt-6 grid max-w-4xl gap-4 sm:grid-cols-2">
          {FAQS.map((f) => (
            <Card key={f.q} className="border-border/60">
              <CardContent className="p-5">
                <h3 className="font-semibold">{f.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment methods */}
      <Card className="mt-10 bg-gradient-to-br from-primary to-emerald-700 text-primary-foreground">
        <CardContent className="flex flex-col items-center justify-between gap-4 p-8 sm:flex-row">
          <div>
            <h3 className="text-xl font-bold">Pay your way</h3>
            <p className="mt-1 text-primary-foreground/80">Stripe for cards · JazzCash · EasyPaisa · Local pricing available</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-white/15 text-primary-foreground">VISA</Badge>
            <Badge variant="secondary" className="bg-white/15 text-primary-foreground">Mastercard</Badge>
            <Badge variant="secondary" className="bg-white/15 text-primary-foreground">JazzCash</Badge>
            <Badge variant="secondary" className="bg-white/15 text-primary-foreground">EasyPaisa</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
