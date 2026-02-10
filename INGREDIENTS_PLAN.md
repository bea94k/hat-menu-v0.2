# Ingredients Implementation Plan

## 📋 Implementation Plan: Robust Structured Ingredients

**Selected Approach:**
- ✅ Storage: Separate `recipe_ingredient` junction table (normalized)
- ✅ Autocomplete: Auto-populate from existing recipe ingredients
- ✅ UI Pattern: Dynamic rows with Add/Remove buttons
- ✅ Migration: Keep old text field, add new structured field

---

## Phase 1: Database Schema

### ✅ Task 1.1: Create database tables
**Commit**: `feat(db): add suggested_ingredient and recipe_ingredient tables`

- Create migration SQL file with:
  - `suggested_ingredient` table (id UUID, name TEXT UNIQUE, created_at)
  - `recipe_ingredient` table (id, recipe_id FK, ingredient_name TEXT, quantity NUMERIC(10,3), unit TEXT, created_at)
  - Indexes on foreign keys and ingredient_name for autocomplete performance
- Run migration in Supabase
- Run `npm run update-types` to regenerate `database.types.ts`

### ✅ Task 1.2: Populate suggested ingredients from existing recipes
**Commit**: `chore(db): seed suggested_ingredient from existing recipe data`

- Create migration script to:
  - Parse existing `recipe.ingredients` text field
  - Extract unique ingredient names (basic tokenization)
  - Insert into `suggested_ingredient` table
- Execute migration
- Document manual cleanup needed for duplicates (e.g., "potato" vs "potatoes")
- **Standards established**: singular form, lowercase (even for origin-based names)

---

## Phase 2: Data Layer & API

### ✅ Task 2.1: Create ingredients API hooks
**Commit**: `feat(api): add ingredients data layer with autocomplete support`

- Create `hat-menu/src/data/ingredientsApi.ts`:
  - `useSuggestedIngredients()` hook - fetch all for autocomplete
  - `useAddSuggestedIngredient()` mutation - add new ingredient names on the fly
- Update `hat-menu/src/schemas/supabase-helpers.ts`:
  - Add `RecipeWithIngredients` type (extends Recipe with recipe_ingredient array)
  - Add `SuggestedIngredient`, `RecipeIngredient` Row/Insert/Update types

### ✅ Task 2.2: Update recipes API for junction table handling
**Commit**: `refactor(api): handle recipe_ingredient junction table in recipe CRUD`

- Update `hat-menu/src/data/recipesApi.ts`:
  - Modify `addRecipe()` to insert recipe + recipe_ingredient rows (similar pattern to `addMenu`)
  - Add `updateRecipe()` with ingredient sync (delete old, insert new)
  - Update fetch queries to include `*,recipe_ingredient(*)` join

---

## Phase 3: Form Components

### Task 3.1: Create atomic ingredient input component
**Commit**: `feat(components): add IngredientInput with autocomplete and unit dropdown`

- Create `hat-menu/src/components/IngredientInput.tsx`:
  - Autocomplete text input for ingredient name (using `useSuggestedIngredients`)
  - Number input for quantity
  - Select dropdown for unit (from `units` const)
  - Remove button
  - Tailwind styling
  - Accessibility (proper labels, aria-* attributes)

### Task 3.2: Create ingredients list manager
**Commit**: `feat(components): add IngredientsListInput for managing ingredient arrays`

- Create `hat-menu/src/components/IngredientsListInput.tsx`:
  - Uses React Hook Form's `useFieldArray` for array management
  - Renders list of `IngredientInput` components
  - "Add Ingredient" button
  - Integrates with form validation

### Task 3.3: Update recipe form schema and validation
**Commit**: `refactor(schemas): update RecipeFormSchema for structured ingredients`

- Update `hat-menu/src/schemas/Recipes.ts`:
  - Change `ingredients` from `string()` to `array().of(IngredientSchema)`
  - Import and use `IngredientSchema` from Ingredients.ts
  - Update `RecipeForm` type accordingly

### Task 3.4: Integrate new components into AddRecipeForm
**Commit**: `feat(forms): replace textarea with structured ingredient inputs in AddRecipeForm`

- Update `hat-menu/src/components/AddRecipeForm.tsx`:
  - Replace `<textarea>` with `<IngredientsListInput>`
  - Update form submission to handle array of ingredients
  - Call `addRecipe` with structured data
  - Update default values to empty array

---

## Phase 4: Display & UX

### Task 4.1: Create ingredient display component
**Commit**: `feat(components): add IngredientsList for displaying structured ingredients`

- Create `hat-menu/src/components/IngredientsList.tsx`:
  - Accepts array of `RecipeIngredient`
  - Formats as clean list (e.g., "2 cups flour", "1 tsp salt")
  - Tailwind styling

### Task 4.2: Update RecipeCard to display structured ingredients
**Commit**: `refactor(components): display structured ingredients in RecipeCard with text fallback`

- Update `hat-menu/src/components/RecipeCard.tsx`:
  - Check if `recipe.recipe_ingredient` exists and has data
  - If yes: render `<IngredientsList>`
  - If no: fallback to displaying `recipe.ingredients` as text
  - Add visual indicator of format type (optional)

---

## Phase 5: Testing & Polish

### Task 5.1: Add unit tests
**Commit**: `test: add tests for ingredient components and validation`

- Test `IngredientSchema` validation (edge cases for quantity decimal places)
- Test ingredient input components
- Test form submission with structured ingredients

### Task 5.2: Update documentation
**Commit**: `docs: update FEATURES.md and copilot-instructions for structured ingredients`

- Update FEATURES.md to mark ingredients as implemented
- Update copilot-instructions.md with new data patterns
- Add inline code comments for complex parts (e.g., autocomplete logic)

---

## 🎯 Optional Enhancements (Future)

- **Task X.1**: Manual migration UI for upgrading old recipes
- **Task X.2**: Bulk edit ingredient names in suggested_ingredient table (for merging duplicates)
- **Task X.3**: Ingredient categories for better organization
- **Task X.4**: Smart deduplication (fuzzy matching "potato" vs "potatoes")

---

## Implementation Notes

### Database Schema Details

```sql
-- suggested_ingredient table
CREATE TABLE suggested_ingredient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- recipe_ingredient junction table
CREATE TABLE recipe_ingredient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID REFERENCES recipe(id) ON DELETE CASCADE,
    ingredient_name TEXT NOT NULL,
    quantity NUMERIC(10,3),
    unit TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_recipe_ingredient_recipe_id ON recipe_ingredient(recipe_id);
CREATE INDEX idx_recipe_ingredient_name ON recipe_ingredient(ingredient_name);
CREATE INDEX idx_suggested_ingredient_name ON suggested_ingredient(name);
```

### Key Design Decisions

1. **Denormalized ingredient_name in recipe_ingredient**: We store the ingredient name directly rather than referencing suggested_ingredient.id. This allows users to enter custom ingredients on-the-fly without enforcing strict references.

2. **Backward compatibility**: Keep `recipe.ingredients` text field for existing data. New recipes will use structured format but can still display old data.

3. **Autocomplete source**: Populate from actual usage rather than pre-seeding. This ensures suggestions match what users actually type.

4. **Unit validation**: Units are hardcoded in TypeScript const array, validated both client-side (Yup) and should be validated server-side via CHECK constraint or trigger.

---

**Plan created**: February 10, 2026
