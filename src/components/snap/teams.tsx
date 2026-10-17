"use client";

import { useState } from "react";
import { useSnap } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Users,
  UserPlus,
  Crown,
  Eye,
  Pencil,
  Trash2,
  Settings,
  FolderOpen,
  Activity,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Member {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "EDITOR" | "VIEWER";
  color: string;
  screenshots: number;
  lastActive: string;
}

const INITIAL_MEMBERS: Member[] = [
  { id: "m1", name: "Alex Rivera", email: "alex@snapmark.io", role: "OWNER", color: "emerald", screenshots: 142, lastActive: "now" },
  { id: "m2", name: "Maya Chen", email: "maya@snapmark.io", role: "EDITOR", color: "violet", screenshots: 87, lastActive: "5m ago" },
  { id: "m3", name: "Daniel Park", email: "daniel@snapmark.io", role: "EDITOR", color: "amber", screenshots: 56, lastActive: "1h ago" },
  { id: "m4", name: "Priya Sharma", email: "priya@snapmark.io", role: "VIEWER", color: "rose", screenshots: 0, lastActive: "2d ago" },
  { id: "m5", name: "Omar Farooq", email: "omar@snapmark.io", role: "VIEWER", color: "cyan", screenshots: 0, lastActive: "5d ago" },
];

export function Teams() {
  const { user } = useSnap();
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"EDITOR" | "VIEWER">("EDITOR");

  const isTeamOwner = user.role === "TEAM_OWNER";

  const invite = () => {
    if (!inviteEmail.trim()) return;
    if (!inviteEmail.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    const colors = ["emerald", "violet", "amber", "rose", "cyan", "lime"];
    const newMember: Member = {
      id: Math.random().toString(36).slice(2),
      name: inviteEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email: inviteEmail.trim(),
      role: inviteRole,
      color: colors[Math.floor(Math.random() * colors.length)],
      screenshots: 0,
      lastActive: "just invited",
    };
    setMembers([...members, newMember]);
    setInviteEmail("");
    toast.success(`Invite sent to ${newMember.email}`);
  };

  const changeRole = (id: string, role: "EDITOR" | "VIEWER") => {
    setMembers((arr) => arr.map((m) => (m.id === id ? { ...m, role } : m)));
    toast.success("Role updated");
  };
  const removeMember = (id: string) => {
    setMembers((arr) => arr.filter((m) => m.id !== id));
    toast.success("Member removed");
  };

  const colorClasses: Record<string, string> = {
    emerald: "bg-emerald-500/15 text-emerald-600",
    violet: "bg-violet-500/15 text-violet-600",
    amber: "bg-amber-500/15 text-amber-600",
    rose: "bg-rose-500/15 text-rose-600",
    cyan: "bg-cyan-500/15 text-cyan-600",
    lime: "bg-lime-500/15 text-lime-600",
  };

  const roleStats = {
    editors: members.filter((m) => m.role === "EDITOR").length,
    viewers: members.filter((m) => m.role === "VIEWER").length,
    total: members.length,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Workspace</h1>
          <p className="text-sm text-muted-foreground">Shared library, members, and team-wide branding.</p>
        </div>
        {isTeamOwner && (
          <Badge variant="outline" className="gap-1.5 border-primary/40 text-primary">
            <Crown className="h-3.5 w-3.5" /> You are the owner
          </Badge>
        )}
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 text-sm text-muted-foreground"><Users className="h-4 w-4" /> Members</div><div className="mt-1 text-2xl font-bold">{roleStats.total}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 text-sm text-muted-foreground"><Pencil className="h-4 w-4" /> Editors</div><div className="mt-1 text-2xl font-bold">{roleStats.editors}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 text-sm text-muted-foreground"><Eye className="h-4 w-4" /> Viewers</div><div className="mt-1 text-2xl font-bold">{roleStats.viewers}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 text-sm text-muted-foreground"><FolderOpen className="h-4 w-4" /> Shared screenshots</div><div className="mt-1 text-2xl font-bold">{members.reduce((a, m) => a + m.screenshots, 0)}</div></CardContent></Card>
      </div>

      {/* Invite */}
      {isTeamOwner && (
        <Card className="mb-6 border-primary/40">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium">
              <UserPlus className="h-4 w-4 text-primary" /> Invite a teammate
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="teammate@company.com"
                onKeyDown={(e) => e.key === "Enter" && invite()}
                className="flex-1"
              />
              <div className="flex gap-2">
                <Button variant={inviteRole === "EDITOR" ? "default" : "outline"} onClick={() => setInviteRole("EDITOR")} className="gap-1.5">
                  <Pencil className="h-3.5 w-3.5" /> Editor
                </Button>
                <Button variant={inviteRole === "VIEWER" ? "default" : "outline"} onClick={() => setInviteRole("VIEWER")} className="gap-1.5">
                  <Eye className="h-3.5 w-3.5" /> Viewer
                </Button>
                <Button onClick={invite} className="gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Invite
                </Button>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Editor: capture, annotate, upload. Viewer: read-only access to shared library.</p>
          </CardContent>
        </Card>
      )}

      {/* Members list */}
      <Card>
        <div className="border-b border-border p-4">
          <h3 className="font-semibold">Members ({members.length})</h3>
        </div>
        <div className="divide-y divide-border">
          {members.map((m) => (
            <div key={m.id} className="flex flex-wrap items-center gap-3 p-4">
              <Avatar className="h-10 w-10 border border-border">
                <AvatarFallback className={cn("text-xs font-semibold", colorClasses[m.color])}>
                  {m.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{m.name}</span>
                  {m.role === "OWNER" && <Badge className="gap-1 bg-amber-500/15 text-amber-700 hover:bg-amber-500/15"><Crown className="h-3 w-3" /> Owner</Badge>}
                  {m.role === "EDITOR" && <Badge variant="outline" className="gap-1"><Pencil className="h-3 w-3" /> Editor</Badge>}
                  {m.role === "VIEWER" && <Badge variant="outline" className="gap-1"><Eye className="h-3 w-3" /> Viewer</Badge>}
                </div>
                <div className="text-xs text-muted-foreground">{m.email} · {m.screenshots} screenshots · {m.lastActive}</div>
              </div>
              {isTeamOwner && m.role !== "OWNER" && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => changeRole(m.id, m.role === "EDITOR" ? "VIEWER" : "EDITOR")}
                  >
                    Make {m.role === "EDITOR" ? "Viewer" : "Editor"}
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeMember(m.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Activity */}
      <Card className="mt-6">
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /><h3 className="font-semibold">Recent team activity</h3></div>
        </div>
        <CardContent className="p-4">
          <div className="space-y-3">
            {[
              { who: "Maya Chen", what: "uploaded 'Onboarding flow v3' to shared library", when: "5m ago" },
              { who: "Daniel Park", what: "shared 'Q3 roadmap' with external stakeholder", when: "1h ago" },
              { who: "Alex Rivera", what: "applied AI auto-blur to 4 screenshots", when: "3h ago" },
              { who: "Priya Sharma", what: "viewed 'Design system tokens'", when: "2d ago" },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                <div className="flex-1">
                  <span className="font-medium">{a.who}</span> {a.what}
                  <div className="text-xs text-muted-foreground">{a.when}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      {isTeamOwner && (
        <Card className="mt-6 border-violet-400/30">
          <div className="border-b border-border p-4">
            <div className="flex items-center gap-2"><Settings className="h-4 w-4 text-violet-600" /><h3 className="font-semibold">Team-wide branding</h3></div>
          </div>
          <CardContent className="p-4">
            <p className="mb-3 text-sm text-muted-foreground">Apply your brand watermark to all shared screenshots from this workspace.</p>
            <div className="flex flex-wrap items-center gap-3">
              <Input placeholder="Brand name (e.g. Acme Inc.)" className="max-w-xs" />
              <input type="color" defaultValue="#10b981" className="h-9 w-14 cursor-pointer rounded border border-border" />
              <Button onClick={() => toast.success("Team branding saved")}>Save branding</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
