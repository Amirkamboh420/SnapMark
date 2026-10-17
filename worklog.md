# SnapMark — Project Worklog

## Project Overview
SnapMark is a web-based screenshot annotation tool with AI auto-blur for sensitive info (emails, phones, credit cards, CNIC IDs). Built as a single-route Next.js 16 app (state-based view switching) showcasing the companion web dashboard + a fully functional browser-based annotation editor.

---

Task ID: 1-13
Agent: Main (Z.ai Code)
Task: Build complete SnapMark web application — landing, editor, dashboard, pricing, settings, admin, shared links, teams + APIs + AI auto-blur.

Work Log:
- Set up Prisma schema (User, Screenshot, Folder, SharedLink, Team, TeamMember, Subscription, SupportTicket, AIBlurLog) and pushed to SQLite.
- Built AI auto-blur detection library (`src/lib/ai-blur.ts`) with regex patterns for email, phone (US/intl/PK), credit card (Luhn-validated), and CNIC; plus `PATTERN_INFO` metadata.
- Built Zustand store (`src/lib/store.ts`) with persisted settings, role switching (FREE/PRO/TEAM_OWNER/ADMIN), screenshots/folders state, theme toggle.
- Designed custom brand theme (emerald/teal primary, amber/violet accents — avoids indigo/blue) in `globals.css` with grid-bg, gradient-text, glass, scan-line, checker-bg animations.
- Created 4 SVG-based demo screenshots (support dashboard, checkout page, code editor bug report, analytics dashboard) each containing realistic sensitive data, plus a `sensitive-regions.ts` map of normalized coordinates for AI blur to detect.
- Built Navbar with role-aware nav, theme toggle, notifications, user menu (role switcher); mobile responsive collapsible menu.
- Built sticky Footer (mt-auto on flex-col min-h-screen layout).
- Built Landing page: animated hero with mock editor + floating badges, stats bar, 6 feature cards, AI auto-blur spotlight (before/after comparison), 8-tool demo grid, demo gallery (click-to-open in editor), competitors comparison, use cases, CTA.
- Built Annotation Editor (centerpiece): HTML5 canvas with 8 tools (select/move, freehand, rect, arrow, text, numbered markers, highlight, blur), color picker + custom hex, stroke width slider, undo/redo history, keyboard shortcuts (V/P/R/A/T/N/H/B, Ctrl+Z/Y), AI auto-blur with scanning animation → detection boxes per pattern type → per-region toggle → "Blur all" + "Apply" to bake blurs into canvas, export PNG/JPG, copy to clipboard, save to gallery, share link generation, upload custom image, demo screenshot switcher, properties panel for selected annotation.
- Built Dashboard: stat cards (total/AI-blurred/starred/this-week), folder sidebar with create/delete, storage usage gauge (plan-aware), search + tabs (all/starred/AI-blurred), screenshot grid with hover actions (edit/star/download/share/delete).
- Built Pricing: 3 plans (Free/Pro/Team) with monthly/yearly toggle (-20%), feature comparison table, FAQ, payment methods (Stripe/JazzCash/EasyPaisa), role switching on plan pick.
- Built Settings: capture defaults (mode radio + hotkey), AI auto-blur preferences (per-pattern toggles, manual review), annotation defaults (color + stroke), export format, cloud sync (plan-gated), data privacy (export/delete).
- Built Shared Links: stats, create new link, list with view counts / expiry / password / watermark toggles (plan-gated), copy / revoke.
- Built Teams: member roster with owner/editor/viewer roles, invite flow, role change, remove, activity feed, team-wide branding (owner only).
- Built Admin (role-gated): KPI cards, tabs for Users (search/suspend), Support tickets (resolve), AI Monitor (detection log with correct/false-positive/false-negative badges + retrain flagging), Broadcast (announcement composer).
- Built API routes: screenshots CRUD, folders, share-links, ai-blur (text scan + DB logging), admin/stats.
- Fixed `FolderShared` invalid lucide-react import (→ `FolderOpen`).
- Resolved editor `render` hoisting/lint issue with renderRef pattern + eslint-disable comments (0 errors, 4 acceptable warnings).
- Verified with agent-browser: landing renders, editor loads, AI auto-blur scans → detects 12 regions → blur all → apply bakes 12 blur layers, role switch to ADMIN unlocks admin panel, dark mode toggle works, mobile (390px) responsive, footer sticks to bottom of page (diff ~0).

Stage Summary:
- Single-route app at `/` with 8 views switched via Zustand (landing, editor, dashboard, sharedlinks, teams, pricing, settings, admin).
- Production-ready UI: emerald brand, dark mode, sticky footer, responsive, toasts, loading states, empty states.
- AI auto-blur is fully functional in-browser: scans demo screenshots via predefined sensitive-region coordinates, shows per-pattern detection boxes (email/phone/card/CNIC), lets users toggle/apply blurs, then bakes them into the canvas for export.
- Editor supports drawing arrows/rects/text/freehand/highlight/numbered markers/blur, undo/redo, color+stroke, keyboard shortcuts, PNG/JPG export, clipboard copy, save-to-gallery, share-link.
- Lint: 0 errors, 4 warnings (unused eslint-disable directives — acceptable, they suppress the render-hoisting rule).
- Dev server running clean on port 3000.

Unresolved issues / risks:
- AI blur for uploaded (non-demo) images currently relies on predefined regions; real OCR (Tesseract.js) is a Phase 3 enhancement. The manual Blur tool (B) is always available as backup per the roadmap risk mitigation.
- API routes are wired to Prisma but the frontend uses local Zustand state for the demo (seeded in-memory). A future phase can connect the dashboard/gallery to the real API endpoints.
- Share link generation is simulated (no actual file upload to S3/R2) — matches the demo scope.
- Next steps (Phase 3+): wire dashboard to real API + DB, add Tesseract.js OCR for uploaded images, implement actual Stripe/JazzCash/EasyPaisa checkout, build the Chrome extension capture logic.

---
Task ID: 14-22
Agent: Main (Z.ai Code) — Phase 2 expansion
Task: Add all missing pages + role-based panels from the SnapMark roadmap.

Work Log:
- Added 7 new views to the Zustand store + page router: onboarding, login, billing, support, folders, export, teammember + capture modal.
- Extended the store with: onboardingComplete, captureModalOpen/triggerCapture, selectedForExport multi-select, user.teamRole (EDITOR/VIEWER), setTeamRole.
- Built Onboarding flow (6 steps: welcome → capture modes → annotation toolkit → AI blur → share/export → ready) with progress bar, step dots, skip intro, plan preferences capture, capture-modal trigger from inside the flow.
- Built Login/Signup page: social auth (Google/GitHub), email+password with show/hide, forgot password, demo auth that drops user onto Dashboard with FREE role; left-side marketing panel with privacy-first messaging.
- Built Billing/Subscription page: current plan card with renewal date + YTD spend, monthly/yearly toggle, 3-plan switcher, payment methods (VISA/MC) with primary toggle, local payment methods (JazzCash/EasyPaisa) for PK users, invoice history table with download, cancel-subscription danger zone.
- Built Support/Help center: 3 quick-help cards (Docs/Community/Email), FAQ with category filter + search + accordion, My Tickets tab showing user's open/resolved tickets, Contact form (subject/category/priority/message) with category-specific guidance for AI blur issues, keyboard shortcuts cheat-sheet.
- Built Capture Mode Selector modal: 3 modes (Visible area / Full page / Selected region) with shortcuts, default-mode highlight, AI auto-blur status reminder, hotkey hint, integrates with triggerCapture store action that routes to editor.
- Built Export Options page: multi-screenshot selection grid with numbered compile order, drag-reorder, format picker (PDF/PNG/JPG — PDF is Pro-gated), page size + orientation for PDF, quality slider for images, AI-blur-first + watermark + metadata + timestamps toggles, compile-and-export with loading state.
- Built Folder/Tag Manager: folder cards with 8-color palette, create/rename/delete, search, "Unsorted" default, tag cloud with counts (click to filter dashboard), starred-screenshots quick-access rail.
- Built Team Member panel (Editor/Viewer): role toggle, permission matrix cards (Capture/Annotate/Upload/View — Viewer shows "Not allowed" with lock icon), Shared Library grid with author avatars + view counts, My Captures tab (Editor only), Activity feed, Team roster; Viewer role correctly disables editing/upload and hides the New Screenshot button.
- Updated Navbar: added Folders, Export, Billing, Support nav items; role-aware Teams/My Team (TEAM_MEMBER sees "My Team" instead of "Teams"); added prominent Capture button + Tour (onboarding) + Login icon button in the right action rail.
- Added TEAM_MEMBER to the role switcher dropdown so all 5 roles (FREE/PRO/TEAM_OWNER/TEAM_MEMBER/ADMIN) are now switchable.
- Fixed React "Cannot update component while rendering" warning in Dashboard by moving the demo-screenshot seeding from useMemo to useEffect.
- Wired all 7 new views into page.tsx + CaptureModal (always mounted).
- Verified with agent-browser: capture modal opens from navbar → mode selection → routes to editor; onboarding 6-step flow navigates correctly; login Google button → Dashboard; billing shows Pro plan + invoices + payment methods; support FAQ accordion + ticket form; folders grid + tag cloud; export multi-select + compile order; TEAM_MEMBER role shows "My Team" with Editor→Viewer permission changes; mobile (390px) sticky footer confirmed (diff=0).
- Lint: 0 errors, 4 warnings (pre-existing unused eslint-disable directives).

Stage Summary:
- App now has 15 views: landing, editor, dashboard, folders, sharedlinks, export, teams, teammember, billing, pricing, support, settings, admin, onboarding, login.
- All 5 roles have appropriate panels: FREE (basic), PRO (full individual), TEAM_OWNER (team management), TEAM_MEMBER (Editor/Viewer workspace), ADMIN (system admin).
- Role-gated features enforced in UI: PDF export (Pro+), AI auto-blur bake (Pro+), no-watermark (Pro+), cloud sync (Pro+), team workspace (Team+), admin panel (Admin only).
- Capture modal is the universal entry point — accessible from navbar + onboarding, with default-mode awareness.
- Multi-screenshot PDF compile workflow fully designed (selection → reorder → options → export).
- All new pages responsive + dark-mode aware + sticky footer verified.

Unresolved issues / risks:
- Real auth (NextAuth) not wired — login is demo-only.
- Real payment processing (Stripe/JazzCash/EasyPaisa) not wired — billing actions are simulated.
- Support ticket submission stores in local toast only — would persist to DB via /api/support-tickets (route stubbed in schema).
- Team member roster is hardcoded demo data — would come from /api/teams.
- Next phase recommendations: wire support tickets to DB, add Tesseract.js OCR for AI blur on uploaded images, implement real NextAuth, connect share-link generation to actual file upload.

---
Task ID: 23-35
Agent: Main (Z.ai Code) — UI Polish Phase
Task: Improve UI across all pages + make the project feel complete and polished.

Work Log:
- Added 15+ new CSS utilities/animations to globals.css: fade-in-up, fade-in, scale-in, slide-in-right, stagger-1..8 delays, glow-primary/amber/violet, shimmer-border (animated gradient border), dots-bg, mesh-bg (4-color gradient mesh), card-lift hover, marquee, pop-in, spin-slow, noise-overlay, refined focus-visible ring, smooth scroll, tabular-nums.
- Polished Landing hero: added staggered fade-in-up animations to badge, h1, p, buttons; added "Trusted by" logo strip below stats; refined stats bar with tabular-nums + backdrop-blur + staggered animations.
- Polished Landing FEATURES: added card-lift class + animate-fade-in-up stagger; icon now scales on hover and flips to primary bg.
- Added new "How it works" section: 4-step timeline (Capture → Annotate → AI Blur → Share) with numbered badges, connector line, staggered animations.
- Added new "Testimonials" section: 3 testimonial cards with 5-star ratings, avatars with colored initials, quote attribution, plus overall 4.8/5 rating header from 2,140+ reviews.
- Added new "Changelog / What's new" section: vertical timeline with 4 dated entries (AI Auto-Blur v2, PDF Compile, Team Workspace, Editor Performance), alternating left/right layout, animated ping dots, colored category badges.
- Refined USE CASES cards: card-lift + group hover with icon scale + staggered fade-in.
- Polished Navbar: added active indicator underline (primary-foreground bar), icon scale on active/hover, refined spacing (gap-0.5), shadow on active.
- Polished Footer: complete rewrite with newsletter signup form (email input + subscribe button with toast), 5-column layout (brand+social / Product / Resources / Company), "All systems operational" status indicator with animated ping, refined link hover states.
- Polished Dashboard: stat cards now use card-lift + animate-fade-in-up stagger; screenshot grid cards use card-lift + hover:border-primary/40 + staggered fade-in.
- Polished Pricing: popular plan now has glow-primary + shimmer-border (animated gradient) + scale-1.04; all plans animate-fade-in-up with stagger.
- Verified with agent-browser: landing renders all 7 new sections (hero, features, AI spotlight, tools, gallery, competitors, use cases, HOW IT WORKS, TESTIMONIALS, CHANGELOG, CTA); dashboard stats + grid animate in; pricing popular plan glows; footer newsletter form submits with toast; dark mode toggles cleanly; mobile (390px) responsive with sticky footer (diff ~0); no console errors.
- Lint: 0 errors, 4 pre-existing warnings.

Stage Summary:
- Landing page now has 11 distinct sections (up from 8): hero, stats+trusted-by, features, AI spotlight, tools, demo gallery, competitors, use cases, HOW IT WORKS, TESTIMONIALS, CHANGELOG, CTA.
- Whole app uses consistent animation system (fade-in-up + stagger) for premium feel.
- Glow effects + shimmer-border on key CTAs and the popular pricing plan.
- Footer is now a proper conversion surface with newsletter capture.
- Navbar has clear active-state affordance with underline indicator.
- All polish is dark-mode aware (mesh-bg, glow, shimmer all adapt).
- Mobile + desktop verified, sticky footer intact, 0 runtime errors.

Unresolved issues / risks:
- Some stagger animations may feel subtle on lower-end devices; could add prefers-reduced-motion guard in a future pass.
- Testimonials/changelog are static demo content — would wire to CMS/API in production.
- Newsletter form is demo-only (toast confirmation) — would integrate with email provider (Resend/SendGrid) in production.
