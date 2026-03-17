# Copilot Instructions for Hat Menu

## Project Overview
Recipe and menu management web app built with React 19 + TypeScript + Vite frontend, Supabase (PostgreSQL) backend. The project uses a monorepo structure: the main app lives in `hat-menu/` subdirectory.

## Working Directory
**Always operate in `/hat-menu` unless working on root-level docs.** All npm commands, file paths for components/pages/schemas, and imports assume you're in the `hat-menu/` directory.

## Data Layer Architecture

### Three-Layer Type System
1. **Auto-generated base types** ([hat-menu/src/schemas/database.types.ts](hat-menu/src/schemas/database.types.ts)) - Generated from Supabase schema via `npm run update-types`. **Never edit manually.**
2. **Extended database types** ([hat-menu/src/schemas/supabase-helpers.ts](hat-menu/src/schemas/supabase-helpers.ts)) - Extracts `Row`, `Insert`, `Update` types and adds relationships (e.g., `MenuWithRecipes`)
3. **Form/validation schemas** ([hat-menu/src/schemas/Recipes.ts](hat-menu/src/schemas/Recipes.ts), [hat-menu/src/schemas/Menus.ts](hat-menu/src/schemas/Menus.ts)) - Yup schemas for forms, omitting id/created_at fields

### Custom SWR + Supabase Hook Pattern
All data fetching uses [hat-menu/src/data/useSupabaseQuery.ts](hat-menu/src/data/useSupabaseQuery.ts):

**Fetching:**
```typescript
const { data, error, isLoading } = useSupabaseQuery<Recipe>({
    table: 'recipe',
    select: '*',  // or '*, menu_recipe(recipe(*))'  for joins
    filters: { category: 'dinner' }  // optional
});
```

**Mutations:**
```typescript
const { mutate } = useSupabaseMutation('recipe');
await mutate('insert', recipeData, 'NEW');  // Use "NEW" as id for inserts
await mutate('update', updates, recipeId);
await mutate('delete', null, recipeId);
```

Note: `useSupabaseMutation` auto-revalidates SWR cache via `mutateSWR(\`/${table}\`)`.

### Complex Relations Pattern
For many-to-many relationships (see [hat-menu/src/data/menusApi.ts](hat-menu/src/data/menusApi.ts) `addMenu` function):
1. Insert parent record with `.select().single()`
2. Map child relationships to junction table inserts
3. Insert junction table records
4. Return combined object with both parent and child data

## Form Handling
- **React Hook Form + Yup** for all forms (see [hat-menu/src/components/AddRecipeForm.tsx](hat-menu/src/components/AddRecipeForm.tsx))
- Use `yupResolver` from `@hookform/resolvers/yup`
- Validation schemas in `/schemas` directory, always omit `id` and `created_at` for form schemas
- Combine `ref` from `register()` with `useRef` for auto-focus: `const { ref, ...rest } = register('name')`

## Development Workflows

### Essential Commands (run in `hat-menu/`)
```bash
npm run dev              # Start dev server (Vite)
npm run json-db          # Start local JSON mock server
npm run update-types     # Regenerate database.types.ts from Supabase
npm run test             # Run Vitest tests
```

### Environment Setup
Create `hat-menu/.env`:
```
VITE_SUPABASE_URL=<from Supabase dashboard>
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<from Supabase dashboard>
```

### Supabase Client Initialization
Import the singleton from [hat-menu/src/supabase-config.ts](hat-menu/src/supabase-config.ts). It's already typed with `Database` type.

## Conventions

- **File organization**: Components in `/components`, full-page components in `/pages`, API hooks in `/data`
- **Plan files**: Whenever asked to create a plan for a feature/task/work, always save it as a Markdown file in `/docs/plans/` (root-level directory).
  - Filename must start with the current date in `YYYY-MM-DD` format.
  - Recommended pattern: `YYYY-MM-DD-short-plan-name.md`.
- **Routing**: Using React Router v7 (not react-router-dom), see [hat-menu/src/main.tsx](hat-menu/src/main.tsx)
- **Styling**: Use Tailwind CSS utility classes for component styling. Do not use inline styles and do not add manually written component/page classes to `hat-menu/src/styles/index.css`; prefer Tailwind utilities directly in JSX. Never touch or adjust focus styles unless explicitly asked.
- **ARIA status usage**: For elements with `role="status"`, do not add `aria-live="polite"`. The polite live region is already implicit, and adding it is unnecessary duplication.
- **Ingredients storage**: 
  - **Current**: New recipes use `recipe_ingredient` junction table with structured data (`ingredient_name`, `quantity`, `unit`)
  - **Legacy**: Old recipes have stringified JSON arrays in `recipe.ingredients` text field - these need manual migration
  - **Recipe mutations**: Use custom `addRecipe`/`updateRecipe` functions from [hat-menu/src/data/recipesApi.ts](hat-menu/src/data/recipesApi.ts), not generic `useSupabaseMutation`, to properly handle the junction table inserts
- **Ingredient naming**: All ingredients in `suggested_ingredient` table and `recipe_ingredient.ingredient_name` must be:
  - **Singular form** (e.g., "potato" not "potatoes")
  - **Lowercase** (e.g., "asian" not "Asian", even for origin-based names)
  - This applies regardless of grammatical correctness for consistency
- **Date handling**: Uses `date-fns` for formatting. Convert form dates to `yyyy-MM-dd` format for Supabase (e.g., `format(menu.startDate, 'yyyy-MM-dd')`)

## Common Pitfalls

1. **Don't edit database.types.ts** - It's auto-generated. Run `npm run update-types` after schema changes.
2. **Junction table handling** - Simple `useSupabaseMutation` won't work for recipes or menus. Use custom functions like `addRecipe`, `updateRecipe`, `addMenu` for complex multi-table operations that involve junction tables.
3. **Mutation ID convention** - Use string `'NEW'` as the ID parameter when calling `mutate('insert', ...)`.
4. **SWR cache invalidation** - The mutation hook auto-revalidates, but complex queries (with joins) may need manual `mutate()` calls.
5. **Legacy ingredient data** - Some old recipes may still have stringified arrays in `recipe.ingredients` field instead of using the `recipe_ingredient` table. Handle both formats when reading.

## Reference Files
- Type generation workflow: [backend-deployment-notes.md](backend-deployment-notes.md) (sections 6-7)
- Roadmap and feature status: [README.md](README.md) (Plan section)
