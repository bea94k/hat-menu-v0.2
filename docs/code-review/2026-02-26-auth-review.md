# Code Review: Authentication & Authorization
**Date**: 2026-02-26  
**Ready for Production**: No  
**Critical Issues**: 1

## Scope
- Frontend auth/session flow in `hat-menu/src/auth/*`, `hat-menu/src/pages/SignInPage.tsx`, `hat-menu/src/pages/SignUpPage.tsx`, `hat-menu/src/utils/auth.ts`.
- Supabase client integration in `hat-menu/src/supabase-config.ts` and data access hooks/APIs.
- Database authorization controls in `hat-menu/supabase/migrations/20260225143000_enable_authenticated_rls_all_tables.sql`.

## Review Plan (Targeted)
1. OWASP A01 (Broken Access Control): verify row-level authorization and ownership boundaries.
2. OWASP A07 (Identification and Authentication Failures): validate sign-in/sign-up/session handling.
3. OWASP A02 (Cryptographic/session handling): review token/session storage assumptions and exposure risk.
4. Zero Trust checks: ensure backend authorization is enforced independently of client route guards.
5. Reliability/security hardening: assess error handling and abuse resistance on auth paths.

## Priority 1 (Must Fix) ⛔

### 1) Broken Access Control via ownership-agnostic RLS
**Risk**: Any authenticated user can read, update, and delete all recipes/menus and related records, enabling cross-account data access and tampering.

**Evidence**:
- `hat-menu/supabase/migrations/20260225143000_enable_authenticated_rls_all_tables.sql` defines authenticated policies with `using (true)` and `with check (true)` for all CRUD operations across app tables.
- Migration comment explicitly states it is "ownership-agnostic for phase 1".

**Impact**:
- Horizontal privilege escalation (IDOR-style behavior at data layer).
- Data confidentiality and integrity violations across users.

**Fix (required)**:
1. Add ownership columns (e.g., `owner_id uuid not null default auth.uid()`) on user-scoped tables (`recipe`, `menu`, and potentially junction tables via parent ownership checks).
2. Replace permissive policies with owner-bound policies.

**Example secure policy pattern**:
```sql
-- recipe table
alter table public.recipe add column if not exists owner_id uuid not null default auth.uid();

drop policy if exists recipe_select_authenticated on public.recipe;
create policy recipe_select_own on public.recipe
for select to authenticated
using (owner_id = auth.uid());

drop policy if exists recipe_update_authenticated on public.recipe;
create policy recipe_update_own on public.recipe
for update to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists recipe_delete_authenticated on public.recipe;
create policy recipe_delete_own on public.recipe
for delete to authenticated
using (owner_id = auth.uid());

drop policy if exists recipe_insert_authenticated on public.recipe;
create policy recipe_insert_own on public.recipe
for insert to authenticated
with check (owner_id = auth.uid());
```

## Priority 2 (Should Fix) ⚠️

### 2) Route guard is client-side only; must not be treated as authorization
**Risk**: `ProtectedRoute` in `hat-menu/src/auth/ProtectedRoute.tsx` enforces UI navigation only. If backend policies remain permissive, users can still access/modify data through direct calls.

**Status**: Backend currently relies on RLS, but RLS is overly permissive (see Priority 1).

**Fix**:
- Keep `ProtectedRoute` for UX.
- Enforce all authorization in Supabase RLS with owner-scoped policies.

### 3) Password policy is weak at form layer
**Risk**: `hat-menu/src/schemas/Auth.ts` currently accepts passwords with minimum length 6.

**Fix**:
- Raise to at least 10-12 chars and enforce composition/passphrase quality in Auth provider settings and validation schema.
- Align with Supabase Auth password policy to avoid mismatch.

### 4) Session checks are inconsistent in data read path
**Risk**: `hat-menu/src/data/useSupabaseQuery.ts` imports `checkAuthenticatedSession` but does not call it in the query fetcher. This is not a direct auth bypass if RLS is correct, but causes inconsistent handling and weakens Zero Trust posture at app boundary.

**Fix**:
- Optionally invoke `checkAuthenticatedSession()` in fetcher for consistent fail-fast behavior.
- Continue treating RLS as the primary authorization control.

## Priority 3 (Recommended Hardening) ✅

### 5) Session/token exposure resilience (XSS blast-radius reduction)
Supabase browser sessions are typically persisted client-side. Any XSS can expose tokens.

**Recommendations**:
- Add strict CSP and avoid unsafe inline script usage.
- Audit rendering paths for untrusted HTML insertion.
- Keep dependencies updated and run regular SAST/DAST checks.

### 6) Minor information disclosure in client logs
`console.error` calls in UI (`AddRecipeForm`, `CreateMenuForm`, `Navbar`) may expose operational details in shared environments.

**Recommendation**:
- Replace with sanitized user-facing errors and optional structured telemetry without sensitive payloads.

## Positive Findings
- Auth state is centralized and observed via `supabase.auth.onAuthStateChange` (`AuthProvider`).
- Sign-in and sign-up paths use generic/sanitized message mapping (`mapAuthErrorMessage`) and avoid raw backend errors in UI.
- Protected app routes are grouped behind `ProtectedRoute`, reducing accidental unauthenticated UX exposure.

## Production Readiness Verdict
Not ready for production until owner-scoped RLS is implemented and verified. Current model effectively treats all authenticated users as a single trust domain.

## Verification Checklist After Fixes
1. Create two test users (`user_a`, `user_b`).
2. Ensure `user_a` cannot `select/update/delete` any `user_b` rows (recipe/menu/junction data).
3. Ensure inserts always stamp `owner_id = auth.uid()` and reject mismatched `owner_id`.
4. Re-run app flows (list/create/update/delete) for both users.
5. Confirm anon still has zero CRUD access.
