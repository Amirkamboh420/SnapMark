"use client";

import { useState } from "react";
import { useSnap } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Download,
  Check,
  Crown,
  Users,
  Zap,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Receipt,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const INVOICES = [
  { id: "INV-2024-0912", date: "Sep 1, 2024", amount: "$7.00", plan: "Pro Monthly", status: "paid" },
  { id: "INV-2024-0847", date: "Aug 1, 2024", amount: "$7.00", plan: "Pro Monthly", status: "paid" },
  { id: "INV-2024-0781", date: "Jul 1, 2024", amount: "$7.00", plan: "Pro Monthly", status: "paid" },
  { id: "INV-2024-0712", date: "Jun 1, 2024", amount: "$19.00", plan: "Team (1 seat)", status: "paid" },
  { id: "INV-2024-0648", date: "May 1, 2024", amount: "$19.00", plan: "Team (1 seat)", status: "paid" },
];

const PAYMENT_METHODS = [
  { id: "pm1", brand: "VISA", last4: "4242", exp: "12/27", primary: true },
  { id: "pm2", brand: "MC", last4: "8888", exp: "03/26", primary: false },
];

export function Billing() {
  const { user, setRole, setView } = useSnap();
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");

  const planInfo: Record<string, { name: string; price: number; icon: any; color: string; features: string[] }> = {
    FREE: { name: "Free", price: 0, icon: Zap, color: "text-foreground", features: ["20 screenshots/mo", "Manual blur", "Watermarked shares"] },
    PRO: { name: "Pro", price: 7, icon: Crown, color: "text-primary", features: ["Unlimited screenshots", "AI auto-blur", "Cloud sync 5GB", "PDF export"] },
    TEAM_OWNER: { name: "Team", price: 19, icon: Users, color: "text-violet-600", features: ["Everything in Pro", "Team workspace", "5 seats included", "Team branding"] },
    TEAM_MEMBER: { name: "Team Member", price: 0, icon: Users, color: "text-violet-600", features: ["Billed to team owner", "Editor/Viewer access"] },
    ADMIN: { name: "Admin (internal)", price: 0, icon: Crown, color: "text-foreground", features: ["Full system access"] },
  };

  const current = planInfo[user.role];
  const yearlyPrice = current.price > 0 ? Math.round(current.price * 0.8) : 0;
  const displayPrice = cycle === "yearly" ? yearlyPrice : current.price;

  const switchPlan = (plan: any) => {
    setRole(plan);
    toast.success(`Switched to ${planInfo[plan].name} plan (demo)`, {
      description: "This would route to Stripe / JazzCash / EasyPaisa checkout.",
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Billing & Subscription</h1>
        <p className="text-sm text-muted-foreground">Manage your plan, payment methods, and invoices.</p>
      </div>

      {/* Current plan */}
      <Card className={cn("mb-6 overflow-hidden", user.role === "PRO" && "border-primary/40", user.role === "TEAM_OWNER" && "border-violet-400/40")}>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-muted", current.color)}>
                <current.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{current.name} Plan</h2>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {current.price > 0
                    ? `$${displayPrice}/${cycle === "yearly" ? "mo billed yearly" : "month"}`
                    : "Free forever"}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {current.features.map((f) => (
                    <Badge key={f} variant="outline" className="text-[10px] font-normal">{f}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {current.price > 0 && (
                <>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Next renewal</div>
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <Calendar className="h-3.5 w-3.5" /> Oct 1, 2024
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast.success("Auto-renew toggled")}>
                    <RefreshCw className="mr-1.5 h-3 w-3" /> Auto-renew on
                  </Button>
                </>
              )}
              {user.role === "FREE" && (
                <Button onClick={() => setView("pricing")} className="gap-1.5">
                  <Crown className="h-4 w-4" /> Upgrade
                </Button>
              )}
            </div>
          </div>

          {current.price > 0 && (
            <>
              <Separator className="my-5" />
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><DollarSign className="h-3 w-3" /> This month</div>
                  <div className="mt-1 text-lg font-bold">${displayPrice}.00</div>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><TrendingUp className="h-3 w-3" /> YTD spend</div>
                  <div className="mt-1 text-lg font-bold">${displayPrice * 9}.00</div>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Calendar className="h-3 w-3" /> Member since</div>
                  <div className="mt-1 text-sm font-bold">May 2024</div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Plan switcher */}
      <h2 className="mb-3 text-lg font-semibold">Switch plan</h2>
      <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-border bg-card p-1">
        <button onClick={() => setCycle("monthly")} className={cn("rounded-full px-4 py-1.5 text-sm font-medium transition-colors", cycle === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>Monthly</button>
        <button onClick={() => setCycle("yearly")} className={cn("rounded-full px-4 py-1.5 text-sm font-medium transition-colors", cycle === "yearly" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>
          Yearly <Badge variant="secondary" className="ml-1 bg-amber-400/20 text-amber-700">-20%</Badge>
        </button>
      </div>
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {(["FREE", "PRO", "TEAM_OWNER"] as const).map((p) => {
          const info = planInfo[p];
          const price = cycle === "yearly" && info.price > 0 ? Math.round(info.price * 0.8) : info.price;
          const isCurrent = user.role === p;
          return (
            <Card key={p} className={cn("relative", p === "PRO" && "border-primary/40", isCurrent && "ring-2 ring-primary/30")}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <info.icon className={cn("h-5 w-5", info.color)} />
                  {isCurrent && <Badge variant="secondary">Current</Badge>}
                </div>
                <div className="mt-3 text-lg font-bold">{info.name}</div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold">${price}</span>
                  <span className="text-xs text-muted-foreground">/{p === "TEAM_OWNER" ? "seat/mo" : "mo"}</span>
                </div>
                <Button
                  className="mt-4 w-full"
                  variant={isCurrent ? "outline" : "default"}
                  disabled={isCurrent}
                  onClick={() => switchPlan(p)}
                >
                  {isCurrent ? "Current plan" : p === "FREE" ? "Downgrade" : "Upgrade"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payment methods */}
      <h2 className="mb-3 text-lg font-semibold">Payment methods</h2>
      <div className="mb-6 space-y-2">
        {PAYMENT_METHODS.map((m) => (
          <Card key={m.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-14 items-center justify-center rounded-md bg-foreground text-background">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{m.brand}</span>
                    <span className="text-sm text-muted-foreground">•••• {m.last4}</span>
                    {m.primary && <Badge variant="secondary" className="text-[10px]">Primary</Badge>}
                  </div>
                  <div className="text-xs text-muted-foreground">Expires {m.exp}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {!m.primary && <Button variant="outline" size="sm" onClick={() => toast.success("Set as primary")}>Make primary</Button>}
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => toast.success("Payment method removed")}>Remove</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        <Button variant="outline" className="w-full border-dashed" onClick={() => toast.success("Add card flow opened (demo)")}>
          + Add payment method
        </Button>
      </div>

      {/* Local payment options */}
      {user.role !== "FREE" && (
        <Card className="mb-6 border-violet-400/30 bg-violet-500/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇵🇰</span>
              <div>
                <div className="font-semibold">Local payment methods</div>
                <div className="text-xs text-muted-foreground">Pay in PKR via JazzCash or EasyPaisa — local pricing available.</div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toast.success("JazzCash checkout opened")}>JazzCash</Button>
              <Button variant="outline" size="sm" onClick={() => toast.success("EasyPaisa checkout opened")}>EasyPaisa</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoices */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Invoice history</h2>
        <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => toast.success("All invoices exported (demo)")}>
          <Download className="h-3.5 w-3.5" /> Export all
        </Button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-3 text-left"><Receipt className="inline h-3 w-3" /> Invoice</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Plan</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {INVOICES.map((inv) => (
                <tr key={inv.id} className="hover:bg-muted/30">
                  <td className="p-3 font-mono text-xs">{inv.id}</td>
                  <td className="p-3 text-muted-foreground">{inv.date}</td>
                  <td className="p-3">{inv.plan}</td>
                  <td className="p-3 text-right font-medium">{inv.amount}</td>
                  <td className="p-3 text-center">
                    <Badge variant="outline" className="border-emerald-500/40 text-emerald-600">
                      <Check className="mr-1 h-3 w-3" /> {inv.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast.success(`Downloading ${inv.id}.pdf`)}>
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Danger zone */}
      <Card className="mt-6 border-destructive/30">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />
            <div className="flex-1">
              <div className="font-semibold text-destructive">Cancel subscription</div>
              <div className="text-sm text-muted-foreground">You&apos;ll keep access until the end of the billing period, then downgrade to Free.</div>
            </div>
            <Button variant="outline" className="text-destructive hover:bg-destructive/5" onClick={() => toast.error("Are you sure? This will downgrade you to Free.")}>
              Cancel plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
