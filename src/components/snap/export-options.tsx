"use client";

import { useState, useRef } from "react";
import { useSnap } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Image as ImageIcon,
  Download,
  Check,
  X,
  Layers,
  FileImage,
  Sparkles,
  ShieldAlert,
  Plus,
  Minus,
  Eye,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DEMO_SCREENSHOTS } from "@/lib/demo-screenshots";

export function ExportOptions() {
  const { user, setView, screenshots } = useSnap();
  const [format, setFormat] = useState<"pdf" | "png" | "jpg">("pdf");
  const [quality, setQuality] = useState(92);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("landscape");
  const [pageSize, setPageSize] = useState<"a4" | "letter" | "fit">("fit");
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [applyAIBlur, setApplyAIBlur] = useState(true);
  const [watermark, setWatermark] = useState(user.role === "FREE");
  const [title, setTitle] = useState("Bug Report Compilation");
  const [compiling, setCompiling] = useState(false);
  const [selected, setSelected] = useState<string[]>(
    DEMO_SCREENSHOTS.slice(0, 3).map((d) => d.id)
  );

  const toggleSelect = (id: string) => {
    setSelected((arr) => arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);
  };

  const handleExport = () => {
    if (selected.length === 0) {
      toast.error("Select at least one screenshot to export");
      return;
    }
    if (format === "pdf" && user.role === "FREE") {
      toast.error("PDF export is a Pro feature", { description: "Upgrade to compile multiple screenshots into a PDF." });
      setView("pricing");
      return;
    }
    setCompiling(true);
    setTimeout(() => {
      setCompiling(false);
      toast.success(`${format.toUpperCase()} exported!`, {
        description: `${selected.length} screenshots compiled into ${title}.${format}`,
      });
    }, 1800);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Export & Compile</h1>
        <p className="text-sm text-muted-foreground">Combine multiple screenshots into a single PDF, or export individually.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left: selection + preview */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Select screenshots <Badge variant="secondary">{selected.length} selected</Badge>
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setSelected([])} disabled={selected.length === 0}>
              Clear all
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {DEMO_SCREENSHOTS.map((d, i) => {
              const isSelected = selected.includes(d.id);
              const order = selected.indexOf(d.id) + 1;
              return (
                <button
                  key={d.id}
                  onClick={() => toggleSelect(d.id)}
                  className={cn(
                    "group relative overflow-hidden rounded-xl border-2 bg-card text-left transition-all hover:shadow-md",
                    isSelected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/40"
                  )}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <img src={d.dataUrl} alt={d.title} className="h-full w-full object-cover object-top" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute left-2 top-2">
                      {isSelected ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white/70 bg-black/30 backdrop-blur" />
                      )}
                    </div>
                    {isSelected && (
                      <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow">
                        {order}
                      </div>
                    )}
                    {i === 1 && (
                      <Badge className="absolute bottom-2 left-2 bg-violet-600/80 text-white hover:bg-violet-600/80">
                        <ShieldAlert className="mr-1 h-3 w-3" /> AI blur
                      </Badge>
                    )}
                  </div>
                  <div className="p-2">
                    <div className="line-clamp-1 text-xs font-semibold">{d.title}</div>
                    <div className="text-[10px] text-muted-foreground">{d.width}×{d.height}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Order preview */}
          {selected.length > 0 && (
            <Card className="mt-4">
              <div className="border-b border-border p-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Layers className="h-4 w-4 text-primary" /> Compile order ({selected.length})
                </div>
              </div>
              <CardContent className="p-3">
                <div className="space-y-1.5">
                  {selected.map((id, i) => {
                    const d = DEMO_SCREENSHOTS.find((x) => x.id === id);
                    if (!d) return null;
                    return (
                      <div key={id} className="flex items-center gap-2 rounded-md border border-border bg-card p-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span>
                        <img src={d.dataUrl} alt="" className="h-8 w-12 rounded object-cover" />
                        <span className="flex-1 truncate text-sm">{d.title}</span>
                        <div className="flex gap-0.5">
                          <Button variant="ghost" size="icon" className="h-6 w-6" disabled={i === 0} onClick={() => {
                            const copy = [...selected];
                            [copy[i - 1], copy[i]] = [copy[i], copy[i - 1]];
                            setSelected(copy);
                          }}><Minus className="h-3 w-3 rotate-90" /></Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6" disabled={i === selected.length - 1} onClick={() => {
                            const copy = [...selected];
                            [copy[i + 1], copy[i]] = [copy[i], copy[i + 1]];
                            setSelected(copy);
                          }}><Plus className="h-3 w-3 rotate-90" /></Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => toggleSelect(id)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: export options */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-5">
              <div className="mb-3 text-sm font-semibold">Document title</div>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Bug Report Compilation" />

              <div className="mb-3 mt-5 text-sm font-semibold">Format</div>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { v: "pdf", icon: FileText, label: "PDF", pro: true },
                  { v: "png", icon: FileImage, label: "PNG" },
                  { v: "jpg", icon: ImageIcon, label: "JPG" },
                ] as const).map((f) => {
                  const Icon = f.icon;
                  const active = format === f.v;
                  return (
                    <button
                      key={f.v}
                      onClick={() => setFormat(f.v)}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-lg border-2 p-3 transition-all",
                        active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                      )}
                    >
                      <Icon className={cn("h-5 w-5", active ? "text-primary" : "text-muted-foreground")} />
                      <span className="text-xs font-medium">{f.label}</span>
                      {f.pro && user.role === "FREE" && <Badge variant="outline" className="text-[9px]">PRO</Badge>}
                    </button>
                  );
                })}
              </div>

              {format === "pdf" && (
                <>
                  <div className="mb-3 mt-5 text-sm font-semibold">Page size</div>
                  <div className="grid grid-cols-3 gap-2">
                    {(["a4", "letter", "fit"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setPageSize(s)}
                        className={cn(
                          "rounded-md border px-2 py-1.5 text-xs font-medium uppercase transition-colors",
                          pageSize === s ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <div className="mb-3 mt-5 text-sm font-semibold">Orientation</div>
                  <div className="grid grid-cols-2 gap-2">
                    {(["portrait", "landscape"] as const).map((o) => (
                      <button
                        key={o}
                        onClick={() => setOrientation(o)}
                        className={cn(
                          "rounded-md border px-2 py-1.5 text-xs font-medium capitalize transition-colors",
                          orientation === o ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent"
                        )}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {format !== "pdf" && (
                <>
                  <div className="mb-2 mt-5 flex items-center justify-between">
                    <span className="text-sm font-semibold">Quality: <span className="font-mono text-primary">{quality}%</span></span>
                  </div>
                  <Slider value={[quality]} onValueChange={(v) => setQuality(v[0])} min={50} max={100} step={1} />
                </>
              )}
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardContent className="p-5 space-y-3">
              <div className="mb-1 text-sm font-semibold">Options</div>
              <label className="flex items-center justify-between rounded-md border border-border p-2.5">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm">Include metadata (title, size)</span>
                </div>
                <Switch checked={includeMetadata} onCheckedChange={setIncludeMetadata} />
              </label>
              <label className="flex items-center justify-between rounded-md border border-border p-2.5">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" />
                  <span className="text-sm">Timestamps on each page</span>
                </div>
                <Switch checked={includeTimestamps} onCheckedChange={setIncludeTimestamps} />
              </label>
              <label className="flex items-center justify-between rounded-md border border-violet-400/30 bg-violet-500/5 p-2.5">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-violet-600" />
                  <div>
                    <div className="text-sm">Apply AI auto-blur first</div>
                    <div className="text-[10px] text-muted-foreground">Scan & blur PII before export</div>
                  </div>
                </div>
                <Switch checked={applyAIBlur} onCheckedChange={setApplyAIBlur} disabled={user.role === "FREE"} />
              </label>
              <label className="flex items-center justify-between rounded-md border border-border p-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-sm">SnapMark watermark</div>
                    {user.role !== "FREE" && <div className="text-[10px] text-muted-foreground">Pro: turn off to remove branding</div>}
                  </div>
                </div>
                <Switch checked={watermark} onCheckedChange={setWatermark} disabled={user.role === "FREE"} />
              </label>
            </CardContent>
          </Card>

          {/* Export button */}
          <Card className="border-primary/40 bg-primary/5">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Output:</span>
                <code className="font-mono text-xs">{title.replace(/\s+/g, "-").toLowerCase()}.{format}</code>
              </div>
              <Button className="w-full gap-2" size="lg" onClick={handleExport} disabled={compiling || selected.length === 0}>
                {compiling ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Compiling…</>
                ) : (
                  <><Download className="h-4 w-4" /> Export {selected.length} {selected.length === 1 ? "screenshot" : "screenshots"}</>
                )}
              </Button>
              {format === "pdf" && user.role === "FREE" && (
                <p className="mt-2 text-center text-[11px] text-amber-600">
                  PDF compile is a Pro feature — <button onClick={() => setView("pricing")} className="underline">upgrade to unlock</button>
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
