# Hat Menu - Implemented Features

This document provides an overview of currently implemented features in the Hat Menu application as of February 2026.

## ✅ Implemented Features

### 1. **Authentication & Access Control**
- **Email/password authentication** - Sign-up and sign-in flows implemented with Supabase Auth
- **Protected routes** - App routes require authenticated session (`/`, `/menus`, `/recipes/add`, `/menus/create`)
- **Public-only auth routes** - Signed-in users are redirected away from `/sign-in` and `/sign-up`
- **Session-aware navigation** - Navbar includes sign-out flow and hides private actions when signed out
- **Authenticated-only database access** - RLS policies allow CRUD for authenticated users and deny anonymous access

### 2. **Recipe Management**
- **View all recipes** - Recipe listing functionality via [`useSupabaseQuery`](hat-menu/src/data/useSupabaseQuery.ts)
- **Add new recipes** - Form implementation in [`AddRecipeForm.tsx`](hat-menu/src/components/AddRecipeForm.tsx) using React Hook Form + Yup validation
- **Data model** - Recipes have `name`, `url`, and structured ingredients stored in `recipe_ingredient` junction table
- **Structured ingredients** - Each ingredient has `ingredient_name` (lowercase, singular), optional `quantity`, and optional `unit`
- **Legacy data** - Old recipes still have stringified ingredient arrays in `recipe.ingredients` field (needs manual migration)

### 3. **Menu Management**
- **Create menus** - Complex menu creation with recipe associations via [`addMenu`](hat-menu/src/data/menusApi.ts) function
- **Menu-Recipe relationship** - Many-to-many junction table (`menu_recipe`) handling
- **Date range support** - Menus have `startDate` and `endDate` fields, formatted with `date-fns`

### 4. **Data Layer Architecture**
- **Three-layer type system**:
  1. Auto-generated Supabase types ([`database.types.ts`](hat-menu/src/schemas/database.types.ts))
  2. Extended database types ([`supabase-helpers.ts`](hat-menu/src/schemas/supabase-helpers.ts))
  3. Form validation schemas in `/schemas` directory
- **Custom SWR + Supabase hook** - [`useSupabaseQuery`](hat-menu/src/data/useSupabaseQuery.ts) for data fetching with caching
- **Mutation hook** - [`useSupabaseMutation`](hat-menu/src/data/useSupabaseQuery.ts) with auto-revalidation

### 5. **Navigation & Routing**
- **React Router v7** implementation in [`main.tsx`](hat-menu/src/main.tsx)
- **Navbar component** - [`Navbar.tsx`](hat-menu/src/components/Navbar.tsx) with links to:
  - Recipes list
  - Add Recipe
  - Menus list
  - Create Menu

### 6. **Development Infrastructure**
- **Supabase backend** - PostgreSQL database with client initialized in [`supabase-config.ts`](hat-menu/src/supabase-config.ts)
- **Local mock JSON server** - Alternative data source via `npm run json-db`
- **Type generation workflow** - `npm run update-types` syncs database schema to TypeScript
- **Testing setup** - Vitest configured

### 7. **Database Schema**
- **`recipe` table** - With id, name, url, ingredients (legacy text field, being phased out)
- **`recipe_ingredient` junction table** - Links recipes to ingredients with quantity/unit (new structured format)
- **`suggested_ingredient` table** - Autocomplete suggestions (lowercase, singular form)
- **`menu` table** - With id, startDate, endDate fields
- **`menu_recipe` junction table** - Links menus to recipes (many-to-many)
- **Seed data** - Available in [`seed-recipes.sql`](hat-menu/src/data/seed-recipes.sql)

### 8. **Misc**
- switched to use **supabase publishable keys**, away from the legacy anon keys (https://supabase.com/docs/guides/api/api-keys#why-are-anon-and-servicerole-jwt-based-keys-no-longer-recommended)

## ⚠️ Not Yet Implemented

### Priority/Where I left off last time
- **Make the app a PWA**
- **Deploy** to access it on other devices
- **Make the app mobile friendly**, especially menu creation and recipe adding
- **Legacy ingredient migration** - Old recipes with stringified ingredients need migration to `recipe_ingredient` table
- **Testing** of everything we have so far
- **Accessibility and good practices** - are there unused or unnecessary classes, properties or attributes?
- **Clean up** comments, types, API files - See which comments are too verbose (and try to fix the instructions.agents). Are there any unused functions? Do we need the supabase hooks at all or everything needs to be a custom hook (because joint tables)?

### Other
- **Update/Delete recipes** - Functions exist but not exposed in UI
- **Update/Delete menus** - Only create functionality exists
- **Recipe categories/filtering** - Hook exists but not implemented in UI
- **Image uploads** - Storage bucket configured but not implemented

## 💡 Ideas

### Grocery List
- Create grocery list from menu (aggregate ingredients from 7 recipes, deduplicate)
- Sort ingredients by categories
- Easy copy or export functionality

### Recipe Enhancements
- Add instructions field
- Add categories or tags
- Disable buttons while recipe is being saved

### Recipe Browsing
- Filter by category or tag
- Search by name or ingredient

### Menu Creation Enhancements
- Avoid recipes used in past 2 menus
- Disable buttons when menu is being saved
- Sort menus by dates in browsing view
- Display recipe names (not just IDs) in browsing view

### Cooking Mode
- Mobile-first design
- Check off completed steps
- Prevent screen from turning off
- Large scroll buttons for hands-free navigation

### Polish/enhance
- Accessible styling (color contrast, focus states, error messages, touch targets)
- Responsive design and zoom support
- Testing setup (React Testing Library for components, Vitest for unit tests)

## 🛠️ Tech Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Yup
- **Data Fetching**: SWR + custom Supabase hooks
- **Routing**: React Router v7
- **Date Handling**: date-fns

## Status

The app is in active development with authentication and authenticated-only database access in place, plus core recipe/menu creation flows working. Update/delete operations are still pending.
