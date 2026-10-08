# Admitly — Online Admission Management System

Frontend-only Next.js application backed by a localStorage mock API.

Run `npm install`, then `npm run dev`. Validate production with `npm run build`.

Demo accounts: Student `student@demo.com` / `student123`; Admin `admin@demo.com` / `admin123`.

The UI is split across public, student, admin, shared components, contexts, and `src/lib`. Replace only `src/lib/api.ts` to swap the mock layer for Supabase.
