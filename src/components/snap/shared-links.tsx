"use client";

import { useState } from "react";
import { useSnap } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Link2,
  Eye,
  Copy,
  Trash2,
  Lock,
  Clock,
  Globe,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { DEMO_SCREENSHOTS } from "@/lib/demo-screenshots";

interface SharedLink {
  id: string;
  url: string;
  title: string;
  views: number;
  expiryDays: number;
  password: boolean;
  watermark: boolean;
  createdAt: number;
  status: "active" | "expired";
}

const INITIAL_LINKS: SharedLink[] = [
  { id: "l1", url: "snapmark.io/s/aB3k9xQz", title: "Bug Report — Login flow", views: 42, expiryDays: 7, password: true, watermark: false, createdAt: Date.now() - 86400000 * 2, status: "active" },
  { id: "l2", url: "snapmark.io/s/xY7m2pLr", title: "Checkout redesign feedback", views: 18, expiryDays: 30, password: false, watermark: true, createdAt: Date.now() - 86400000 * 5, status: "active" },
  { id: "l3", url: "snapmark.io/s/qW4n8jKt", title: "Analytics dashboard v2", views: 7, expiryDays: 0, password: false, watermark: true, createdAt: Date.now() - 86400000 * 14, status: "expired" },
  { id: "l4", url: "snapmark.io/s/rT6v1hBc", title: "API error trace", views: 91, expiryDays: 14, password: true, watermark: false, createdAt: Date.now() - 86400000, status: "active" },
];

export function SharedLinks() {
  const { user } = useSnap();
  const [links, setLinks] = useState<SharedLink[]>(INITIAL_LINKS);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);

  const createLink = () => {
    if (!newTitle.trim()) return;
    const id = Math.random().toString(36).slice(2, 10);
    const newLink: SharedLink = {
      id,
      url: `snapmark.io/s/${id.slice(0, 8)}`,
      title: newTitle.trim(),
      views: 0,
      expiryDays: user.role === "FREE" ? 7 : 30,
      password: false,
      watermark: user.role === "FREE",
      createdAt: Date.now(),
      status: "active",
    };
    setLinks([newLink, ...links]);
    setNewTitle("");
    setCreating(false);
    toast.success("Share link generated", { description: newLink.url });
  };

  const toggle = (id: string, key: keyof SharedLink, val: any) => {
    setLinks((arr) => arr.map((l) => (l.id === id ? { ...l, [key]: val } : l)));
  };

  const copyUrl = (url: string) => {
    navigator.clipboard?.writeText(`https://${url}`);
    toast.success("Link copied to clipboard");
  };

  const revoke = (id: string) => {
    setLinks((arr) => arr.filter((l) => l.id !== id));
    toast.success("Link revoked");
  };

  const fmtDate = (t: number) => new Date(t).toLocaleDateString();
  const totalViews = links.reduce((a, l) => a + l.views, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shared Links</h1>
          <p className="text-sm text-muted-foreground">Manage, track, and revoke your public screenshot links.</p>
        </div>
        <Button onClick={() => setCreating(!creating)} className="gap-2">
          <Plus className="h-4 w-4" /> New link
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <Card><CardContent className="p-4"><div className="text-2xl font-bold">{links.length}</div><div className="text-xs text-muted-foreground">Active links</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold">{totalViews}</div><div className="text-xs text-muted-foreground">Total views</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold">{links.filter((l) => l.password).length}</div><div className="text-xs text-muted-foreground">Password-protected</div></CardContent></Card>
      </div>

      {creating && (
        <Card className="mb-4 border-primary/40">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium">
              <Link2 className="h-4 w-4 text-primary" /> Generate a new share link
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Link title (e.g. 'Q3 roadmap feedback')"
                onKeyDown={(e) => e.key === "Enter" && createLink()}
                autoFocus
              />
              <Button onClick={createLink} className="gap-2">
                <Link2 className="h-4 w-4" /> Generate
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {user.role === "FREE" ? "Free plan: 7-day expiry, watermark on." : "Pro/Team: custom expiry, no watermark, optional password."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* List */}
      <div className="space-y-3">
        {links.map((l) => (
          <Card key={l.id} className={l.status === "expired" ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-semibold">{l.title}</h3>
                    {l.status === "expired" ? (
                      <Badge variant="outline" className="text-muted-foreground">Expired</Badge>
                    ) : (
                      <Badge variant="outline" className="border-primary/40 text-primary">Active</Badge>
                    )}
                  </div>
                  <button
                    onClick={() => copyUrl(l.url)}
                    className="mt-1.5 flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 font-mono text-xs text-primary hover:bg-muted/70"
                  >
                    <Globe className="h-3 w-3" />
                    {l.url}
                    <Copy className="h-3 w-3" />
                  </button>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {l.views} views</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {l.expiryDays === 0 ? "expired" : `${l.expiryDays}d expiry`}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> created {fmtDate(l.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-end gap-2">
                    <label className="flex items-center gap-2 text-xs">
                      <Lock className="h-3 w-3" /> Password
                      <Switch
                        checked={l.password}
                        onCheckedChange={(v) => toggle(l.id, "password", v)}
                        disabled={user.role === "FREE"}
                      />
                    </label>
                    <label className="flex items-center gap-2 text-xs">
                      <ShieldCheck className="h-3 w-3" /> Watermark
                      <Switch
                        checked={l.watermark}
                        onCheckedChange={(v) => toggle(l.id, "watermark", v)}
                        disabled={user.role === "FREE"}
                      />
                    </label>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => copyUrl(l.url)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="text-destructive" onClick={() => revoke(l.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
