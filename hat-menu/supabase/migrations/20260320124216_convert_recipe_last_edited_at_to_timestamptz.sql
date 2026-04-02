-- migration: convert recipe.last_edited_at from timestamp to timestamptz
-- purpose: align temporal storage with supabase/postgres best practices and remove console warning
-- affected table: public.recipe
-- affected column: last_edited_at (type change: timestamp -> timestamptz)
-- special considerations:
-- 1) this migration assumes existing last_edited_at values represent utc time.
-- 2) conversion is explicit via "at time zone 'utc'" to avoid session-timezone-dependent interpretation.
-- 3) this is a schema evolution migration and should be applied after the column was originally added.

begin;

-- step 1: convert column type to timestamptz.
-- important: changing temporal column types can shift values if timezone assumptions are implicit.
-- we avoid that by explicitly interpreting existing timestamp values as utc during conversion.
alter table if exists public.recipe
alter column last_edited_at type timestamptz
using (
    case
        when last_edited_at is null then null
        else last_edited_at at time zone 'utc'
    end
);

-- step 2: preserve explicit default null for readability and consistency.
alter table if exists public.recipe
alter column last_edited_at set default null;

-- step 3: refresh column comment to reflect new type semantics.
comment on column public.recipe.last_edited_at is
'utc timestamp with time zone of the latest recipe edit; null means the recipe has not been edited since creation or before this field existed.';

commit;
