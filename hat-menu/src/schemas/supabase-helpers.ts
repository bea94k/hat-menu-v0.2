import type { Tables, TablesInsert, TablesUpdate } from './database.types';

// Extract base types from Supabase schema
export type RecipeRow = Tables<'recipe'>;
export type MenuRow = Tables<'menu'>;
export type MenuRecipeRow = Tables<'menu_recipe'>;
export type RecipeIngredientRow = Tables<'recipe_ingredient'>;
export type SuggestedIngredientRow = Tables<'suggested_ingredient'>;

// Extended types for frontend use
export type Recipe = RecipeRow & {
    ingredients: string; // Store as JSON string in database
};

export type Menu = MenuRow & {
    recipes: Recipe[]; // Populated via junction table
};

// Insert types (for creating new records)
export type RecipeInsert = TablesInsert<'recipe'> & {
    ingredients?: string;
};

export type MenuInsert = TablesInsert<'menu'>;

export type MenuRecipeInsert = TablesInsert<'menu_recipe'>;

export type RecipeIngredientInsert = TablesInsert<'recipe_ingredient'>;

export type SuggestedIngredientInsert = TablesInsert<'suggested_ingredient'>;

// Update types (for updating existing records)
export type RecipeUpdate = TablesUpdate<'recipe'> & {
    ingredients?: string;
};

export type MenuUpdate = TablesUpdate<'menu'>;

export type MenuRecipeUpdate = TablesUpdate<'menu_recipe'>;

export type RecipeIngredientUpdate = TablesUpdate<'recipe_ingredient'>;

export type SuggestedIngredientUpdate = TablesUpdate<'suggested_ingredient'>;

// Query result types for complex queries
export type MenuWithRecipes = MenuRow & {
    menu_recipe: (MenuRecipeRow & {
        recipe: RecipeRow;
    })[];
};

export type RecipeWithMenus = RecipeRow & {
    menu_recipe: (MenuRecipeRow & {
        menu: MenuRow;
    })[];
};

// Extended types with ingredients
export type RecipeIngredient = RecipeIngredientRow;

export type SuggestedIngredient = SuggestedIngredientRow;

export type RecipeWithIngredients = RecipeRow & {
    recipe_ingredient: RecipeIngredientRow[];
};
