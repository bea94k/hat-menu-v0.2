import type { Database, Tables, TablesInsert, TablesUpdate } from './database.types';

// Extract base types from Supabase schema
export type RecipeRow = Tables<'recipe'>;
export type MenuRow = Tables<'menu'>;
export type MenuRecipeRow = Tables<'menu_recipe'>;

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

// Update types (for updating existing records)
export type RecipeUpdate = TablesUpdate<'recipe'> & {
    ingredients?: string;
};

export type MenuUpdate = TablesUpdate<'menu'>;

export type MenuRecipeUpdate = TablesUpdate<'menu_recipe'>;

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
