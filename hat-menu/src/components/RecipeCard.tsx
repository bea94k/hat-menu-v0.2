import { useNavigate } from 'react-router';
import type { Recipe, RecipeWithIngredients } from '../schemas/supabase-helpers';
import Button from './primitives/Button';
import { IngredientsList } from './IngredientsList';

interface Props {
    recipe: Recipe | RecipeWithIngredients;
}

const RecipeCard = ({ recipe }: Props) => {
    const navigate = useNavigate();
    // Check if recipe has structured ingredients (new format)
    const hasStructuredIngredients = 
        'recipe_ingredient' in recipe && 
        recipe.recipe_ingredient && 
        recipe.recipe_ingredient.length > 0;

    return (
        <div className='p-2 border border-primary-300 bg-white rounded-lg'>
            <p className='font-bold flex items-center gap-2'>
                {recipe.ready_for_production ? (
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
                ) : (
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-400 shrink-0" />
                )}
                {recipe.name}
            </p>
            <p className="text-xs text-gray-400 italic">ID: {recipe.id}</p>
            <p>URL: {recipe.url ? <a href={recipe.url} target="_blank" rel="noopener noreferrer">{recipe.url}</a> : 'No link provided'}</p>
            
            <div>
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

            <Button
                onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
                variant="outline"
                className="mt-2 w-fit"
            >
                Edit
            </Button>
        </div>
    );
};

export default RecipeCard;
