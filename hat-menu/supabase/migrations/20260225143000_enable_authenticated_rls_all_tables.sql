-- migration: enable authenticated-only rls access across application tables
-- created at (utc): 2026-02-25 14:30:00
-- purpose:
--   1) enable row level security on all app tables.
--   2) allow authenticated users to perform select/insert/update/delete on all rows.
--   3) explicitly deny anon users for select/insert/update/delete.
-- affected tables:
--   public.recipe
--   public.menu
--   public.menu_recipe
--   public.suggested_ingredient
--   public.recipe_ingredient
-- notes:
--   - this migration is intentionally ownership-agnostic for phase 1.
--   - policies are split by operation and role for clear auditing.
--   - existing data remains unchanged; only access rules are updated.

begin;

-- ============================================================
-- permissions baseline
-- ============================================================
-- explicit privilege setup keeps behavior predictable across environments.
-- anon receives no table privileges, and authenticated receives CRUD privileges.

revoke all on table public.recipe from anon;
revoke all on table public.menu from anon;
revoke all on table public.menu_recipe from anon;
revoke all on table public.suggested_ingredient from anon;
revoke all on table public.recipe_ingredient from anon;

grant select, insert, update, delete on table public.recipe to authenticated;
grant select, insert, update, delete on table public.menu to authenticated;
grant select, insert, update, delete on table public.menu_recipe to authenticated;
grant select, insert, update, delete on table public.suggested_ingredient to authenticated;
grant select, insert, update, delete on table public.recipe_ingredient to authenticated;

-- ============================================================
-- enable row level security on all application tables
-- ============================================================
-- enabling rls is safe for existing rows; it only changes authorization behavior.

alter table public.recipe enable row level security;
alter table public.menu enable row level security;
alter table public.menu_recipe enable row level security;
alter table public.suggested_ingredient enable row level security;
alter table public.recipe_ingredient enable row level security;

-- ============================================================
-- recipe policies
-- ============================================================

-- cleanup for idempotency in local resets or repeated apply attempts.
drop policy if exists recipe_select_authenticated on public.recipe;
drop policy if exists recipe_insert_authenticated on public.recipe;
drop policy if exists recipe_update_authenticated on public.recipe;
drop policy if exists recipe_delete_authenticated on public.recipe;
drop policy if exists recipe_select_anon on public.recipe;
drop policy if exists recipe_insert_anon on public.recipe;
drop policy if exists recipe_update_anon on public.recipe;
drop policy if exists recipe_delete_anon on public.recipe;

-- authenticated: allow full table access.
create policy recipe_select_authenticated on public.recipe
for select to authenticated
using (true);

create policy recipe_insert_authenticated on public.recipe
for insert to authenticated
with check (true);

create policy recipe_update_authenticated on public.recipe
for update to authenticated
using (true)
with check (true);

create policy recipe_delete_authenticated on public.recipe
for delete to authenticated
using (true);

-- anon: explicitly deny all operations.
create policy recipe_select_anon on public.recipe
for select to anon
using (false);

create policy recipe_insert_anon on public.recipe
for insert to anon
with check (false);

create policy recipe_update_anon on public.recipe
for update to anon
using (false)
with check (false);

create policy recipe_delete_anon on public.recipe
for delete to anon
using (false);

-- ============================================================
-- menu policies
-- ============================================================

drop policy if exists menu_select_authenticated on public.menu;
drop policy if exists menu_insert_authenticated on public.menu;
drop policy if exists menu_update_authenticated on public.menu;
drop policy if exists menu_delete_authenticated on public.menu;
drop policy if exists menu_select_anon on public.menu;
drop policy if exists menu_insert_anon on public.menu;
drop policy if exists menu_update_anon on public.menu;
drop policy if exists menu_delete_anon on public.menu;

create policy menu_select_authenticated on public.menu
for select to authenticated
using (true);

create policy menu_insert_authenticated on public.menu
for insert to authenticated
with check (true);

create policy menu_update_authenticated on public.menu
for update to authenticated
using (true)
with check (true);

create policy menu_delete_authenticated on public.menu
for delete to authenticated
using (true);

create policy menu_select_anon on public.menu
for select to anon
using (false);

create policy menu_insert_anon on public.menu
for insert to anon
with check (false);

create policy menu_update_anon on public.menu
for update to anon
using (false)
with check (false);

create policy menu_delete_anon on public.menu
for delete to anon
using (false);

-- ============================================================
-- menu_recipe policies
-- ============================================================

drop policy if exists menu_recipe_select_authenticated on public.menu_recipe;
drop policy if exists menu_recipe_insert_authenticated on public.menu_recipe;
drop policy if exists menu_recipe_update_authenticated on public.menu_recipe;
drop policy if exists menu_recipe_delete_authenticated on public.menu_recipe;
drop policy if exists menu_recipe_select_anon on public.menu_recipe;
drop policy if exists menu_recipe_insert_anon on public.menu_recipe;
drop policy if exists menu_recipe_update_anon on public.menu_recipe;
drop policy if exists menu_recipe_delete_anon on public.menu_recipe;

create policy menu_recipe_select_authenticated on public.menu_recipe
for select to authenticated
using (true);

create policy menu_recipe_insert_authenticated on public.menu_recipe
for insert to authenticated
with check (true);

create policy menu_recipe_update_authenticated on public.menu_recipe
for update to authenticated
using (true)
with check (true);

create policy menu_recipe_delete_authenticated on public.menu_recipe
for delete to authenticated
using (true);

create policy menu_recipe_select_anon on public.menu_recipe
for select to anon
using (false);

create policy menu_recipe_insert_anon on public.menu_recipe
for insert to anon
with check (false);

create policy menu_recipe_update_anon on public.menu_recipe
for update to anon
using (false)
with check (false);

create policy menu_recipe_delete_anon on public.menu_recipe
for delete to anon
using (false);

-- ============================================================
-- suggested_ingredient policies
-- ============================================================

drop policy if exists suggested_ingredient_select_authenticated on public.suggested_ingredient;
drop policy if exists suggested_ingredient_insert_authenticated on public.suggested_ingredient;
drop policy if exists suggested_ingredient_update_authenticated on public.suggested_ingredient;
drop policy if exists suggested_ingredient_delete_authenticated on public.suggested_ingredient;
drop policy if exists suggested_ingredient_select_anon on public.suggested_ingredient;
drop policy if exists suggested_ingredient_insert_anon on public.suggested_ingredient;
drop policy if exists suggested_ingredient_update_anon on public.suggested_ingredient;
drop policy if exists suggested_ingredient_delete_anon on public.suggested_ingredient;

create policy suggested_ingredient_select_authenticated on public.suggested_ingredient
for select to authenticated
using (true);

create policy suggested_ingredient_insert_authenticated on public.suggested_ingredient
for insert to authenticated
with check (true);

create policy suggested_ingredient_update_authenticated on public.suggested_ingredient
for update to authenticated
using (true)
with check (true);

create policy suggested_ingredient_delete_authenticated on public.suggested_ingredient
for delete to authenticated
using (true);

create policy suggested_ingredient_select_anon on public.suggested_ingredient
for select to anon
using (false);

create policy suggested_ingredient_insert_anon on public.suggested_ingredient
for insert to anon
with check (false);

create policy suggested_ingredient_update_anon on public.suggested_ingredient
for update to anon
using (false)
with check (false);

create policy suggested_ingredient_delete_anon on public.suggested_ingredient
for delete to anon
using (false);

-- ============================================================
-- recipe_ingredient policies
-- ============================================================

drop policy if exists recipe_ingredient_select_authenticated on public.recipe_ingredient;
drop policy if exists recipe_ingredient_insert_authenticated on public.recipe_ingredient;
drop policy if exists recipe_ingredient_update_authenticated on public.recipe_ingredient;
drop policy if exists recipe_ingredient_delete_authenticated on public.recipe_ingredient;
drop policy if exists recipe_ingredient_select_anon on public.recipe_ingredient;
drop policy if exists recipe_ingredient_insert_anon on public.recipe_ingredient;
drop policy if exists recipe_ingredient_update_anon on public.recipe_ingredient;
drop policy if exists recipe_ingredient_delete_anon on public.recipe_ingredient;

create policy recipe_ingredient_select_authenticated on public.recipe_ingredient
for select to authenticated
using (true);

create policy recipe_ingredient_insert_authenticated on public.recipe_ingredient
for insert to authenticated
with check (true);

create policy recipe_ingredient_update_authenticated on public.recipe_ingredient
for update to authenticated
using (true)
with check (true);

create policy recipe_ingredient_delete_authenticated on public.recipe_ingredient
for delete to authenticated
using (true);

create policy recipe_ingredient_select_anon on public.recipe_ingredient
for select to anon
using (false);

create policy recipe_ingredient_insert_anon on public.recipe_ingredient
for insert to anon
with check (false);

create policy recipe_ingredient_update_anon on public.recipe_ingredient
for update to anon
using (false)
with check (false);

create policy recipe_ingredient_delete_anon on public.recipe_ingredient
for delete to anon
using (false);

commit;
