"use client";

import { useSnap } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Github, Twitter, Heart, Mail, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Footer() {
  const setView = useSnap((s) => s.setView);
  const [email, setEmail] = useState("");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    toast.success("Subscribed!", { description: "You'll get product updates weekly. No spam." });
    setEmail("");
  };

  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Top: newsletter */}
        <div className="mb-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Get product updates</h3>
              <p className="text-sm text-muted-foreground">Weekly changelog + tips. No spam, unsubscribe anytime.</p>
            </div>
          </div>
          <form onSubmit={subscribe} className="flex w-full max-w-md items-center gap-2 sm:w-auto">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-10 flex-1 sm:w-64"
            />
            <Button type="submit" className="gap-1.5">
              Subscribe <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>

        {/* Middle: links grid */}
        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-2">
            <button onClick={() => setView("landing")} className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
                <Camera className="h-4 w-4" />
              </div>
              <span className="text-base font-bold">SnapMark</span>
            </button>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              The screenshot tool that respects privacy. Capture, annotate with
              AI-powered auto-blur, and share in one click — built for developers,
              QA, designers, and support teams.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <a href="#" aria-label="GitHub" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:bg-accent hover:text-foreground hover:border-primary/40">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Twitter" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:bg-accent hover:text-foreground hover:border-primary/40">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Email" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:bg-accent hover:text-foreground hover:border-primary/40">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => setView("editor")} className="transition-colors hover:text-foreground">Editor</button></li>
              <li><button onClick={() => setView("dashboard")} className="transition-colors hover:text-foreground">Dashboard</button></li>
              <li><button onClick={() => setView("pricing")} className="transition-colors hover:text-foreground">Pricing</button></li>
              <li><button onClick={() => setView("export")} className="transition-colors hover:text-foreground">Export & PDF</button></li>
              <li><button onClick={() => setView("settings")} className="transition-colors hover:text-foreground">Settings</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Resources</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => setView("support")} className="transition-colors hover:text-foreground">Help Center</button></li>
              <li><a href="#" className="transition-colors hover:text-foreground">Documentation</a></li>
              <li><a href="#" className="transition-colors hover:text-foreground">Privacy Policy</a></li>
              <li><a href="#" className="transition-colors hover:text-foreground">Terms of Service</a></li>
              <li><a href="#" className="transition-colors hover:text-foreground">Chrome Web Store</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="transition-colors hover:text-foreground">About</a></li>
              <li><a href="#" className="transition-colors hover:text-foreground">Blog</a></li>
              <li><a href="#" className="transition-colors hover:text-foreground">Careers</a></li>
              <li><a href="#" className="transition-colors hover:text-foreground">Contact</a></li>
              <li><button onClick={() => setView("billing")} className="transition-colors hover:text-foreground">Billing</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} SnapMark. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 items-center justify-center">
                <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              All systems operational
            </span>
            <p className="flex items-center gap-1.5">
              Built with <Heart className="h-3 w-3 fill-red-500 text-red-500" /> for makers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
