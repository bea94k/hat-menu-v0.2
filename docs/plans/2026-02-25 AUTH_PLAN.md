# Supabase Authentication Implementation Plan

## Scope and Assumptions
- Auth method for phase 1: Email/password only.
- Access model: All app routes require authentication.
- Authorization model: All tables and all columns are available to authenticated users; no ownership-based restrictions.
- Security timing: Include authenticated-only RLS policies in phase 1.

This plan aligns with existing architecture in:
- Routing: [hat-menu/src/main.tsx](hat-menu/src/main.tsx)
- Supabase client singleton: [hat-menu/src/supabase-config.ts](hat-menu/src/supabase-config.ts)
- Data layer patterns: [hat-menu/src/data/useSupabaseQuery.ts](hat-menu/src/data/useSupabaseQuery.ts), [hat-menu/src/data/recipesApi.ts](hat-menu/src/data/recipesApi.ts), [hat-menu/src/data/menusApi.ts](hat-menu/src/data/menusApi.ts)
- Form conventions: [hat-menu/src/components/AddRecipeForm.tsx](hat-menu/src/components/AddRecipeForm.tsx)

## Step-by-Step Plan

### 1) Create auth foundation (context + hooks)
- Add `AuthProvider` in `hat-menu/src/auth/AuthProvider.tsx`.
- Initialize auth state with `supabase.auth.getSession()` on app boot.
- Subscribe to session changes with `supabase.auth.onAuthStateChange()`.
- Expose typed values/actions via context:
  - `session`
  - `user`
  - `loading`
  - `signIn(email, password)`
  - `signUp(email, password)`
  - `signOut()`
- Add `useAuth` hook in `hat-menu/src/auth/useAuth.ts`.

### 2) Protect routes and integrate provider
- Add `ProtectedRoute` component in `hat-menu/src/auth/ProtectedRoute.tsx`.
- Wrap app router with `AuthProvider` in `hat-menu/src/main.tsx`.
- Update route definitions so:
  - `SignIn` and `SignUp` remain public.
  - Existing app pages (`/`, `/menus`, `/recipes/add`, `/menus/create`) require auth.
- Ensure loading state prevents premature redirect before session resolves.

### 3) Implement auth pages with existing form standards
- Add pages:
  - `hat-menu/src/pages/SignInPage.tsx`
  - `hat-menu/src/pages/SignUpPage.tsx`
- Add validation schema file:
  - `hat-menu/src/schemas/Auth.ts`
- Use React Hook Form + Yup (`@hookform/resolvers/yup`) to match project conventions.
- Keep UX minimal:
  - email field
  - password field
  - submit button
  - inline error message
  - link between sign-in and sign-up pages

### 4) Add auth controls to navigation
- Update `hat-menu/src/components/Navbar.tsx`:
  - Show `Sign out` when authenticated.
  - Optionally hide private nav links until authenticated session is known.
- Ensure sign-out clears UI session state and redirects to sign-in route.

### 5) Fix local Supabase auth callback configuration
- Update `hat-menu/supabase/config.toml` auth URLs to match Vite local origin used by this repo.
- Ensure `site_url` and `redirect_urls` are consistent for local testing.
- Document this in:
  - `hat-menu/README.md`
  - root `README.md` (if needed)

### 6) Configure authenticated-only table access in database (migration)
- Create new migration in `hat-menu/supabase/migrations/`.
- Do not add ownership columns (for example `owner_id`) for auth purposes.
- Keep table structure focused on domain data; access control is handled by RLS policies.

### 7) Enable RLS and add policies
- In migration, enable RLS on all application tables.
- Add policies so authenticated users can:
  - `SELECT` all rows
  - `INSERT` all rows
  - `UPDATE` all rows
  - `DELETE` all rows
- Ensure anonymous users (`anon`) have no table access.

### 8) Apply RLS safely to existing data
- No ownership backfill is required because access is not user-scoped.
- Validate that enabling RLS does not break existing read/write paths for authenticated sessions.
- Include rollback-safe sequencing in migration.

### 9) Update client-side data mutation paths
- Update inserts/updates in:
  - `hat-menu/src/data/recipesApi.ts`
  - `hat-menu/src/data/menusApi.ts`
  - any direct table mutations using `useSupabaseMutation`
- Ensure mutation paths do not rely on anonymous access assumptions.
- Rely on RLS for security (not client-only filtering).

### 10) Handle auth/session edge cases in UI
- Add user-facing handling for:
  - invalid credentials
  - expired/invalid session
  - network/auth service errors
- Standardize auth error messages on sign-in/sign-up pages.
- When user tries to access an url that doesn't exist (for example '/nowhere'), redirect to '/'.

### 11) Verification and testing
- Run and verify locally:
  - `npm run dev`
  - `npm run test` - ✅ pass 7 unit tests for utils
- Manual test path:
  1. Sign up
    - ✅ Sign-up happy path succeeds.
    - ✅ Invalid form input (email/password) shows validation errors.
    - ✅ Duplicate-account sign-up shows expected error/message. -> in request response "user already exists" visible, in UI generic "sign up failed, check your details, try again" message.
  2. Sign in
    - ✅ Sign-in happy path succeeds.
    - ✅ Invalid form input (email/password) shows validation errors.
    - ✅ Wrong credentials show a user-friendly auth error.
  3. Session-expired handling works
    - ✅ Invalidate session (e.g., sign out in another tab or expire token). Submitting a protected form redirects to /sign-in. -> Sign out in both tabs is immediate. When removing cookies and tokens, no sing out or redirect is done, but can't access nor update the data from UI; on reload, redirects to sign-in page.
    - ❌ User sees a session-expired/re-authentication message. -> this doesn't happen, but the flow is secure enough
  4. Create/edit records
    - ✅ Signed-in user can create a recipe successfully.
    - ✅ Signed-in user can create a menu successfully.
    - ✅ Newly created records are visible in list views.
    - NOTE: 'Edit' functionality implemented on API level, but not in UI, so not tested here.
  5. Sign out
    - ✅ Clicking Sign out redirects to /sign-in.
    - ✅ Private nav/actions are hidden after sign-out
    - ✅ Accessing private routes after sign-out redirects to /sign-in.
  6. Verify protected routes redirect to sign-in
    - ✅ While signed out, visiting /, /menus, /recipes/add, /menus/create redirects to /sign-in.
    - ✅ No private page content is visible before redirect.
  7. Verify unauth-only routes redirect to /
    - ✅ While signed in, visiting /sign-in redirects to /.
    - ✅ While signed in, visiting /sign-up redirects to /.
- Validate RLS behavior (Supabase SQL editor/manual checks):
  - ✅ unauthenticated access is denied for all protected tables
  - ✅ authenticated users can read/write all rows as intended
  - ✅ all table columns required by app flows remain accessible to authenticated users

### 12) Documentation updates
- Add auth setup instructions and env guidance to `hat-menu/README.md`.
- Add migration/deployment sequence notes to `backend-deployment-notes.md`.
- Update feature status in `FEATURES.md`.

## Implementation Checklist
- [x] Auth context/provider and hook added
- [x] Protected routing implemented
- [x] Sign-in and sign-up pages added
- [x] Navbar sign-out flow integrated
- [x] Supabase local auth redirect config fixed
- [x] Authenticated-only RLS migration created and applied
- [x] RLS policies created and verified
- [x] Client mutation paths verified for authenticated access
- [x] Session/error edge cases handled
- [x] Tests and manual auth flow verified
- [x] Documentation updated

## Notes / Risks
- Avoid exposing secret keys in frontend; browser app should use anon/publishable key only.
- Keep generated database types workflow intact (`database.types.ts` is generated).
- This model allows any authenticated user to modify data across tables, so audit and moderation controls may be needed.