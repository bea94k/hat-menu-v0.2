import type { RecipeForm } from '../schemas/Recipes';
import type { RecipeWithIngredients } from '../schemas/supabase-helpers';

type IngredientUnit = NonNullable<RecipeForm['ingredients']>[number]['unit'];

function parseRecipeIngredients(recipe: RecipeWithIngredients): RecipeForm['ingredients'] {
    // Use structured ingredients from junction table if available
    if (recipe.recipe_ingredient && recipe.recipe_ingredient.length > 0) {
        return recipe.recipe_ingredient.map(ing => ({
            name: ing.ingredient_name,
            quantity: ing.quantity ?? undefined,
            unit: (ing.unit ?? '') as IngredientUnit,
        }));
    }

    // Fall back to legacy comma-separated text in recipe.ingredients
    if ('ingredients' in recipe && typeof recipe.ingredients === 'string' && recipe.ingredients) {
        const items = recipe.ingredients.split(',').map(s => s.trim()).filter(Boolean);
        if (items.length > 0) {
            return items.map(name => ({ name, quantity: undefined, unit: '' }));
        }
    }

    return [{ name: '', quantity: undefined, unit: '' }];
}

export { parseRecipeIngredients };
