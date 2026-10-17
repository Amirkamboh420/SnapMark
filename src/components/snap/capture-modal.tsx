"use client";

import { useSnap, type CaptureMode } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Maximize, Crop, Sparkles, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";

const MODES: {
  v: CaptureMode;
  title: string;
  desc: string;
  icon: any;
  shortcut: string;
  badge?: string;
}[] = [
  {
    v: "visible",
    title: "Visible Area",
    desc: "Capture what's currently in your viewport. Fastest option.",
    icon: Camera,
    shortcut: "V",
    badge: "Recommended",
  },
  {
    v: "full-page",
    title: "Full Page",
    desc: "Scroll-stitch the entire page, even below the fold.",
    icon: Maximize,
    shortcut: "F",
  },
  {
    v: "selected",
    title: "Selected Region",
    desc: "Drag to select a precise area. Pixel-perfect.",
    icon: Crop,
    shortcut: "S",
  },
];

export function CaptureModal() {
  const { captureModalOpen, setCaptureModalOpen, triggerCapture, settings } = useSnap();

  return (
    <Dialog open={captureModalOpen} onOpenChange={setCaptureModalOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="border-b border-border p-5 text-left">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            <DialogTitle>Capture mode</DialogTitle>
          </div>
          <DialogDescription>Choose how SnapMark should capture your screen.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 p-5 sm:grid-cols-3">
          {MODES.map((m) => {
            const Icon = m.icon;
            const isDefault = settings.defaultCaptureMode === m.v;
            return (
              <button
                key={m.v}
                onClick={() => triggerCapture(m.v)}
                className={cn(
                  "group relative flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md",
                  isDefault ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                )}
              >
                {m.badge && (
                  <Badge className="absolute -top-2 right-2 bg-amber-500/90 text-white hover:bg-amber-500/90">
                    {m.badge}
                  </Badge>
                )}
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", isDefault ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:text-primary")}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold">{m.title}</span>
                    {isDefault && <Badge variant="secondary" className="text-[9px]">Default</Badge>}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{m.desc}</div>
                </div>
                <div className="mt-auto flex items-center gap-1 text-[10px] text-muted-foreground">
                  <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono font-semibold">{m.shortcut}</kbd>
                </div>
              </button>
            );
          })}
        </div>

        {/* AI blur reminder */}
        <div className="mx-5 mb-5 flex items-center gap-3 rounded-lg border border-violet-400/30 bg-violet-500/5 p-3">
          <Sparkles className="h-5 w-5 text-violet-600" />
          <div className="flex-1">
            <div className="text-sm font-medium">AI auto-blur is {settings.aiAutoBlur ? "ON" : "OFF"}</div>
            <div className="text-xs text-muted-foreground">
              {settings.aiAutoBlur
                ? "SnapMark will scan & flag sensitive info (emails, phones, cards, IDs) before you share."
                : "Enable in Settings to auto-detect sensitive info before sharing."}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border bg-muted/30 p-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Keyboard className="h-3.5 w-3.5" /> Press{" "}
            <kbd className="rounded bg-background px-1.5 py-0.5 font-mono text-[10px]">{settings.hotkeyCapture}</kbd>{" "}
            anywhere to trigger capture
          </div>
          <Button variant="outline" size="sm" onClick={() => setCaptureModalOpen(false)}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
