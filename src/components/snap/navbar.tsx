"use client";

import { useSnap } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Sparkles,
  LayoutDashboard,
  CreditCard,
  Settings,
  Users,
  Link2,
  Shield,
  Moon,
  Sun,
  Bell,
  Menu,
  X,
  FolderOpen,
  FileText,
  LifeBuoy,
  LogIn,
  Rocket,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS: { key: any; label: string; icon: any; roles?: string[] }[] = [
  { key: "landing", label: "Home", icon: Camera },
  { key: "editor", label: "Editor", icon: Sparkles },
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "folders", label: "Folders", icon: FolderOpen },
  { key: "sharedlinks", label: "Shared Links", icon: Link2 },
  { key: "export", label: "Export", icon: FileText },
  { key: "teams", label: "Teams", icon: Users, roles: ["TEAM_OWNER", "TEAM_MEMBER", "ADMIN"] },
  { key: "teammember", label: "My Team", icon: Users, roles: ["TEAM_MEMBER"] },
  { key: "billing", label: "Billing", icon: CreditCard },
  { key: "pricing", label: "Pricing", icon: CreditCard },
  { key: "support", label: "Support", icon: LifeBuoy },
  { key: "settings", label: "Settings", icon: Settings },
  { key: "admin", label: "Admin", icon: Shield, roles: ["ADMIN"] },
];

const ROLE_LABEL: Record<string, string> = {
  FREE: "Free Plan",
  PRO: "Pro Plan",
  TEAM_OWNER: "Team Owner",
  TEAM_MEMBER: "Team Member",
  ADMIN: "Administrator",
};

export function Navbar() {
  const { view, setView, user, setRole, settings, toggleTheme, notifications, setCaptureModalOpen } = useSnap();
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = NAV_ITEMS.filter(
    (i) => !i.roles || i.roles.includes(user.role)
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <button
          onClick={() => setView("landing")}
          className="flex items-center gap-2.5 group"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform group-hover:scale-105">
            <Camera className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500" />
            </span>
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-lg font-bold tracking-tight">SnapMark</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Annotate · Blur · Share
            </span>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {items.map((item) => {
            const Icon = item.icon;
            const active = view === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setView(item.key)}
                className={cn(
                  "group relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4 transition-transform", active ? "scale-110" : "group-hover:scale-105")} />
                {item.label}
                {active && (
                  <span className="absolute -bottom-[1px] left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary-foreground" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
            aria-label="Toggle theme"
          >
            {settings.theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          <Button
            size="sm"
            className="hidden gap-1.5 sm:flex"
            onClick={() => setCaptureModalOpen(true)}
          >
            <Camera className="h-4 w-4" /> Capture
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="hidden gap-1.5 md:flex"
            onClick={() => setView("onboarding")}
          >
            <Rocket className="h-4 w-4" /> Tour
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setView("login")}
            aria-label="Login"
          >
            <LogIn className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Bell className="h-4 w-4" />
                {notifications > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {notifications}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-2">
                <span className="text-sm font-medium">AI blur flagged 3 regions</span>
                <span className="text-xs text-muted-foreground">
                  In &quot;Checkout Page&quot; — 2m ago
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-2">
                <span className="text-sm font-medium">Share link viewed 12 times</span>
                <span className="text-xs text-muted-foreground">
                  &quot;Bug Report&quot; — 1h ago
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-2">
                <span className="text-sm font-medium">Team seat added</span>
                <span className="text-xs text-muted-foreground">
                  Maya joined Workspace — 3h ago
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-accent transition-colors">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden flex-col items-start leading-tight sm:flex">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-[11px] text-muted-foreground">{user.email}</span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-1">
                  <span>{user.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
                  <Badge variant="secondary" className="mt-1 w-fit">
                    {ROLE_LABEL[user.role]}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Switch role (demo)
              </DropdownMenuLabel>
              {(["FREE", "PRO", "TEAM_OWNER", "TEAM_MEMBER", "ADMIN"] as const).map((r) => (
                <DropdownMenuItem
                  key={r}
                  onClick={() => setRole(r)}
                  className="cursor-pointer justify-between"
                >
                  {ROLE_LABEL[r]}
                  {user.role === r && <span className="text-primary">●</span>}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setView("settings")}>
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView("billing")}>
                <CreditCard className="mr-2 h-4 w-4" /> Billing & Subscription
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView("support")}>
                <LifeBuoy className="mr-2 h-4 w-4" /> Help & Support
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-border/60 bg-background lg:hidden">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-1 p-3 sm:grid-cols-4">
            {items.map((item) => {
              const Icon = item.icon;
              const active = view === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setView(item.key);
                    setMobileOpen(false);
                  }}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg p-3 text-xs font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
