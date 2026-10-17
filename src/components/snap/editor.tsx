"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSnap } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  MousePointer2,
  Pen,
  Square,
  ArrowRight,
  Type,
  Hash,
  Highlighter,
  Eraser,
  Sparkles,
  Undo2,
  Redo2,
  Download,
  Copy,
  Link2,
  Save,
  Upload,
  Trash2,
  ScanEye,
  Wand2,
  Check,
  X,
  FileImage,
  ChevronLeft,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { DEMO_SCREENSHOTS } from "@/lib/demo-screenshots";
import { DEMO_SENSITIVE_REGIONS, type SensitiveRegionDef } from "@/lib/sensitive-regions";
import { PATTERN_INFO, type SensitivePattern } from "@/lib/ai-blur";
import { cn } from "@/lib/utils";

type Tool =
  | "select"
  | "pen"
  | "rect"
  | "arrow"
  | "text"
  | "number"
  | "highlight"
  | "blur";

interface Annotation {
  id: string;
  type: Tool;
  color: string;
  strokeWidth: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  text?: string;
  fontSize?: number;
  points?: { x: number; y: number }[];
  n?: number;
}

const COLORS = [
  "#10b981", "#ef4444", "#f59e0b", "#8b5cf6",
  "#0ea5e9", "#ec4899", "#f97316", "#000000",
];

const TOOLS: { key: Tool; icon: any; label: string; shortcut: string }[] = [
  { key: "select", icon: MousePointer2, label: "Select / Move", shortcut: "V" },
  { key: "pen", icon: Pen, label: "Freehand", shortcut: "P" },
  { key: "rect", icon: Square, label: "Rectangle", shortcut: "R" },
  { key: "arrow", icon: ArrowRight, label: "Arrow", shortcut: "A" },
  { key: "text", icon: Type, label: "Text", shortcut: "T" },
  { key: "number", icon: Hash, label: "Numbered Marker", shortcut: "N" },
  { key: "highlight", icon: Highlighter, label: "Highlight", shortcut: "H" },
  { key: "blur", icon: Eraser, label: "Blur Region", shortcut: "B" },
];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function Editor() {
  const { editingScreenshot, startEditorWith, upsertScreenshot, settings, user } = useSnap();

  const [imgSrc, setImgSrc] = useState<string>(
    editingScreenshot?.dataUrl || DEMO_SCREENSHOTS[0].dataUrl
  );
  const [title, setTitle] = useState(editingScreenshot?.title || "Untitled screenshot");
  const [tool, setTool] = useState<Tool>("select");
  const [color, setColor] = useState(settings.defaultColor || "#10b981");
  const [stroke, setStroke] = useState(settings.defaultStrokeWidth || 4);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [history, setHistory] = useState<Annotation[][]>([[]]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [numberCounter, setNumberCounter] = useState(1);
  const [aiScanning, setAiScanning] = useState(false);
  const [aiRegions, setAiRegions] = useState<(SensitiveRegionDef & { id: string; blurred: boolean })[]>([]);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [exportFmt, setExportFmt] = useState<"png" | "jpg">("png");
  const [imgSize, setImgSize] = useState<{ w: number; h: number }>({ w: 1280, h: 800 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const drawingRef = useRef<Annotation | null>(null);
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const renderRef = useRef<() => void>(() => {});

  // Load image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
      renderRef.current();
    };
    img.src = imgSrc;
  }, [imgSrc]);

  // Re-render on annotation/tool change
  useEffect(() => {
    renderRef.current();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annotations, selectedId, color, aiRegions, imgSize]);

  // keep renderRef in sync
  useEffect(() => {
    renderRef.current = render;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const pushHistory = useCallback((next: Annotation[]) => {
    setAnnotations(next);
    setHistory((h) => {
      const sliced = h.slice(0, historyIdx + 1);
      sliced.push(next);
      return sliced;
    });
    setHistoryIdx((i) => i + 1);
  }, [historyIdx]);

  const undo = () => {
    if (historyIdx <= 0) return;
    const ni = historyIdx - 1;
    setHistoryIdx(ni);
    setAnnotations(history[ni] || []);
    setSelectedId(null);
  };
  const redo = () => {
    if (historyIdx >= history.length - 1) return;
    const ni = historyIdx + 1;
    setHistoryIdx(ni);
    setAnnotations(history[ni] || []);
    setSelectedId(null);
  };
  const clearAll = () => {
    pushHistory([]);
    setAiRegions([]);
    setSelectedId(null);
    setNumberCounter(1);
    toast.success("Canvas cleared");
  };

  // Canvas <-> image coordinate mapping
  const getScale = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imgRef.current) return 1;
    return canvas.width / imgRef.current.naturalWidth;
  };

  const toImgCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    let cx: number, cy: number;
    if ("touches" in e) {
      const t = e.touches[0] || e.changedTouches[0];
      cx = t.clientX;
      cy = t.clientY;
    } else {
      cx = e.clientX;
      cy = e.clientY;
    }
    const x = ((cx - rect.left) / rect.width) * canvas.width;
    const y = ((cy - rect.top) / rect.height) * canvas.height;
    return { x, y };
  };

  // Drawing helpers
  const render = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    for (const a of annotations) {
      drawAnnotation(ctx, a);
    }

    // Draw in-progress AI region overlays (detection boxes)
    for (const r of aiRegions) {
      const x = r.x * canvas.width;
      const y = r.y * canvas.height;
      const w = r.w * canvas.width;
      const h = r.h * canvas.height;
      const info = PATTERN_INFO[r.pattern];
      if (r.blurred) {
        // Apply blur by drawing a pixelated block
        applyBlurRegion(ctx, canvas, img, x, y, w, h);
        // subtle border
        ctx.strokeStyle = info.color + "AA";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, w, h);
      } else {
        // Detection box with animated dashed border
        ctx.save();
        ctx.strokeStyle = info.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(x, y, w, h);
        // label
        ctx.setLineDash([]);
        ctx.fillStyle = info.color;
        const labelW = ctx.measureText(info.label).width + 12;
        ctx.fillRect(x, Math.max(0, y - 18), labelW, 18);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 11px sans-serif";
        ctx.fillText(info.label, x + 6, Math.max(12, y - 5));
        ctx.restore();
      }
    }

    // Selection highlight
    if (selectedId) {
      const a = annotations.find((x) => x.id === selectedId);
      if (a) {
        const bb = getBBox(a);
        ctx.save();
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(bb.x - 4, bb.y - 4, bb.w + 8, bb.h + 8);
        // handles
        ctx.setLineDash([]);
        ctx.fillStyle = "#10b981";
        for (const [hx, hy] of [
          [bb.x - 4, bb.y - 4],
          [bb.x + bb.w + 4, bb.y - 4],
          [bb.x - 4, bb.y + bb.h + 4],
          [bb.x + bb.w + 4, bb.y + bb.h + 4],
        ]) {
          ctx.fillRect(hx - 3, hy - 3, 6, 6);
        }
        ctx.restore();
      }
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  renderRef.current = render;

  const applyBlurRegion = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    img: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number
  ) => {
    // Draw the image region scaled down then back up (pixelate blur)
    const scale = Math.max(0.04, Math.min(20 / Math.max(w, 1), 0.15));
    const tw = Math.max(2, w * scale);
    const th = Math.max(2, h * scale);
    const tmp = document.createElement("canvas");
    tmp.width = tw;
    tmp.height = th;
    const tctx = tmp.getContext("2d");
    if (!tctx) return;
    // source coords in original image space
    const sx = (x / canvas.width) * img.naturalWidth;
    const sy = (y / canvas.height) * img.naturalHeight;
    const sw = (w / canvas.width) * img.naturalWidth;
    const sh = (h / canvas.height) * img.naturalHeight;
    tctx.drawImage(img, sx, sy, sw, sh, 0, 0, tw, th);
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tmp, 0, 0, tw, th, x, y, w, h);
    // dark tint
    ctx.fillStyle = "rgba(15, 23, 42, 0.18)";
    ctx.fillRect(x, y, w, h);
    ctx.restore();
  };

  const drawAnnotation = (ctx: CanvasRenderingContext2D, a: Annotation) => {
    ctx.save();
    ctx.strokeStyle = a.color;
    ctx.fillStyle = a.color;
    ctx.lineWidth = a.strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (a.type === "pen" && a.points && a.points.length > 0) {
      ctx.beginPath();
      ctx.moveTo(a.points[0].x, a.points[0].y);
      for (let i = 1; i < a.points.length; i++) {
        ctx.lineTo(a.points[i].x, a.points[i].y);
      }
      ctx.stroke();
    } else if (a.type === "rect") {
      const x = Math.min(a.x1, a.x2);
      const y = Math.min(a.y1, a.y2);
      const w = Math.abs(a.x2 - a.x1);
      const h = Math.abs(a.y2 - a.y1);
      ctx.strokeRect(x, y, w, h);
    } else if (a.type === "arrow") {
      const dx = a.x2 - a.x1;
      const dy = a.y2 - a.y1;
      const len = Math.hypot(dx, dy);
      const head = Math.min(20, len * 0.3);
      const ang = Math.atan2(dy, dx);
      ctx.beginPath();
      ctx.moveTo(a.x1, a.y1);
      ctx.lineTo(a.x2, a.y2);
      ctx.stroke();
      // arrowhead
      ctx.beginPath();
      ctx.moveTo(a.x2, a.y2);
      ctx.lineTo(a.x2 - head * Math.cos(ang - 0.4), a.y2 - head * Math.sin(ang - 0.4));
      ctx.lineTo(a.x2 - head * Math.cos(ang + 0.4), a.y2 - head * Math.sin(ang + 0.4));
      ctx.closePath();
      ctx.fill();
    } else if (a.type === "text" && a.text) {
      const fs = a.fontSize || 22;
      ctx.font = `bold ${fs}px sans-serif`;
      ctx.textBaseline = "top";
      // background pill
      const tw = ctx.measureText(a.text).width;
      ctx.fillStyle = a.color;
      const pad = 6;
      roundRect(ctx, a.x1 - pad, a.y1 - pad, tw + pad * 2, fs + pad * 2, 6);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.fillText(a.text, a.x1, a.y1);
    } else if (a.type === "number") {
      const r = 16;
      ctx.beginPath();
      ctx.arc(a.x1, a.y1, r, 0, Math.PI * 2);
      ctx.fillStyle = a.color;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(a.n ?? 1), a.x1, a.y1 + 1);
      ctx.textAlign = "start";
    } else if (a.type === "highlight") {
      const x = Math.min(a.x1, a.x2);
      const y = Math.min(a.y1, a.y2);
      const w = Math.abs(a.x2 - a.x1);
      const h = Math.abs(a.y2 - a.y1);
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = a.color;
      ctx.fillRect(x, y, w, h);
      ctx.globalAlpha = 1;
    } else if (a.type === "blur") {
      const x = Math.min(a.x1, a.x2);
      const y = Math.min(a.y1, a.y2);
      const w = Math.abs(a.x2 - a.x1);
      const h = Math.abs(a.y2 - a.y1);
      if (imgRef.current) {
        applyBlurRegion(ctx, canvasRef.current!, imgRef.current, x, y, w, h);
      }
    }
    ctx.restore();
  };

  const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  const getBBox = (a: Annotation) => {
    if (a.type === "pen" && a.points && a.points.length) {
      const xs = a.points.map((p) => p.x);
      const ys = a.points.map((p) => p.y);
      return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
    }
    if (a.type === "number") {
      return { x: a.x1 - 16, y: a.y1 - 16, w: 32, h: 32 };
    }
    if (a.type === "text") {
      const fs = a.fontSize || 22;
      const tw = (a.text?.length || 0) * (fs * 0.55);
      return { x: a.x1 - 6, y: a.y1 - 6, w: tw + 12, h: fs + 12 };
    }
    return {
      x: Math.min(a.x1, a.x2),
      y: Math.min(a.y1, a.y2),
      w: Math.abs(a.x2 - a.x1),
      h: Math.abs(a.y2 - a.y1),
    };
  };

  // Hit-test for select tool
  const hitTest = (x: number, y: number): Annotation | null => {
    for (let i = annotations.length - 1; i >= 0; i--) {
      const a = annotations[i];
      const bb = getBBox(a);
      if (x >= bb.x - 6 && x <= bb.x + bb.w + 6 && y >= bb.y - 6 && y <= bb.y + bb.h + 6) {
        return a;
      }
    }
    return null;
  };

  // Pointer handlers
  const onDown = (e: React.MouseEvent) => {
    const { x, y } = toImgCoords(e);
    if (tool === "select") {
      const hit = hitTest(x, y);
      if (hit) {
        setSelectedId(hit.id);
        dragRef.current = { id: hit.id, dx: x - hit.x1, dy: y - hit.y1 };
      } else {
        setSelectedId(null);
      }
      return;
    }
    if (tool === "text") {
      const text = window.prompt("Annotation text:", "");
      if (text && text.trim()) {
        const a: Annotation = {
          id: uid(),
          type: "text",
          color,
          strokeWidth: stroke,
          x1: x,
          y1: y,
          x2: x,
          y2: y,
          text: text.trim(),
          fontSize: 22,
        };
        pushHistory([...annotations, a]);
        setSelectedId(a.id);
      }
      setTool("select");
      return;
    }
    if (tool === "number") {
      const a: Annotation = {
        id: uid(),
        type: "number",
        color,
        strokeWidth: stroke,
        x1: x,
        y1: y,
        x2: x,
        y2: y,
        n: numberCounter,
      };
      pushHistory([...annotations, a]);
      setNumberCounter((c) => c + 1);
      setSelectedId(a.id);
      return;
    }
    const a: Annotation = {
      id: uid(),
      type: tool,
      color,
      strokeWidth: stroke,
      x1: x,
      y1: y,
      x2: x,
      y2: y,
      points: tool === "pen" ? [{ x, y }] : undefined,
    };
    drawingRef.current = a;
  };

  const onMove = (e: React.MouseEvent) => {
    const { x, y } = toImgCoords(e);
    if (tool === "select" && dragRef.current) {
      const { id, dx, dy } = dragRef.current;
      setAnnotations((arr) =>
        arr.map((a) => {
          if (a.id !== id) return a;
          if (a.type === "pen" && a.points) {
            const nx = x - dx;
            const ny = y - dy;
            const oldX = a.x1;
            const oldY = a.y1;
            const offX = nx - oldX;
            const offY = ny - oldY;
            return {
              ...a,
              x1: nx,
              y1: ny,
              x2: a.x2 + offX,
              y2: a.y2 + offY,
              points: a.points.map((p) => ({ x: p.x + offX, y: p.y + offY })),
            };
          }
          const offX = (x - dx) - a.x1;
          const offY = (y - dy) - a.y1;
          return {
            ...a,
            x1: a.x1 + offX,
            y1: a.y1 + offY,
            x2: a.x2 + offX,
            y2: a.y2 + offY,
          };
        })
      );
      return;
    }
    if (!drawingRef.current) return;
    const a = drawingRef.current;
    if (a.type === "pen") {
      a.points = [...(a.points || []), { x, y }];
    } else {
      a.x2 = x;
      a.y2 = y;
    }
    // live update via direct canvas redraw for perf
    render();
  };

  const onUp = () => {
    if (dragRef.current) {
      dragRef.current = null;
      pushHistory(annotations);
      return;
    }
    if (!drawingRef.current) return;
    const a = drawingRef.current;
    drawingRef.current = null;
    // Reject tiny drags
    if (
      a.type !== "pen" &&
      Math.abs(a.x2 - a.x1) < 5 &&
      Math.abs(a.y2 - a.y1) < 5
    ) {
      render();
      return;
    }
    pushHistory([...annotations, a]);
    setSelectedId(a.id);
    if (tool !== "select") setTool("select");
  };

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA") return;
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedId) {
          pushHistory(annotations.filter((a) => a.id !== selectedId));
          setSelectedId(null);
        }
      } else {
        const map: Record<string, Tool> = {
          v: "select", p: "pen", r: "rect", a: "arrow", t: "text", n: "number", h: "highlight", b: "blur",
        };
        const k = e.key.toLowerCase();
        if (map[k]) setTool(map[k]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [annotations, selectedId, historyIdx]);

  // AI scan
  const runAiScan = async () => {
    setAiScanning(true);
    setAiPanelOpen(true);
    setAiRegions([]);
    await new Promise((r) => setTimeout(r, 1400));
    // Determine current screenshot id
    const demo = DEMO_SCREENSHOTS.find((d) => d.dataUrl === imgSrc);
    const id = demo?.id || editingScreenshot?.id || "";
    const regions = DEMO_SENSITIVE_REGIONS[id] || [];
    const withIds = regions.map((r) => ({ ...r, id: uid(), blurred: false }));
    setAiRegions(withIds);
    setAiScanning(false);
    if (withIds.length === 0) {
      toast.info("AI found no auto-detectable patterns. Use the manual Blur tool (B).");
    } else {
      toast.success(`AI detected ${withIds.length} sensitive regions`);
    }
  };

  const toggleRegionBlur = (id: string) => {
    setAiRegions((arr) => arr.map((r) => (r.id === id ? { ...r, blurred: !r.blurred } : r)));
  };
  const applyAllBlur = () => {
    setAiRegions((arr) => arr.map((r) => ({ ...r, blurred: true })));
    toast.success("All sensitive regions blurred");
  };
  const acceptAiBlur = () => {
    // Bake blurred regions into annotations + persist
    const blurred = aiRegions.filter((r) => r.blurred);
    const newAnns: Annotation[] = blurred.map((r) => ({
      id: uid(),
      type: "blur",
      color: "#000",
      strokeWidth: 1,
      x1: r.x * imgSize.w,
      y1: r.y * imgSize.h,
      x2: (r.x + r.w) * imgSize.w,
      y2: (r.y + r.h) * imgSize.h,
    }));
    if (newAnns.length) pushHistory([...annotations, ...newAnns]);
    setAiRegions([]);
    setAiPanelOpen(false);
    toast.success(`${newAnns.length} blur layers baked into the canvas`);
  };

  // Export
  const exportCanvas = (fmt: "png" | "jpg"): string => {
    const out = document.createElement("canvas");
    out.width = imgSize.w;
    out.height = imgSize.h;
    const ctx = out.getContext("2d")!;
    if (fmt === "jpg") {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, out.width, out.height);
    }
    if (imgRef.current) ctx.drawImage(imgRef.current, 0, 0, out.width, out.height);
    // scale annotations
    const sx = out.width / (canvasRef.current?.width || out.width);
    ctx.save();
    ctx.scale(sx, sx);
    for (const a of annotations) drawAnnotation(ctx, a);
    ctx.restore();
    // bake ai regions
    for (const r of aiRegions.filter((r) => r.blurred)) {
      applyBlurRegion(ctx, out, imgRef.current!, r.x * out.width, r.y * out.height, r.w * out.width, r.h * out.height);
    }
    return fmt === "jpg" ? out.toDataURL("image/jpeg", 0.92) : out.toDataURL("image/png");
  };

  const handleDownload = () => {
    const url = exportCanvas(exportFmt);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "-").toLowerCase() || "snapmark"}.${exportFmt}`;
    a.click();
    toast.success(`Downloaded as ${exportFmt.toUpperCase()}`);
  };

  const handleCopyClipboard = async () => {
    try {
      const url = exportCanvas("png");
      const blob = await (await fetch(url)).blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Clipboard not supported in this browser");
    }
  };

  const handleSaveGallery = () => {
    const url = exportCanvas(exportFmt);
    const sizeBytes = Math.round((url.length * 3) / 4);
    const id = editingScreenshot?.id || uid();
    upsertScreenshot({
      id,
      title,
      dataUrl: url,
      captureType: editingScreenshot?.captureType || "visible",
      width: imgSize.w,
      height: imgSize.h,
      sizeBytes,
      aiBlurApplied: aiRegions.some((r) => r.blurred),
      starred: editingScreenshot?.starred || false,
      tags: editingScreenshot?.tags || [],
      folderId: editingScreenshot?.folderId || null,
      createdAt: editingScreenshot?.createdAt || Date.now(),
    });
    toast.success("Saved to gallery");
  };

  const handleShare = () => {
    const url = exportCanvas(exportFmt);
    handleSaveGallery();
    toast.success("Share link generated", {
      description: `snapmark.io/s/${uid().slice(0, 8)} — copied!`,
    });
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImgSrc(reader.result as string);
      setTitle(file.name.replace(/\.[^.]+$/, ""));
      setAnnotations([]);
      setHistory([[]]);
      setHistoryIdx(0);
      setAiRegions([]);
      toast.success("Image loaded — start annotating");
    };
    reader.readAsDataURL(file);
  };

  const selected = annotations.find((a) => a.id === selectedId) || null;
  const blurCount = aiRegions.filter((r) => r.blurred).length;
  const patternCounts = aiRegions.reduce<Record<string, number>>((acc, r) => {
    acc[r.pattern] = (acc[r.pattern] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-6">
      {/* Header bar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => useSnap.getState().setView("landing")}>
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-9 w-64 border-none bg-transparent px-1 text-base font-semibold shadow-none focus-visible:ring-0"
          />
          <Badge variant="outline" className="gap-1">
            <FileImage className="h-3 w-3" /> {imgSize.w}×{imgSize.h}
          </Badge>
          {aiRegions.some((r) => r.blurred) && (
            <Badge className="gap-1 bg-violet-500/15 text-violet-600 hover:bg-violet-500/20">
              <ShieldAlert className="h-3 w-3" /> AI blur applied
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={undo} disabled={historyIdx <= 0}>
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="outline" size="sm" onClick={redo} disabled={historyIdx >= history.length - 1}>
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button
            size="sm"
            onClick={runAiScan}
            disabled={aiScanning}
            className="gap-1.5 bg-violet-600 text-white hover:bg-violet-700"
          >
            {aiScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            AI Auto-Blur
          </Button>
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onUpload}
          />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[280px_1fr_300px]">
        {/* LEFT: tools + properties */}
        <Card className="h-fit p-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Tools
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {TOOLS.map((t) => {
              const Icon = t.icon;
              const active = tool === t.key;
              return (
                <TooltipProvider key={t.key}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setTool(t.key)}
                        className={cn(
                          "flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border text-muted-foreground transition-all hover:bg-accent",
                          active && "border-primary bg-primary text-primary-foreground shadow-sm hover:bg-primary"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-[9px] font-medium">{t.shortcut}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">{t.label}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>

          <Separator className="my-3" />

          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Color
          </div>
          <div className="grid grid-cols-8 gap-1.5">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={cn(
                  "aspect-square rounded-md border-2 transition-transform hover:scale-110",
                  color === c ? "border-foreground" : "border-transparent"
                )}
                style={{ background: c }}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent"
            />
            <span className="text-xs font-mono text-muted-foreground">{color}</span>
          </div>

          <Separator className="my-3" />

          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Stroke width
          </div>
          <div className="flex items-center gap-2">
            <Slider
              value={[stroke]}
              onValueChange={(v) => setStroke(v[0])}
              min={1}
              max={20}
              step={1}
              className="flex-1"
            />
            <span className="w-6 text-center text-xs font-mono">{stroke}</span>
          </div>

          <Separator className="my-3" />

          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Export format
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {(["png", "jpg"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setExportFmt(f)}
                className={cn(
                  "rounded-md border px-2 py-1.5 text-xs font-medium uppercase transition-colors",
                  exportFmt === f ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {user.role === "FREE" && (
            <div className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/10 p-2 text-[11px] text-amber-700 dark:text-amber-400">
              <Sparkles className="mb-1 inline h-3 w-3" /> Free plan: AI blur is read-only preview. Upgrade to bake blurs into exports.
            </div>
          )}
        </Card>

        {/* CENTER: canvas */}
        <div className="min-w-0">
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-xl border border-border bg-muted checker-bg"
          >
            {aiScanning && (
              <div className="pointer-events-none absolute inset-0 z-20">
                <div className="scan-line absolute inset-x-0 h-1 bg-violet-500/80 shadow-[0_0_20px_4px_rgba(139,92,246,0.6)]" />
                <div className="absolute inset-0 bg-violet-500/5" />
              </div>
            )}
            <canvas
              ref={canvasRef}
              width={imgSize.w}
              height={imgSize.h}
              onMouseDown={onDown}
              onMouseMove={onMove}
              onMouseUp={onUp}
              onMouseLeave={onUp}
              className={cn(
                "block h-auto w-full",
                tool === "select" ? "cursor-default" : "cursor-crosshair"
              )}
              style={{ aspectRatio: `${imgSize.w} / ${imgSize.h}` }}
            />
          </div>

          {/* Bottom action bar */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card p-2.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{annotations.length} annotations</span>
              {aiRegions.length > 0 && <span>· {aiRegions.length} AI regions</span>}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyClipboard} className="gap-1.5">
                <Copy className="h-4 w-4" /> Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1.5">
                <Download className="h-4 w-4" /> {exportFmt.toUpperCase()}
              </Button>
              <Button variant="outline" size="sm" onClick={handleSaveGallery} className="gap-1.5">
                <Save className="h-4 w-4" /> Save
              </Button>
              <Button size="sm" onClick={handleShare} className="gap-1.5">
                <Link2 className="h-4 w-4" /> Share link
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT: properties + AI panel */}
        <div className="flex flex-col gap-3">
          {aiPanelOpen && (
            <Card className="border-violet-400/30 bg-violet-500/5">
              <div className="flex items-center justify-between border-b border-violet-400/20 p-3">
                <div className="flex items-center gap-2">
                  <ScanEye className="h-4 w-4 text-violet-600" />
                  <span className="text-sm font-semibold">AI Detection</span>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setAiPanelOpen(false)}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="p-3">
                {aiScanning ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
                      Scanning for sensitive patterns…
                    </div>
                    <div className="space-y-1.5">
                      {["Emails", "Phone numbers", "Credit cards", "CNIC / IDs"].map((p, i) => (
                        <div key={p} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500" style={{ animationDelay: `${i * 200}ms` }} />
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {Object.entries(patternCounts).map(([p, n]) => (
                        <Badge key={p} variant="outline" className="gap-1" style={{ borderColor: PATTERN_INFO[p as SensitivePattern].color + "60", color: PATTERN_INFO[p as SensitivePattern].color }}>
                          {PATTERN_INFO[p as SensitivePattern].label}: {n}
                        </Badge>
                      ))}
                      {aiRegions.length === 0 && (
                        <span className="text-xs text-muted-foreground">No patterns detected.</span>
                      )}
                    </div>
                    <ScrollArea className="max-h-72 pr-2">
                      <div className="space-y-1.5">
                        {aiRegions.map((r) => {
                          const info = PATTERN_INFO[r.pattern];
                          return (
                            <div
                              key={r.id}
                              className="flex items-center gap-2 rounded-lg border border-border bg-card p-2"
                            >
                              <span className="h-2.5 w-2.5 rounded-full" style={{ background: info.color }} />
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-xs font-medium">{r.text}</div>
                                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{info.label}</div>
                              </div>
                              <button
                                onClick={() => toggleRegionBlur(r.id)}
                                className={cn(
                                  "flex h-6 items-center gap-1 rounded-md border px-2 text-[10px] font-semibold transition-colors",
                                  r.blurred
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border text-muted-foreground hover:bg-accent"
                                )}
                              >
                                {r.blurred ? <><Check className="h-3 w-3" /> Blurred</> : "Blur"}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                    <div className="mt-3 flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={applyAllBlur} disabled={aiRegions.length === 0} className="flex-1">
                        Blur all ({aiRegions.length})
                      </Button>
                      <Button size="sm" onClick={acceptAiBlur} disabled={blurCount === 0} className="flex-1 gap-1.5 bg-violet-600 text-white hover:bg-violet-700">
                        <Check className="h-3.5 w-3.5" /> Apply ({blurCount})
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Card>
          )}

          {selected && (
            <Card className="p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Selected
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => {
                    pushHistory(annotations.filter((a) => a.id !== selectedId));
                    setSelectedId(null);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <Badge variant="outline" className="capitalize">{selected.type}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Color</span>
                  <div className="flex items-center gap-1.5">
                    <span className="h-4 w-4 rounded border border-border" style={{ background: selected.color }} />
                    <span className="font-mono text-xs">{selected.color}</span>
                  </div>
                </div>
                {selected.type === "text" && (
                  <Input
                    value={selected.text || ""}
                    onChange={(e) => {
                      const txt = e.target.value;
                      setAnnotations((arr) => arr.map((a) => (a.id === selected.id ? { ...a, text: txt } : a)));
                    }}
                    className="h-8 text-sm"
                  />
                )}
                {selected.type === "number" && (
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground">Number</Label>
                    <Input
                      type="number"
                      value={selected.n || 1}
                      onChange={(e) => {
                        const n = parseInt(e.target.value) || 1;
                        setAnnotations((arr) => arr.map((a) => (a.id === selected.id ? { ...a, n } : a)));
                      }}
                      className="h-8 w-20 text-sm"
                    />
                  </div>
                )}
              </div>
            </Card>
          )}

          {!selected && !aiPanelOpen && (
            <Card className="p-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Quick start
              </div>
              <ol className="space-y-2 text-xs text-muted-foreground">
                <li><span className="mr-1 font-semibold text-foreground">1.</span> Pick a tool (V/P/R/A/T/N/H/B)</li>
                <li><span className="mr-1 font-semibold text-foreground">2.</span> Drag on the canvas to draw</li>
                <li><span className="mr-1 font-semibold text-foreground">3.</span> Hit <kbd className="rounded bg-muted px-1">AI Auto-Blur</kbd> to scan PII</li>
                <li><span className="mr-1 font-semibold text-foreground">4.</span> Apply blurs, then export / share</li>
              </ol>
              <Separator className="my-3" />
              <div className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Tip:</span> Press <kbd className="rounded bg-muted px-1">N</kbd> repeatedly to drop numbered step markers (1, 2, 3…).
              </div>
            </Card>
          )}

          <Card className="p-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Demo screenshots
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {DEMO_SCREENSHOTS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setImgSrc(d.dataUrl);
                    setTitle(d.title);
                    setAnnotations([]);
                    setHistory([[]]);
                    setHistoryIdx(0);
                    setAiRegions([]);
                    useSnap.getState().startEditorWith({
                      id: d.id,
                      title: d.title,
                      dataUrl: d.dataUrl,
                      captureType: d.captureType,
                      width: d.width,
                      height: d.height,
                      sizeBytes: 0,
                      aiBlurApplied: false,
                      starred: false,
                      tags: d.tags,
                      folderId: null,
                      createdAt: Date.now(),
                    });
                  }}
                  className="group overflow-hidden rounded-md border border-border transition-all hover:border-primary"
                >
                  <img src={d.dataUrl} alt={d.title} className="aspect-[16/10] w-full object-cover object-top" />
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
