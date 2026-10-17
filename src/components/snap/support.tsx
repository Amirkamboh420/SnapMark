"use client";

import { useState } from "react";
import { useSnap } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LifeBuoy,
  MessageSquare,
  BookOpen,
  Mail,
  Search,
  Send,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronRight,
  Sparkles,
  ShieldAlert,
  Camera,
  Keyboard,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    cat: "Capture",
    q: "How do I capture a full-page screenshot?",
    a: "Click the SnapMark extension icon, choose 'Full page', and SnapMark will scroll & stitch the entire page automatically. For SPAs with lazy-loaded content, wait 2s before capturing.",
  },
  {
    cat: "Capture",
    q: "Can I capture just a selected region?",
    a: "Yes — choose 'Selected area' and drag to draw your region. You can fine-tune pixel-perfect with arrow keys before confirming.",
  },
  {
    cat: "AI Blur",
    q: "How does AI auto-blur detect sensitive data?",
    a: "SnapMark scans the screenshot text with regex patterns for emails, phone numbers (US, intl, PK formats), credit card numbers (Luhn-validated), and CNIC/ID formats. A vision AI model is in development for higher accuracy.",
  },
  {
    cat: "AI Blur",
    q: "What if AI misses something?",
    a: "Always use the 'Review before share' step. You can also use the manual Blur tool (keyboard: B) to drag-blur any area AI missed. We log false negatives to improve detection.",
  },
  {
    cat: "AI Blur",
    q: "Does AI blur work offline?",
    a: "Yes — the regex-based detection runs entirely in your browser. No data leaves your device unless you choose to share.",
  },
  {
    cat: "Sharing",
    q: "What's the difference between Free and Pro share links?",
    a: "Free links have a SnapMark watermark and expire in 7 days. Pro links: no watermark, custom expiry, optional password protection, and view tracking.",
  },
  {
    cat: "Sharing",
    q: "Can I revoke a shared link?",
    a: "Yes — go to Shared Links in the dashboard and click Revoke. The link instantly stops working.",
  },
  {
    cat: "Account",
    q: "Can I use SnapMark without an account?",
    a: "Yes, in local-only mode. You can capture, annotate and download without signing up. Cloud sync, share links and team features require an account.",
  },
  {
    cat: "Account",
    q: "How do I delete my data?",
    a: "Go to Settings → Data & privacy → Delete account. All your screenshots, links, and metadata are permanently removed within 30 days.",
  },
  {
    cat: "Billing",
    q: "Do you offer refunds?",
    a: "Yes — 14-day money-back guarantee on all paid plans, no questions asked. Contact support with your invoice ID.",
  },
  {
    cat: "Team",
    q: "What's the difference between Editor and Viewer roles?",
    a: "Editors can capture, annotate, and upload to the shared team library. Viewers have read-only access — perfect for stakeholders who just need to review.",
  },
];

const USER_TICKETS = [
  { id: "T-1042", subject: "AI blur missed my phone number", status: "in-progress", priority: "high", updated: "2h ago" },
  { id: "T-1039", subject: "How to export to PDF?", status: "resolved", priority: "low", updated: "1d ago" },
];

const STATUS_COLORS: Record<string, string> = {
  open: "border-amber-500/40 text-amber-600",
  "in-progress": "border-sky-500/40 text-sky-600",
  resolved: "border-emerald-500/40 text-emerald-600",
};

export function Support() {
  const { user } = useSnap();
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [form, setForm] = useState({ subject: "", category: "general", priority: "medium", message: "" });

  const categories = ["All", ...Array.from(new Set(FAQS.map((f) => f.cat)))];
  const filteredFaqs = FAQS.filter(
    (f) =>
      (activeCat === "All" || f.cat === activeCat) &&
      (query === "" || f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase()))
  );

  const submitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject || !form.message) {
      toast.error("Please fill in subject and message");
      return;
    }
    toast.success("Support ticket created!", {
      description: `Ticket ID: T-${Math.floor(Math.random() * 9000 + 1000)} — we'll reply within 24h.`,
    });
    setForm({ subject: "", category: "general", priority: "medium", message: "" });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Support & Help Center</h1>
        <p className="text-sm text-muted-foreground">Find answers, browse docs, or reach out to our team.</p>
      </div>

      {/* Quick help cards */}
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <Card className="border-border/60 transition-shadow hover:shadow-md">
          <CardContent className="p-5 text-center">
            <BookOpen className="mx-auto h-6 w-6 text-primary" />
            <div className="mt-2 font-semibold">Documentation</div>
            <div className="text-xs text-muted-foreground">Guides, API docs, tutorials</div>
            <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => toast.info("Docs opening…")}>Browse docs</Button>
          </CardContent>
        </Card>
        <Card className="border-border/60 transition-shadow hover:shadow-md">
          <CardContent className="p-5 text-center">
            <MessageSquare className="mx-auto h-6 w-6 text-primary" />
            <div className="mt-2 font-semibold">Community</div>
            <div className="text-xs text-muted-foreground">Discord, Reddit, GitHub</div>
            <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => toast.info("Joining community…")}>Join Discord</Button>
          </CardContent>
        </Card>
        <Card className="border-border/60 transition-shadow hover:shadow-md">
          <CardContent className="p-5 text-center">
            <Mail className="mx-auto h-6 w-6 text-primary" />
            <div className="mt-2 font-semibold">Email us</div>
            <div className="text-xs text-muted-foreground">support@snapmark.io</div>
            <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => toast.info("Composing email…")}>Send email</Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="faq">
        <TabsList className="mb-4">
          <TabsTrigger value="faq" className="gap-1.5"><BookOpen className="h-3.5 w-3.5" /> FAQ</TabsTrigger>
          <TabsTrigger value="tickets" className="gap-1.5"><Clock className="h-3.5 w-3.5" /> My tickets</TabsTrigger>
          <TabsTrigger value="contact" className="gap-1.5"><LifeBuoy className="h-3.5 w-3.5" /> Contact us</TabsTrigger>
        </TabsList>

        {/* FAQ */}
        <TabsContent value="faq">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search FAQs…" className="pl-9" />
            </div>
            <div className="flex flex-wrap gap-1">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCat(c)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    activeCat === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filteredFaqs.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center text-sm text-muted-foreground">
                  No FAQs match your search. Try the Contact tab.
                </CardContent>
              </Card>
            ) : (
              filteredFaqs.map((f) => {
                const id = `${f.cat}-${f.q}`;
                const open = openFaq === id;
                return (
                  <Card key={id} className="overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(open ? null : id)}
                      className="flex w-full items-center justify-between gap-3 p-4 text-left hover:bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        {open ? <ChevronDown className="h-4 w-4 text-primary" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                        <span className="font-medium">{f.q}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px]">{f.cat}</Badge>
                    </button>
                    {open && (
                      <div className="border-t border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
                        {f.a}
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        {/* My tickets */}
        <TabsContent value="tickets">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Your support tickets</h3>
            <Badge variant="secondary">{USER_TICKETS.length} tickets</Badge>
          </div>
          <div className="space-y-2">
            {USER_TICKETS.map((t) => (
              <Card key={t.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-muted-foreground">{t.id}</code>
                      <span className="font-medium">{t.subject}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Last updated {t.updated}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">{t.priority}</Badge>
                    <Badge variant="outline" className={cn("capitalize", STATUS_COLORS[t.status])}>
                      {t.status.replace("-", " ")}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Contact form */}
        <TabsContent value="contact">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <Send className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Open a new ticket</h3>
              </div>
              <form onSubmit={submitTicket} className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label className="mb-1.5 block text-sm">Subject</Label>
                    <Input
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="Briefly describe your issue"
                    />
                  </div>
                  <div>
                    <Label className="mb-1.5 block text-sm">Category</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="ai-blur">AI Blur issue</SelectItem>
                        <SelectItem value="capture">Capture problem</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="bug">Bug report</SelectItem>
                        <SelectItem value="feature">Feature request</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="mb-1.5 block text-sm">Priority</Label>
                  <div className="flex gap-2">
                    {["low", "medium", "high", "urgent"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setForm({ ...form, priority: p })}
                        className={cn(
                          "flex-1 rounded-md border px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                          form.priority === p
                            ? p === "urgent" ? "border-destructive bg-destructive/10 text-destructive"
                              : p === "high" ? "border-amber-500 bg-amber-500/10 text-amber-600"
                              : p === "medium" ? "border-sky-500 bg-sky-500/10 text-sky-600"
                              : "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                            : "border-border text-muted-foreground hover:bg-accent"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="mb-1.5 block text-sm">Message</Label>
                  <Textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe your issue in detail. Include screenshots if possible."
                    className="min-h-[140px]"
                  />
                </div>
                {form.category === "ai-blur" && (
                  <div className="flex items-start gap-2 rounded-lg border border-violet-400/30 bg-violet-500/5 p-3 text-xs">
                    <ShieldAlert className="mt-0.5 h-4 w-4 text-violet-600" />
                    <div>
                      <div className="font-medium">For AI blur issues</div>
                      <div className="text-muted-foreground">Please include the original screenshot (or describe the missed text). We use this to improve detection.</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Response time: &lt;24h on business days
                  </p>
                  <Button type="submit" className="gap-1.5">
                    <Send className="h-4 w-4" /> Submit ticket
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick links */}
      <Card className="mt-6 bg-muted/30">
        <CardContent className="grid gap-3 p-5 sm:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Keyboard className="h-4 w-4 text-primary" /> Keyboard shortcuts
            </div>
            <div className="mt-2 space-y-1 text-xs text-muted-foreground">
              <div><kbd className="rounded bg-muted px-1">Ctrl+Shift+S</kbd> — Trigger capture</div>
              <div><kbd className="rounded bg-muted px-1">V/P/R/A/T/N/H/B</kbd> — Switch tools</div>
              <div><kbd className="rounded bg-muted px-1">Ctrl+Z / Y</kbd> — Undo / Redo</div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-primary" /> Quick actions
            </div>
            <div className="mt-2 space-y-1 text-xs text-muted-foreground">
              <div><Camera className="mr-1 inline h-3 w-3" /> Press the extension icon to start</div>
              <div><CheckCircle2 className="mr-1 inline h-3 w-3" /> Review AI detections before sharing</div>
              <div><ShieldAlert className="mr-1 inline h-3 w-3" /> Use manual blur as backup</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
