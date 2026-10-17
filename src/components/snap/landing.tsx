"use client";

import { useSnap } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Camera,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Star,
  MousePointer2,
  Type,
  Square,
  Pen,
  Eraser,
  Highlighter,
  Hash,
  Download,
  Link2,
  Zap,
  Lock,
  Cloud,
  FileText,
  Users,
  Check,
  X,
  ArrowRight,
  ScanEye,
  Wand2,
} from "lucide-react";
import { DEMO_SCREENSHOTS } from "@/lib/demo-screenshots";

const FEATURES = [
  {
    icon: Camera,
    title: "Capture Anything",
    desc: "Full-page, visible area, or drag-to-select region. Smart scrolling stitch for infinite pages.",
    color: "from-emerald-500/20 to-teal-500/20",
  },
  {
    icon: Pen,
    title: "Rich Annotations",
    desc: "Arrows, rectangles, text, freehand, numbered markers, highlights, spotlight — everything you need.",
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: Sparkles,
    title: "AI Auto-Blur",
    desc: "Detects emails, phone numbers, credit cards, and CNIC IDs — blurs them in one click. No more leaking PII.",
    color: "from-violet-500/20 to-fuchsia-500/20",
    badge: "AI",
  },
  {
    icon: Link2,
    title: "One-Click Share",
    desc: "Generate a shareable link with expiry & password protection. Track views. No upload dance.",
    color: "from-rose-500/20 to-pink-500/20",
  },
  {
    icon: Cloud,
    title: "Cloud Sync",
    desc: "Your gallery follows you across devices. Folders, tags, search. Pro & Team tiers.",
    color: "from-cyan-500/20 to-sky-500/20",
  },
  {
    icon: FileText,
    title: "PDF Export",
    desc: "Compile multiple screenshots into a single PDF — perfect for bug reports & tutorials.",
    color: "from-lime-500/20 to-green-500/20",
  },
];

const COMPETITORS = [
  {
    name: "Awesome Screenshot",
    weakness: "Watermark on free tier · No AI auto-blur · Usage limits",
  },
  {
    name: "Nimbus Screenshot",
    weakness: "Dated, complex UI · No AI auto-blur · Heavy install",
  },
  {
    name: "Loom (video-focused)",
    weakness: "Screenshots are secondary · Basic annotation only",
  },
  {
    name: "Lightshot",
    weakness: "Too basic · No advanced annotation · No AI features",
  },
];

const TOOL_DEMO = [
  { icon: MousePointer2, label: "Select" },
  { icon: Pen, label: "Freehand" },
  { icon: Square, label: "Rectangle" },
  { icon: Type, label: "Text" },
  { icon: Hash, label: "Numbered" },
  { icon: Highlighter, label: "Highlight" },
  { icon: Eraser, label: "Blur" },
  { icon: ScanEye, label: "AI Blur" },
];

const STATS = [
  { value: "50K+", label: "Active installs" },
  { value: "1.2M", label: "Screenshots/mo" },
  { value: "99.2%", label: "AI blur accuracy" },
  { value: "4.8★", label: "Chrome Store rating" },
];

export function Landing() {
  const { setView, startEditorWith } = useSnap();

  const openDemo = (demo: any) => {
    startEditorWith({
      id: demo.id,
      title: demo.title,
      dataUrl: demo.dataUrl,
      captureType: demo.captureType,
      width: demo.width,
      height: demo.height,
      sizeBytes: 0,
      aiBlurApplied: false,
      starred: false,
      tags: demo.tags,
      folderId: null,
      createdAt: Date.now(),
    });
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0" />
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-20 top-40 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge
                variant="secondary"
                className="mb-5 gap-1.5 rounded-full border-primary/20 bg-primary/10 px-3 py-1 text-primary animate-fade-in-up"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Now with AI Auto-Blur
              </Badge>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl animate-fade-in-up stagger-1">
                Screenshot.
                <br />
                <span className="gradient-text">Annotate. Blur.</span>
                <br />
                Share in one click.
              </h1>
              <p className="mt-5 max-w-lg text-lg text-muted-foreground animate-fade-in-up stagger-2">
                SnapMark captures your screen and lets you annotate with arrows,
                highlights, and text — then{" "}
                <span className="font-semibold text-foreground">
                  AI automatically blurs sensitive info
                </span>{" "}
                (emails, phones, cards, IDs) before you share.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row animate-fade-in-up stagger-3">
                <Button
                  size="lg"
                  className="h-12 gap-2 text-base shadow-lg shadow-primary/30"
                  onClick={() => setView("editor")}
                >
                  <Sparkles className="h-5 w-5" />
                  Launch Editor
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 gap-2 text-base"
                  onClick={() => setView("pricing")}
                >
                  View Pricing
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-6 flex items-center gap-5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-primary" /> Free tier forever
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-primary" /> No credit card
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-primary" /> Privacy-first
                </span>
              </div>
            </div>

            {/* Hero visual: mock editor */}
            <div className="relative">
              <div className="animate-float rounded-2xl border border-border bg-card p-3 shadow-2xl shadow-primary/10">
                <div className="mb-2 flex items-center gap-1.5 px-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-2 text-[11px] text-muted-foreground">
                    snapmark.io/editor
                  </span>
                </div>
                <div className="overflow-hidden rounded-lg border border-border">
                  <div className="relative aspect-[16/10] bg-muted">
                    <img
                      src={DEMO_SCREENSHOTS[1].dataUrl}
                      alt="Screenshot being annotated"
                      className="h-full w-full object-cover"
                    />
                    {/* simulated annotation overlays */}
                    <div className="absolute left-[8%] top-[28%] rounded bg-amber-400/80 px-1.5 py-0.5 text-[10px] font-bold text-black">
                      CARD NUMBER
                    </div>
                    <div className="absolute left-[8%] top-[28%] h-7 w-[42%] rounded bg-black/60 backdrop-blur-md" />
                    <div className="absolute left-[8%] top-[68%] rounded bg-violet-400/80 px-1.5 py-0.5 text-[10px] font-bold text-black">
                      CNIC
                    </div>
                    <div className="absolute left-[8%] top-[68%] h-7 w-[42%] rounded bg-black/60 backdrop-blur-md" />
                    {/* arrow */}
                    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 62.5">
                      <defs>
                        <marker id="ah" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
                          <path d="M0,0 L4,2 L0,4 Z" fill="#10b981" />
                        </marker>
                      </defs>
                      <path d="M75,15 L60,30" stroke="#10b981" strokeWidth="1.2" fill="none" markerEnd="url(#ah)" />
                    </svg>
                  </div>
                </div>
                {/* mini toolbar */}
                <div className="mt-2 flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1.5">
                  {TOOL_DEMO.slice(0, 6).map((t, i) => {
                    const Icon = t.icon;
                    return (
                      <div
                        key={i}
                        className={`flex h-7 w-7 items-center justify-center rounded-md ${
                          i === 5 ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                    );
                  })}
                  <div className="ml-auto flex items-center gap-1">
                    <div className="flex items-center gap-1 rounded-md bg-violet-500/15 px-2 py-1 text-[10px] font-semibold text-violet-600">
                      <Wand2 className="h-3 w-3" /> AI Blur
                    </div>
                  </div>
                </div>
              </div>
              {/* floating badges */}
              <div className="absolute -right-3 -top-3 animate-float rounded-xl border border-border bg-card p-2.5 shadow-lg" style={{ animationDelay: "0.5s" }}>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold">3 PII regions blurred</span>
                </div>
              </div>
              <div className="absolute -bottom-3 -left-3 animate-float rounded-xl border border-border bg-card p-2.5 shadow-lg" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-semibold">0.8s to share</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card/50 p-6 backdrop-blur sm:grid-cols-4">
            {STATS.map((s, i) => (
              <div key={s.label} className={`text-center animate-fade-in-up stagger-${i + 1}`}>
                <div className="text-3xl font-extrabold gradient-text tabular-nums">{s.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Trusted by */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 opacity-60">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Trusted by teams at</span>
            {["Acme Corp", "Globex", "Initech", "Umbrella", "Hooli", "Vandelay"].map((c) => (
              <span key={c} className="text-sm font-bold tracking-tight text-muted-foreground">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">Features</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to ship visual feedback
          </h2>
          <p className="mt-3 text-muted-foreground">
            From capture to share, SnapMark replaces 4 separate tools with one
            lightweight workflow.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Card
                key={f.title}
                className={`card-lift group relative overflow-hidden border-border/60 hover:shadow-xl hover:border-primary/40 animate-fade-in-up stagger-${i + 1}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 transition-opacity group-hover:opacity-100`} />
                <CardContent className="relative p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    {f.badge && (
                      <Badge className="bg-violet-500/15 text-violet-600 hover:bg-violet-500/20">
                        {f.badge}
                      </Badge>
                    )}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* AI AUTO-BLUR SPOTLIGHT */}
      <section className="border-y border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2">
                  <span className="text-sm font-medium">Before / After</span>
                  <Badge className="bg-violet-500/15 text-violet-600 hover:bg-violet-500/20">
                    <ScanEye className="mr-1 h-3 w-3" /> AI Blur ON
                  </Badge>
                </div>
                <div className="grid grid-cols-2">
                  <div className="relative border-r border-border">
                    <img src={DEMO_SCREENSHOTS[0].dataUrl} alt="Before" className="aspect-[16/10] w-full object-cover" />
                    <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      RAW
                    </span>
                    {/* highlight detected regions */}
                    <div className="pointer-events-none absolute inset-0">
                      <div className="absolute left-[41%] top-[21%] h-[5%] w-[24%] rounded border-2 border-amber-400 bg-amber-400/10" />
                      <div className="absolute left-[63%] top-[21%] h-[5%] w-[18%] rounded border-2 border-emerald-400 bg-emerald-400/10" />
                      <div className="absolute left-[41%] top-[28%] h-[5%] w-[24%] rounded border-2 border-amber-400 bg-amber-400/10" />
                    </div>
                  </div>
                  <div className="relative">
                    <img src={DEMO_SCREENSHOTS[0].dataUrl} alt="After" className="aspect-[16/10] w-full object-cover" />
                    <span className="absolute left-2 top-2 rounded bg-primary/80 px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                      BLURRED
                    </span>
                    <div className="pointer-events-none absolute inset-0">
                      <div className="absolute left-[41%] top-[21%] h-[5%] w-[24%] rounded bg-black/70 backdrop-blur-md" />
                      <div className="absolute left-[63%] top-[21%] h-[5%] w-[18%] rounded bg-black/70 backdrop-blur-md" />
                      <div className="absolute left-[41%] top-[28%] h-[5%] w-[24%] rounded bg-black/70 backdrop-blur-md" />
                    </div>
                  </div>
                </div>
                <div className="border-t border-border p-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-medium text-muted-foreground">Detected:</span>
                    <Badge variant="outline" className="border-amber-400/40 text-amber-600">3 emails</Badge>
                    <Badge variant="outline" className="border-emerald-400/40 text-emerald-600">3 phones</Badge>
                    <Badge variant="outline" className="border-violet-400/40 text-violet-600">1 CNIC</Badge>
                    <Badge variant="outline" className="border-rose-400/40 text-rose-600">1 card</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Badge className="mb-3 bg-violet-500/15 text-violet-600 hover:bg-violet-500/20">
                <Sparkles className="mr-1 h-3 w-3" /> AI Spotlight
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Stop leaking PII in screenshots
              </h2>
              <p className="mt-4 text-muted-foreground">
                Manual blurring is slow and error-prone. SnapMark scans every
                screenshot for sensitive patterns and blurs them automatically —
                with regex precision plus Luhn validation for cards.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  { icon: "📧", label: "Email addresses", pat: "RFC-compliant regex" },
                  { icon: "📱", label: "Phone numbers", pat: "US, intl, PK formats" },
                  { icon: "💳", label: "Credit cards", pat: "Luhn-validated 16-digit" },
                  { icon: "🆔", label: "CNIC / ID numbers", pat: "XXXXX-XXXXXXX-X" },
                ].map((p) => (
                  <li key={p.label} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                    <span className="text-xl">{p.icon}</span>
                    <div>
                      <div className="text-sm font-semibold">{p.label}</div>
                      <div className="text-xs text-muted-foreground">{p.pat}</div>
                    </div>
                    <Check className="ml-auto h-4 w-4 text-primary" />
                  </li>
                ))}
              </ul>
              <Button className="mt-6 gap-2" onClick={() => openDemo(DEMO_SCREENSHOTS[1])}>
                <Wand2 className="h-4 w-4" /> Try AI Blur on demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* TOOL DEMO */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">Annotation Toolkit</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            8 precision tools. Zero learning curve.
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TOOL_DEMO.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.label}
                onClick={() => openDemo(DEMO_SCREENSHOTS[2])}
                className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{t.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* DEMO GALLERY */}
      <section className="border-y border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Badge variant="secondary" className="mb-3">Live Demos</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Click any screenshot to start annotating
              </h2>
              <p className="mt-2 text-muted-foreground">
                Real-world scenarios with sensitive data to blur.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DEMO_SCREENSHOTS.map((d) => (
              <button
                key={d.id}
                onClick={() => openDemo(d)}
                className="group overflow-hidden rounded-xl border border-border bg-card text-left transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={d.dataUrl}
                    alt={d.title}
                    className="h-full w-full object-cover object-top transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
                      <Sparkles className="h-4 w-4" /> Open in Editor
                    </span>
                  </div>
                  <Badge className="absolute left-2 top-2 bg-black/60 text-white hover:bg-black/60">
                    {d.captureType}
                  </Badge>
                </div>
                <div className="p-3">
                  <div className="text-sm font-semibold line-clamp-1">{d.title}</div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-[10px]">{d.category}</Badge>
                    <span>1280×800</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* COMPETITORS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">Why SnapMark</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            The competition leaves gaps. We fill them.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COMPETITORS.map((c) => (
            <Card key={c.name} className="border-border/60">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{c.name}</h3>
                  <X className="h-4 w-4 text-destructive" />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{c.weakness}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="mt-6 border-primary/40 bg-primary/5">
          <CardContent className="flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">SnapMark differentiator</div>
                <div className="text-sm text-muted-foreground">
                  AI auto-blur + lightweight + one-click share + simple UI
                </div>
              </div>
            </div>
            <Button onClick={() => setView("editor")} className="gap-2">
              Try it now <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* USE CASES */}
      <section className="border-y border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-3">Built for</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Every team that ships visuals
            </h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "🐛", title: "Developers & QA", desc: "Bug reports with pixel-perfect annotations + stack traces blurred." },
              { icon: "🎨", title: "Designers", desc: "Feedback rounds with arrows, numbered steps, spotlight focus." },
              { icon: "📈", title: "Marketers", desc: "Competitor research, tutorials, ad creative reviews." },
              { icon: "🎓", title: "Teachers & Trainers", desc: "Step-by-step guides with numbered markers and PDF export." },
              { icon: "🎧", title: "Customer Support", desc: "Issue docs with PII auto-blurred before sharing externally." },
              { icon: "🏢", title: "Agencies & Teams", desc: "Shared workspace library + team-wide branding on shares." },
            ].map((u, i) => (
              <div
                key={u.title}
                className={`card-lift group rounded-xl border border-border bg-card p-5 hover:shadow-lg hover:border-primary/40 animate-fade-in-up stagger-${i + 1}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-2xl transition-transform group-hover:scale-110">{u.icon}</div>
                <h3 className="mt-3 font-semibold">{u.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">How it works</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            From screen to share in 4 steps
          </h2>
          <p className="mt-3 text-muted-foreground">
            No more juggling 4 tools. SnapMark replaces capture + edit + blur + upload in one flow.
          </p>
        </div>
        <div className="relative mt-12">
          {/* Connector line */}
          <div className="absolute left-1/2 top-8 hidden h-0.5 w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent lg:block" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "01", icon: Camera, t: "Capture", d: "Pick full-page, visible area, or drag a region. One hotkey." },
              { n: "02", icon: Sparkles, t: "Annotate", d: "Arrows, text, numbered markers, highlights — 8 precision tools." },
              { n: "03", icon: ShieldAlert, t: "AI Blur", d: "One click scans for emails, phones, cards, IDs. Review & apply." },
              { n: "04", icon: Link2, t: "Share", d: "Copy a link or export PNG/JPG/PDF. Track views. Done." },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.n} className={`relative animate-fade-in-up stagger-${i + 1}`}>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-card border border-border shadow-sm">
                      <Icon className="h-6 w-6 text-primary" />
                      <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{s.n}</span>
                    </div>
                    <h3 className="mt-4 font-semibold">{s.t}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-y border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-3">Loved by makers</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              50,000+ professionals trust SnapMark
            </h2>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">4.8 / 5 from 2,140+ reviews</span>
            </div>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                quote: "SnapMark replaced 3 tools for our QA team. The AI auto-blur caught a customer email I would have leaked in a bug report. Lifesaver.",
                name: "Sarah Johnson",
                role: "QA Lead, Globex",
                color: "bg-emerald-500/15 text-emerald-600",
                initials: "SJ",
              },
              {
                quote: "The numbered step markers are perfect for onboarding tutorials. I compile 8 screenshots into a PDF in one click. Saves me hours every week.",
                name: "Daniel Park",
                role: "Product Designer, Initech",
                color: "bg-violet-500/15 text-violet-600",
                initials: "DP",
              },
              {
                quote: "As a support agent, I share screenshots with customers daily. Knowing PII is auto-blurred gives me peace of mind. Best $7 I spend.",
                name: "Fatima Ali",
                role: "Customer Success, Acme",
                color: "bg-amber-500/15 text-amber-600",
                initials: "FA",
              },
            ].map((t, i) => (
              <Card key={t.name} className={`card-lift border-border/60 animate-fade-in-up stagger-${i + 1}`}>
                <CardContent className="p-6">
                  <div className="mb-3 flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${t.color}`}>{t.initials}</div>
                    <div>
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CHANGELOG / WHATS NEW */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3 gap-1">
            <Zap className="h-3 w-3" /> What&apos;s new
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Shipping every week</h2>
          <p className="mt-3 text-muted-foreground">See what we&apos;ve been building lately.</p>
        </div>
        <div className="relative mt-12 space-y-6 before:absolute before:left-4 before:top-2 before:h-full before:w-0.5 before:bg-border sm:before:left-1/2 sm:before:-translate-x-1/2">
          {[
            { date: "Sep 23, 2024", tag: "AI", tagColor: "bg-violet-500/15 text-violet-600", title: "AI Auto-Blur v2", desc: "Now detects CNIC/ID numbers + Luhn-validated credit cards. 99.2% accuracy, up from 94%.", side: "left" },
            { date: "Sep 15, 2024", tag: "Feature", tagColor: "bg-emerald-500/15 text-emerald-600", title: "PDF Compile", desc: "Combine multiple screenshots into a single PDF with numbered pages, metadata & timestamps.", side: "right" },
            { date: "Sep 8, 2024", tag: "Team", tagColor: "bg-amber-500/15 text-amber-600", title: "Team Workspace", desc: "Shared library, Editor/Viewer roles, team-wide branding, and centralized billing.", side: "left" },
            { date: "Aug 30, 2024", tag: "Improvement", tagColor: "bg-cyan-500/15 text-cyan-600", title: "Editor Performance", desc: "60fps canvas rendering, instant undo/redo, smarter region selection.", side: "right" },
          ].map((c, i) => (
            <div
              key={i}
              className={`relative flex ${c.side === "right" ? "sm:justify-end" : "sm:justify-start"} animate-fade-in-up stagger-${i + 1}`}
            >
              <div className="absolute left-4 top-3 z-10 flex h-3 w-3 items-center justify-center rounded-full bg-primary ring-4 ring-background sm:left-1/2 sm:-translate-x-1/2">
                <span className="absolute h-3 w-3 animate-ping rounded-full bg-primary opacity-50" />
              </div>
              <Card className={`ml-12 w-full border-border/60 sm:ml-0 sm:w-[calc(50%-2rem)] ${c.side === "right" ? "sm:ml-auto" : "sm:mr-auto"}`}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className={c.tagColor}>{c.tag}</Badge>
                    <span className="text-xs text-muted-foreground">{c.date}</span>
                  </div>
                  <h3 className="mt-3 font-semibold">{c.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button variant="outline" onClick={() => useSnap.getState().setView("support")} className="gap-2">
            <ArrowRight className="h-4 w-4" /> View full changelog
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary to-emerald-700 text-primary-foreground">
          <CardContent className="relative p-10 sm:p-14">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-amber-300/20 blur-2xl" />
            <div className="relative mx-auto max-w-2xl text-center">
              <Lock className="mx-auto h-10 w-10" />
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                Your screenshots, your privacy.
              </h2>
              <p className="mt-3 text-primary-foreground/80">
                Local-only mode available. Sensitive data never leaves your
                device unless you choose to share. Free tier forever.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2"
                  onClick={() => setView("editor")}
                >
                  <Sparkles className="h-5 w-5" /> Launch the Editor
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  onClick={() => setView("pricing")}
                >
                  <Users className="h-5 w-5" /> See Team Plans
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
