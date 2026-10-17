"use client";

import { useState } from "react";
import { useSnap } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Users,
  DollarSign,
  HardDrive,
  ShieldAlert,
  TrendingUp,
  Ticket,
  Activity,
  Megaphone,
  Search,
  Ban,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const KPI = [
  { label: "Total users", value: "48,250", delta: "+312 today", icon: Users, color: "text-primary" },
  { label: "MRR", value: "$28,540", delta: "+8.2% MoM", icon: DollarSign, color: "text-emerald-600" },
  { label: "Storage used", value: "1.84 TB", delta: "of 5 TB", icon: HardDrive, color: "text-amber-600" },
  { label: "AI blur flags", value: "12,847", delta: "99.2% accuracy", icon: ShieldAlert, color: "text-violet-600" },
];

const USERS = [
  { id: "u1", name: "Sarah Johnson", email: "sarah.j@gmail.com", plan: "PRO", status: "active", screenshots: 142, joined: "2024-08-12" },
  { id: "u2", name: "Acme Corp (Team)", email: "billing@acme.com", plan: "TEAM_OWNER", status: "active", screenshots: 1840, joined: "2024-06-03" },
  { id: "u3", name: "Ahmed Khan", email: "ahmed.khan@gmail.com", plan: "FREE", status: "active", screenshots: 18, joined: "2024-09-21" },
  { id: "u4", name: "Maria Garcia", email: "maria.g@outlook.com", plan: "PRO", status: "suspended", screenshots: 67, joined: "2024-07-15" },
  { id: "u5", name: "David Chen", email: "david.chen@yahoo.com", plan: "FREE", status: "active", screenshots: 4, joined: "2024-09-29" },
  { id: "u6", name: "Fatima Ali", email: "fatima.ali@gmail.com", plan: "TEAM_MEMBER", status: "active", screenshots: 234, joined: "2024-05-19" },
  { id: "u7", name: "Robert Smith", email: "r.smith@company.com", plan: "PRO", status: "active", screenshots: 89, joined: "2024-08-30" },
];

const TICKETS = [
  { id: "t1", subject: "AI blur missed my phone number", user: "sarah.j@gmail.com", status: "open", priority: "high", pattern: "phone" },
  { id: "t2", subject: "Stripe payment failed on upgrade", user: "ahmed.khan@gmail.com", status: "in-progress", priority: "medium", pattern: null },
  { id: "t3", subject: "False positive on a date string", user: "maria.g@outlook.com", status: "open", priority: "low", pattern: "cnic" },
  { id: "t4", subject: "How do I export to PDF?", user: "david.chen@yahoo.com", status: "resolved", priority: "low", pattern: null },
  { id: "t5", subject: "Full-page stitch broken on SPA", user: "billing@acme.com", status: "open", priority: "high", pattern: null },
];

const AI_FLAGS = [
  { id: "f1", pattern: "email", sample: "billing@acme.com", result: "correct", timestamp: "2m ago" },
  { id: "f2", pattern: "card", sample: "4111 1111 1111 1111", result: "correct", timestamp: "8m ago" },
  { id: "f3", pattern: "phone", sample: "555-2024-01", result: "false-positive", timestamp: "15m ago" },
  { id: "f4", pattern: "cnic", sample: "35201-1234567-1", result: "correct", timestamp: "22m ago" },
  { id: "f5", pattern: "email", sample: "noreply@github.com", result: "correct", timestamp: "30m ago" },
  { id: "f6", pattern: "card", sample: "1234 5678 9012", result: "false-negative", timestamp: "44m ago" },
];

const PATTERN_COLORS: Record<string, string> = {
  email: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  phone: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  card: "bg-rose-500/15 text-rose-600 border-rose-500/30",
  cnic: "bg-violet-500/15 text-violet-600 border-violet-500/30",
};

export function Admin() {
  const { user, setRole, setView } = useSnap();
  const [query, setQuery] = useState("");

  const filteredUsers = USERS.filter(
    (u) => u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="gap-1 bg-violet-600 text-white hover:bg-violet-600"><ShieldAlert className="h-3 w-3" /> Admin</Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">System overview, users, support & AI blur accuracy.</p>
        </div>
        <Button variant="outline" onClick={() => { setRole("PRO"); setView("dashboard"); }}>
          Exit admin mode
        </Button>
      </div>

      {user.role !== "ADMIN" ? (
        <Card className="border-amber-400/40 bg-amber-400/5">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
            <div>
              <div className="font-semibold">Admin access required</div>
              <div className="text-sm text-muted-foreground">Switch to the Admin role from the user menu to view this panel.</div>
            </div>
            <Button onClick={() => setRole("ADMIN")}>Switch to Admin role</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* KPIs */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {KPI.map((k) => {
              const Icon = k.icon;
              return (
                <Card key={k.label}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg bg-muted", k.color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <TrendingUp className="h-3 w-3 text-emerald-500" />
                    </div>
                    <div className="mt-3 text-2xl font-bold">{k.value}</div>
                    <div className="text-xs text-muted-foreground">{k.label}</div>
                    <div className="mt-1 text-[11px] text-emerald-600">{k.delta}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Tabs defaultValue="users">
            <TabsList className="mb-4">
              <TabsTrigger value="users" className="gap-1.5"><Users className="h-3.5 w-3.5" /> Users</TabsTrigger>
              <TabsTrigger value="tickets" className="gap-1.5"><Ticket className="h-3.5 w-3.5" /> Support</TabsTrigger>
              <TabsTrigger value="ai" className="gap-1.5"><ShieldAlert className="h-3.5 w-3.5" /> AI Monitor</TabsTrigger>
              <TabsTrigger value="broadcast" className="gap-1.5"><Megaphone className="h-3.5 w-3.5" /> Broadcast</TabsTrigger>
            </TabsList>

            {/* USERS */}
            <TabsContent value="users">
              <Card>
                <div className="border-b border-border p-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search users by name or email…"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="p-3 text-left">User</th>
                        <th className="p-3 text-left">Plan</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-right">Screenshots</th>
                        <th className="p-3 text-left">Joined</th>
                        <th className="p-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-muted/30">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/15 text-xs text-primary">{u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</AvatarFallback></Avatar>
                              <div>
                                <div className="font-medium">{u.name}</div>
                                <div className="text-xs text-muted-foreground">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className={u.plan === "PRO" ? "border-primary/40 text-primary" : u.plan === "TEAM_OWNER" ? "border-violet-400/40 text-violet-600" : ""}>
                              {u.plan.replace("_", " ")}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge variant={u.status === "active" ? "secondary" : "destructive"} className="capitalize">{u.status}</Badge>
                          </td>
                          <td className="p-3 text-right font-mono">{u.screenshots}</td>
                          <td className="p-3 text-muted-foreground">{u.joined}</td>
                          <td className="p-3 text-right">
                            <Button
                              size="sm"
                              variant={u.status === "active" ? "outline" : "default"}
                              onClick={() => toast.success(u.status === "active" ? "User suspended" : "User reinstated")}
                              className="gap-1"
                            >
                              {u.status === "active" ? <><Ban className="h-3 w-3" /> Suspend</> : <><CheckCircle2 className="h-3 w-3" /> Reinstate</>}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            {/* TICKETS */}
            <TabsContent value="tickets">
              <div className="space-y-2">
                {TICKETS.map((t) => (
                  <Card key={t.id}>
                    <CardContent className="flex flex-wrap items-center gap-3 p-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{t.subject}</span>
                          {t.pattern && (
                            <Badge variant="outline" className={cn("capitalize", PATTERN_COLORS[t.pattern])}>{t.pattern}</Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">{t.user}</div>
                      </div>
                      <Badge variant={t.priority === "high" ? "destructive" : t.priority === "medium" ? "secondary" : "outline"} className="capitalize">
                        {t.priority}
                      </Badge>
                      <Badge variant={t.status === "resolved" ? "secondary" : "outline"} className="capitalize">
                        {t.status.replace("-", " ")}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.success("Ticket resolved")}
                      >
                        Resolve
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* AI MONITOR */}
            <TabsContent value="ai">
              <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Total scans (24h)", value: "3,842" },
                  { label: "Correct detections", value: "3,811", color: "text-emerald-600" },
                  { label: "False positives", value: "21", color: "text-amber-600" },
                  { label: "False negatives", value: "10", color: "text-rose-600" },
                ].map((s) => (
                  <Card key={s.label}><CardContent className="p-4"><div className={cn("text-2xl font-bold", s.color)}>{s.value}</div><div className="text-xs text-muted-foreground">{s.label}</div></CardContent></Card>
                ))}
              </div>
              <Card>
                <div className="border-b border-border p-4">
                  <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-violet-600" /><h3 className="font-semibold">Recent AI detections</h3></div>
                </div>
                <div className="divide-y divide-border">
                  {AI_FLAGS.map((f) => (
                    <div key={f.id} className="flex items-center gap-3 p-4">
                      <Badge variant="outline" className={cn("capitalize", PATTERN_COLORS[f.pattern])}>{f.pattern}</Badge>
                      <code className="flex-1 font-mono text-sm text-muted-foreground">{f.sample}</code>
                      {f.result === "correct" && <Badge variant="outline" className="border-emerald-500/40 text-emerald-600"><CheckCircle2 className="mr-1 h-3 w-3" /> Correct</Badge>}
                      {f.result === "false-positive" && <Badge variant="outline" className="border-amber-500/40 text-amber-600"><AlertTriangle className="mr-1 h-3 w-3" /> False positive</Badge>}
                      {f.result === "false-negative" && <Badge variant="outline" className="border-rose-500/40 text-rose-600"><AlertTriangle className="mr-1 h-3 w-3" /> False negative</Badge>}
                      <span className="text-xs text-muted-foreground">{f.timestamp}</span>
                      <Button size="sm" variant="ghost" onClick={() => toast.success("Flagged for retraining")}>Flag</Button>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* BROADCAST */}
            <TabsContent value="broadcast">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">Broadcast announcement</h3>
                  </div>
                  <div className="space-y-3">
                    <Input placeholder="Subject (e.g. 'New AI blur patterns added')" />
                    <textarea
                      className="flex min-h-[120px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Message body — will appear in all users' notifications…"
                    />
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" defaultChecked className="rounded" /> Email all users
                      </label>
                      <Button onClick={() => toast.success("Broadcast sent to 48,250 users")} className="gap-2">
                        <Megaphone className="h-4 w-4" /> Send broadcast
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
