# INSTRUCTIONS: Build the Frontend for "Online Admission Management System"

You are an expert frontend engineer. Build a **complete, polished, production-looking frontend** for an **Online Admission Management System** in this repository. Read this entire file first, then execute it top to bottom. Do not ask questions; where something is unspecified, make a sensible decision and keep going.

**Problem statement:** Educational institutions need to simplify student applications, document submission, verification, and admission processing.

**Scope:** FRONTEND ONLY. There is no real backend. All data comes from a mock data layer persisted in `localStorage`, structured so a real backend (Supabase) can be swapped in later by editing only `src/lib/api.ts`.

---

## 1. TECH STACK (mandatory)

| Concern | Choice |
|---|---|
| Framework | **Next.js (latest stable, App Router)** |
| Language | **TypeScript** (strict mode, no `any`) |
| Styling | **Tailwind CSS** (use whatever version `create-next-app` installs) |
| Animation | **framer-motion** |
| Icons | **lucide-react** |
| Utilities | `clsx`, `tailwind-merge` |
| Fonts | `next/font/google`: **Inter** (body) and **Plus Jakarta Sans** (headings) |

No UI component libraries (no shadcn, MUI, Chakra). Build all UI primitives by hand with Tailwind.

---

## 2. SETUP COMMANDS (run these first)

If the repo is empty, scaffold into the current directory:

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

If the answers are interactive, choose: TypeScript Yes, ESLint Yes, Tailwind Yes, `src/` directory Yes, App Router Yes, Turbopack Yes, import alias `@/*`.

Then install dependencies:

```bash
npm install framer-motion lucide-react clsx tailwind-merge
npm install
```

Finally verify:

```bash
npm run build
```

The build must pass with **zero TypeScript and ESLint errors** before you finish. Then run `npm run dev` to confirm it starts.

---

## 3. PROJECT STRUCTURE (create exactly this)

```
.
├── instructions.md
├── package.json
├── tsconfig.json
├── next.config.ts
├── public/
│   └── logo.svg                      # simple graduation-cap style logo you create as SVG
└── src/
    ├── app/
    │   ├── layout.tsx                # fonts, metadata, <Providers/>, global toast host
    │   ├── globals.css               # Tailwind import + theme tokens + base styles
    │   ├── page.tsx                  # Landing page
    │   ├── not-found.tsx
    │   ├── login/
    │   │   └── page.tsx
    │   ├── register/
    │   │   └── page.tsx
    │   ├── student/
    │   │   ├── layout.tsx            # DashboardShell with student nav + auth guard
    │   │   ├── dashboard/page.tsx
    │   │   ├── apply/page.tsx        # multi-step application form
    │   │   ├── documents/page.tsx
    │   │   └── status/page.tsx       # application tracker timeline
    │   └── admin/
    │       ├── layout.tsx            # DashboardShell with admin nav + auth guard
    │       ├── dashboard/page.tsx
    │       ├── applications/
    │       │   ├── page.tsx          # table + filters
    │       │   └── [id]/page.tsx     # review a single application
    │       └── analytics/page.tsx
    ├── components/
    │   ├── providers.tsx             # wraps AuthProvider, ApplicationsProvider, ToastProvider
    │   ├── ui/
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx
    │   │   ├── Input.tsx
    │   │   ├── Select.tsx
    │   │   ├── Textarea.tsx
    │   │   ├── Badge.tsx
    │   │   ├── Modal.tsx
    │   │   ├── Progress.tsx
    │   │   ├── Skeleton.tsx
    │   │   ├── EmptyState.tsx
    │   │   ├── Toast.tsx
    │   │   └── Tabs.tsx
    │   ├── layout/
    │   │   ├── Navbar.tsx            # public top nav
    │   │   ├── Footer.tsx
    │   │   ├── DashboardShell.tsx    # sidebar + topbar + mobile drawer
    │   │   ├── Sidebar.tsx
    │   │   ├── Topbar.tsx
    │   │   └── PageTransition.tsx
    │   ├── landing/
    │   │   ├── Hero.tsx
    │   │   ├── Features.tsx
    │   │   ├── HowItWorks.tsx
    │   │   ├── StatsStrip.tsx
    │   │   ├── CallToAction.tsx
    │   │   └── FAQ.tsx
    │   ├── student/
    │   │   ├── ApplicationWizard.tsx # orchestrates steps
    │   │   ├── steps/
    │   │   │   ├── PersonalStep.tsx
    │   │   │   ├── AcademicStep.tsx
    │   │   │   ├── CourseStep.tsx
    │   │   │   ├── DocumentsStep.tsx
    │   │   │   └── ReviewStep.tsx
    │   │   ├── StepIndicator.tsx
    │   │   ├── DocumentUploader.tsx  # drag and drop zone
    │   │   ├── DocumentCard.tsx
    │   │   ├── StatusTimeline.tsx
    │   │   └── StudentSummaryCard.tsx
    │   └── admin/
    │       ├── StatsCards.tsx
    │       ├── ApplicationsTable.tsx
    │       ├── FilterBar.tsx
    │       ├── DocumentVerifier.tsx  # per-document verify / reject with reason
    │       ├── DecisionPanel.tsx     # move to under review / accept / reject
    │       ├── ApplicantProfile.tsx
    │       └── charts/
    │           ├── BarChart.tsx      # pure CSS/SVG, no chart library
    │           ├── DonutChart.tsx    # pure SVG
    │           └── TrendLine.tsx     # pure SVG
    ├── context/
    │   ├── AuthContext.tsx
    │   ├── ApplicationsContext.tsx
    │   └── ToastContext.tsx
    ├── hooks/
    │   ├── useLocalStorage.ts
    │   ├── useAuthGuard.ts
    │   └── useCountUp.ts
    ├── lib/
    │   ├── api.ts                    # ONLY file that touches data; async functions w/ fake latency
    │   ├── mock-data.ts              # seed users + ~24 seeded applications
    │   ├── constants.ts              # courses, statuses, document types, nav items
    │   ├── animations.ts             # shared framer-motion variants
    │   ├── validators.ts             # form validation helpers
    │   └── utils.ts                  # cn(), formatDate(), generateId(), etc.
    └── types/
        └── index.ts
```

Create every file listed. Do not leave placeholder or empty files.

---

## 4. DESIGN SYSTEM

**Vibe:** modern, trustworthy, institutional but fresh. Clean white surfaces, generous spacing, soft shadows, rounded corners. Not generic; give it a distinct identity.

**Theme tokens** (define in `globals.css` using the Tailwind theme mechanism of the installed version, so classes like `bg-brand-600` work):

- `brand` scale (indigo/violet): 50 `#eef2ff`, 100 `#e0e7ff`, 200 `#c7d2fe`, 300 `#a5b4fc`, 400 `#818cf8`, 500 `#6366f1`, 600 `#4f46e5`, 700 `#4338ca`, 800 `#3730a3`, 900 `#312e81`
- `accent`: amber `#f59e0b`
- Neutral surfaces: page background `#f8fafc`, cards white, borders `slate-200`
- Status colors:
  - Draft: slate
  - Submitted: blue
  - Under Review: amber
  - Accepted: emerald
  - Rejected: rose
  - Documents Pending: orange

**Typography:** headings use Plus Jakarta Sans (bold, tight tracking); body uses Inter.

**Shape:** cards `rounded-2xl`, buttons/inputs `rounded-xl`, soft shadow `shadow-sm` with `hover:shadow-md` lift on interactive cards.

**Backgrounds:** landing hero uses a layered gradient plus subtle animated floating blurred blobs (framer-motion). Dashboards use the flat light background.

**Responsive:** mobile-first. Everything must work at 360px, 768px, and 1280px+. Sidebar becomes a slide-in drawer on mobile.

**Accessibility:** semantic HTML, labels on all inputs, visible focus rings (`focus-visible:ring-2 ring-brand-500`), `aria-*` on modals/tabs, respect `prefers-reduced-motion` (use framer-motion's `useReducedMotion` in key animations).

---

## 5. ANIMATION REQUIREMENTS (framer-motion)

Put reusable variants in `src/lib/animations.ts`: `fadeUp`, `fadeIn`, `scaleIn`, `staggerContainer`, `slideInLeft`, `slideInRight`.

Apply them as follows:

1. **Page transitions:** `PageTransition.tsx` wraps dashboard page content with a fade + slight upward slide.
2. **Landing page:** hero text staggers in; hero illustration/mock card floats gently (looping y-translate); sections reveal on scroll with `whileInView` (`viewport={{ once: true, amount: 0.2 }}`).
3. **Cards and lists:** staggered entrance for stat cards, document cards and table rows.
4. **Buttons and cards:** `whileHover` and `whileTap` micro-interactions (subtle scale/lift).
5. **Multi-step wizard:** use `AnimatePresence mode="wait"` with directional slide transitions between steps (direction depends on next vs back).
6. **Modal and toast:** `AnimatePresence` with scale/fade in and out.
7. **Status timeline:** the progress line animates its fill (`scaleY`/`height`) and nodes pop in sequentially.
8. **Numbers:** stat cards count up from 0 using the `useCountUp` hook when they enter view.
9. **Charts:** bars grow from 0, donut segments draw via `strokeDashoffset`, trend line draws via `pathLength`.
10. **Sidebar mobile drawer:** slides in from the left with a dimmed backdrop.
11. **Document upload:** upload progress bar animates 0 to 100% over about 1.2s, then the card flips to a success state with a check icon pop.

Keep durations between 0.25s and 0.6s and use easing like `[0.22, 1, 0.36, 1]`. Never block interaction behind animations.

---

## 6. TYPES (`src/types/index.ts`)

```ts
export type Role = "student" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;       // mock only
  role: Role;
  avatarColor: string;    // tailwind-safe hex used for initials avatar
}

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "documents_pending"
  | "accepted"
  | "rejected";

export type DocumentType =
  | "photo"
  | "id_proof"
  | "marksheet_10"
  | "marksheet_12"
  | "transfer_certificate"
  | "category_certificate";

export type DocumentStatus = "not_uploaded" | "uploaded" | "verified" | "rejected";

export interface ApplicationDocument {
  type: DocumentType;
  status: DocumentStatus;
  fileName?: string;
  fileSize?: number;          // bytes
  uploadedAt?: string;        // ISO
  rejectionReason?: string;
}

export interface PersonalDetails {
  fullName: string;
  email: string;
  phone: string;
  dob: string;                // yyyy-mm-dd
  gender: "male" | "female" | "other";
  address: string;
  city: string;
  state: string;
  pincode: string;
  guardianName: string;
  guardianPhone: string;
}

export interface AcademicDetails {
  board10: string;
  percentage10: number;
  year10: number;
  board12: string;
  stream12: string;
  percentage12: number;
  year12: number;
  schoolName: string;
}

export interface CoursePreference {
  firstChoice: string;
  secondChoice?: string;
  thirdChoice?: string;
}

export interface TimelineEvent {
  id: string;
  label: string;              // e.g. "Application submitted"
  note?: string;
  at: string;                 // ISO
  status: ApplicationStatus;
}

export interface Application {
  id: string;                 // e.g. "ADM-2026-0001"
  userId: string;
  status: ApplicationStatus;
  personal: PersonalDetails;
  academic: AcademicDetails;
  courses: CoursePreference;
  documents: ApplicationDocument[];
  timeline: TimelineEvent[];
  adminRemarks?: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}
```

---

## 7. DATA LAYER

### `src/lib/constants.ts`
Export:
- `COURSES`: at least 8 (e.g. B.Tech Computer Science, B.Tech Electronics & Instrumentation, B.Tech Mechanical, B.Tech Civil, BBA, B.Com, B.Sc Physics, BCA) each with `name`, `code`, `seats`, `duration`, `minPercentage`.
- `STATUS_META`: map of status to `{ label, color classes, icon }`.
- `DOCUMENT_META`: map of document type to `{ label, required: boolean, accepted: "JPG, PNG, PDF", maxMB }`.
- `INDIAN_STATES`, `BOARDS` (CBSE, ICSE, State Board, Other), `STREAMS`.
- `STUDENT_NAV` and `ADMIN_NAV` arrays: `{ label, href, icon }`.

### `src/lib/mock-data.ts`
- Seed users: 
  - Student: `student@demo.com` / `student123` (name "Aarav Sharma")
  - Admin: `admin@demo.com` / `admin123` (name "Admissions Office")
- Seed **~24 applications** from varied fake Indian students with a realistic spread of statuses (about 5 submitted, 6 under review, 4 documents pending, 5 accepted, 3 rejected, 1 draft), varied courses, percentages, dates across the last 60 days, and timelines consistent with each status. The demo student's own application should be `under_review` with 4 of 6 documents verified, 1 uploaded, and 1 rejected with a reason ("Image is blurry, please re-upload a clear scan").

### `src/lib/api.ts`
Single data access module. All functions are **async with a 300 to 700ms simulated delay** and read/write `localStorage` (keys prefixed `oams_`). Seed on first load. Export:

```ts
login(email, password): Promise<User>
register(name, email, password): Promise<User>
logout(): Promise<void>
getCurrentUser(): Promise<User | null>

getApplications(): Promise<Application[]>                 // admin
getApplicationById(id): Promise<Application | null>
getApplicationByUser(userId): Promise<Application | null>
saveDraft(userId, partial: Partial<Application>): Promise<Application>
submitApplication(userId): Promise<Application>
uploadDocument(applicationId, type, file: {name:string; size:number}): Promise<Application>
verifyDocument(applicationId, type): Promise<Application>
rejectDocument(applicationId, type, reason): Promise<Application>
updateStatus(applicationId, status, remarks?): Promise<Application>   // appends to timeline
getAnalytics(): Promise<AnalyticsSummary>
resetDemoData(): Promise<void>
```

Do not read real file bytes; just store file name and size metadata. Every state change must append a `TimelineEvent`.

### Contexts
- `AuthContext`: `user`, `loading`, `login`, `register`, `logout`. Restores session on mount.
- `ApplicationsContext`: holds current student's application or admin's list, plus `refresh()` and mutation wrappers that show toasts.
- `ToastContext`: `toast.success/error/info(message)`, auto-dismiss after 3.5s.

### Route protection
`useAuthGuard(role)` redirects unauthenticated users to `/login`, and wrong-role users to their own dashboard. Show a skeleton while auth loads. Use it inside `student/layout.tsx` and `admin/layout.tsx`.

---

## 8. PAGES AND BEHAVIOR

### 8.1 Landing page (`/`)
Sections in order: `Navbar` (logo, links, "Login", "Apply Now"), `Hero`, `StatsStrip`, `Features`, `HowItWorks`, `FAQ` (animated accordion), `CallToAction`, `Footer`.

- **Hero:** headline like "Admissions, simplified." with an animated gradient word, subtext about applying, uploading, tracking in one place, two CTAs ("Start your application" goes to `/register`, "Admin login" goes to `/login`), and a floating mock "application status" card with an animated progress bar.
- **StatsStrip:** four count-up stats (e.g. 12,000+ applications, 98% verified in 48h, 40+ courses, 24/7 tracking).
- **Features:** 6 cards (Online application, Secure document upload, Real-time status, Smart verification, Admin dashboard, Instant notifications).
- **HowItWorks:** 4 numbered steps (Register, Fill application, Upload documents, Track decision) with a connecting animated line.

### 8.2 Auth pages (`/login`, `/register`)
Split-screen layout: form on one side, branded gradient panel on the other (hidden on mobile). Validation with inline errors. Login page shows a **"Demo credentials" box with two one-click buttons** ("Login as Student", "Login as Admin") that autofill and submit. Successful login routes student to `/student/dashboard` and admin to `/admin/dashboard`. Show a loading spinner on the button while pending and shake the form on error.

### 8.3 Student area

**`/student/dashboard`**
- Welcome header with the student's name.
- `StudentSummaryCard`: application ID, status badge, course applied, last updated.
- Row of 3 quick stats: Documents verified (x of 6), Profile completion %, Days since submission.
- "Next steps" checklist derived from application state (e.g. "Re-upload rejected Marksheet 12").
- Recent timeline preview (last 3 events) with a link to `/student/status`.
- If no application exists: `EmptyState` with a CTA to start applying.

**`/student/apply`** (multi-step wizard)
Steps: 1 Personal, 2 Academic, 3 Course Preference, 4 Documents, 5 Review & Submit.
- `StepIndicator` at top with animated progress (checkmarks for completed steps; clickable to revisit completed steps).
- Per-step validation (required fields, phone 10 digits, pincode 6 digits, percentages 0 to 100, DOB must make applicant at least 15 years old). Block "Next" with inline errors.
- Course step: selectable course cards showing seats, duration, and minimum percentage; warn (do not block) if the student's 12th percentage is below the minimum. Allow up to 3 ranked preferences.
- Documents step reuses `DocumentUploader`.
- Review step: read-only summary with "Edit" links jumping to each step. Terms checkbox required. "Submit Application" shows a confirm modal, then a full-screen success state with an animated checkmark and the generated application ID, and a button to `/student/status`.
- Auto-save draft to `localStorage` on every step change and show a small "Draft saved" indicator.
- If the application is already submitted, show it read-only with a notice banner.

**`/student/documents`**
Grid of the 6 `DocumentCard`s. Each shows type label, required/optional tag, status badge, file name and size, upload date, and rejection reason (in a rose callout) if rejected. Actions: Upload, Replace, Remove. Include the drag and drop `DocumentUploader` with validation (type JPG/PNG/PDF, max 5 MB) and the animated progress bar described in section 5. Top of page shows an overall progress bar "x of 6 documents verified".

**`/student/status`**
- Large status banner with an icon and a human sentence (e.g. "Your documents are being verified").
- `StatusTimeline` (vertical): every `TimelineEvent`, newest at the bottom, with the current step highlighted and pulsing, future steps greyed (Submitted, Documents Verified, Under Review, Decision).
- Admin remarks card if present.
- If accepted: a celebratory confetti-like burst (framer-motion particles, no extra library) and a "Download admission letter" button that just shows a toast "Feature coming soon".

### 8.4 Admin area

**`/admin/dashboard`**
- `StatsCards`: Total, Submitted, Under Review, Documents Pending, Accepted, Rejected with count-up and a small trend hint.
- A "Needs attention" panel: applications waiting longest (top 5) with quick "Review" buttons.
- Recent activity feed from timelines across all applications.
- Mini `DonutChart` of status distribution.

**`/admin/applications`**
- `FilterBar`: search (name, ID, email), status filter (pills or select), course filter, sort (newest, oldest, percentage high to low), and a "Clear filters" button.
- `ApplicationsTable`: columns Applicant (avatar initials + name + email), App ID, Course, 12th %, Documents (e.g. "4/6" with mini progress), Status badge, Submitted date, Action ("Review"). Rows animate in with stagger. Client-side pagination (10 per page) with animated page controls. Responsive: collapses to stacked cards on mobile.
- Empty search shows `EmptyState`.
- Bulk select checkboxes with a bulk action bar for "Mark as Under Review" (nice to have; implement if straightforward).

**`/admin/applications/[id]`**
Two-column layout on desktop:
- Left: `ApplicantProfile` (personal, academic, course preferences in tidy sections) with `Tabs` (Profile, Documents, History).
- Right: `DecisionPanel` (sticky) with current status, remarks textarea, and buttons: "Mark Under Review", "Request Documents", "Accept", "Reject". Accept/Reject open a confirm `Modal`; Reject requires a reason.
- `DocumentVerifier` in the Documents tab: for each document show a preview placeholder (file-type icon card), status, and **Verify** / **Reject** buttons. Reject opens a modal asking for a reason (required). Verifying/rejecting updates immediately with a toast and a timeline entry.
- Safeguard: "Accept" is disabled with a tooltip unless all required documents are verified.
- History tab renders the same `StatusTimeline`.

**`/admin/analytics`**
- `BarChart`: applications per course.
- `DonutChart`: status distribution with legend.
- `TrendLine`: applications submitted per week for last 8 weeks.
- Summary tiles: acceptance rate, average 12th percentage, average review time (days).
- All charts hand-built with SVG/CSS and animated per section 5. **No chart libraries.**

### 8.5 Shared layout
`DashboardShell`: left `Sidebar` (logo, nav with active highlight using an animated `layoutId` pill, user card at bottom with logout), `Topbar` (page title, notification bell with a dummy dropdown, avatar menu). Mobile: hamburger opens drawer.

---

## 9. UI COMPONENT CONTRACTS

- **Button:** variants `primary | secondary | outline | ghost | danger`; sizes `sm | md | lg`; props `loading`, `leftIcon`, `rightIcon`, `fullWidth`; built on `motion.button`.
- **Input / Select / Textarea:** props `label`, `error`, `hint`, `leftIcon`; forward refs; error state with red border and animated message.
- **Badge:** accepts a status and renders the correct color/icon from `STATUS_META`; also a generic tone variant.
- **Modal:** portal-less is fine; trap focus loosely, close on Esc and backdrop click, animated.
- **Tabs:** accessible `role="tablist"`, animated underline using `layoutId`.
- **Progress:** animated width bar with optional label.
- **Skeleton:** shimmer loading block used for all async loading states.
- **Toast:** stacked bottom-right (top on mobile), icon by type, auto dismiss.

Every async screen must show **loading skeletons**, an **empty state**, and an **error state** where relevant.

---

## 10. CODING RULES

1. TypeScript strict; no `any`, no `@ts-ignore`. Define prop interfaces for every component.
2. Add `"use client"` only where hooks, context, or framer-motion are used. Keep `layout.tsx` and static wrappers as server components where possible.
3. Use the `cn()` helper (`clsx` + `tailwind-merge`) for all conditional classes.
4. Use `next/link` and `next/navigation` (`useRouter`, `usePathname`, `useParams`); use `next/image` for images where applicable.
5. Keep components small and single-purpose; extract repeated markup.
6. No inline magic strings for statuses, courses, or documents. Use `constants.ts`.
7. No hard-coded colors outside the theme tokens, except the avatar color field and SVG fills.
8. Do not add any dependency beyond those listed in section 1.
9. Avoid hydration errors: never read `localStorage` during render; read inside `useEffect` or via the `useLocalStorage` hook after mount.
10. Include meaningful `metadata` (title, description) in `layout.tsx` and per-page where easy.
11. Clean, readable code with short comments only where logic is non-obvious.

---

## 11. BUILD ORDER

1. Run setup commands (section 2) and install dependencies.
2. Create `types`, `lib/constants`, `lib/utils`, `lib/animations`, `lib/mock-data`, `lib/api`.
3. Create contexts, hooks, and `providers.tsx`; wire into `app/layout.tsx` with fonts and `globals.css` theme.
4. Build all `components/ui` primitives.
5. Build layout components (`Navbar`, `Footer`, `DashboardShell`, `Sidebar`, `Topbar`, `PageTransition`).
6. Build landing page and its sections.
7. Build `/login` and `/register`.
8. Build the student area (wizard, documents, status, dashboard).
9. Build the admin area (dashboard, applications list, review page, analytics + charts).
10. Add `not-found.tsx`, polish animations, check responsiveness at 360, 768, and 1280 widths.
11. Run `npm run lint` and `npm run build`; fix every error and warning.

---

## 12. ACCEPTANCE CHECKLIST (verify before finishing)

- [ ] `npm install`, `npm run dev`, and `npm run build` all succeed with no errors.
- [ ] Folder structure matches section 3.
- [ ] Landing page looks polished and animates on load and scroll.
- [ ] One-click demo login works for both student and admin.
- [ ] Student can complete all 5 wizard steps with validation, upload documents, submit, and see the timeline update.
- [ ] Student can see rejected document reasons and re-upload.
- [ ] Admin can search, filter, sort, and paginate applications.
- [ ] Admin can verify or reject each document (reason required) and accept/reject an application; the student sees the change after re-login or refresh.
- [ ] "Accept" is blocked until required documents are verified.
- [ ] Analytics charts render and animate without any chart library.
- [ ] Layout is fully responsive; sidebar drawer works on mobile.
- [ ] Route guards redirect correctly by role.
- [ ] No console errors or hydration warnings.
- [ ] A `README.md` exists with setup steps, demo credentials, folder overview, and a note that `src/lib/api.ts` is the single place to replace with Supabase later.

When done, print a short summary of what was built, the demo credentials, and the commands to run the project.
