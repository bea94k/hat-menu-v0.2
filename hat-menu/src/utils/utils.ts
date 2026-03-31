const getUniqueRandom = <T extends { id: string }>(itemCount: number, items: T[]): T[] => {
    if (itemCount <= 0 || items.length === 0) return [];
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    const uniqueItems: T[] = [];
    const seenIds = new Set<string>();
    for (const item of shuffled) {
        // keep track of seen IDs for the case when the items array includes duplicate IDs
        if (!seenIds.has(item.id)) {
            uniqueItems.push(item);
            seenIds.add(item.id);
        }
        if (uniqueItems.length === itemCount) break;
    }
    return uniqueItems;
};

import type { RecipeForm } from '../schemas/Recipes';
import type { RecipeWithIngredients } from '../schemas/supabase-helpers';

function parseRecipeIngredients(recipe: RecipeWithIngredients): RecipeForm['ingredients'] {
    // Use structured ingredients from junction table if available
    if (recipe.recipe_ingredient && recipe.recipe_ingredient.length > 0) {
        return recipe.recipe_ingredient.map(ing => ({
            name: ing.ingredient_name,
            quantity: ing.quantity ?? undefined,
            unit: ing.unit ?? '',
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

export { getUniqueRandom, parseRecipeIngredients };