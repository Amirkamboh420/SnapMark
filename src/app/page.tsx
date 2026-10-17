"use client";

import { useSnap } from "@/lib/store";
import { Navbar } from "@/components/snap/navbar";
import { Footer } from "@/components/snap/footer";
import { Landing } from "@/components/snap/landing";
import { Editor } from "@/components/snap/editor";
import { Dashboard } from "@/components/snap/dashboard";
import { Pricing } from "@/components/snap/pricing";
import { Settings } from "@/components/snap/settings";
import { Admin } from "@/components/snap/admin";
import { SharedLinks } from "@/components/snap/shared-links";
import { Teams } from "@/components/snap/teams";
import { Onboarding } from "@/components/snap/onboarding";
import { Login } from "@/components/snap/login";
import { Billing } from "@/components/snap/billing";
import { Support } from "@/components/snap/support";
import { Folders } from "@/components/snap/folders";
import { ExportOptions } from "@/components/snap/export-options";
import { TeamMember } from "@/components/snap/team-member";
import { CaptureModal } from "@/components/snap/capture-modal";

export default function Page() {
  const view = useSnap((s) => s.view);

  // Full-screen views (no footer)
  const fullScreen = view === "editor" || view === "login" || view === "onboarding";

  return (
    <div className="flex min-h-screen flex-col">
      {view !== "login" && <Navbar />}
      <main className="flex-1">
        {view === "landing" && <Landing />}
        {view === "editor" && <Editor />}
        {view === "dashboard" && <Dashboard />}
        {view === "pricing" && <Pricing />}
        {view === "settings" && <Settings />}
        {view === "admin" && <Admin />}
        {view === "sharedlinks" && <SharedLinks />}
        {view === "teams" && <Teams />}
        {view === "onboarding" && <Onboarding />}
        {view === "login" && <Login />}
        {view === "billing" && <Billing />}
        {view === "support" && <Support />}
        {view === "folders" && <Folders />}
        {view === "export" && <ExportOptions />}
        {view === "teammember" && <TeamMember />}
      </main>
      {!fullScreen && <Footer />}
      <CaptureModal />
    </div>
  );
}
