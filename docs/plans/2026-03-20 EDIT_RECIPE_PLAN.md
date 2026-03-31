# Edit Recipe Feature Plan

## Scope and Assumptions

**Goal:** Implement functionality to allow users to edit existing recipes with basic editable fields: name, description, URL, and ingredients.

**Assumptions:**
- Recipes exist in the database with data populated via junction table (`recipe_ingredient`) for new recipes
- Legacy recipes may have stringified JSON in `recipe.ingredients` field (need to handle both formats)
- Edit form shares most validation rules with AddRecipeForm
- Only name, description, URL, and ingredients can be edited (category, tags, servings, prep/cook times, instructions not yet implemented)
- Users should be able to update these basic recipe fields
- A `last_edited_at` timestamp field will be added to track when recipes are modified (users will not manually touch recipe ID or created_at)
- A temporary `ready_for_production` boolean field will be added to track manually-reviewed recipes during data cleanup phase (to be removed in final cleanup step)
- Use existing custom `updateRecipe` function from `recipesApi.ts` for proper junction table handling

**Out of Scope:**
- Deleting recipes (separate feature)
- Bulk editing of recipes
- Recipe versioning/history
- Editing category, tags, servings, prep/cook times, instructions (not yet implemented in UI)

## Step-by-Step Plan

### DONE: Step 1: Add last_edited_at Field to Recipe Table
**Description:** Create a database migration to add a `last_edited_at` timestamp field to the recipe table.

**Details:**
- Create migration file in `hat-menu/supabase/migrations/` with timestamp naming convention
- Add `last_edited_at TIMESTAMP DEFAULT NULL` column to `recipe` table
- This field will be automatically set/updated whenever a recipe is modified
- Run migration in Supabase
- Regenerate TypeScript types: `npm run update-types`
- Expected result: Recipe table has `last_edited_at` column available in database.types.ts
- Test: Check Supabase schema to confirm column exists; verify database.types.ts includes the new field

### DONE: Step 2: Add ready_for_production Field to Recipe Table (Temporary)
**Description:** Create a database migration to add a temporary `ready_for_production` boolean field to track manually reviewed recipes.

**Details:**
- Create migration file in `hat-menu/supabase/migrations/` with timestamp naming convention
- Add `ready_for_production BOOLEAN DEFAULT false` column to `recipe` table
- This is a temporary field for data cleanup purposes - recipes will be manually marked as ready after review
- Run migration in Supabase
- Regenerate TypeScript types: `npm run update-types`
- Expected result: Recipe table has `ready_for_production` column; type definitions updated
- Test: Check Supabase schema to confirm column exists; verify database.types.ts includes the new field

### DONE: Step 3: Create EditRecipePage Component
**Description:** Add a new page component to be ready to display the edit form for a recipe.

**Details:**
- Create `hat-menu/src/pages/EditRecipePage.tsx`
- Use route params to get recipe ID
- Fetch recipe data using `useSupabaseQuery` hook through useRecipe(id)
- Show loading state while fetching
- console.log the recipe's data
- Display recipe id and name in a <p> element
- Add a "back" button in top left corner to navigate back to the recipes list
- Make the back button a universal element in the PageWrapper.
- Expected result: Page loads recipe by ID, displays recipe's id and name, console logs the whole recipe data
- Test: Navigate to edit page with valid recipe ID, verify id and name matches and console logged data matches; "back" button navigates back to recipes listing.

### DONE: Step 4: Add Edit Route to Router
**Description:** Register the new edit recipe route in the React Router v7 config.

**Details:**
- Update `hat-menu/src/main.tsx` to add route: `/edit-recipe/:id`
- Wrap with ProtectedRoute to ensure only authenticated users can edit
- Expected result: Route is accessible and loads EditRecipePage component
- Test: Navigate to `/edit-recipe/123`, verify page loads; visit non-existent ID `/edit-recipe/999`, verify error handling

### DONE: Step 5: Add Edit Button to RecipeCard Component
**Description:** Add a navigation button to allow users to access the edit page from recipe cards, and display a visual indicator for ready_for_production status.

**Details:**
- Update `hat-menu/src/components/RecipeCard.tsx`
- Add "Edit" button that navigates to `/edit-recipe/{id}` route
- Show button only for authenticated users (can check in component or hide based on context)
- Add visual indicator (e.g., green checkmark, green dot, or badge) next to recipe name/title when `ready_for_production` is true
- When `ready_for_production` is false, no indicator is shown
- Expected result: Recipe card displays edit button and ready_for_production status indicator
- Test: Click edit button on recipe card, verify navigation to edit page works; verify indicator appears for recipes with ready_for_production=true and is absent for false

### Step 6: Create EditRecipeForm Component
**Description:** Extract common form logic from AddRecipeForm into a reusable component that can handle both insert and update modes, including the temporary ready_for_production field.

**Details:**
- Create `hat-menu/src/components/EditRecipeForm.tsx` 
- Accept props: `recipe?: Recipe` (optional, for edit mode), `onSuccess: () => void`
- Include form fields for: name, URL, ingredients (inputs for name, quantity and unit), and ready_for_production checkbox
- Reuse form validation schema from `hat-menu/src/schemas/Recipes.ts` (update schema to include ready_for_production)
- Handle legacy ingredients (stringified JSON) before populating form
- Support both add and edit modes with conditional rendering/behavior
- Handle success (show a success notification/feedback)
- Also update `hat-menu/src/components/AddRecipeForm.tsx` to include ready_for_production checkbox to track new recipes
- Expected result: Form component that pre-fills with existing recipe data (name, URL, ingredients, ready_for_production); new recipes also show ready_for_production checkbox
- Test: Pass a recipe via props and verify these fields populate correctly; toggle ready_for_production checkbox and submit; verify changes persist; test AddRecipeForm also shows the checkbox

### Step 7: Verify updateRecipe Function Handles All Fields and Sets last_edited_at
**Description:** Audit the existing `updateRecipe` function in `recipesApi.ts` to ensure it properly handles editable fields, ingredient updates, and sets the last_edited_at timestamp.

**Details:**
- Review `hat-menu/src/data/recipesApi.ts` `updateRecipe` function
- Verify it handles: name, description, URL
- Verify it handles ingredient updates (delete old, insert new via `recipe_ingredient` table)
- Verify it sets `last_edited_at` to current timestamp on every update
- Add or fix logic if missing
- Expected result: `updateRecipe` properly updates editable recipe columns, junction table entries, and timestamp
- Test: Update a recipe with changed name, description, URL, and ingredients; verify all changes persist and last_edited_at is updated

### Step 8: Handle Recipe Not Found / Permission Errors
**Description:** Add appropriate error handling and user feedback for edge cases.

**Details:**
- Update EditRecipePage to handle: recipe not found (404), unauthorized access (403)
- Display user-friendly error messages
- Provide navigation back to recipes list
- Expected result: Graceful error handling with helpful messages
- Test: Visit edit page for non-existent recipe ID, verify error message; attempt to edit recipe owned by another user (if applicable), verify access denied

### Step 9: E2E Test Recipe Edit Flow
**Description:** Manually test the complete edit workflow from start to finish.

**Details:**
- Start from recipes list
- Click edit on a recipe
- Modify multiple fields (name, ingredients, tags, etc.)
- Toggle ready_for_production checkbox to track completion
- Submit form
- Verify changes appear on recipe card
- Verify changes persist after refresh
- Expected result: Full edit workflow works end-to-end with ready_for_production tracking
- Test: Complete the above steps manually; check database directly to confirm persistence

### Step 10: Remove ready_for_production Field from UI and Database (Cleanup)
**Description:** Clean up the temporary ready_for_production field after all recipes have been manually reviewed and cleared.

**Details:**
- Remove ready_for_production checkbox field from CreateRecipeForm component
- Remove ready_for_production checkbox field from EditRecipeForm component
- Remove ready_for_production visual indicator (checkmark/dot/badge) from RecipeCard component
- Remove ready_for_production field from form validation schemas in `hat-menu/src/schemas/Recipes.ts`
- Create a final database migration to drop the `ready_for_production` column from `recipe` table
- Run migration in Supabase
- Regenerate TypeScript types: `npm run update-types` (field will be removed from types)
- Expected result: ready_for_production completely removed from codebase and database
- Test: Verify field is no longer in database schema, forms no longer show checkbox, RecipeCard no longer shows indicator, type definitions no longer include field

### Step 11: Remove Legacy `recipe.ingredients` Text Column (Cleanup)
**Description:** After all recipes have been manually reviewed and their ingredients migrated to the `recipe_ingredient` junction table, remove the legacy `recipe.ingredients` text column and all related dual-format handling throughout the codebase.

**Prerequisite:** All recipes must have their ingredients stored in `recipe_ingredient` table. Verify with: `SELECT id, name FROM recipe WHERE id NOT IN (SELECT DISTINCT recipe_id FROM recipe_ingredient);` — result should be empty.

**Details:**

**Database:**
- Create migration to drop the `ingredients` column from `recipe` table
- Run migration in Supabase
- Regenerate TypeScript types: `npm run update-types` (`ingredients` field will disappear from auto-generated types)

**Types (`hat-menu/src/schemas/supabase-helpers.ts`):**
- Remove `ingredients: string` from `Recipe` type extension (the `& { ingredients: string }` override will no longer be needed)
- Remove `ingredients?: string` from `RecipeInsert` type extension
- Remove `ingredients?: string` from `RecipeUpdate` type extension
- If `Recipe` type no longer needs any custom extensions beyond the base `RecipeRow`, simplify or remove the extended type alias

**Validation schema (`hat-menu/src/schemas/Recipes.ts`):**
- Remove `ingredients: string().required()` from `RecipeSchema` (the full-record validation schema)
- `RecipeFormSchema` already uses `array().of(IngredientSchema)` for the form — no change needed there

**UI — RecipeCard (`hat-menu/src/components/RecipeCard.tsx`):**
- Remove `hasStructuredIngredients` conditional check
- Remove the legacy text fallback branch (`recipe.ingredients` display + "Legacy text format" label)
- Always render `<IngredientsList>` with `recipe.recipe_ingredient`
- Remove the "Structured format" label (no longer needed as a distinction)
- Update `Props` type: use `RecipeWithIngredients` only instead of `Recipe | RecipeWithIngredients`

**API — recipesApi.ts (`hat-menu/src/data/recipesApi.ts`):**
- Remove the dummy `ingredients: 'temp string cause ingredients in separate table'` from `addRecipe` insert call
- Clean up any other references to `recipe.ingredients` text field

**Documentation:**
- Update `copilot-instructions.md`: remove "Legacy" bullet under "Ingredients storage", remove pitfall #5 about legacy ingredient data
- Update `FEATURES.md`: remove "Legacy data" bullet about stringified ingredient arrays
- Update `INGREDIENTS_PLAN.md`: mark backward-compatibility notes as resolved

- Expected result: `recipe.ingredients` text column fully removed from database, types, UI, API, and docs; all ingredient display uses `recipe_ingredient` junction table exclusively
- Test: Verify DB column is gone; `npm run update-types` produces types without `ingredients` on recipe; app compiles with no type errors; RecipeCard renders ingredients via `<IngredientsList>` only; `addRecipe` no longer sends a dummy ingredients string; grep codebase for `recipe.ingredients` and `hasStructuredIngredients` returns zero hits

