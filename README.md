# Admitly — Online Admission Management System

Admitly is a frontend-only Next.js application for student admissions. It uses a localStorage-backed mock API, with separate student and admissions workspaces.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Validate a production build with `npm run build` and run linting with `npm run lint`.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Student | `student@demo.com` | `student123` |
| Admin | `admin@demo.com` | `admin123` |

The login screen includes one-click buttons for both demo accounts.

## Project structure

- `src/app`: public, authentication, student, and admin routes.
- `src/components/landing`: public site sections.
- `src/components/auth`: shared authentication layout and form pieces.
- `src/components/student` and `src/components/admin`: role-specific UI components.
- `src/components/layout`: dashboard shell, navigation, and page transitions.
- `src/components/ui`: reusable interface primitives.
- `src/context`: authentication, application, and toast state.
- `src/hooks`: local storage, role guards, and count-up behavior.
- `src/lib`: constants, validation, animation variants, formatting, and mock data.
- `src/types`: shared TypeScript models.

## Data layer

All data access is isolated in `src/lib/api.ts`. Replace that file to connect a backend such as Supabase while keeping the UI and contexts intact. The current implementation stores demo users, applications, and session state in browser localStorage.
