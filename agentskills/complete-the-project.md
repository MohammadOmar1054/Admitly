# TASK: COMPLETE THE EXISTING "Admitly" PROJECT (do not start over)

You are working inside an existing Next.js repository: **online-admission-submission** ("Admitly", an Online Admission Management System). A previous pass scaffolded the project, but **the implementation is far from complete**. Your job is to finish it to the full spec in `agentskills/instructions.md` (read that file first; it is the source of truth for design, behavior, animations, types and acceptance criteria).

Do not ask questions. Work through everything below in order and keep going until the acceptance checklist passes.

---

## 1. WHAT IS WRONG TODAY (audit of the current repo)

1. **Files are minified into single lines.** Almost every `.ts/.tsx` file is one unreadable line (for example `src/components/ui.tsx`, `src/components/Dashboard.tsx`, `src/lib/api.ts`). This is not acceptable.
2. **Components are collapsed into a few files** (`ui.tsx`, `Dashboard.tsx`, `AuthForm.tsx`) instead of the structure in the spec.
3. **Many pages are stubs** of roughly 1 to 2 KB (`student/status`, `student/documents`, `admin/dashboard`, `admin/analytics`, `admin/applications`, `admin/applications/[id]`). They lack real UI, filtering, verification flow, charts, and animations.
4. **Missing entirely:** `src/hooks/*`, `src/lib/animations.ts`, `src/lib/validators.ts`, all of `components/landing/*`, `components/student/*`, `components/admin/*` (including the SVG charts), `components/layout/*`, and most `components/ui/*` primitives.
5. The data layer (`src/lib/api.ts`, `mock-data.ts`, contexts) exists and is broadly functional. **Keep its behavior and exported function names.** Reformat it and fix bugs, but do not rewrite it from scratch.

---

## 2. STEP 0: MAKE THE EXISTING CODE READABLE

Run this first, before changing any logic:

```bash
npm install
npm install -D prettier
npx prettier --write "src/**/*.{ts,tsx,css}" "*.{ts,mjs,json}"
npm run build
```

Add a `.prettierrc` with `{ "semi": true, "singleQuote": false, "printWidth": 90, "trailingComma": "all" }`. Commit nothing broken: the build must still pass after formatting. From now on, **no file may be written as a single long line**. Use normal multi-line, readable formatting everywhere.

Also check `package.json`: if any dependency version fails to install, pin it to the latest version that exists on npm. Do not add dependencies beyond: `framer-motion`, `lucide-react`, `clsx`, `tailwind-merge` (plus `prettier` as a dev dependency).

---

## 3. STEP 1: SPLIT THE CONSOLIDATED FILES INTO THE REAL STRUCTURE

Break up the existing bundled files, then delete the bundles and update every import.

| Existing file | Becomes |
|---|---|
| `src/components/ui.tsx` | `src/components/ui/Button.tsx`, `Card.tsx`, `Badge.tsx`, plus new `Input.tsx`, `Select.tsx`, `Textarea.tsx`, `Modal.tsx`, `Progress.tsx`, `Skeleton.tsx`, `EmptyState.tsx`, `Toast.tsx`, `Tabs.tsx` |
| `src/components/Dashboard.tsx` | `src/components/layout/DashboardShell.tsx`, `Sidebar.tsx`, `Topbar.tsx`, `PageTransition.tsx` |
| `src/components/AuthForm.tsx` | keep as a shared form, but extract `src/components/auth/AuthSplitLayout.tsx` and `DemoCredentials.tsx` |

Then create every folder and file from the structure in `agentskills/instructions.md` section 3 that does not exist yet. Component contracts (props, variants, sizes) are defined in section 9 of that file. Update `src/app/student/layout.tsx` and `src/app/admin/layout.tsx` to use `DashboardShell` and the `useAuthGuard` hook.

---

## 4. STEP 2: ADD THE MISSING FOUNDATION FILES

Create:

- `src/lib/animations.ts`: variants `fadeUp`, `fadeIn`, `scaleIn`, `staggerContainer`, `slideInLeft`, `slideInRight`, easing `[0.22, 1, 0.36, 1]`.
- `src/lib/validators.ts`: validators for email, 10-digit phone, 6-digit pincode, percentage 0 to 100, minimum age 15 from DOB, required fields. Return `Record<string, string>` error maps.
- `src/hooks/useLocalStorage.ts` (hydration-safe, reads inside `useEffect`), `src/hooks/useAuthGuard.ts` (role redirect), `src/hooks/useCountUp.ts` (animated number, triggers when in view, respects reduced motion).
- Extend `src/app/globals.css` theme: add the complete `brand` scale (50 to 900), `accent` amber, and status color tokens. Currently only `brand-50/100/500/600/700` exist.
- Add `AnalyticsSummary` fields needed by the charts (weekly submission counts, average review days). Guard `getAnalytics()` against division by zero when there are no applications.

---

## 5. STEP 3: BUILD EVERY PAGE FULLY

Implement each page to the full behavior described in section 8 of `agentskills/instructions.md`. Below is the minimum bar for each. Every page needs loading skeletons, empty states, and entrance animations.

**Public**
- `/` Landing: `Navbar`, `Hero` (gradient headline, floating status card, animated blobs), `StatsStrip` (count-up), `Features` (6 cards), `HowItWorks` (4 steps with animated connector), `FAQ` (animated accordion), `CallToAction`, `Footer`. Each in its own file under `components/landing/`.
- `/login`, `/register`: split-screen layout, inline validation, loading state, shake on error, one-click "Login as Student / Admin" demo buttons.

**Student**
- `/student/dashboard`: welcome header, `StudentSummaryCard`, three quick stats, "Next steps" checklist derived from application state, timeline preview, empty state if no application.
- `/student/apply`: 5-step animated wizard (`ApplicationWizard` + `steps/PersonalStep`, `AcademicStep`, `CourseStep`, `DocumentsStep`, `ReviewStep` + `StepIndicator`). Per-step validation, ranked course cards with seats and min percentage, auto-saved draft indicator, confirm modal, animated success screen with application ID, read-only mode once submitted.
- `/student/documents`: six `DocumentCard`s with status, rejection reason callout, drag and drop `DocumentUploader` (JPG/PNG/PDF, max 5 MB, animated progress), overall verified progress bar.
- `/student/status`: status banner, animated vertical `StatusTimeline`, admin remarks card, celebratory particle burst on accepted.

**Admin**
- `/admin/dashboard`: `StatsCards` with count-up, "Needs attention" list, recent activity feed, mini `DonutChart`.
- `/admin/applications`: `FilterBar` (search, status, course, sort, clear), `ApplicationsTable` with avatar initials, document progress, status badge, pagination (10 per page), staggered rows, mobile card layout, empty state.
- `/admin/applications/[id]`: `ApplicantProfile` with `Tabs` (Profile, Documents, History), `DocumentVerifier` (Verify / Reject with required reason modal), sticky `DecisionPanel` (Under Review, Request Documents, Accept, Reject with confirm modals). "Accept" must be disabled until all required documents are verified.
- `/admin/analytics`: hand-built SVG/CSS `BarChart`, `DonutChart`, `TrendLine` (animated, no chart library) plus summary tiles.

**Also:** `src/app/not-found.tsx`, a toast host mounted in `providers.tsx`, and mobile responsive sidebar drawer.

---

## 6. RULES (unchanged from the spec, restated)

1. TypeScript strict, no `any`, no `@ts-ignore`, prop interfaces for all components.
2. `"use client"` only where needed.
3. Use `cn()` for conditional classes; use constants from `src/lib/constants.ts` instead of magic strings.
4. Never read `localStorage` during render (avoid hydration errors).
5. Respect `prefers-reduced-motion`.
6. Responsive at 360px, 768px, 1280px+.
7. Keep `src/lib/api.ts` as the only data-access module (a Supabase swap later must only touch this file).
8. Readable, multi-line, Prettier-formatted code. Short comments only where logic is non-obvious.

---

## 7. ACCEPTANCE CHECKLIST (do not stop until all are true)

- [ ] `npx prettier --check "src/**/*.{ts,tsx,css}"` passes and no source file is a single minified line.
- [ ] `npm run lint` and `npm run build` pass with zero errors.
- [ ] Folder structure matches section 3 of `agentskills/instructions.md`; the old bundled files (`ui.tsx`, `Dashboard.tsx`) are removed.
- [ ] Demo logins work: `student@demo.com` / `student123` and `admin@demo.com` / `admin123`.
- [ ] Student can complete the full wizard, upload documents, submit, and see the timeline update.
- [ ] Student sees rejected-document reasons and can re-upload.
- [ ] Admin can search, filter, sort, paginate, verify/reject documents (reason required), and accept/reject applications; "Accept" is blocked until required documents are verified.
- [ ] Analytics charts render and animate without any chart library.
- [ ] No console errors or hydration warnings; layout works at 360, 768, 1280 widths.
- [ ] `README.md` updated: setup, demo credentials, folder overview, note that `src/lib/api.ts` is the single file to replace with Supabase.

When finished, commit with a clear message and print a short summary of what changed plus the commands to run the project.
