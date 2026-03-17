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
        <div className='p-2 border border-primary-300 bg-white rounded-lg'>
            <p className='font-bold'>{recipe.name}</p>
            <p className="text-xs text-gray-400 italic">ID: {recipe.id}</p>
            <p>URL: {recipe.url ? <a href={recipe.url} target="_blank" rel="noopener noreferrer">{recipe.url}</a> : 'No link provided'}</p>
            
            <div className='pt-2'>
                <p className='underline decoration-primary-500/50'>Ingredients:</p>
                {hasStructuredIngredients ? (
                    <>
                        <IngredientsList ingredients={recipe.recipe_ingredient} />
                        <p className="text-xs text-gray-400 italic mt-1">Structured format</p>
                    </>
                ) : (
                    <>
                        <p>{recipe.ingredients}</p>
                        <p className="text-xs text-gray-400 italic">Legacy text format</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default RecipeCard;
