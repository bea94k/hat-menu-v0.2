import type { Recipe, RecipeWithIngredients } from '../schemas/supabase-helpers';
import { IngredientsList } from './IngredientsList';

interface Props {
    recipe: Recipe | RecipeWithIngredients;
}

const RecipeCard = ({ recipe }: Props) => {
    // Check if recipe has structured ingredients (new format)
    const hasStructuredIngredients = 
        'recipe_ingredient' in recipe && 
        recipe.recipe_ingredient && 
        recipe.recipe_ingredient.length > 0;

    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <p>Name: {recipe.name}</p>
            <p>ID: {recipe.id}</p>
            <p>URL: {recipe.url ? <a href={recipe.url} target="_blank" rel="noopener noreferrer">{recipe.url}</a> : 'No link provided'}</p>
            
            <div>
                <strong>Ingredients:</strong>
                {hasStructuredIngredients ? (
                    <div className="mt-2">
                        <IngredientsList ingredients={recipe.recipe_ingredient} />
                        <span className="text-xs text-gray-400 italic mt-1 block">Structured format</span>
                    </div>
                ) : (
                    <div className="mt-1">
                        <p className="text-gray-700">{recipe.ingredients}</p>
                        <span className="text-xs text-gray-400 italic">Legacy text format</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecipeCard;
