"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ViewKey =
  | "landing"
  | "editor"
  | "dashboard"
  | "pricing"
  | "settings"
  | "admin"
  | "sharedlinks"
  | "teams"
  | "onboarding"
  | "login"
  | "billing"
  | "support"
  | "folders"
  | "export"
  | "teammember";

export type CaptureMode = "full-page" | "visible" | "selected";

export interface ScreenshotMeta {
  id: string;
  title: string;
  dataUrl: string;
  captureType: "full-page" | "visible" | "selected";
  width: number;
  height: number;
  sizeBytes: number;
  aiBlurApplied: boolean;
  starred: boolean;
  tags: string[];
  folderId: string | null;
  createdAt: number;
}

export interface FolderMeta {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

interface SnapMarkState {
  view: ViewKey;
  setView: (v: ViewKey) => void;

  // current user (mock — no real auth)
  user: {
    name: string;
    email: string;
    role: "FREE" | "PRO" | "TEAM_OWNER" | "TEAM_MEMBER" | "ADMIN";
    avatarColor: string;
    teamRole?: "EDITOR" | "VIEWER";
  };
  setRole: (r: SnapMarkState["user"]["role"]) => void;
  setTeamRole: (r: "EDITOR" | "VIEWER") => void;

  // onboarding
  onboardingComplete: boolean;
  completeOnboarding: () => void;

  // capture mode selector modal
  captureModalOpen: boolean;
  setCaptureModalOpen: (open: boolean) => void;
  triggerCapture: (mode: CaptureMode) => void;

  // editor payload
  editingScreenshot: ScreenshotMeta | null;
  startEditorWith: (s: ScreenshotMeta | null) => void;

  // multi-select for export/PDF compile
  selectedForExport: string[];
  toggleExportSelect: (id: string) => void;
  clearExportSelect: () => void;

  // local gallery (kept in sync with DB via API)
  screenshots: ScreenshotMeta[];
  setScreenshots: (s: ScreenshotMeta[]) => void;
  upsertScreenshot: (s: ScreenshotMeta) => void;
  removeScreenshot: (id: string) => void;

  folders: FolderMeta[];
  setFolders: (f: FolderMeta[]) => void;
  addFolder: (f: FolderMeta) => void;
  removeFolder: (id: string) => void;

  // settings (persisted)
  settings: {
    defaultCaptureMode: "full-page" | "visible" | "selected";
    aiAutoBlur: boolean;
    defaultColor: string;
    defaultStrokeWidth: number;
    hotkeyCapture: string;
    preferJpg: boolean;
    watermarkShared: boolean;
    theme: "light" | "dark";
  };
  updateSettings: (s: Partial<SnapMarkState["settings"]>) => void;
  toggleTheme: () => void;

  // toasts count for badge
  notifications: number;
  setNotifications: (n: number) => void;
}

export const useSnap = create<SnapMarkState>()(
  persist(
    (set) => ({
      view: "landing",
      setView: (v) => set({ view: v }),

      user: {
        name: "Alex Rivera",
        email: "alex@snapmark.io",
        role: "PRO",
        avatarColor: "emerald",
        teamRole: "EDITOR",
      },
      setRole: (r) =>
        set((s) => ({ user: { ...s.user, role: r } })),
      setTeamRole: (r) =>
        set((s) => ({ user: { ...s.user, teamRole: r } })),

      onboardingComplete: false,
      completeOnboarding: () => set({ onboardingComplete: true }),

      captureModalOpen: false,
      setCaptureModalOpen: (open) => set({ captureModalOpen: open }),
      triggerCapture: (mode) =>
        set((s) => ({
          captureModalOpen: false,
          view: "editor",
          editingScreenshot: s.editingScreenshot,
          settings: { ...s.settings, defaultCaptureMode: mode },
        })),

      editingScreenshot: null,
      startEditorWith: (screenshot) =>
        set({ editingScreenshot: screenshot, view: "editor" }),

      selectedForExport: [],
      toggleExportSelect: (id) =>
        set((st) => ({
          selectedForExport: st.selectedForExport.includes(id)
            ? st.selectedForExport.filter((x) => x !== id)
            : [...st.selectedForExport, id],
        })),
      clearExportSelect: () => set({ selectedForExport: [] }),

      screenshots: [],
      setScreenshots: (s) => set({ screenshots: s }),
      upsertScreenshot: (s) =>
        set((st) => {
          const idx = st.screenshots.findIndex((x) => x.id === s.id);
          if (idx >= 0) {
            const copy = [...st.screenshots];
            copy[idx] = s;
            return { screenshots: copy };
          }
          return { screenshots: [s, ...st.screenshots] };
        }),
      removeScreenshot: (id) =>
        set((st) => ({
          screenshots: st.screenshots.filter((x) => x.id !== id),
        })),

      folders: [],
      setFolders: (f) => set({ folders: f }),
      addFolder: (f) => set((st) => ({ folders: [...st.folders, f] })),
      removeFolder: (id) =>
        set((st) => ({ folders: st.folders.filter((x) => x.id !== id) })),

      settings: {
        defaultCaptureMode: "visible",
        aiAutoBlur: true,
        defaultColor: "#10b981",
        defaultStrokeWidth: 4,
        hotkeyCapture: "Ctrl+Shift+S",
        preferJpg: false,
        watermarkShared: true,
        theme: "light",
      },
      updateSettings: (s) =>
        set((st) => ({ settings: { ...st.settings, ...s } })),
      toggleTheme: () =>
        set((st) => ({
          settings: {
            ...st.settings,
            theme: st.settings.theme === "light" ? "dark" : "light",
          },
        })),

      notifications: 3,
      setNotifications: (n) => set({ notifications: n }),
    }),
    { name: "snapmark-store" }
  )
);
