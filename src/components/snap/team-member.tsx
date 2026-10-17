"use client";

import { useState } from "react";
import { useSnap } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Pencil,
  Eye,
  Upload,
  FolderOpen,
  Activity,
  Crown,
  Lock,
  Camera,
  Sparkles,
  ShieldAlert,
  Clock,
  Users,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DEMO_SCREENSHOTS } from "@/lib/demo-screenshots";

const TEAM_LIBRARY = [
  { id: "tl1", title: "Q4 Roadmap — Onboarding flow", author: "Maya Chen", role: "EDITOR", captured: "5m ago", views: 18 },
  { id: "tl2", title: "Checkout redesign feedback", author: "Daniel Park", role: "EDITOR", captured: "1h ago", views: 24 },
  { id: "tl3", title: "Design system tokens review", author: "Alex Rivera", role: "OWNER", captured: "3h ago", views: 42 },
  { id: "tl4", title: "API error trace — auth flow", author: "Maya Chen", role: "EDITOR", captured: "1d ago", views: 67 },
  { id: "tl5", title: "Mobile responsive audit", author: "Daniel Park", role: "EDITOR", captured: "2d ago", views: 31 },
  { id: "tl6", title: "Customer onboarding screenshots", author: "Alex Rivera", role: "OWNER", captured: "3d ago", views: 12 },
];

const MY_ACTIVITY = [
  { action: "uploaded", target: "Q4 Roadmap — Onboarding flow", when: "5m ago" },
  { action: "applied AI blur to", target: "Checkout redesign feedback", when: "1h ago" },
  { action: "shared", target: "API error trace — auth flow", when: "3h ago" },
  { action: "commented on", target: "Design system tokens review", when: "1d ago" },
];

export function TeamMember() {
  const { user, setTeamRole, setRole, setView, startEditorWith } = useSnap();
  const [activeTab, setActiveTab] = useState("library");

  const isViewer = user.teamRole === "VIEWER";

  const openEditor = (d: typeof DEMO_SCREENSHOTS[number]) => {
    if (isViewer) {
      toast.error("Viewers cannot edit", { description: "Ask the team owner to upgrade your role to Editor." });
      return;
    }
    startEditorWith({
      id: d.id, title: d.title, dataUrl: d.dataUrl, captureType: d.captureType,
      width: d.width, height: d.height, sizeBytes: 0, aiBlurApplied: false,
      starred: false, tags: d.tags, folderId: null, createdAt: Date.now(),
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Team Workspace</h1>
            <Badge className={cn("gap-1", isViewer ? "bg-sky-500/15 text-sky-600 hover:bg-sky-500/15" : "bg-violet-500/15 text-violet-600 hover:bg-violet-500/15")}>
              {isViewer ? <><Eye className="h-3 w-3" /> Viewer</> : <><Pencil className="h-3 w-3" /> Editor</>}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {isViewer
              ? "Read-only access to the shared team library. Cannot upload or edit."
              : "Capture, annotate & upload to the shared team library."}
          </p>
        </div>
        {!isViewer && (
          <Button onClick={() => setView("editor")} className="gap-2">
            <Camera className="h-4 w-4" /> New screenshot
          </Button>
        )}
      </div>

      {/* Role toggle (demo) */}
      <Card className="mb-6 border-violet-400/30 bg-violet-500/5">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-violet-600" />
            <div>
              <div className="text-sm font-medium">Your team role: <span className="font-bold capitalize">{user.teamRole?.toLowerCase()}</span></div>
              <div className="text-xs text-muted-foreground">
                {isViewer
                  ? "Viewers can browse, comment & share — but not capture or edit."
                  : "Editors can capture, annotate, upload & share within the team library."}
              </div>
            </div>
          </div>
          <div className="flex gap-1.5">
            <Button size="sm" variant={isViewer ? "outline" : "default"} onClick={() => setTeamRole("EDITOR")} className="gap-1.5">
              <Pencil className="h-3.5 w-3.5" /> Editor
            </Button>
            <Button size="sm" variant={!isViewer ? "outline" : "default"} onClick={() => setTeamRole("VIEWER")} className="gap-1.5">
              <Eye className="h-3.5 w-3.5" /> Viewer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Role-specific permissions */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: Camera, label: "Capture", editor: true, viewer: false },
          { icon: Pencil, label: "Annotate", editor: true, viewer: false },
          { icon: Upload, label: "Upload", editor: true, viewer: false },
          { icon: Eye, label: "View library", editor: true, viewer: true },
        ].map((p) => {
          const Icon = p.icon;
          const allowed = isViewer ? p.viewer : p.editor;
          return (
            <Card key={p.label} className={cn("border-border/60", !allowed && "opacity-50")}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Icon className={cn("h-4 w-4", allowed ? "text-primary" : "text-muted-foreground")} />
                  {allowed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </div>
                <div className="mt-2 text-sm font-semibold">{p.label}</div>
                <div className="text-[11px] text-muted-foreground">{allowed ? "Allowed" : "Not allowed"}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="library" className="gap-1.5"><FolderOpen className="h-3.5 w-3.5" /> Shared Library</TabsTrigger>
          {!isViewer && <TabsTrigger value="my" className="gap-1.5"><Camera className="h-3.5 w-3.5" /> My Captures</TabsTrigger>}
          <TabsTrigger value="activity" className="gap-1.5"><Activity className="h-3.5 w-3.5" /> Activity</TabsTrigger>
          <TabsTrigger value="team" className="gap-1.5"><Users className="h-3.5 w-3.5" /> Team</TabsTrigger>
        </TabsList>

        {/* Shared library */}
        <TabsContent value="library">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Shared Library ({TEAM_LIBRARY.length})</h3>
            {!isViewer && (
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setView("editor")}>
                <Upload className="h-3.5 w-3.5" /> Upload
              </Button>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM_LIBRARY.map((s, i) => {
              const demo = DEMO_SCREENSHOTS[i % DEMO_SCREENSHOTS.length];
              return (
                <Card key={s.id} className="group overflow-hidden border-border/60 transition-all hover:shadow-lg hover:-translate-y-0.5">
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <img src={demo.dataUrl} alt={s.title} className="h-full w-full object-cover object-top" />
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button size="sm" variant="secondary" onClick={() => openEditor(demo)} disabled={isViewer}>
                        {isViewer ? <><Eye className="h-3.5 w-3.5" /> View</> : <><Sparkles className="h-3.5 w-3.5" /> Edit</>}
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => toast.success("Share link copied")}>
                        Share
                      </Button>
                    </div>
                    {i % 2 === 0 && (
                      <Badge className="absolute left-2 top-2 bg-violet-600/80 text-white hover:bg-violet-600/80">
                        <ShieldAlert className="mr-1 h-3 w-3" /> AI
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <div className="line-clamp-1 text-sm font-semibold">{s.title}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Avatar className="h-5 w-5"><AvatarFallback className="bg-primary/15 text-[9px] text-primary">{s.author.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                      <span>{s.author}</span>
                      {s.role === "OWNER" && <Crown className="h-3 w-3 text-amber-500" />}
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {s.captured}</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {s.views}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* My captures */}
        {!isViewer && (
          <TabsContent value="my">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">My Captures (3)</h3>
              <Button size="sm" onClick={() => setView("editor")} className="gap-1.5">
                <Camera className="h-3.5 w-3.5" /> New
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {DEMO_SCREENSHOTS.slice(0, 3).map((d) => (
                <Card key={d.id} className="group overflow-hidden border-border/60 transition-all hover:shadow-md">
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <img src={d.dataUrl} alt={d.title} className="h-full w-full object-cover object-top" />
                  </div>
                  <CardContent className="p-3">
                    <div className="line-clamp-1 text-sm font-semibold">{d.title}</div>
                    <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Draft</span>
                      <Button size="sm" variant="outline" onClick={() => openEditor(d)} className="h-6 gap-1 px-2 text-xs">
                        <Upload className="h-3 w-3" /> Push to library
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}

        {/* Activity */}
        <TabsContent value="activity">
          <Card>
            <div className="border-b border-border p-4">
              <h3 className="font-semibold">Recent activity</h3>
            </div>
            <CardContent className="p-4">
              <div className="space-y-3">
                {MY_ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                    <div className="flex-1">
                      <span className="text-muted-foreground">{a.action}</span>{" "}
                      <span className="font-medium">{a.target}</span>
                      <div className="text-xs text-muted-foreground">{a.when}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team */}
        <TabsContent value="team">
          <Card>
            <div className="border-b border-border p-4 flex items-center justify-between">
              <h3 className="font-semibold">Team members (5)</h3>
              <Button variant="outline" size="sm" onClick={() => setView("teams")}>Manage team</Button>
            </div>
            <div className="divide-y divide-border">
              {[
                { name: "Alex Rivera", email: "alex@snapmark.io", role: "OWNER", color: "emerald" },
                { name: "Maya Chen", email: "maya@snapmark.io", role: "EDITOR", color: "violet" },
                { name: "Daniel Park", email: "daniel@snapmark.io", role: "EDITOR", color: "amber" },
                { name: "You", email: user.email, role: user.teamRole || "EDITOR", color: "cyan" },
                { name: "Priya Sharma", email: "priya@snapmark.io", role: "VIEWER", color: "rose" },
              ].map((m) => (
                <div key={m.email} className="flex items-center gap-3 p-4">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className={cn("text-xs font-semibold", `bg-${m.color}-500/15`, `text-${m.color}-600`)}>
                      {m.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{m.name}</span>
                      {m.role === "OWNER" && <Crown className="h-3 w-3 text-amber-500" />}
                    </div>
                    <div className="text-xs text-muted-foreground">{m.email}</div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{m.role}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
