# Make Recipe URL Optional

## Scope and assumptions

- Goal: make `recipe.url` optional at the database level and remove temporary frontend fallback behavior.
- In scope:
  - Supabase migration to drop `NOT NULL` from `public.recipe.url`.
  - Regeneration of generated database types.
  - Cleanup in recipe creation form to stop forcing a default URL.
  - Verification that recipe creation works both with and without a URL.
- Out of scope:
  - Legacy ingredient migration.
  - Update/delete recipe UI changes.
  - Broader data model refactors.
- Assumptions:
  - Supabase migration workflow is already configured for local and remote environments.
  - No external consumer relies on `recipe.url` always being non-null.

## Step-by-step plan

1. Add migration to make `public.recipe.url` nullable.
- Implementation: create `hat-menu/supabase/migrations/<timestamp>_make_recipe_url_nullable.sql` and run `alter table public.recipe alter column url drop not null;` inside `begin; ... commit;`.
- Expected result / acceptance criteria: database schema no longer enforces `NOT NULL` on `recipe.url`.
- Verification: apply migration in local Supabase and inspect schema (`\d public.recipe` or Supabase table editor) to confirm `url` is nullable.

2. Apply migration and regenerate generated Supabase types.
- Implementation: from `hat-menu/`, apply migrations and run `npm run update-types`.
- Expected result / acceptance criteria: generated types reflect nullable URL on recipe insert/update payloads.
- Verification: check `hat-menu/src/schemas/database.types.ts` and confirm recipe insert type uses optional `url` (for example `url?: string`).

3. Remove the frontend default URL workaround in the add recipe form.
- Implementation: update `hat-menu/src/components/AddRecipeForm.tsx` to remove `DEFAULT_RECIPE_URL` and submit `url` as trimmed value or `undefined`.
- Expected result / acceptance criteria: form no longer injects placeholder URL values when user leaves URL blank.
- Verification: code inspection confirms no `DEFAULT_RECIPE_URL` usage remains and submit payload maps empty URL to `undefined`.

4. Validate create-recipe flow with and without URL.
- Implementation: run app, create one recipe without URL and one with URL.
- Expected result / acceptance criteria: both submissions succeed; no DB constraint errors; URL is null/empty in DB when omitted and persisted when provided.
- Verification: use UI success feedback and confirm inserted rows in Supabase table editor (or query) show expected URL values.

5. Run a quick regression check around recipe listing and menu creation.
- Implementation: open recipes and menus views after creating test records.
- Expected result / acceptance criteria: no runtime errors caused by nullable URL values in existing screens.
- Verification: manual smoke test in app (recipes list, create menu path) completes without console/runtime errors.
