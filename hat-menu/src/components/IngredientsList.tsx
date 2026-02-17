import type { RecipeIngredientRow } from '../schemas/supabase-helpers';

interface IngredientsListProps {
    ingredients: RecipeIngredientRow[];
}

/**
 * Displays a formatted list of recipe ingredients.
 * Formats each ingredient as "quantity unit name" (e.g., "2 cups flour", "1 tsp salt").
 * Handles optional quantity and unit fields gracefully.
 */
export function IngredientsList({ ingredients }: IngredientsListProps) {
    if (!ingredients || ingredients.length === 0) {
        return <p className="text-gray-500 italic">No ingredients listed</p>;
    }

    const formatIngredient = (ingredient: RecipeIngredientRow): string => {
        const parts: string[] = [];

        if (ingredient.quantity !== null && ingredient.quantity !== undefined) {
            parts.push(ingredient.quantity.toString());
        }

        if (ingredient.unit && ingredient.unit.trim() !== '') {
            parts.push(ingredient.unit);
        }

        parts.push(ingredient.ingredient_name);

        return parts.join(' ');
    };

    return (
        <ul className="list-disc list-inside space-y-1">
            {ingredients.map((ingredient) => (
                <li key={ingredient.id} className="text-gray-700">
                    {formatIngredient(ingredient)}
                </li>
            ))}
        </ul>
    );
}
