"use client";

import { useSnap } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import {
  Camera,
  Keyboard,
  Sparkles,
  Palette,
  Shield,
  Bell,
  Download,
  Cloud,
  Trash2,
  Save,
  CreditCard,
} from "lucide-react";

export function Settings() {
  const { settings, updateSettings, user, setView } = useSnap();

  const save = (msg = "Settings saved") => toast.success(msg);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Customize capture, AI blur, appearance and privacy.</p>
      </div>

      <div className="space-y-5">
        {/* Capture */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Camera className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-semibold">Capture defaults</h2>
                <p className="text-xs text-muted-foreground">Default behavior when you trigger a screenshot.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="mb-2 block text-sm">Default capture mode</Label>
                <RadioGroup
                  value={settings.defaultCaptureMode}
                  onValueChange={(v) => updateSettings({ defaultCaptureMode: v as any })}
                  className="grid grid-cols-1 gap-2"
                >
                  {[
                    { v: "visible", l: "Visible area", d: "Capture current viewport" },
                    { v: "full-page", l: "Full page", d: "Stitch entire scrollable page" },
                    { v: "selected", l: "Selected region", d: "Drag to select an area" },
                  ].map((o) => (
                    <label key={o.v} className="flex cursor-pointer items-start gap-2 rounded-lg border border-border p-3 hover:bg-accent">
                      <RadioGroupItem value={o.v} className="mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">{o.l}</div>
                        <div className="text-xs text-muted-foreground">{o.d}</div>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <Label className="mb-2 block text-sm">Hotkey</Label>
                <Input
                  value={settings.hotkeyCapture}
                  onChange={(e) => updateSettings({ hotkeyCapture: e.target.value })}
                  className="font-mono"
                />
                <p className="mt-1.5 text-xs text-muted-foreground">Keyboard shortcut to trigger capture (configurable in the extension).</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Blur */}
        <Card className="border-violet-400/30">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15 text-violet-600">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-semibold">AI Auto-Blur</h2>
                  <p className="text-xs text-muted-foreground">Automatically detect & blur sensitive info before sharing.</p>
                </div>
              </div>
              <Switch
                checked={settings.aiAutoBlur}
                onCheckedChange={(v) => updateSettings({ aiAutoBlur: v })}
              />
            </div>
            {settings.aiAutoBlur && (
              <div className="space-y-3 rounded-lg bg-violet-500/5 p-4">
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    { p: "email", l: "Email addresses", icon: "📧" },
                    { p: "phone", l: "Phone numbers", icon: "📱" },
                    { p: "card", l: "Credit cards (Luhn)", icon: "💳" },
                    { p: "cnic", l: "CNIC / ID numbers", icon: "🆔" },
                  ].map((x) => (
                    <div key={x.p} className="flex items-center justify-between rounded-md border border-border bg-card p-2.5">
                      <div className="flex items-center gap-2">
                        <span>{x.icon}</span>
                        <span className="text-sm">{x.l}</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between rounded-md border border-border bg-card p-2.5">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-violet-600" />
                    <span className="text-sm">Require manual review before applying</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                {user.role === "FREE" && (
                  <div className="flex items-center gap-2 rounded-md border border-amber-400/40 bg-amber-400/10 p-2.5 text-xs text-amber-700 dark:text-amber-400">
                    <Sparkles className="h-3.5 w-3.5" /> AI auto-blur is a Pro feature. You can preview, but not bake blurs.
                    <Button size="sm" variant="outline" className="ml-auto h-7" onClick={() => setView("pricing")}>Upgrade</Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Annotation defaults */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Palette className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-semibold">Annotation defaults</h2>
                <p className="text-xs text-muted-foreground">Default colors and sizes for new annotations.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="mb-2 block text-sm">Default color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.defaultColor}
                    onChange={(e) => updateSettings({ defaultColor: e.target.value })}
                    className="h-9 w-14 cursor-pointer rounded border border-border bg-transparent"
                  />
                  <Input value={settings.defaultColor} onChange={(e) => updateSettings({ defaultColor: e.target.value })} className="font-mono" />
                </div>
              </div>
              <div>
                <Label className="mb-2 block text-sm">Default stroke width: <span className="font-mono text-primary">{settings.defaultStrokeWidth}px</span></Label>
                <Slider
                  value={[settings.defaultStrokeWidth]}
                  onValueChange={(v) => updateSettings({ defaultStrokeWidth: v[0] })}
                  min={1}
                  max={12}
                  step={1}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Download className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-semibold">Export</h2>
                <p className="text-xs text-muted-foreground">Default format & quality.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="mb-2 block text-sm">Default format</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["png", "jpg"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => updateSettings({ preferJpg: f === "jpg" })}
                      className={`rounded-md border px-3 py-2 text-sm font-medium uppercase transition-colors ${settings.preferJpg === (f === "jpg") ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="mb-2 block text-sm">Watermark shared links</Label>
                <div className="flex items-center justify-between rounded-md border border-border p-3">
                  <span className="text-sm">Show SnapMark badge on shared screenshots</span>
                  <Switch
                    checked={settings.watermarkShared}
                    onCheckedChange={(v) => updateSettings({ watermarkShared: v })}
                  />
                </div>
                {user.role === "PRO" || user.role === "TEAM_OWNER" ? (
                  <p className="mt-1.5 text-xs text-muted-foreground">Pro & Team: turn off to share without branding.</p>
                ) : (
                  <p className="mt-1.5 text-xs text-muted-foreground">Free plan: watermark is always on. Upgrade to remove.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cloud sync */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Cloud className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-semibold">Cloud sync</h2>
                <p className="text-xs text-muted-foreground">Sync your gallery across devices.</p>
              </div>
            </div>
            {user.role === "FREE" ? (
              <div className="flex items-center gap-3 rounded-lg border border-amber-400/40 bg-amber-400/10 p-4">
                <Cloud className="h-5 w-5 text-amber-600" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Cloud sync is a Pro feature</div>
                  <div className="text-xs text-muted-foreground">Free plan keeps screenshots local-only for privacy.</div>
                </div>
                <Button size="sm" onClick={() => setView("pricing")}>Upgrade</Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md border border-border p-3">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4 text-primary" />
                    <span className="text-sm">Sync screenshots across devices</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-md border border-border p-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-sm">End-to-end encryption</span>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data & privacy */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-semibold">Data & privacy</h2>
                <p className="text-xs text-muted-foreground">Your data, your control.</p>
              </div>
            </div>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => toast.success("Export started — you'll get an email (demo)")}>
                <Download className="h-4 w-4" /> Export all my data
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 text-destructive hover:bg-destructive/5" onClick={() => toast.error("Are you sure? This can't be undone (demo)")}>
                <Trash2 className="h-4 w-4" /> Delete account & all data
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={() => save()}>Cancel</Button>
          <Button className="gap-2" onClick={() => save("All settings saved")}>
            <Save className="h-4 w-4" /> Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}
