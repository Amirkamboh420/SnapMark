"use client";

import { useState } from "react";
import { useSnap, type FolderMeta } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FolderPlus,
  Folder,
  Tag,
  Search,
  Trash2,
  Edit3,
  Star,
  ShieldAlert,
  Image as ImageIcon,
  MoreVertical,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DEMO_SCREENSHOTS } from "@/lib/demo-screenshots";

const FOLDER_COLORS = [
  { name: "emerald", class: "bg-emerald-500" },
  { name: "amber", class: "bg-amber-500" },
  { name: "violet", class: "bg-violet-500" },
  { name: "rose", class: "bg-rose-500" },
  { name: "cyan", class: "bg-cyan-500" },
  { name: "lime", class: "bg-lime-500" },
  { name: "orange", class: "bg-orange-500" },
  { name: "fuchsia", class: "bg-fuchsia-500" },
];

interface ManagedFolder extends FolderMeta {
  count: number;
}

const INITIAL_FOLDERS: ManagedFolder[] = [
  { id: "f1", name: "Bug Reports", color: "rose", createdAt: Date.now() - 86400000 * 30, count: 24 },
  { id: "f2", name: "Design Feedback", color: "violet", createdAt: Date.now() - 86400000 * 20, count: 18 },
  { id: "f3", name: "Tutorials", color: "amber", createdAt: Date.now() - 86400000 * 14, count: 12 },
  { id: "f4", name: "Competitor Research", color: "cyan", createdAt: Date.now() - 86400000 * 7, count: 8 },
  { id: "f5", name: "Customer Issues", color: "emerald", createdAt: Date.now() - 86400000 * 3, count: 31 },
];

const ALL_TAGS = [
  { name: "pii", count: 14 },
  { name: "support", count: 31 },
  { name: "bug", count: 24 },
  { name: "design", count: 18 },
  { name: "tutorial", count: 12 },
  { name: "checkout", count: 5 },
  { name: "analytics", count: 8 },
  { name: "api", count: 6 },
  { name: "mobile", count: 4 },
];

export function Folders() {
  const { addFolder, removeFolder, folders: storeFolders, startEditorWith, setView } = useSnap();
  const [folders, setFolders] = useState<ManagedFolder[]>(INITIAL_FOLDERS);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("emerald");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [query, setQuery] = useState("");

  const createFolder = () => {
    if (!newName.trim()) return;
    const f: ManagedFolder = {
      id: Math.random().toString(36).slice(2),
      name: newName.trim(),
      color: newColor,
      createdAt: Date.now(),
      count: 0,
    };
    setFolders([f, ...folders]);
    addFolder(f);
    setNewName("");
    setShowCreate(false);
    toast.success("Folder created");
  };

  const saveEdit = () => {
    if (!editingId || !editName.trim()) return;
    setFolders((arr) => arr.map((f) => (f.id === editingId ? { ...f, name: editName.trim() } : f)));
    setEditingId(null);
    toast.success("Folder renamed");
  };

  const del = (id: string) => {
    setFolders((arr) => arr.filter((f) => f.id !== id));
    removeFolder(id);
    toast.success("Folder deleted (screenshots moved to Unsorted)");
  };

  const totalScreenshots = folders.reduce((a, f) => a + f.count, 0) + 8;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Folders & Tags</h1>
          <p className="text-sm text-muted-foreground">Organize your screenshots for faster findability.</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)} className="gap-2">
          <FolderPlus className="h-4 w-4" /> New folder
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 text-sm text-muted-foreground"><Folder className="h-4 w-4" /> Folders</div><div className="mt-1 text-2xl font-bold">{folders.length}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 text-sm text-muted-foreground"><Tag className="h-4 w-4" /> Tags</div><div className="mt-1 text-2xl font-bold">{ALL_TAGS.length}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 text-sm text-muted-foreground"><ImageIcon className="h-4 w-4" /> Organized</div><div className="mt-1 text-2xl font-bold">{totalScreenshots}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 text-sm text-muted-foreground"><ShieldAlert className="h-4 w-4" /> AI-blurred</div><div className="mt-1 text-2xl font-bold">14</div></CardContent></Card>
      </div>

      {/* Create form */}
      {showCreate && (
        <Card className="mb-4 border-primary/40">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium">Create new folder</span>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowCreate(false)}><X className="h-3.5 w-3.5" /></Button>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Folder name (e.g. Q4 Roadmap)"
                  onKeyDown={(e) => e.key === "Enter" && createFolder()}
                  autoFocus
                />
              </div>
              <div className="flex items-center gap-1.5">
                {FOLDER_COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setNewColor(c.name)}
                    className={cn(
                      "h-7 w-7 rounded-full border-2 transition-transform hover:scale-110",
                      c.class,
                      newColor === c.name ? "border-foreground ring-2 ring-offset-2 ring-offset-background ring-foreground/30" : "border-transparent"
                    )}
                    aria-label={c.name}
                  />
                ))}
              </div>
              <Button onClick={createFolder} className="gap-1.5"><FolderPlus className="h-4 w-4" /> Create</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Folders */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Folders ({folders.length})</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search folders…" className="h-9 w-56 pl-9 text-sm" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {/* Unsorted */}
            <Card className="border-dashed">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline">Unsorted</Badge>
                </div>
                <button onClick={() => setView("dashboard")} className="mt-3 block text-left">
                  <div className="font-semibold">All screenshots</div>
                  <div className="text-xs text-muted-foreground">{totalScreenshots} screenshots</div>
                </button>
              </CardContent>
            </Card>

            {folders
              .filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))
              .map((f) => {
                const colorClass = FOLDER_COLORS.find((c) => c.name === f.color)?.class || "bg-emerald-500";
                return (
                  <Card key={f.id} className="group transition-shadow hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg text-white", colorClass)}>
                          <Folder className="h-5 w-5" />
                        </div>
                        <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingId(f.id); setEditName(f.name); }}>
                            <Edit3 className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => del(f.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      {editingId === f.id ? (
                        <div className="mt-3 flex gap-1.5">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                            className="h-8 text-sm"
                            autoFocus
                          />
                          <Button size="sm" className="h-8 px-2" onClick={saveEdit}>Save</Button>
                        </div>
                      ) : (
                        <button onClick={() => setView("dashboard")} className="mt-3 block w-full text-left">
                          <div className="truncate font-semibold">{f.name}</div>
                          <div className="text-xs text-muted-foreground">{f.count} screenshots</div>
                          <div className="mt-2 text-[10px] text-muted-foreground">Created {new Date(f.createdAt).toLocaleDateString()}</div>
                        </button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>

        {/* Tags sidebar */}
        <div>
          <h2 className="mb-3 text-lg font-semibold">Tags</h2>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-1.5">
                {ALL_TAGS.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => { setView("dashboard"); toast.success(`Filtering by #${t.name}`); }}
                    className="group flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs transition-colors hover:border-primary hover:bg-primary/5"
                  >
                    <span className="text-muted-foreground">#</span>
                    <span className="font-medium">{t.name}</span>
                    <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px]">{t.count}</Badge>
                  </button>
                ))}
              </div>
              <div className="mt-4 border-t border-border pt-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Tag className="h-3.5 w-3.5" />
                  Click any tag to filter the dashboard
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Star className="h-4 w-4 text-amber-500" /> Starred screenshots
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {DEMO_SCREENSHOTS.slice(0, 3).map((d) => (
                  <button
                    key={d.id}
                    onClick={() => startEditorWith({
                      id: d.id, title: d.title, dataUrl: d.dataUrl, captureType: d.captureType,
                      width: d.width, height: d.height, sizeBytes: 0, aiBlurApplied: false,
                      starred: true, tags: d.tags, folderId: null, createdAt: Date.now(),
                    })}
                    className="overflow-hidden rounded-md border border-border transition-all hover:border-primary"
                  >
                    <img src={d.dataUrl} alt={d.title} className="aspect-[16/10] w-full object-cover object-top" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
