-- migration: add ready_for_production column to recipe table
-- purpose: temporary flag to track recipes that a user has manually reviewed, adjusted, and confirmed
--          as production-ready during the data cleanup phase
-- affected table: public.recipe
-- affected column: ready_for_production (boolean, not null, default false)
-- special considerations:
-- 1) this column is TEMPORARY and will be dropped in a future cleanup migration once all
--    recipes have been reviewed and confirmed by the user.
-- 2) all existing rows default to false (not yet reviewed), which is intentionally conservative.
-- 3) no rls policy changes required; existing table policies remain in effect.

begin;

-- step 1: add the temporary boolean column.
-- default false ensures all existing recipes start as "not yet reviewed" until a user
-- explicitly marks them as confirmed and ready for production.
alter table if exists public.recipe
add column if not exists ready_for_production boolean not null default false;

-- step 2: document the temporary nature of this column in the schema.
comment on column public.recipe.ready_for_production is
'temporary column — to be dropped after data cleanup is complete. '
'set to true by the user to indicate that this recipe has been manually reviewed.';

commit;
