"use client";

import { useEffect, useMemo, useState } from "react";
import { useSnap, type ScreenshotMeta } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Search,
  Sparkles,
  Star,
  Trash2,
  Download,
  Link2,
  Filter,
  FolderPlus,
  Image as ImageIcon,
  Camera,
  Clock,
  ShieldAlert,
  MoreVertical,
  Cloud,
  HardDrive,
  TrendingUp,
} from "lucide-react";
import { DEMO_SCREENSHOTS } from "@/lib/demo-screenshots";
import { cn } from "@/lib/utils";

const FOLDER_COLORS = ["emerald", "amber", "violet", "rose", "cyan", "lime"];

export function Dashboard() {
  const { screenshots, setScreenshots, upsertScreenshot, removeScreenshot, folders, addFolder, removeFolder, startEditorWith, setView, user } = useSnap();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [folderName, setFolderName] = useState("");
  const [showFolderInput, setShowFolderInput] = useState(false);

  // Seed demo screenshots into local gallery if empty
  useEffect(() => {
    if (screenshots.length === 0) {
      const seededData: ScreenshotMeta[] = DEMO_SCREENSHOTS.map((d, i) => ({
        id: d.id,
        title: d.title,
        dataUrl: d.dataUrl,
        captureType: d.captureType,
        width: d.width,
        height: d.height,
        sizeBytes: 142000 + i * 38000,
        aiBlurApplied: i === 1 || i === 0,
        starred: i === 0,
        tags: d.tags,
        folderId: null,
        createdAt: Date.now() - i * 86400000 * 2,
      }));
      setScreenshots(seededData);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const seeded = screenshots;

  const filtered = useMemo(() => {
    let list = [...seeded];
    if (tab === "starred") list = list.filter((s) => s.starred);
    if (tab === "ai") list = list.filter((s) => s.aiBlurApplied);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((s) => s.title.toLowerCase().includes(q) || s.tags.some((t) => t.includes(q)));
    }
    return list.sort((a, b) => b.createdAt - a.createdAt);
  }, [seeded, tab, query]);

  const totalSize = seeded.reduce((acc, s) => acc + s.sizeBytes, 0);
  const storageLimit = user.role === "FREE" ? 500 * 1024 * 1024 : 5 * 1024 * 1024 * 1024;
  const storagePct = Math.min(100, (totalSize / storageLimit) * 100);

  const stats = [
    { label: "Total screenshots", value: seeded.length, icon: ImageIcon, color: "text-primary" },
    { label: "AI-blur applied", value: seeded.filter((s) => s.aiBlurApplied).length, icon: ShieldAlert, color: "text-violet-600" },
    { label: "Starred", value: seeded.filter((s) => s.starred).length, icon: Star, color: "text-amber-500" },
    { label: "This week", value: seeded.filter((s) => Date.now() - s.createdAt < 7 * 86400000).length, icon: TrendingUp, color: "text-emerald-600" },
  ];

  const createFolder = () => {
    if (!folderName.trim()) return;
    const color = FOLDER_COLORS[Math.floor(Math.random() * FOLDER_COLORS.length)];
    addFolder({ id: Math.random().toString(36).slice(2), name: folderName.trim(), color, createdAt: Date.now() });
    setFolderName("");
    setShowFolderInput(false);
    toast.success("Folder created");
  };

  const fmtSize = (b: number) => b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${(b / 1024).toFixed(0)} KB`;
  const fmtDate = (t: number) => {
    const d = new Date(t);
    const days = Math.floor((Date.now() - t) / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Your screenshot gallery, organized & searchable.</p>
        </div>
        <Button onClick={() => setView("editor")} className="gap-2">
          <Camera className="h-4 w-4" /> New screenshot
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className={`card-lift border-border/60 animate-fade-in-up stagger-${i + 1}`}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-muted transition-transform group-hover:scale-110", s.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold leading-none tabular-nums">{s.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Sidebar: folders + storage */}
        <div className="space-y-4">
          <Card className="p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Folders</span>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowFolderInput(!showFolderInput)}>
                <FolderPlus className="h-3.5 w-3.5" />
              </Button>
            </div>
            {showFolderInput && (
              <div className="mb-2 flex gap-1.5">
                <Input
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && createFolder()}
                  placeholder="Folder name"
                  className="h-8 text-sm"
                  autoFocus
                />
                <Button size="sm" className="h-8 px-2" onClick={createFolder}>Add</Button>
              </div>
            )}
            <div className="space-y-1">
              <button
                onClick={() => setTab("all")}
                className={cn("flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors", tab === "all" ? "bg-primary text-primary-foreground" : "hover:bg-accent")}
              >
                <ImageIcon className="h-3.5 w-3.5" /> All screenshots
                <span className="ml-auto text-xs opacity-70">{seeded.length}</span>
              </button>
              <button
                onClick={() => setTab("starred")}
                className={cn("flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors", tab === "starred" ? "bg-primary text-primary-foreground" : "hover:bg-accent")}
              >
                <Star className="h-3.5 w-3.5" /> Starred
                <span className="ml-auto text-xs opacity-70">{seeded.filter((s) => s.starred).length}</span>
              </button>
              <button
                onClick={() => setTab("ai")}
                className={cn("flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors", tab === "ai" ? "bg-primary text-primary-foreground" : "hover:bg-accent")}
              >
                <ShieldAlert className="h-3.5 w-3.5" /> AI-blurred
                <span className="ml-auto text-xs opacity-70">{seeded.filter((s) => s.aiBlurApplied).length}</span>
              </button>
              {folders.map((f) => (
                <div key={f.id} className="group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent">
                  <span className={cn("h-2.5 w-2.5 rounded-full", `bg-${f.color}-500`)} />
                  <span className="flex-1 truncate">{f.name}</span>
                  <button
                    onClick={() => { removeFolder(f.id); toast.success("Folder removed"); }}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Storage</span>
              {user.role === "FREE" ? <HardDrive className="h-3.5 w-3.5 text-muted-foreground" /> : <Cloud className="h-3.5 w-3.5 text-primary" />}
            </div>
            <div className="text-sm">
              <span className="font-semibold">{fmtSize(totalSize)}</span>
              <span className="text-muted-foreground"> / {fmtSize(storageLimit)}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${storagePct}%` }} />
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground">
              {user.role === "FREE" ? "Free plan: 500MB. Upgrade for 5GB+ cloud sync." : "Cloud sync active"}
            </div>
            {user.role === "FREE" && (
              <Button size="sm" variant="outline" className="mt-2 w-full" onClick={() => setView("pricing")}>
                Upgrade for cloud sync
              </Button>
            )}
          </Card>
        </div>

        {/* Main: search + grid */}
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title or tag…"
                className="pl-9"
              />
            </div>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="starred">Starred</TabsTrigger>
                <TabsTrigger value="ai">AI-blurred</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {filtered.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-semibold">No screenshots found</div>
                  <div className="text-sm text-muted-foreground">Try a different filter or capture a new screenshot.</div>
                </div>
                <Button onClick={() => setView("editor")} className="gap-2">
                  <Camera className="h-4 w-4" /> New screenshot
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((s, i) => (
                <Card key={s.id} className={`card-lift group overflow-hidden border-border/60 hover:shadow-xl hover:border-primary/40 animate-fade-in-up stagger-${Math.min(i + 1, 8)}`}>
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <img
                      src={s.dataUrl}
                      alt={s.title}
                      className="h-full w-full object-cover object-top transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2">
                      <Badge className="bg-black/60 text-white hover:bg-black/60">{s.captureType}</Badge>
                      <div className="flex gap-1">
                        {s.aiBlurApplied && (
                          <Badge className="bg-violet-600/80 text-white hover:bg-violet-600/80">
                            <ShieldAlert className="mr-1 h-3 w-3" /> AI
                          </Badge>
                        )}
                        {s.starred && (
                          <Badge className="bg-amber-500/80 text-white hover:bg-amber-500/80">
                            <Star className="h-3 w-3 fill-white" />
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => startEditorWith(s)}>
                        <Sparkles className="h-3.5 w-3.5" /> Edit
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="secondary" className="px-2">
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            upsertScreenshot({ ...s, starred: !s.starred });
                            toast.success(s.starred ? "Removed star" : "Starred");
                          }}>
                            <Star className="mr-2 h-3.5 w-3.5" /> {s.starred ? "Unstar" : "Star"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            const a = document.createElement("a");
                            a.href = s.dataUrl;
                            a.download = `${s.title.replace(/\s+/g, "-")}.png`;
                            a.click();
                          }}>
                            <Download className="mr-2 h-3.5 w-3.5" /> Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            toast.success("Share link copied", { description: `snapmark.io/s/${s.id.slice(0, 8)}` });
                          }}>
                            <Link2 className="mr-2 h-3.5 w-3.5" /> Copy share link
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => {
                            removeScreenshot(s.id);
                            toast.success("Screenshot deleted");
                          }}>
                            <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <div className="line-clamp-1 text-sm font-semibold">{s.title}</div>
                    <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {fmtDate(s.createdAt)}</span>
                      <span>{fmtSize(s.sizeBytes)}</span>
                    </div>
                    {s.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {s.tags.slice(0, 3).map((t) => (
                          <Badge key={t} variant="outline" className="text-[10px]">#{t}</Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
