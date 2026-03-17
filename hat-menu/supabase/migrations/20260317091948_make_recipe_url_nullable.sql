-- migration: make recipe url nullable
-- purpose: allow recipes to be created without a url by removing the not null constraint
-- affected object: public.recipe.url
-- special considerations:
--   1) this is a schema-changing operation that relaxes an integrity constraint
--   2) existing rows are unaffected; only future writes gain the ability to store null in url
--   3) application and generated types should be updated in follow-up steps

begin;

-- this is a destructive schema alteration in the sense that it removes an existing constraint.
-- after this change, the database will no longer reject inserts/updates with a null url value.
-- this is intentional to support optional recipe urls.
alter table public.recipe
  alter column url drop not null;

commit;
