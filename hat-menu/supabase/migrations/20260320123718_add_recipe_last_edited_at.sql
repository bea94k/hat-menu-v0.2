-- migration: add last_edited_at column to recipe table
-- purpose: track when a recipe was last modified to support edit workflows and auditing
-- affected table: public.recipe
-- affected column: last_edited_at (timestamp, nullable, default null)
-- special considerations:
-- 1) this change is additive and non-destructive.
-- 2) existing rows remain valid and will keep null until explicitly updated by application logic.
-- 3) no rls policy changes are required because no new table is created and existing table policies remain in effect.

begin;

-- step 1: add a nullable timestamp column to record the most recent edit time.
-- default null is explicit to document intent and to avoid backfilling synthetic values for legacy rows.
alter table if exists public.recipe
add column if not exists last_edited_at timestamp default null;

-- step 2: add a column-level comment for schema clarity in database tooling.
comment on column public.recipe.last_edited_at is
'utc timestamp of the latest recipe edit; null means the recipe has not been edited since creation or before this field existed.';

commit;
