# Hat Menu - Implemented Features

This document provides an overview of currently implemented features in the Hat Menu application as of February 2026.

## ✅ Implemented Features

### 1. **Recipe Management**
- **View all recipes** - Recipe listing functionality via [`useSupabaseQuery`](hat-menu/src/data/useSupabaseQuery.ts)
- **Add new recipes** - Form implementation in [`AddRecipeForm.tsx`](hat-menu/src/components/AddRecipeForm.tsx) using React Hook Form + Yup validation
- **Data model** - Recipes have `name`, `url`, and `ingredients` (stored as plain text string)

### 2. **Menu Management**
- **Create menus** - Complex menu creation with recipe associations via [`addMenu`](hat-menu/src/data/menusApi.ts) function
- **Menu-Recipe relationship** - Many-to-many junction table (`menu_recipe`) handling
- **Date range support** - Menus have `startDate` and `endDate` fields, formatted with `date-fns`

### 3. **Data Layer Architecture**
- **Three-layer type system**:
  1. Auto-generated Supabase types ([`database.types.ts`](hat-menu/src/schemas/database.types.ts))
  2. Extended database types ([`supabase-helpers.ts`](hat-menu/src/schemas/supabase-helpers.ts))
  3. Form validation schemas in `/schemas` directory
- **Custom SWR + Supabase hook** - [`useSupabaseQuery`](hat-menu/src/data/useSupabaseQuery.ts) for data fetching with caching
- **Mutation hook** - [`useSupabaseMutation`](hat-menu/src/data/useSupabaseQuery.ts) with auto-revalidation

### 4. **Navigation & Routing**
- **React Router v7** implementation in [`main.tsx`](hat-menu/src/main.tsx)
- **Navbar component** - [`Navbar.tsx`](hat-menu/src/components/Navbar.tsx) with links to:
  - Recipes list
  - Add Recipe
  - Menus list
  - Create Menu

### 5. **Development Infrastructure**
- **Supabase backend** - PostgreSQL database with client initialized in [`supabase-config.ts`](hat-menu/src/supabase-config.ts)
- **Local mock JSON server** - Alternative data source via `npm run json-db`
- **Type generation workflow** - `npm run update-types` syncs database schema to TypeScript
- **Testing setup** - Vitest configured

### 6. **Database Schema**
- **`recipe` table** - With id, name, url, ingredients fields
- **`menu` table** - With id, startDate, endDate fields
- **`menu_recipe` junction table** - Links menus to recipes (many-to-many)
- **Seed data** - Available in [`seed-recipes.sql`](hat-menu/src/data/seed-recipes.sql)

## ⚠️ Not Yet Implemented

- **Update/Delete recipes** - Commented out in [`recipesApi.ts`](hat-menu/src/data/recipesApi.ts)
- **Recipe categories/filtering** - Hook exists but not implemented in UI
- **Ingredients as structured data** - Currently plain text, future: JSON array or separate table
- **Authentication** - Supabase Auth configured but not used in app
- **Image uploads** - Storage bucket configured but not implemented
- **Update/Delete menus** - Only create functionality exists

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

The app is in active development with core CRUD operations for recipes and basic menu creation working, but update/delete operations and advanced features are still pending.
